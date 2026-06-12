#!/usr/bin/env python3
"""
K53 OCR-Based Image Matching
=============================
Extract the sign code text directly from each image using OCR.
Match each image to its sign code by reading the text in the image.

This solves the "multiple signs per page get same image" problem.
"""

import fitz  # PyMuPDF
from PIL import Image
import pytesseract
import io
import os
import json
import re
from collections import defaultdict

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

def extract_sign_code_from_image(img_data):
    """
    Use OCR to extract sign code from image.
    Look for patterns like R101, W205, GD-3, etc.
    """
    try:
        img = Image.open(io.BytesIO(img_data))
        text = pytesseract.image_to_string(img)

        # Look for sign codes in the image
        # Patterns: R1.1, W205, GD-3, RM12, IN7, etc.
        codes = re.findall(r'[RWG][A-Z]?[\d\.\-]+', text, re.IGNORECASE)

        if codes:
            return codes[0].upper()
        return None
    except Exception as e:
        return None

def normalize_code(code):
    return code.replace('.', '').replace(' ', '').upper()

def main():
    print("\n" + "=" * 90)
    print("  K53 OCR-BASED IMAGE MATCHING")
    print("=" * 90)

    # Load database
    with open(SIGNS_JSON_PATH, 'r') as f:
        signs_list = json.load(f)

    # Create code lookup (handle both with and without dots)
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
    no_code_found = []

    for page_num in range(len(doc)):
        page = doc[page_num]
        image_list = page.get_images()

        if not image_list:
            continue

        print(f"\nPage {page_num + 1}: {len(image_list)} images")

        for img_idx, img_info in enumerate(image_list):
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

                # Extract sign code from image using OCR
                sign_code = extract_sign_code_from_image(img_data)

                if not sign_code:
                    no_code_found.append((page_num + 1, img_idx))
                    continue

                # Look up sign
                if sign_code not in code_to_sign:
                    print(f"  ⚠️  Image has code {sign_code} but not in database")
                    continue

                sign = code_to_sign[sign_code]

                # Skip if already assigned
                if sign['id'] in assignments:
                    print(f"  ⊘ {sign_code} already assigned (duplicate in PDF)")
                    continue

                # Save image
                img_path = f"{ASSETS_BASE}/{sign['category']}/{sign['id']}.png"
                with open(img_path, 'wb') as f:
                    f.write(img_data)

                assignments[sign['id']] = sign_code
                print(f"  ✓ {sign_code:15s} → {sign['name']}")

            except Exception as e:
                continue

    # Update database
    print(f"\n💾 Updating {len(assignments)} signs with images...")

    for sign in signs_list:
        if sign['id'] in assignments:
            sign['imagePath'] = f"/k53_assets/{sign['category']}/{sign['id']}.png"

    with open(SIGNS_JSON_PATH, 'w') as f:
        json.dump(signs_list, f, indent=2, ensure_ascii=False)

    with_images = len([s for s in signs_list if 'imagePath' in s])
    without = len(signs_list) - with_images

    print("\n" + "=" * 90)
    print(f"✅ COMPLETE")
    print("=" * 90)
    print(f"  With images (OCR matched): {with_images}")
    print(f"  Without images: {without}")
    print(f"  Images without readable code: {len(no_code_found)}")
    print()
    print(f"  Database: {SIGNS_JSON_PATH}")
    print("=" * 90)


if __name__ == "__main__":
    main()
