#!/usr/bin/env python3
"""
K53 Position-Based Extraction (CORRECTED)
==========================================
For each page:
  1. Find all sign codes in the TEXT (in order mentioned)
  2. Extract all IMAGES and sort by Y-position (top to bottom)
  3. Match by position: image N (by position) → sign N (by text order)

The KEY FIX: sort images by Y-coordinate, not PDF stream order.
"""

import fitz  # PyMuPDF
import os
import json
import re

PDF_PATH = "2_Manual_on_Road_Traffic_Signs_v100_Jun_2012.pdf"
SIGNS_JSON_PATH = "k53_signs_official.json"
ASSETS_BASE = "k53_assets"

def get_image_quality(pix):
    w, h = pix.width, pix.height
    if w < 40 or h < 40 or w > 1000 or h > 1000:
        return 0
    size = min(w * h, 100000) / 100000
    aspect = (min(w, h) / max(w, h)) ** 1.2
    return (size * 0.6 + aspect * 0.4)

def normalize_code(code):
    return code.replace('.', '').replace(' ', '').upper()

def find_codes_in_text(text):
    """Find sign codes in order they appear in text."""
    codes = re.findall(r'[RWG][\dA-Z\.\-]+', text, re.IGNORECASE)
    # Remove duplicates but preserve order
    seen = set()
    result = []
    for code in codes:
        code_upper = code.upper()
        if code_upper not in seen:
            seen.add(code_upper)
            result.append(code_upper)
    return result

def main():
    print("\n" + "=" * 90)
    print("  K53 POSITION-BASED EXTRACTION (Y-COORDINATE SORTED)")
    print("=" * 90)

    # Load database
    with open(SIGNS_JSON_PATH, 'r') as f:
        signs_list = json.load(f)

    code_to_sign = {}
    for sign in signs_list:
        code = sign['code']
        code_norm = normalize_code(code)
        code_to_sign[code] = sign
        code_to_sign[code_norm] = sign

    print(f"\n📖 {len(signs_list)} signs in database")

    # Create output dirs
    for sign in signs_list:
        os.makedirs(f"{ASSETS_BASE}/{sign['category']}", exist_ok=True)

    # Clear old assignments
    for sign in signs_list:
        sign.pop('imagePath', None)

    # Open PDF
    doc = fitz.open(PDF_PATH)
    print(f"📄 Processing {len(doc)} pages...")

    assignments = {}

    for page_num in range(len(doc)):
        page = doc[page_num]
        page_text = page.get_text("text")
        image_list = page.get_images()

        if not image_list:
            continue

        # Step 1: Find sign codes in text order
        page_codes = find_codes_in_text(page_text)
        if not page_codes:
            continue

        # Step 2: Extract images with Y-positions
        page_images = []
        for img_info in image_list:
            try:
                xref = img_info[0]
                pix = fitz.Pixmap(doc, xref)
                quality = get_image_quality(pix)

                if quality <= 0:
                    continue

                # Convert to PNG
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
                    'y_pos': img_info[3]  # Get Y coordinate
                })
            except:
                continue

        if not page_images:
            continue

        # Step 3: Sort images by Y-position (top to bottom)
        page_images.sort(key=lambda x: x['y_pos'])

        # Step 4: Match codes to images by position
        print(f"Page {page_num+1:2d}: {len(page_codes)} signs, {len(page_images)} images (sorted by Y-pos)")

        for sign_idx, code in enumerate(page_codes):
            if code not in code_to_sign:
                continue

            sign = code_to_sign[code]

            # Skip if already assigned
            if sign['id'] in assignments:
                continue

            # Match to image at same position
            if sign_idx < len(page_images):
                img = page_images[sign_idx]

                img_path = f"{ASSETS_BASE}/{sign['category']}/{sign['id']}.png"
                try:
                    with open(img_path, 'wb') as f:
                        f.write(img['data'])

                    assignments[sign['id']] = code
                    print(f"  ✓ {code:15s} → {sign['name']}")

                except Exception as e:
                    print(f"  ✗ {code:15s} - Error: {e}")

    # Update database
    print(f"\n💾 Updating {len(assignments)} signs with images...")

    for sign in signs_list:
        if sign['id'] in assignments:
            sign['imagePath'] = f"/k53_assets/{sign['category']}/{sign['id']}.png"

    with open(SIGNS_JSON_PATH, 'w') as f:
        json.dump(signs_list, f, indent=2, ensure_ascii=False)

    with_images = len([s for s in signs_list if 'imagePath' in s])

    print("\n" + "=" * 90)
    print(f"✅ COMPLETE: {with_images} signs with images")
    print("=" * 90)


if __name__ == "__main__":
    main()
