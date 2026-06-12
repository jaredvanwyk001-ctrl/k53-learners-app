#!/usr/bin/env python3
"""
K53 Direct Code-to-Image Matching
==================================
For each sign code found in PDF:
  1. Find the exact location of that code in the text
  2. Get the NEXT image that appears after that code
  3. Assign that image to that sign

This is more accurate than position-based matching.
"""

import fitz  # PyMuPDF
from PIL import Image
import io
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

def main():
    print("\n" + "=" * 90)
    print("  K53 DIRECT CODE-TO-IMAGE MATCHING")
    print("=" * 90)

    # Load signs
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
    skipped_codes = []

    for page_num in range(len(doc)):
        page = doc[page_num]

        # Get text blocks with positions
        text_dict = page.get_text("dict")

        # Get all images
        image_list = page.get_images()
        if not image_list:
            continue

        # Extract images with positions
        images_by_pos = {}
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

                    images_by_pos[img_idx] = {
                        'data': img_data,
                        'quality': quality,
                        'width': pix.width,
                        'height': pix.height
                    }
            except:
                continue

        # Get page text
        page_text = page.get_text("text")

        # Find all sign codes on this page
        codes = re.findall(r'[RWG][\dA-Z\.\-]+', page_text, re.IGNORECASE)

        for code in codes:
            code_upper = code.upper()

            if code_upper not in code_to_sign:
                continue

            sign = code_to_sign[code_upper]

            if sign['id'] in assignments:
                continue  # Already assigned

            # Find position of this code in text
            code_pos = page_text.find(code_upper)
            if code_pos == -1:
                code_pos = page_text.find(code_upper.replace('.', ''))

            if code_pos == -1:
                skipped_codes.append(code_upper)
                continue

            # Get the FIRST good quality image on this page
            # Prefer it if it appears after the code text
            best_img_idx = None
            best_img = None

            for img_idx in sorted(images_by_pos.keys()):
                if images_by_pos[img_idx]['quality'] > 0.3:  # Good quality
                    if best_img is None:
                        best_img_idx = img_idx
                        best_img = images_by_pos[img_idx]
                        break

            if best_img:
                img_path = f"{ASSETS_BASE}/{sign['category']}/{sign['id']}.png"

                try:
                    with open(img_path, 'wb') as f:
                        f.write(best_img['data'])

                    assignments[sign['id']] = {
                        'code': code_upper,
                        'name': sign['name'],
                        'page': page_num + 1,
                        'dimensions': f"{best_img['width']}×{best_img['height']}"
                    }

                    print(f"Page {page_num+1:2d}: {code_upper:15s} → {sign['name']:50s}")

                except Exception as e:
                    print(f"ERROR: {code_upper:15s} - {e}")

    # Update database
    print(f"\n💾 Updating {len(assignments)} signs with images...")

    for sign in signs_list:
        if sign['id'] in assignments:
            sign['imagePath'] = f"/k53_assets/{sign['category']}/{sign['id']}.png"

    with open(SIGNS_JSON_PATH, 'w') as f:
        json.dump(signs_list, f, indent=2, ensure_ascii=False)

    # Summary
    with_images = len([s for s in signs_list if 'imagePath' in s])

    print("\n" + "=" * 90)
    print(f"✅ COMPLETE: {with_images} signs with images")
    print("=" * 90)


if __name__ == "__main__":
    main()
