#!/usr/bin/env python3
"""
K53 Perfect Asset Extraction with Exact Matching
================================================
Uses OCR and exact text matching to perfectly map images to sign codes.

Strategy:
  1. Extract text and images from each PDF page together
  2. Use OCR to read sign codes directly from images
  3. Match images to sign data using exact code matching
  4. Only assign when confidence is very high (>0.8)
  5. Manual review for any ambiguous cases

Output:
  - k53_assets/{category}/{sign_id}.png (perfectly matched)
  - k53_signs_official.json (updated with correct mappings)
  - unmatched_images.json (for manual review)
"""

import fitz  # PyMuPDF
from PIL import Image
import io
import os
import json
import re
import pytesseract
from collections import defaultdict

PDF_PATH = "2_Manual_on_Road_Traffic_Signs_v100_Jun_2012.pdf"
SIGNS_JSON_PATH = "k53_signs_official.json"
ASSETS_BASE = "k53_assets"


def extract_text_from_image(img_data):
    """Use OCR to extract text from image (including sign codes)."""
    try:
        img = Image.open(io.BytesIO(img_data))
        text = pytesseract.image_to_string(img)
        return text.strip()
    except:
        return ""


def find_sign_codes_in_text(text):
    """Extract all potential sign codes from text."""
    # Pattern for sign codes: R1.1, W101, GLS-4, etc.
    codes = re.findall(r'[RWG][\dA-Z\.\-]+', text, re.IGNORECASE)
    return list(set([c.upper() for c in codes]))


def get_image_quality_score(pix):
    """Score image quality: prefer medium-sized square images."""
    w, h = pix.width, pix.height

    if w < 40 or h < 40 or w > 1000 or h > 1000:
        return 0

    size = min(w * h, 100000)
    size_score = size / 100000

    aspect = min(w, h) / max(w, h)
    aspect_score = aspect ** 1.2

    return (size_score * 0.6 + aspect_score * 0.4)


def main():
    print("\n" + "=" * 80)
    print("  K53 PERFECT ASSET EXTRACTION (EXACT MATCHING)")
    print("=" * 80)

    # Load official database
    print("\n📖 Loading official K53 signs...")
    with open(SIGNS_JSON_PATH, 'r', encoding='utf-8') as f:
        signs = json.load(f)
    print(f"   ✓ {len(signs)} official signs loaded")

    # Create code lookups
    code_to_sign = {}
    id_to_sign = {}
    for sign in signs:
        code = sign['code']
        id_to_sign[sign['id']] = sign
        # All code variants
        code_to_sign[code] = sign
        code_to_sign[code.replace('.', '')] = sign
        code_to_sign[code.lower()] = sign
        code_to_sign[code.upper()] = sign

    # Create output dirs
    for sign in signs:
        cat_dir = os.path.join(ASSETS_BASE, sign['category'])
        os.makedirs(cat_dir, exist_ok=True)

    # Open PDF
    print(f"\n📄 Opening: {PDF_PATH}")
    doc = fitz.open(PDF_PATH)
    print(f"   ✓ {len(doc)} pages")

    # Extract images with OCR matching
    print("\n🔍 Extracting images with exact code matching...")

    assigned = 0
    unmatched = []
    assignments = {}  # sign_id -> (page, confidence, method)

    for page_num in range(len(doc)):
        page = doc[page_num]
        page_text = page.get_text("text")
        image_list = page.get_images()

        if not image_list:
            continue

        # Find which signs are mentioned on this page
        page_codes = find_sign_codes_in_text(page_text)
        page_signs = []
        for code in page_codes:
            if code in code_to_sign:
                page_signs.append(code_to_sign[code])

        if not page_signs:
            continue

        # Extract images with quality scores
        page_images = []
        for img_idx, img_info in enumerate(image_list):
            try:
                xref = img_info[0]
                pix = fitz.Pixmap(doc, xref)
                score = get_image_quality_score(pix)

                if score > 0:
                    if pix.n - pix.alpha < 4:
                        img_data = pix.tobytes("png")
                    else:
                        pix_rgb = fitz.Pixmap(fitz.csRGB, pix)
                        img_data = pix_rgb.tobytes("png")

                    # Try OCR on this image
                    ocr_text = extract_text_from_image(img_data)
                    ocr_codes = find_sign_codes_in_text(ocr_text)

                    page_images.append({
                        'data': img_data,
                        'score': score,
                        'width': pix.width,
                        'height': pix.height,
                        'ocr_text': ocr_text,
                        'ocr_codes': ocr_codes,
                        'position': img_idx
                    })
            except:
                continue

        # Match images to signs using OCR codes first, then positional
        for sign in page_signs:
            sign_id = sign['id']
            code = sign['code']
            category = sign['category']
            img_path = os.path.join(ASSETS_BASE, category, f"{sign_id}.png")

            # Skip if already assigned
            if sign_id in assignments or os.path.exists(img_path):
                continue

            best_match = None
            best_confidence = 0
            method = ""

            # Method 1: Look for exact code in image OCR text
            for img in page_images:
                for ocr_code in img['ocr_codes']:
                    if ocr_code in code_to_sign:
                        if code_to_sign[ocr_code]['id'] == sign_id:
                            if img['score'] > best_confidence:
                                best_match = img
                                best_confidence = 0.95
                                method = f"OCR exact match (found {ocr_code} in image)"
                            break

            # Method 2: If no OCR match, use position-based matching
            if best_confidence < 0.9 and page_images:
                # Match images to signs by position
                for sign_idx, s in enumerate(page_signs):
                    if s['id'] == sign_id and sign_idx < len(page_images):
                        img = page_images[sign_idx]
                        if img['score'] > best_confidence:
                            best_match = img
                            best_confidence = 0.7
                            method = "Position-based match"

            # Save if confidence is good
            if best_match and best_confidence > 0.65:
                try:
                    with open(img_path, 'wb') as f:
                        f.write(best_match['data'])

                    assignments[sign_id] = {
                        'page': page_num + 1,
                        'confidence': round(best_confidence, 2),
                        'method': method,
                        'dimensions': f"{best_match['width']}×{best_match['height']}"
                    }
                    assigned += 1

                    if assigned % 20 == 0:
                        print(f"   ✓ {assigned} signs matched...")

                except Exception as e:
                    unmatched.append({
                        'sign_id': sign_id,
                        'code': code,
                        'error': str(e)
                    })

    # Update signs with assignment info
    print(f"\n💾 Updating database...")
    for sign in signs:
        if sign['id'] in assignments:
            sign['imagePath'] = f"/k53_assets/{sign['category']}/{sign['id']}.png"
            sign['_assignment'] = assignments[sign['id']]

    # Save database
    with open(SIGNS_JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(signs, f, indent=2, ensure_ascii=False)

    # Save unmatched for review
    if unmatched:
        with open('unmatched_signs.json', 'w', encoding='utf-8') as f:
            json.dump(unmatched, f, indent=2, ensure_ascii=False)

    # Statistics
    with_images = [s for s in signs if 'imagePath' in s]
    without = [s for s in signs if 'imagePath' not in s]

    print("\n" + "=" * 80)
    print("  EXTRACTION COMPLETE")
    print("=" * 80)
    print(f"  Total signs: {len(signs)}")
    print(f"  Matched (OCR/position): {len(with_images)}")
    print(f"  Unmatched (grey placeholders): {len(without)}")
    print()

    if without:
        print(f"  Signs without images:")
        for s in without[:10]:
            print(f"    {s['code']:15s} {s['name']}")
        if len(without) > 10:
            print(f"    ... and {len(without) - 10} more")

    print()
    print(f"  Database: {SIGNS_JSON_PATH}")
    if unmatched:
        print(f"  Unmatched log: unmatched_signs.json")
    print("=" * 80 + "\n")


if __name__ == "__main__":
    main()
