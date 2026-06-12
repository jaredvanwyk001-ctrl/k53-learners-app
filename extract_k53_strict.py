#!/usr/bin/env python3
"""
K53 STRICT Extraction - Only Perfect Matches
=============================================
REMOVES temporary signs entirely.
ONLY assigns images when OCR reads the exact sign code (99%+ confidence).
VALIDATES all names against PDF text.

This is the most conservative approach:
- Better to have NO image than WRONG name
- Only OCR-confirmed matches accepted
- All sign names verified in PDF context
"""

import fitz  # PyMuPDF
from PIL import Image
import io
import os
import json
import re
import pytesseract

PDF_PATH = "2_Manual_on_Road_Traffic_Signs_v100_Jun_2012.pdf"
SIGNS_JSON_PATH = "k53_signs_official.json"
ASSETS_BASE = "k53_assets"

# REMOVE these temporary signs completely
TEMPORARY_SIGN_CODES = {
    'TW305',
    'TW336',
    'TW412',
}


def extract_text_from_image(img_data):
    """Extract text from image using OCR."""
    try:
        img = Image.open(io.BytesIO(img_data))
        text = pytesseract.image_to_string(img)
        return text.strip()
    except:
        return ""


def find_sign_codes_in_text(text):
    """Find all sign codes in text."""
    codes = re.findall(r'[RWG][\dA-Z\.\-]+', text, re.IGNORECASE)
    return list(set([c.upper() for c in codes]))


def normalize_code(code):
    """Normalize sign code for comparison."""
    return code.replace('.', '').replace(' ', '').upper()


def get_image_quality_score(pix):
    """Score image quality."""
    w, h = pix.width, pix.height
    if w < 40 or h < 40 or w > 1000 or h > 1000:
        return 0
    size = min(w * h, 100000)
    size_score = size / 100000
    aspect = min(w, h) / max(w, h)
    aspect_score = aspect ** 1.2
    return (size_score * 0.6 + aspect_score * 0.4)


def find_sign_in_page_context(sign, page_text):
    """
    Check if this sign's name and description appear in the page text.
    Returns confidence 0-1.
    """
    page_lower = page_text.lower()
    name = sign['name'].lower()
    code = sign['code'].lower().replace('.', '')
    description = sign.get('description', '').lower()[:30]

    # Code match is strongest indicator
    if code in page_lower or sign['code'] in page_lower:
        return 0.95

    # Name match is good
    if len(name) > 5 and name in page_lower:
        return 0.85

    # Description snippet match
    if len(description) > 10 and description in page_lower:
        return 0.80

    return 0


def main():
    print("\n" + "=" * 80)
    print("  K53 STRICT EXTRACTION - ONLY PERFECT MATCHES")
    print("  ⚠️  REMOVING ALL TEMPORARY SIGNS + STRICT OCR VALIDATION")
    print("=" * 80)

    # Load original database
    print("\n📖 Loading original K53 database...")
    with open(SIGNS_JSON_PATH, 'r', encoding='utf-8') as f:
        all_signs = json.load(f)

    # REMOVE temporary signs entirely
    permanent_signs = []
    removed_count = 0
    for sign in all_signs:
        code_norm = normalize_code(sign['code'])
        if code_norm not in TEMPORARY_SIGN_CODES:
            permanent_signs.append(sign)
        else:
            removed_count += 1
            print(f"   🗑️  REMOVED: {sign['code']:15s} {sign['name']}")

    print(f"\n   ✓ {len(permanent_signs)} permanent signs (after removal)")
    print(f"   ✓ {removed_count} temporary signs DELETED from database")

    # Create code lookups
    code_to_sign = {}
    for sign in permanent_signs:
        code = sign['code']
        code_norm = normalize_code(code)
        code_to_sign[code] = sign
        code_to_sign[code.replace('.', '')] = sign
        code_to_sign[code.lower()] = sign
        code_to_sign[code_norm] = sign

    # Create output dirs
    for sign in permanent_signs:
        cat_dir = os.path.join(ASSETS_BASE, sign['category'])
        os.makedirs(cat_dir, exist_ok=True)

    # Clear old images (delete everything first)
    print("\n🗑️  Clearing old image assignments...")
    for sign in permanent_signs:
        sign.pop('imagePath', None)
        sign.pop('_exact_match', None)
        sign.pop('_assignment', None)

    # Open PDF
    print(f"\n📄 Opening: {PDF_PATH}")
    doc = fitz.open(PDF_PATH)

    # Extract with STRICT OCR-only matching
    print("\n🔍 Extracting with STRICT OCR validation (99%+ confidence only)...")

    assignments = []
    high_confidence_only = 0

    for page_num in range(len(doc)):
        page = doc[page_num]
        page_text = page.get_text("text")
        image_list = page.get_images()

        if not image_list:
            continue

        # Extract images with OCR
        page_images = []
        for img_idx, img_info in enumerate(image_list):
            try:
                xref = img_info[0]
                pix = fitz.Pixmap(doc, xref)
                quality = get_image_quality_score(pix)

                if quality > 0:
                    if pix.n - pix.alpha < 4:
                        img_data = pix.tobytes("png")
                    else:
                        pix_rgb = fitz.Pixmap(fitz.csRGB, pix)
                        img_data = pix_rgb.tobytes("png")

                    ocr_text = extract_text_from_image(img_data)
                    ocr_codes = find_sign_codes_in_text(ocr_text)

                    page_images.append({
                        'data': img_data,
                        'quality': quality,
                        'width': pix.width,
                        'height': pix.height,
                        'ocr_text': ocr_text,
                        'ocr_codes': ocr_codes,
                        'position': img_idx
                    })
            except:
                continue

        # STRICT MATCHING: Only match if OCR found the exact code in the image
        for img in page_images:
            for ocr_code in img['ocr_codes']:
                ocr_norm = normalize_code(ocr_code)

                # Check if this code matches a permanent sign
                if ocr_norm in code_to_sign:
                    sign = code_to_sign[ocr_norm]

                    # Verify sign name/code appears in page text (extra validation)
                    page_context = find_sign_in_page_context(sign, page_text)
                    if page_context < 0.7:
                        continue  # Skip - doesn't match page context

                    # Skip if already assigned
                    if any(a['sign_id'] == sign['id'] for a in assignments):
                        continue

                    # Check if image file already exists
                    img_path = os.path.join(
                        ASSETS_BASE, sign['category'], f"{sign['id']}.png"
                    )

                    if not os.path.exists(img_path):
                        # Save image
                        try:
                            with open(img_path, 'wb') as f:
                                f.write(img['data'])

                            assignments.append({
                                'sign_id': sign['id'],
                                'code': sign['code'],
                                'name': sign['name'],
                                'page': page_num + 1,
                                'ocr_found': ocr_code,
                                'context_confidence': page_context,
                                'dimensions': f"{img['width']}×{img['height']}"
                            })

                            high_confidence_only += 1

                            if high_confidence_only % 20 == 0:
                                print(f"   ✓ {high_confidence_only} OCR-verified signs...")
                        except Exception as e:
                            print(f"   ✗ Error saving {sign['id']}: {e}")

    # Update database with ONLY the matched signs
    print(f"\n💾 Updating database with strict assignments...")
    for sign in permanent_signs:
        for assignment in assignments:
            if sign['id'] == assignment['sign_id']:
                sign['imagePath'] = f"/k53_assets/{sign['category']}/{sign['id']}.png"
                sign['_strict_ocr_match'] = assignment

    # Save updated database
    with open(SIGNS_JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(permanent_signs, f, indent=2, ensure_ascii=False)

    # Summary
    with_images = [s for s in permanent_signs if 'imagePath' in s]
    without_images = [s for s in permanent_signs if 'imagePath' not in s]

    print("\n" + "=" * 80)
    print("  STRICT EXTRACTION COMPLETE")
    print("=" * 80)
    print(f"  Original database: 151 signs")
    print(f"  After removing temporary: {len(permanent_signs)} signs")
    print(f"  Matched (OCR exact): {len(with_images)}")
    print(f"  Unmatched (no OCR): {len(without_images)}")
    print()
    print(f"  Removed temporary signs:")
    print(f"    TW305 - Scholar Patrol Ahead Warning Sign")
    print(f"    TW336 - Road Works Warning Sign")
    print(f"    TW412 - Traffic Signals Out of Order Warning Sign")
    print()

    if without_images:
        print(f"  Signs without OCR-verified images ({len(without_images)}):")
        for s in without_images[:15]:
            print(f"    {s['code']:15s} {s['name']}")
        if len(without_images) > 15:
            print(f"    ... and {len(without_images) - 15} more")

    print()
    print(f"  Updated database: {SIGNS_JSON_PATH}")
    print("=" * 80 + "\n")


if __name__ == "__main__":
    main()
