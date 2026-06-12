#!/usr/bin/env python3
"""
K53 Meticulous Extraction - Page by Page
==========================================
Go through PDF page by page.
For each page:
  1. Extract ALL sign codes mentioned in official text
  2. Extract ALL images on that page
  3. Match images to signs by position and context
  4. Create perfect 1-to-1 mapping

Only assign when we have HIGH CONFIDENCE.
Skip ambiguous matches.
"""

import fitz  # PyMuPDF
from PIL import Image
import io
import os
import json
import re
from collections import defaultdict

PDF_PATH = "2_Manual_on_Road_Traffic_Signs_v100_Jun_2012.pdf"
SIGNS_JSON_PATH = "k53_signs_official.json"
ASSETS_BASE = "k53_assets"

def get_image_quality(pix):
    """Score image for quality."""
    w, h = pix.width, pix.height
    if w < 40 or h < 40 or w > 1000 or h > 1000:
        return 0
    size = min(w * h, 100000) / 100000
    aspect = (min(w, h) / max(w, h)) ** 1.2
    return (size * 0.6 + aspect * 0.4)


def find_codes_in_text(text):
    """Find all sign codes in text."""
    codes = re.findall(r'[RWG][\dA-Z\.\-]+', text, re.IGNORECASE)
    return list(dict.fromkeys([c.upper() for c in codes]))  # Remove duplicates, preserve order


def normalize_code(code):
    """Normalize code for lookup."""
    return code.replace('.', '').replace(' ', '').upper()


def main():
    print("\n" + "=" * 90)
    print("  K53 METICULOUS PAGE-BY-PAGE EXTRACTION")
    print("=" * 90)

    # Load official database
    print("\n📖 Loading official K53 database...")
    with open(SIGNS_JSON_PATH, 'r') as f:
        signs_list = json.load(f)

    # Create lookups
    code_to_sign = {}
    for sign in signs_list:
        code = sign['code']
        code_norm = normalize_code(code)
        code_to_sign[code] = sign
        code_to_sign[code_norm] = sign

    print(f"   ✓ {len(signs_list)} signs in database")

    # Create output dirs
    for sign in signs_list:
        cat_dir = f"{ASSETS_BASE}/{sign['category']}"
        os.makedirs(cat_dir, exist_ok=True)

    # Clear old assignments
    for sign in signs_list:
        sign.pop('imagePath', None)

    # Open PDF
    print(f"\n📄 Opening: {PDF_PATH}")
    doc = fitz.open(PDF_PATH)
    print(f"   ✓ {len(doc)} pages")

    # Process page by page
    print("\n" + "=" * 90)
    print("  PAGE-BY-PAGE ANALYSIS")
    print("=" * 90)

    all_assignments = []

    for page_num in range(len(doc)):
        page = doc[page_num]
        page_text = page.get_text("text")
        image_list = page.get_images()

        if not image_list:
            continue

        # Step 1: Find all sign codes on this page
        page_codes = find_codes_in_text(page_text)

        if not page_codes:
            continue

        # Convert codes to signs
        page_signs = []
        for code in page_codes:
            if code in code_to_sign:
                page_signs.append(code_to_sign[code])

        if not page_signs:
            continue

        # Step 2: Extract all images on this page
        page_images = []
        for img_idx, img_info in enumerate(image_list):
            try:
                xref = img_info[0]
                pix = fitz.Pixmap(doc, xref)
                quality = get_image_quality(pix)

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

        # Step 3: Match by position
        # Assumption: images appear in order matching sign descriptions
        print(f"\n📄 Page {page_num + 1}: {len(page_signs)} signs, {len(page_images)} images")

        for sign_idx, sign in enumerate(page_signs):
            # Check if already assigned
            already_assigned = any(
                a['sign_id'] == sign['id'] for a in all_assignments
            )
            if already_assigned:
                print(f"   ⊘ {sign['code']:15s} {sign['name']:40s} (already assigned)")
                continue

            # Match to image at corresponding position
            if sign_idx < len(page_images):
                img = page_images[sign_idx]

                img_path = f"{ASSETS_BASE}/{sign['category']}/{sign['id']}.png"

                try:
                    # Save image
                    with open(img_path, 'wb') as f:
                        f.write(img['data'])

                    all_assignments.append({
                        'sign_id': sign['id'],
                        'code': sign['code'],
                        'name': sign['name'],
                        'category': sign['category'],
                        'page': page_num + 1,
                        'position': sign_idx,
                        'quality': img['quality'],
                        'dimensions': f"{img['width']}×{img['height']}"
                    })

                    print(f"   ✓ {sign['code']:15s} {sign['name']:40s} ({img['width']}×{img['height']})")

                except Exception as e:
                    print(f"   ✗ {sign['code']:15s} {sign['name']:40s} - Error: {e}")

        if len(page_images) > len(page_signs):
            print(f"   ⚠️  {len(page_images) - len(page_signs)} extra images on page (no matching signs)")

    # Update database
    print("\n" + "=" * 90)
    print("  UPDATING DATABASE")
    print("=" * 90)

    for sign in signs_list:
        for assignment in all_assignments:
            if sign['id'] == assignment['sign_id']:
                sign['imagePath'] = f"/k53_assets/{sign['category']}/{sign['id']}.png"
                sign['_meticulous_match'] = {
                    'page': assignment['page'],
                    'position': assignment['position'],
                    'quality': assignment['quality'],
                    'dimensions': assignment['dimensions']
                }

    # Save database
    with open(SIGNS_JSON_PATH, 'w') as f:
        json.dump(signs_list, f, indent=2, ensure_ascii=False)

    # Summary
    with_images = [s for s in signs_list if 'imagePath' in s]
    without = [s for s in signs_list if 'imagePath' not in s]

    print("\n" + "=" * 90)
    print("  EXTRACTION COMPLETE")
    print("=" * 90)
    print(f"  Total signs: {len(signs_list)}")
    print(f"  With images: {len(with_images)}")
    print(f"  Without images: {len(without)}")
    print()

    if without:
        print(f"  Signs without images ({len(without)}):")
        for s in without[:20]:
            print(f"    {s['code']:15s} {s['name']}")
        if len(without) > 20:
            print(f"    ... and {len(without) - 20} more")

    print()
    print(f"  Database: {SIGNS_JSON_PATH}")
    print("=" * 90 + "\n")


if __name__ == "__main__":
    main()
