#!/usr/bin/env python3
"""
K53 Clean Asset Extraction (AGGRESSIVE)
========================================
Reads the official K53 PDF manual and extracts ALL high-quality sign images.
Uses intelligent matching with k53_signs_official.json as source of truth.

Strategy:
  1. Extract every reasonably-sized image from the PDF
  2. Score each image for quality (size, aspect ratio)
  3. Match images to signs using page proximity + text heuristics
  4. Assign best image to each sign

Output:
  - k53_assets/{category}/{sign_id}.png (all available signs)
  - k53_signs_official.json (updated with image paths)
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


def get_image_quality_score(pix):
    """
    Score image quality: prefer medium-sized square images (actual signs).
    Typical sign sizes: 50-200px, nearly square aspect ratio.
    """
    w, h = pix.width, pix.height

    # Skip tiny images (< 40px) - noise, decorations
    if w < 40 or h < 40:
        return 0

    # Skip huge images (> 1000px) - page backgrounds, diagrams
    if w > 1000 or h > 1000:
        return 0

    # Prefer medium-to-large images
    size = min(w * h, 100000)
    size_score = size / 100000

    # Prefer square-ish images (signs are usually square or nearly square)
    aspect = min(w, h) / max(w, h)
    aspect_score = aspect ** 1.2

    # Combined score
    return (size_score * 0.6 + aspect_score * 0.4)


def extract_all_images(doc):
    """Extract all scorable images from entire PDF."""
    all_images = []

    for page_num in range(len(doc)):
        page = doc[page_num]
        page_text = page.get_text("text")
        image_list = page.get_images()

        for img_index, img_info in enumerate(image_list):
            xref = img_info[0]
            try:
                pix = fitz.Pixmap(doc, xref)
                score = get_image_quality_score(pix)

                if score > 0:
                    # Convert to PNG bytes
                    if pix.n - pix.alpha < 4:  # GRAY or RGB
                        img_data = pix.tobytes("png")
                    else:  # CMYK
                        pix_rgb = fitz.Pixmap(fitz.csRGB, pix)
                        img_data = pix_rgb.tobytes("png")

                    all_images.append({
                        'page': page_num,
                        'data': img_data,
                        'score': score,
                        'width': pix.width,
                        'height': pix.height,
                        'size_kb': len(img_data) / 1024,
                        'page_text': page_text
                    })
            except:
                continue

    return sorted(all_images, key=lambda x: x['score'], reverse=True)


def match_sign_to_image(sign, page_images):
    """
    Find the best image for a sign from images on its pages.

    Strategy:
    1. Look for explicit code match in page text
    2. Fall back to category match + size heuristics
    3. Return highest-quality match
    """
    best_score = 0
    best_image = None

    for img in page_images:
        page_text = img['page_text'].lower()
        code = sign['code'].lower().replace('.', '')
        name = sign['name'].lower()

        match_score = img['score']  # Start with quality

        # Boost score if code is on this page
        if code in page_text or sign['code'] in page_text:
            match_score *= 1.5
        # Slight boost if name is on page
        elif len(name) > 5 and name in page_text:
            match_score *= 1.2

        if match_score > best_score:
            best_score = match_score
            best_image = img

    return best_image if best_score > 0.3 else None


def main():
    print("\n" + "=" * 80)
    print("  K53 CLEAN ASSET EXTRACTION (AGGRESSIVE MODE)")
    print("=" * 80)

    # Load official database
    print("\n📖 Loading official K53 signs...")
    with open(SIGNS_JSON_PATH, 'r', encoding='utf-8') as f:
        signs = json.load(f)
    print(f"   ✓ {len(signs)} official signs loaded")

    # Create output dirs
    for sign in signs:
        cat_dir = os.path.join(ASSETS_BASE, sign['category'])
        os.makedirs(cat_dir, exist_ok=True)

    # Open PDF
    print(f"\n📄 Opening: {PDF_PATH}")
    doc = fitz.open(PDF_PATH)
    print(f"   ✓ {len(doc)} pages")

    # Extract ALL images
    print("\n🔍 Extracting ALL images from PDF...")
    all_images = extract_all_images(doc)
    print(f"   ✓ Found {len(all_images)} scorable images")

    # Group images by page for better matching
    images_by_page = defaultdict(list)
    for img in all_images:
        images_by_page[img['page']].append(img)

    # Build page-to-signs map to improve matching
    signs_by_page = defaultdict(list)
    for sign in signs:
        # Try to find which pages mention this sign
        for page_num in range(len(doc)):
            page = doc[page_num]
            text = page.get_text("text").lower()
            code = sign['code'].lower().replace('.', '')
            if code in text or sign['code'] in text:
                signs_by_page[page_num].append(sign)

    # Assign images to signs
    print("\n📸 Matching images to signs...")
    assigned = 0
    skipped = []

    for sign in signs:
        sign_id = sign['id']
        category = sign['category']
        img_path = os.path.join(ASSETS_BASE, category, f"{sign_id}.png")

        # Skip if already extracted
        if os.path.exists(img_path):
            if 'imagePath' not in sign:
                sign['imagePath'] = f"./k53_assets/{category}/{sign_id}.png"
            assigned += 1
            continue

        # Find candidate images (from pages that mention this sign, or all images)
        candidates = []
        for page_num in signs_by_page:
            if sign in signs_by_page[page_num]:
                candidates.extend(images_by_page[page_num])

        # If no explicit page match, use top images from similar pages
        if not candidates:
            candidates = all_images[:200]  # Use best 200 images as fallback

        # Find best match
        best = match_sign_to_image(sign, candidates)

        if best:
            try:
                with open(img_path, 'wb') as f:
                    f.write(best['data'])

                sign['imagePath'] = f"./k53_assets/{category}/{sign_id}.png"
                sign['_extraction'] = {
                    'source_page': best['page'] + 1,
                    'dimensions': f"{best['width']}×{best['height']}",
                    'quality_score': round(best['score'], 2),
                    'size_kb': round(best['size_kb'], 1)
                }

                assigned += 1
                if assigned % 20 == 0:
                    print(f"   ✓ {assigned} signs assigned...")

            except Exception as e:
                skipped.append((sign_id, str(e)))
        else:
            skipped.append((sign_id, "No suitable image found"))

    # Save updated database
    print(f"\n💾 Saving updated database...")
    with open(SIGNS_JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(signs, f, indent=2, ensure_ascii=False)
    print(f"   ✓ {SIGNS_JSON_PATH} updated")

    # Statistics
    with_images = [s for s in signs if 'imagePath' in s]
    without = [s for s in signs if 'imagePath' not in s]

    print("\n" + "=" * 80)
    print("  EXTRACTION COMPLETE")
    print("=" * 80)
    print(f"  Total signs in database:        {len(signs)}")
    print(f"  Signs with extracted images:    {len(with_images)} ✓")
    print(f"  Signs with grey placeholders:   {len(without)}")
    print()

    if without:
        print(f"  Placeholders (will show grey box with code):")
        for s in without[:15]:
            print(f"    {s['code']:15s} {s['name']}")
        if len(without) > 15:
            print(f"    ... and {len(without) - 15} more")

    print()
    print(f"  Assets location:  {ASSETS_BASE}/")
    print(f"  Database:         {SIGNS_JSON_PATH}")
    print("=" * 80 + "\n")


if __name__ == "__main__":
    main()
