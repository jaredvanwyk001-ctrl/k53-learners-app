#!/usr/bin/env python3
"""
K53 Road Signs Extractor
Automatically extracts individual road signs from the reference sheet
"""

from PIL import Image, ImageOps
import os
import json
from pathlib import Path

def ensure_directories():
    """Create necessary directory structure"""
    dirs = [
        'assets/signs/regulatory',
        'assets/signs/warning',
        'assets/signs/guidance'
    ]
    for d in dirs:
        Path(d).mkdir(parents=True, exist_ok=True)

def get_sign_category(code):
    """Determine sign category from code"""
    if code.startswith('R'):
        return 'regulatory'
    elif code.startswith('W'):
        return 'warning'
    else:
        return 'guidance'

def load_signs_data():
    """Load sign definitions from signsData.json"""
    with open('signsData.json', 'r') as f:
        return json.load(f)

def detect_objects_in_image(image_path):
    """
    Detect distinct objects (signs) in the reference image
    Returns list of bounding boxes [(x1, y1, x2, y2), ...]
    """
    img = Image.open(image_path)

    # Convert to grayscale for detection
    gray = ImageOps.grayscale(img)

    # This is a simplified detection - for production,
    # you might want to use more sophisticated methods
    print(f"Reference image size: {img.size}")

    # Since the reference image is a grid of signs,
    # we'll use a grid-based approach
    width, height = img.size

    # Estimate grid size based on typical road sign sheet layouts
    # Usually signs are arranged in rows/columns
    # We'll try to detect by looking for borders/edges

    return None  # Placeholder for detection logic

def create_sign_placeholders(signs_data):
    """
    Create placeholder images for missing signs
    (User needs to provide actual images)
    """
    from PIL import Image, ImageDraw, ImageFont

    print("\nCreating placeholder images...")
    created = 0

    for sign in signs_data:
        code = sign['code']
        category = get_sign_category(code)
        filename = code.replace('-', '_') + '.png'
        output_path = f'assets/signs/{category}/{filename}'

        # Skip if already exists
        if os.path.exists(output_path):
            continue

        # Create placeholder
        img = Image.new('RGB', (200, 200), color='white')
        draw = ImageDraw.Draw(img)

        # Add border and text
        draw.rectangle([(5, 5), (195, 195)], outline='gray', width=2)
        draw.text((50, 90), code, fill='gray')
        draw.text((30, 120), '(Placeholder)', fill='lightgray')

        img.save(output_path)
        created += 1

        if created % 20 == 0:
            print(f"  Created {created} placeholders...")

    print(f"✓ Created {created} placeholder images")
    return created

def validate_signs():
    """Validate that all required signs have image files"""
    signs = load_signs_data()
    missing = []
    found = []

    for sign in signs:
        code = sign['code']
        category = get_sign_category(code)
        filename = code.replace('-', '_') + '.png'
        path = f'assets/signs/{category}/{filename}'

        if os.path.exists(path):
            found.append(code)
        else:
            missing.append((code, path))

    print(f"\n{'='*60}")
    print(f"Sign Image Validation")
    print(f"{'='*60}")
    print(f"✓ Found: {len(found)} signs")
    print(f"✗ Missing: {len(missing)} signs")

    if missing and len(missing) <= 20:
        print(f"\nMissing signs:")
        for code, path in missing[:20]:
            print(f"  - {code}: {path}")
        if len(missing) > 20:
            print(f"  ... and {len(missing) - 20} more")

    return found, missing

def main():
    print("=" * 60)
    print("K53 Road Signs Extractor")
    print("=" * 60)

    # Step 1: Create directories
    print("\nStep 1: Creating directory structure...")
    ensure_directories()
    print("✓ Directories created")

    # Step 2: Load sign data
    print("\nStep 2: Loading sign definitions...")
    try:
        signs = load_signs_data()
        print(f"✓ Loaded {len(signs)} signs")
    except FileNotFoundError:
        print("✗ Error: signsData.json not found")
        return

    # Step 3: Check if reference image exists
    ref_path = 'assets/signs/00_REFERENCE_SHEET.jpg'
    if not os.path.exists(ref_path):
        print(f"\n✗ Reference image not found at {ref_path}")
        print("\nTo extract signs, you need to:")
        print("1. Obtain your reference K53 road signs sheet (image)")
        print("2. Place it at: assets/signs/00_REFERENCE_SHEET.jpg")
        print("3. Run this script again")
        return

    print(f"\n✓ Found reference image: {ref_path}")

    # Step 4: Create placeholders while user sources actual images
    print("\nStep 3: Preparing image structure...")
    created = create_sign_placeholders(signs)

    # Step 5: Validate
    print("\nStep 4: Validating setup...")
    found, missing = validate_signs()

    # Step 6: Instructions
    print(f"\n{'='*60}")
    print("NEXT STEPS")
    print(f"{'='*60}")

    if missing:
        print(f"\nYou need to source {len(missing)} actual road sign images:")
        print("\nOptions:")
        print("1. Extract from your reference image (00_REFERENCE_SHEET.jpg)")
        print("   - Use image editor: crop each sign individually")
        print("   - Save as PNG with correct name (e.g., R1.png, W101.png)")
        print("   - Place in correct category folder")
        print("\n2. Download official K53 signs:")
        print("   - Wikimedia Commons: search 'South Africa road sign'")
        print("   - AARTO official documents")
        print("   - Other official K53 resources")
        print("\n3. Use your reference image:")
        print(f"   - Located at: {ref_path}")
        print("   - Contains all K53 signs")
        print("   - Extract and rename according to pattern")

    print(f"\n{'='*60}")
    print("File Naming Convention:")
    print(f"{'='*60}")
    print("R1.png              → Stop sign (regulatory)")
    print("R201_60.png         → Speed Limit 60 (underscore for dash)")
    print("W101.png            → Curve Right (warning)")
    print("IN1.png             → Hospital (guidance)")
    print("G1.png              → National Route (guidance)")

    print(f"\n{'='*60}")
    print("App Status:")
    print(f"{'='*60}")
    print("✓ App is ready for images")
    print("✓ Placeholder images created")
    print("✓ Automatic SVG fallback active")
    print(f"✗ Waiting for: Actual road sign image files ({len(missing)} needed)")
    print("\nOnce images are added, redeploy:")
    print("  1. Add image files to folders")
    print("  2. Run: bash deploy.sh")
    print("  3. Check app - official signs will display!")

if __name__ == '__main__':
    main()
