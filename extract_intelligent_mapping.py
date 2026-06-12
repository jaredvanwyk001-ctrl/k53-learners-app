#!/usr/bin/env python3
"""
Intelligent K53 Extraction
==========================
Strategy: Extract sign codes from specific text patterns (Name: sections)
and match to images on the same area of the page using coordinate proximity.

This avoids the problem of finding random code mentions throughout the text.
"""

import fitz
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
    return 1

def find_name_sections(page_text):
    """Find sign names and their codes from 'Name:' sections."""
    # Pattern: "Name: {description} ({CODE})"
    pattern = r'Name:\s*([^(]+)\(([RWG][\dA-Z\.\-]+)\)'
    matches = re.findall(pattern, page_text, re.IGNORECASE)

    results = []
    for desc, code in matches:
        results.append({
            'description': desc.strip(),
            'code': code.upper(),
            'y_pos': page_text.find(f'Name: {desc}({code})')  # Approximate
        })

    return results

def main():
    print("\n" + "=" * 90)
    print("  INTELLIGENT K53 EXTRACTION")
    print("=" * 90)

    # Load database
    with open(SIGNS_JSON_PATH, 'r') as f:
        signs_list = json.load(f)

    code_to_sign = {}
    for sign in signs_list:
        code = sign['code'].replace('.', '').replace(' ', '').upper()
        code_to_sign[code] = sign
        code_to_sign[sign['code'].upper()] = sign

    # Create output dirs
    for sign in signs_list:
        os.makedirs(f"{ASSETS_BASE}/{sign['category']}", exist_ok=True)

    # Clear old assignments
    for sign in signs_list:
        sign.pop('imagePath', None)

    doc = fitz.open(PDF_PATH)
    print(f"\n📖 Processing {len(doc)} pages...")

    assignments = {}
    page_stats = []

    for page_num in range(len(doc)):
        page = doc[page_num]
        page_text = page.get_text("text")
        image_list = page.get_images()

        if not image_list:
            continue

        # Find "Name:" sections which indicate actual sign entries
        name_sections = find_name_sections(page_text)

        if not name_sections:
            continue

        # Extract images with Y positions
        page_images = []
        for img_info in image_list:
            try:
                xref = img_info[0]
                pix = fitz.Pixmap(doc, xref)

                if get_image_quality(pix) <= 0:
                    continue

                if pix.n - pix.alpha < 4:
                    img_data = pix.tobytes("png")
                else:
                    pix_rgb = fitz.Pixmap(fitz.csRGB, pix)
                    img_data = pix_rgb.tobytes("png")

                page_images.append({
                    'data': img_data,
                    'width': pix.width,
                    'height': pix.height,
                    'y': img_info[3]
                })
            except:
                continue

        if not page_images:
            continue

        # Sort images top-to-bottom
        page_images.sort(key=lambda x: x['y'], reverse=True)

        page_stats.append({
            'page': page_num + 1,
            'codes': len(name_sections),
            'images': len(page_images),
            'match': len(name_sections) == len(page_images)
        })

        # Assign images to codes in order
        for code_idx, name_section in enumerate(name_sections):
            code = name_section['code']

            # Try to find in database
            if code not in code_to_sign:
                code_norm = code.replace('.', '')
                if code_norm not in code_to_sign:
                    continue

            sign = code_to_sign[code]

            if sign['id'] in assignments:
                continue

            # Match to image at same position
            if code_idx < len(page_images):
                img = page_images[code_idx]

                img_path = f"{ASSETS_BASE}/{sign['category']}/{sign['id']}.png"
                try:
                    with open(img_path, 'wb') as f:
                        f.write(img['data'])

                    assignments[sign['id']] = code

                    if page_stats[-1]['match']:
                        print(f"Page {page_num+1:2d}: ✓ {code:15s} → {sign['name'][:40]}")

                except:
                    pass

    # Update database
    for sign in signs_list:
        if sign['id'] in assignments:
            sign['imagePath'] = f"/k53_assets/{sign['category']}/{sign['id']}.png"

    with open(SIGNS_JSON_PATH, 'w') as f:
        json.dump(signs_list, f, indent=2, ensure_ascii=False)

    with_images = len([s for s in signs_list if 'imagePath' in s])

    print("\n" + "=" * 90)
    print(f"✅ EXTRACTION COMPLETE: {with_images} signs with images")
    print("=" * 90)

    # Show pages where codes matched images count
    print("\nPages with matching code/image counts:")
    matched = [p for p in page_stats if p['match']]
    for p in matched[:15]:
        print(f"  Page {p['page']:2d}: {p['codes']} codes, {p['images']} images ✓")


if __name__ == "__main__":
    main()
