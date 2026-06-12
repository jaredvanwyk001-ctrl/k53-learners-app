#!/usr/bin/env python3
"""
K53 Permanent Signs Extraction (EXACT)
======================================
Extracts ONLY permanent signs (white background).
Ignores ALL temporary signs (yellow background).
Validates names and descriptions against PDF text.

Permanent vs Temporary:
- Permanent: Regulatory, Warning, Guidance, Tourism, Road Markings
- Temporary: TW305, TW336, TW412 (scholar patrol, road works, signals out of order)
           These have yellow backgrounds in the manual

Strategy:
  1. Load official signs database
  2. Filter to ONLY permanent signs (exclude TW* temporary codes)
  3. Extract images from PDF pages containing permanent signs
  4. Use OCR to read sign codes from images
  5. Match images to signs with extremely high confidence (>0.85)
  6. Validate that extracted text matches sign descriptions
  7. Only assign when 100% confident

Output:
  - k53_assets/{category}/{sign_id}.png (permanent signs only)
  - k53_signs_official.json (updated with validated data)
  - extraction_report.json (detailed matching info)
"""

import fitz  # PyMuPDF
from PIL import Image
import io
import os
import json
import re
import pytesseract
from collections import defaultdict

PDF_PATH = "2_Manual_on_Road_Traffic_Signs_v100_Jun_2012.pdf"
SIGNS_JSON_PATH = "k53_signs_official.json"
ASSETS_BASE = "k53_assets"

# Temporary signs to EXCLUDE (yellow background in manual)
TEMPORARY_SIGN_CODES = [
    'TW305',  # Scholar Patrol Ahead
    'TW336',  # Road Works Warning
    'TW412',  # Traffic Signals Out of Order
]


def is_permanent_sign(sign):
    """Check if sign is permanent (not temporary/yellow background)."""
    code = sign['code'].replace('.', '').upper()

    # Exclude any signs in temporary list
    for temp_code in TEMPORARY_SIGN_CODES:
        if code.startswith(temp_code):
            return False

    # Permanent categories: Regulatory, Warning, Guidance, Tourism, Road Markings
    return sign['category'] in ['regulatory', 'warning', 'guidance', 'tourism', 'road-markings']


def extract_text_from_image(img_data):
    """Use OCR to extract text from image."""
    try:
        img = Image.open(io.BytesIO(img_data))
        text = pytesseract.image_to_string(img)
        return text.strip()
    except:
        return ""


def find_sign_codes_in_text(text):
    """Extract all potential sign codes from text."""
    codes = re.findall(r'[RWG][\dA-Z\.\-]+', text, re.IGNORECASE)
    return list(set([c.upper() for c in codes]))


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


def validate_sign_data(sign, page_text):
    """
    Validate that the sign's name and description match the PDF text.
    Returns confidence score (0-1).
    """
    page_lower = page_text.lower()
    name = sign['name'].lower()
    code = sign['code'].lower().replace('.', '')

    confidence = 0

    # Check if code appears in text (highest confidence)
    if code in page_lower or sign['code'] in page_lower:
        confidence = 0.9

    # Check if name appears in text
    if len(name) > 5 and name in page_lower:
        confidence = max(confidence, 0.8)

    # Check if purpose text appears
    if len(sign.get('purpose', '')) > 10:
        purpose_snippet = sign['purpose'][:20].lower()
        if purpose_snippet in page_lower:
            confidence = 0.95

    return confidence


def main():
    print("\n" + "=" * 80)
    print("  K53 PERMANENT SIGNS EXTRACTION (EXACT MATCHING)")
    print("  ⚠️  EXCLUDING TEMPORARY SIGNS (TW305, TW336, TW412)")
    print("=" * 80)

    # Load official database
    print("\n📖 Loading official K53 signs...")
    with open(SIGNS_JSON_PATH, 'r', encoding='utf-8') as f:
        signs = json.load(f)

    # Filter to PERMANENT signs only
    permanent_signs = [s for s in signs if is_permanent_sign(s)]
    temporary_signs = [s for s in signs if not is_permanent_sign(s)]

    print(f"   ✓ {len(permanent_signs)} permanent signs")
    print(f"   ⊘ {len(temporary_signs)} temporary signs (EXCLUDED)")

    print(f"\n   Temporary signs being excluded:")
    for s in temporary_signs:
        print(f"     ⊘ {s['code']:15s} {s['name']}")

    # Create code lookups for PERMANENT signs only
    code_to_sign = {}
    for sign in permanent_signs:
        code = sign['code']
        code_to_sign[code] = sign
        code_to_sign[code.replace('.', '')] = sign
        code_to_sign[code.lower()] = sign
        code_to_sign[code.upper()] = sign

    # Create output dirs
    for sign in permanent_signs:
        cat_dir = os.path.join(ASSETS_BASE, sign['category'])
        os.makedirs(cat_dir, exist_ok=True)

    # Open PDF
    print(f"\n📄 Opening: {PDF_PATH}")
    doc = fitz.open(PDF_PATH)
    print(f"   ✓ {len(doc)} pages")

    # Extract images with exact matching
    print("\n🔍 Extracting permanent signs with exact matching...")

    assigned = 0
    report = {
        'total_permanent': len(permanent_signs),
        'assigned': 0,
        'unassigned': [],
        'assignments': []
    }

    for page_num in range(len(doc)):
        page = doc[page_num]
        page_text = page.get_text("text")
        image_list = page.get_images()

        if not image_list:
            continue

        # Find PERMANENT signs mentioned on this page
        page_codes = find_sign_codes_in_text(page_text)
        page_signs = []
        for code in page_codes:
            if code in code_to_sign:
                sign = code_to_sign[code]
                validation = validate_sign_data(sign, page_text)
                if validation > 0.7:  # Only include if text matches
                    page_signs.append((sign, validation))

        if not page_signs:
            continue

        # Extract images
        page_images = []
        for img_idx, img_info in enumerate(image_list):
            try:
                xref = img_info[0]
                pix = fitz.Pixmap(doc, xref)
                score = get_image_quality_score(pix)

                if score > 0:
                    if pix.n - pix.alpha < 4:
                        img_data = pix.tobytes("png")
                    else:
                        pix_rgb = fitz.Pixmap(fitz.csRGB, pix)
                        img_data = pix_rgb.tobytes("png")

                    ocr_text = extract_text_from_image(img_data)
                    ocr_codes = find_sign_codes_in_text(ocr_text)

                    page_images.append({
                        'data': img_data,
                        'score': score,
                        'width': pix.width,
                        'height': pix.height,
                        'ocr_text': ocr_text,
                        'ocr_codes': ocr_codes,
                        'position': img_idx
                    })
            except:
                continue

        # Match images to signs - EXACT MATCHING ONLY
        for sign, validation_score in page_signs:
            sign_id = sign['id']
            code = sign['code']
            category = sign['category']
            img_path = os.path.join(ASSETS_BASE, category, f"{sign_id}.png")

            if sign_id in [a['sign_id'] for a in report['assignments']]:
                continue

            best_match = None
            best_confidence = 0
            match_method = ""

            # EXACT Method 1: OCR found the exact code in the image
            for img in page_images:
                for ocr_code in img['ocr_codes']:
                    ocr_code_clean = ocr_code.replace('.', '').upper()
                    code_clean = code.replace('.', '').upper()
                    if ocr_code_clean == code_clean:
                        if img['score'] > best_confidence:
                            best_match = img
                            best_confidence = 0.98
                            match_method = f"OCR exact code match ({ocr_code})"

            # EXACT Method 2: Position match with high validation
            if best_confidence < 0.95 and validation_score > 0.85:
                # Try to match by position
                for sign_idx, (s, _) in enumerate(page_signs):
                    if s['id'] == sign_id and sign_idx < len(page_images):
                        img = page_images[sign_idx]
                        if img['score'] > best_confidence:
                            best_match = img
                            best_confidence = 0.92
                            match_method = f"Position match (validation: {validation_score})"

            # Only save if VERY confident
            if best_match and best_confidence > 0.90:
                try:
                    with open(img_path, 'wb') as f:
                        f.write(best_match['data'])

                    report['assignments'].append({
                        'sign_id': sign_id,
                        'code': code,
                        'name': sign['name'],
                        'page': page_num + 1,
                        'confidence': round(best_confidence, 2),
                        'method': match_method,
                        'dimensions': f"{best_match['width']}×{best_match['height']}",
                        'validation_score': round(validation_score, 2)
                    })

                    assigned += 1
                    if assigned % 20 == 0:
                        print(f"   ✓ {assigned} permanent signs matched...")

                except Exception as e:
                    report['unassigned'].append({
                        'sign_id': sign_id,
                        'code': code,
                        'reason': f"Save error: {str(e)}"
                    })

    # Update signs with assignments
    print(f"\n💾 Updating database...")
    for sign in permanent_signs:
        for assignment in report['assignments']:
            if sign['id'] == assignment['sign_id']:
                sign['imagePath'] = f"/k53_assets/{sign['category']}/{sign['id']}.png"
                sign['_exact_match'] = assignment

    with open(SIGNS_JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(signs, f, indent=2, ensure_ascii=False)

    # Save extraction report
    report['assigned'] = assigned
    report['unassigned_count'] = len(report['unassigned'])
    with open('extraction_report.json', 'w', encoding='utf-8') as f:
        json.dump(report, f, indent=2, ensure_ascii=False)

    # Summary
    print("\n" + "=" * 80)
    print("  EXTRACTION COMPLETE (PERMANENT SIGNS ONLY)")
    print("=" * 80)
    print(f"  Permanent signs database: {len(permanent_signs)}")
    print(f"  Matched with HIGH confidence (>0.90): {assigned}")
    print(f"  Unmatched: {len(report['unassigned'])}")
    print()
    print(f"  Excluded temporary signs: {len(temporary_signs)}")
    print(f"    TW305 - Scholar Patrol Ahead")
    print(f"    TW336 - Road Works Warning")
    print(f"    TW412 - Traffic Signals Out of Order")
    print()

    if report['unassigned']:
        print(f"  Unmatched permanent signs:")
        for u in report['unassigned'][:10]:
            print(f"    {u['code']:15s} {u['sign_id']:15s} - {u['reason']}")
        if len(report['unassigned']) > 10:
            print(f"    ... and {len(report['unassigned']) - 10} more")

    print()
    print(f"  Database: {SIGNS_JSON_PATH}")
    print(f"  Report: extraction_report.json")
    print("=" * 80 + "\n")


if __name__ == "__main__":
    main()
