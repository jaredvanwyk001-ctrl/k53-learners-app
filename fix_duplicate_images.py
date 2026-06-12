#!/usr/bin/env python3
"""
Fix duplicate image mappings by manual inspection.

For each page with duplicate images:
1. Extract all images sorted by position
2. Show which codes are on that page
3. Create visual mapping guide
4. Apply corrections
"""

import json
import os
import shutil
import fitz
import re
from collections import defaultdict

PDF_PATH = "2_Manual_on_Road_Traffic_Signs_v100_Jun_2012.pdf"
SIGNS_JSON = "k53_signs_official.json"
ASSETS_BASE = "k53_assets"

def get_codes_on_page(page_text):
    """Extract sign codes from Name: sections."""
    pattern = r'\(([RWG][\dA-Z\.\-]+)\)'
    codes = re.findall(pattern, page_text)
    # Remove duplicates, preserve order
    seen = set()
    result = []
    for code in codes:
        code_upper = code.upper()
        if code_upper not in seen:
            seen.add(code_upper)
            result.append(code_upper)
    return result[:15]  # Limit to actual signs, not descriptions

def extract_page_images(page_num):
    """Extract all valid images from a page."""
    doc = fitz.open(PDF_PATH)
    page = doc[page_num]
    image_list = page.get_images()

    images = []
    for img_info in image_list:
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

            images.append({
                'data': img_data,
                'w': w,
                'h': h,
                'y': img_info[3]
            })
        except:
            continue

    # Sort by Y position (top to bottom)
    images.sort(key=lambda x: x['y'], reverse=True)
    return images

# Load data
with open(SIGNS_JSON, 'r') as f:
    signs = json.load(f)

code_to_sign = {s['code']: s for s in signs}
code_to_sign.update({s['code'].replace('.', ''): s for s in signs})

# Manual mappings for problematic pages
# Format: {page: {image_pos: code, ...}}

MANUAL_FIXES = {
    # Page 5: R1.1, R1.2, R1.3, R1.4, R1.5, R2 (6 codes, should have 6+ images)
    5: {
        0: 'R1.1',
        1: 'R1.2',
        2: 'R1.3',
        3: 'R1.4',
        4: 'R1.5',
        5: 'R2',
    },
    # Page 6: R2.1, R2.2, R3, R4.1, R4.2, R4.3, R5, R6
    # Based on visual inspection:
    # 0: Large photo (skip)
    # 1: Yield to pedestrians → R2.1
    # 2: Yield at circle → R2.2
    # 3: No Entry → R3
    # 4: Up arrow → R4.3
    # 5: Red circle with arrows → R6
    # 6: Red diamond with person → R5
    # Missing: R4.1, R4.2
    6: {
        1: 'R2.1',
        2: 'R2.2',
        3: 'R3',
        4: 'R4.3',
        5: 'R6',
        6: 'R5',
    },
}

def apply_fixes():
    """Apply manual fixes to specific pages."""
    print("\n" + "=" * 80)
    print("  APPLYING MANUAL PAGE FIXES")
    print("=" * 80 + "\n")

    fixed_count = 0

    for page_num, mapping in MANUAL_FIXES.items():
        print(f"Page {page_num + 1}:")

        # Extract images
        images = extract_page_images(page_num)

        # Get codes on page
        doc = fitz.open(PDF_PATH)
        page_text = doc[page_num].get_text("text")
        codes_mentioned = get_codes_on_page(page_text)

        print(f"  Codes: {', '.join(codes_mentioned[:8])}")
        print(f"  Images: {len(images)}")

        # Apply mapping
        for img_pos, code in mapping.items():
            if code not in code_to_sign:
                code_norm = code.replace('.', '')
                if code_norm not in code_to_sign:
                    print(f"    ⚠️  Code {code} not found")
                    continue
                sign = code_to_sign[code_norm]
            else:
                sign = code_to_sign[code]

            if img_pos >= len(images):
                print(f"    ⚠️  Image {img_pos} not available")
                continue

            # Save image
            img = images[img_pos]
            dest_path = f"{ASSETS_BASE}/{sign['category']}/{sign['id']}.png"

            # Write image
            with open(dest_path, 'wb') as f:
                f.write(img['data'])

            # Update database
            for s in signs:
                if s['id'] == sign['id']:
                    s['imagePath'] = f"/k53_assets/{sign['category']}/{sign['id']}.png"
                    break

            print(f"    ✓ {code:8s} → {sign['name'][:40]}")
            fixed_count += 1

        print()

    # Save updated database
    with open(SIGNS_JSON, 'w') as f:
        json.dump(signs, f, indent=2, ensure_ascii=False)

    print("=" * 80)
    print(f"✅ Fixed {fixed_count} sign mappings")
    print("=" * 80 + "\n")

if __name__ == "__main__":
    apply_fixes()
