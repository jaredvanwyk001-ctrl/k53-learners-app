#!/usr/bin/env python3
"""
Extract all images from all pages for manual inspection
Organize them by page with metadata
"""

import fitz
import os
import json
from pathlib import Path

PDF_PATH = "2_Manual_on_Road_Traffic_Signs_v100_Jun_2012.pdf"
doc = fitz.open(PDF_PATH)

# Load database to get sign codes per page
with open('k53_signs_official.json', 'r') as f:
    signs = json.load(f)

print(f"\n{'='*80}")
print(f"EXTRACTING ALL IMAGES FROM ALL {len(doc)} PAGES")
print(f"{'='*80}\n")

page_info = []

for page_num in range(len(doc)):
    page = doc[page_num]
    page_text = page.get_text("text")
    image_list = page.get_images()

    if not image_list:
        continue

    # Find sign codes on this page
    import re
    codes = re.findall(r'[RWG][\dA-Z\.\-]+', page_text, re.IGNORECASE)
    codes = list(dict.fromkeys(codes))  # Remove duplicates, preserve order

    # Extract images with positions
    page_images = []

    for img_idx, img_info in enumerate(image_list):
        try:
            xref = img_info[0]
            pix = fitz.Pixmap(doc, xref)

            w, h = pix.width, pix.height
            if w < 40 or h < 40 or w > 1000 or h > 1000:
                continue

            if pix.n - pix.alpha < 4:
                img_data = pix.tobytes("png")
            else:
                pix_rgb = fitz.Pixmap(fitz.csRGB, pix)
                img_data = pix_rgb.tobytes("png")

            y_pos = img_info[3]
            page_images.append({
                'idx': img_idx,
                'y_pos': y_pos,
                'data': img_data,
                'w': w,
                'h': h
            })
        except:
            continue

    if page_images:
        page_images.sort(key=lambda x: x['y_pos'], reverse=True)

        # Create output directory
        page_dir = f"/tmp/inspection/page{page_num+1:02d}"
        os.makedirs(page_dir, exist_ok=True)

        # Save images
        for pos, img_info in enumerate(page_images):
            filename = f"{page_dir}/{pos:02d}_{img_info['w']}x{img_info['h']}.png"
            with open(filename, 'wb') as f:
                f.write(img_info['data'])

        page_info.append({
            'page': page_num + 1,
            'codes': codes,
            'image_count': len(page_images),
            'dir': page_dir
        })

# Print summary
print(f"Extracted images from {len(page_info)} pages\n")

for info in page_info[:20]:
    page = info['page']
    codes = info['codes']
    img_count = info['image_count']
    code_count = len(codes)

    status = "✓" if img_count == code_count else "⚠️"
    print(f"{status} Page {page:2d}: {code_count:2d} codes, {img_count:2d} images → {info['dir']}")

if len(page_info) > 20:
    print(f"... and {len(page_info) - 20} more pages")

print(f"\nTo inspect images, open: /tmp/inspection/page##/")
