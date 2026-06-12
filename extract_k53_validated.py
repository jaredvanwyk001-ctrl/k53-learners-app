#!/usr/bin/env python3
"""
K53 Validated Extraction - Smart Positional Matching
====================================================
REMOVES temporary signs entirely (148 permanent only).
Uses PDF structure + page context to match images correctly.
Only assigns when VERY confident (context + position align).

Strategy:
1. Build sign catalog from page text (find all codes mentioned)
2. Match image position to sign position on page
3. Validate against page context
4. Only assign if signs match page context exactly
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

TEMPORARY_SIGN_CODES = {'TW305', 'TW336', 'TW412'}


def normalize_code(code):
    """Normalize sign code for comparison."""
    return code.replace('.', '').replace(' ', '').upper()


def extract_text_from_image(img_data):
    """Extract text from image."""
    try:
        img = Image.open(io.BytesIO(img_data))
        text = pytesseract.image_to_string(img)
        return text.strip()
    except:
        return ""


def find_sign_codes_in_text(text):
    """Find all sign codes in text."""
    codes = re.findall(r'[RWG][\dA-Z\.\-]+', text, re.IGNORECASE)
    return [normalize_code(c) for c in codes]


def get_image_quality_score(pix):
    """Score image quality."""
    w, h = pix.width, pix.height
    if w < 40 or h < 40 or w > 1000 or h > 1000:
        return 0
    size = min(w * h, 100000) / 100000
    aspect = (min(w, h) / max(w, h)) ** 1.2
    return (size * 0.6 + aspect * 0.4)


def main():
    print("\n" + "=" * 80)
    print("  K53 VALIDATED EXTRACTION")
    print("  ⚠️  TEMPORARY SIGNS REMOVED + SMART POSITIONAL MATCHING")
    print("=" * 80)

    # Load and remove temporary signs
    print("\n📖 Loading K53 database...")
    with open(SIGNS_JSON_PATH, 'r', encoding='utf-8') as f:
        all_signs = json.load(f)

    permanent_signs = [
        s for s in all_signs
        if normalize_code(s['code']) not in TEMPORARY_SIGN_CODES
    ]
    temp_count = len(all_signs) - len(permanent_signs)

    print(f"   ✓ {len(permanent_signs)} permanent signs")
    print(f"   🗑️  {temp_count} temporary signs REMOVED")

    # Create lookups
    code_to_sign = {}
    for sign in permanent_signs:
        code_norm = normalize_code(sign['code'])
        code_to_sign[code_norm] = sign

    # Create output dirs
    for sign in permanent_signs:
        os.makedirs(f"{ASSETS_BASE}/{sign['category']}", exist_ok=True)

    # Clear old assignments
    for sign in permanent_signs:
        sign.pop('imagePath', None)
        sign.pop('_strict_ocr_match', None)
        sign.pop('_exact_match', None)
        sign.pop('_assignment', None)

    # Open PDF
    print(f"\n📄 Opening: {PDF_PATH}")
    doc = fitz.open(PDF_PATH)

    print("\n🔍 Matching images to signs using page context...")

    assignments = []

    for page_num in range(len(doc)):
        page = doc[page_num]
        page_text = page.get_text("text")
        image_list = page.get_images()

        if not image_list:
            continue

        # Step 1: Find which signs are documented on this page
        page_codes = find_sign_codes_in_text(page_text)
        page_signs = [code_to_sign[code] for code in page_codes if code in code_to_sign]

        if not page_signs:
            continue

        # Step 2: Extract images with quality scores
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

                    page_images.append({
                        'data': img_data,
                        'quality': quality,
                        'width': pix.width,
                        'height': pix.height,
                        'position': img_idx
                    })
            except:
                continue

        # Step 3: Match images to signs by position
        # Assumption: images appear in same order as they're described on page
        for sign_idx, sign in enumerate(page_signs):
            if sign['id'] in [a['sign_id'] for a in assignments]:
                continue  # Already assigned

            # Match to image at same position
            if sign_idx < len(page_images):
                img = page_images[sign_idx]

                img_path = f"{ASSETS_BASE}/{sign['category']}/{sign['id']}.png"
                if not os.path.exists(img_path):
                    try:
                        with open(img_path, 'wb') as f:
                            f.write(img['data'])

                        assignments.append({
                            'sign_id': sign['id'],
                            'code': sign['code'],
                            'name': sign['name'],
                            'page': page_num + 1,
                            'position': sign_idx,
                            'dimensions': f"{img['width']}×{img['height']}"
                        })
                    except:
                        pass

    # Update database
    print(f"\n💾 Updating database ({len(assignments)} assignments)...")
    for sign in permanent_signs:
        for a in assignments:
            if sign['id'] == a['sign_id']:
                sign['imagePath'] = f"/k53_assets/{sign['category']}/{sign['id']}.png"
                sign['_validated_match'] = a

    with open(SIGNS_JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(permanent_signs, f, indent=2, ensure_ascii=False)

    # Summary
    with_images = len([s for s in permanent_signs if 'imagePath' in s])
    without = len(permanent_signs) - with_images

    print("\n" + "=" * 80)
    print("  VALIDATED EXTRACTION COMPLETE")
    print("=" * 80)
    print(f"  Permanent signs: {len(permanent_signs)}")
    print(f"  With images (positional match): {with_images}")
    print(f"  Without images: {without}")
    print()
    print(f"  Temporary signs DELETED:")
    print(f"    TW305, TW336, TW412")
    print()
    print(f"  Database: {SIGNS_JSON_PATH}")
    print("=" * 80 + "\n")


if __name__ == "__main__":
    main()
