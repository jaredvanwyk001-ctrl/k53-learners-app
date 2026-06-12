#!/usr/bin/env python3
"""
Create a comprehensive manual mapping guide for all problematic pages.

This script identifies all pages with duplicate image issues, extracts the images,
and generates a human-readable mapping guide that shows which image position
should map to which sign code based on:
1. Visual inspection (user will do this)
2. Logical ordering from the PDF
3. Known K53 sign patterns
"""

import json
import fitz
import re
import hashlib
from collections import defaultdict

PDF_PATH = "2_Manual_on_Road_Traffic_Signs_v100_Jun_2012.pdf"
SIGNS_JSON = "k53_signs_official.json"

# Load signs
with open(SIGNS_JSON, 'r') as f:
    signs = json.load(f)

# Find all signs with duplicate images
image_to_codes = defaultdict(list)
for sign in signs:
    if 'imagePath' in sign:
        img_path = f".{sign['imagePath']}"
        try:
            with open(img_path, 'rb') as f:
                h = hashlib.md5(f.read()).hexdigest()
                image_to_codes[h].append(sign['code'])
        except:
            pass

# Get problematic groups
problem_groups = {h: codes for h, codes in image_to_codes.items() if len(codes) > 1}

print("\n" + "="*90)
print("  MANUAL MAPPING GUIDE FOR PROBLEMATIC PAGES")
print("="*90)

print(f"\nFound {len(problem_groups)} groups of duplicate images")
print(f"Affecting {sum(len(codes) for codes in problem_groups.values())} signs\n")

# For each problem group, find which page it's on
doc = fitz.open(PDF_PATH)
problem_pages = defaultdict(list)

for code_list in problem_groups.values():
    first_code = code_list[0]

    # Find page
    for page_num in range(len(doc)):
        text = doc[page_num].get_text("text")
        if f'({first_code})' in text:
            problem_pages[page_num + 1].append((first_code, code_list))
            break

# Sort pages
sorted_pages = sorted(problem_pages.items(), key=lambda x: len(x[1][0][1]), reverse=True)

print("Top problem pages (by number of affected signs):\n")

for page_num, code_groups in sorted_pages[:10]:
    for first_code, code_list in code_groups:
        count = len(code_list)
        print(f"  Page {page_num:2d}: {count:2d} signs ({', '.join(code_list[:3])}...)")

print(f"\n{'='*90}")
print("These pages need manual inspection and correction.")
print("="*90 + "\n")

# Generate JSON template for manual fixes
manual_fixes_template = {}

for page_num, code_groups in sorted_pages[:15]:  # Top 15 pages
    page_index = page_num - 1

    manual_fixes_template[page_index] = {
        'page': page_num,
        'codes': [],
        'image_mapping': {}
    }

    # Get unique codes for this page
    all_codes_on_page = set()
    for first_code, code_list in code_groups:
        all_codes_on_page.update(code_list)

    manual_fixes_template[page_index]['codes'] = sorted(list(all_codes_on_page))

    # Placeholder for image mappings
    for i in range(len(all_codes_on_page)):
        manual_fixes_template[page_index]['image_mapping'][i] = "INSPECT_IMAGE_AND_IDENTIFY"

# Save template
with open('/tmp/manual_mapping_template.json', 'w') as f:
    json.dump(manual_fixes_template, f, indent=2)

print("Created template: /tmp/manual_mapping_template.json")
print("Use this to systematically fix each page.")
