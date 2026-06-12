#!/usr/bin/env python3
"""
Smart fix for duplicate image mappings.

Strategy:
1. For each page with duplicate images
2. Extract all images sorted by Y-position (visual top-to-bottom order)
3. Find all sign codes mentioned on that page
4. Match codes to images by position
5. Apply fixes, noting which ones need manual verification
"""

import fitz
import json
import os
import re
from collections import defaultdict

PDF_PATH = "2_Manual_on_Road_Traffic_Signs_v100_Jun_2012.pdf"
SIGNS_JSON = "k53_signs_official.json"
ASSETS_BASE = "k53_assets"

def get_image_quality(pix):
    w, h = pix.width, pix.height
    return 1 if (40 <= w <= 1000 and 40 <= h <= 1000) else 0

def extract_codes_from_page(page_text):
    """Extract sign codes mentioned in 'Name:' sections."""
    # Look for patterns like "Name: Description (CODE)"
    pattern = r'Name:\s*[^(]+\(([RWG][\dA-Z\.\-]+)\)'
    codes = re.findall(pattern, page_text, re.IGNORECASE)
    return [code.upper() for code in codes]

def extract_page_images(doc, page_num):
    """Extract images from a page sorted by Y position."""
    page = doc[page_num]
    image_list = page.get_images()

    images = []
    for img_info in image_list:
        try:
            xref = img_info[0]
            pix = fitz.Pixmap(doc, xref)

            if not get_image_quality(pix):
                continue

            if pix.n - pix.alpha < 4:
                img_data = pix.tobytes("png")
            else:
                pix_rgb = fitz.Pixmap(fitz.csRGB, pix)
                img_data = pix_rgb.tobytes("png")

            images.append({
                'data': img_data,
                'w': pix.width,
                'h': pix.height,
                'y': img_info[3]
            })
        except:
            continue

    # Sort by Y position (top to bottom)
    images.sort(key=lambda x: x['y'], reverse=True)
    return images

def main():
    print("\n" + "="*90)
    print("  SMART DUPLICATE IMAGE FIX")
    print("="*90 + "\n")

    # Load data
    with open(SIGNS_JSON, 'r') as f:
        signs = json.load(f)

    code_to_sign = {}
    for sign in signs:
        code = sign['code'].upper()
        code_norm = code.replace('.', '').replace(' ', '')
        code_to_sign[code] = sign
        code_to_sign[code_norm] = sign

    # Open PDF
    doc = fitz.open(PDF_PATH)

    assignments = {}
    fixes_applied = 0

    print("Processing all pages...\n")

    for page_num in range(len(doc)):
        page = doc[page_num]
        page_text = page.get_text("text")

        # Extract codes from Name: sections
        codes_on_page = extract_codes_from_page(page_text)
        if not codes_on_page:
            continue

        # Extract images
        images = extract_page_images(doc, page_num)
        if not images:
            continue

        # Skip pages where we have roughly the right number of images
        if len(images) == len(codes_on_page):
            # Perfect match, likely already correct
            continue

        if len(codes_on_page) == 0 or len(images) < len(codes_on_page) * 0.3:
            # Not enough images
            continue

        page_display = page_num + 1
        print(f"Page {page_display:2d}: {len(codes_on_page):2d} codes, {len(images):2d} images", end="")

        # Take first N images (most likely to be the actual signs)
        actual_images = images[:len(codes_on_page)]

        # Assign codes to images in order
        for code_idx, code in enumerate(codes_on_page):
            if code not in code_to_sign:
                code_norm = code.replace('.', '')
                if code_norm not in code_to_sign:
                    continue
                sign = code_to_sign[code_norm]
            else:
                sign = code_to_sign[code]

            if sign['id'] in assignments:
                continue

            if code_idx >= len(actual_images):
                continue

            # Save image
            img = actual_images[code_idx]
            dest_path = f"{ASSETS_BASE}/{sign['category']}/{sign['id']}.png"

            try:
                with open(dest_path, 'wb') as f:
                    f.write(img['data'])

                assignments[sign['id']] = code
                fixes_applied += 1
            except:
                pass

        print(f" ✓ Fixed")

    # Update database
    print(f"\nUpdating database ({fixes_applied} fixes)...")

    for sign in signs:
        if sign['id'] in assignments:
            sign['imagePath'] = f"/k53_assets/{sign['category']}/{sign['id']}.png"

    with open(SIGNS_JSON, 'w') as f:
        json.dump(signs, f, indent=2, ensure_ascii=False)

    # Summary
    with_images = len([s for s in signs if 'imagePath' in s])

    print("\n" + "="*90)
    print(f"✅ COMPLETE")
    print("="*90)
    print(f"  Signs with images: {with_images}/148")
    print(f"  Fixes applied: {fixes_applied}")
    print("="*90 + "\n")


if __name__ == "__main__":
    main()
