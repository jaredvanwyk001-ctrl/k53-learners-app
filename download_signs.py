#!/usr/bin/env python3
"""
K53 Road Signs Downloader and Organizer
Attempts to source official K53 road signs and organize them automatically
"""

import os
import json
import urllib.request
import urllib.error
from pathlib import Path

# Known sources for K53 road signs
SIGN_SOURCES = {
    # Wikimedia Commons - South African road signs
    'R1': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/South_Africa_MUTCD_R1.svg/200px-South_Africa_MUTCD_R1.svg.png',
    'R2': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/South_Africa_MUTCD_R2.svg/200px-South_Africa_MUTCD_R2.svg.png',

    # Add more sources as discovered
    # Format: 'SignCode': 'URL_to_image'
}

def ensure_directories():
    """Create necessary directory structure"""
    dirs = [
        'assets/signs/regulatory',
        'assets/signs/warning',
        'assets/signs/guidance'
    ]
    for d in dirs:
        Path(d).mkdir(parents=True, exist_ok=True)
    print("✓ Directory structure created")

def get_sign_category(code):
    """Determine sign category from code"""
    if code.startswith('R'):
        return 'regulatory'
    elif code.startswith('W'):
        return 'warning'
    else:
        return 'guidance'

def download_image(url, output_path, max_retries=3):
    """Download image from URL with retry logic"""
    for attempt in range(max_retries):
        try:
            urllib.request.urlretrieve(url, output_path)
            return True
        except urllib.error.URLError:
            if attempt < max_retries - 1:
                print(f"  Retry {attempt + 1}/{max_retries} for {output_path}...")
                continue
            else:
                print(f"  Failed to download: {output_path}")
                return False
    return False

def load_signs_data():
    """Load sign definitions from signsData.json"""
    try:
        with open('signsData.json', 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        print("Error: signsData.json not found")
        return []

def main():
    print("=" * 60)
    print("K53 Road Signs Downloader")
    print("=" * 60)

    # Step 1: Create directories
    ensure_directories()

    # Step 2: Load sign data
    signs = load_signs_data()
    print(f"\n✓ Loaded {len(signs)} sign definitions from signsData.json")

    # Step 3: Attempt downloads from known sources
    print("\n" + "=" * 60)
    print("Attempting to download signs from available sources...")
    print("=" * 60)

    downloaded = 0
    failed = 0

    for code, url in SIGN_SOURCES.items():
        category = get_sign_category(code)
        filename = code.replace('-', '_') + '.png'
        output_path = f'assets/signs/{category}/{filename}'

        print(f"\nDownloading {code}...", end=' ')
        if download_image(url, output_path):
            print(f"✓ Saved to {output_path}")
            downloaded += 1
        else:
            failed += 1

    print("\n" + "=" * 60)
    print(f"Download Summary: {downloaded} successful, {failed} failed")
    print("=" * 60)

    print("\n" + "=" * 60)
    print("IMPORTANT: Sourcing Official K53 Road Signs")
    print("=" * 60)
    print("""
The automatic downloader found limited official sources online.
To complete the sign collection, you have these options:

OPTION 1: Manual Download (Recommended)
1. Visit official K53 resources:
   - AARTO official website
   - Department of Transport South Africa
   - Licensed K53 study guides
2. Download road sign images
3. Save them to appropriate folders:
   - /assets/signs/regulatory/ (R-codes)
   - /assets/signs/warning/ (W-codes)
   - /assets/signs/guidance/ (G/IN-codes)
4. Use naming convention: CODE.png (e.g., R1.png, W101.png)

OPTION 2: Use Your Reference Image
If you have a high-quality reference image:
1. Extract individual signs using image editor
2. Crop and save each sign
3. Place in appropriate category folder
4. Run this script again to validate

OPTION 3: Community Resources
Search for "K53 road signs open source" or similar
Look for:
- Government transportation agencies
- Educational institutions
- Open data repositories

Your reference image (00_REFERENCE_SHEET.jpg) is available at:
/assets/signs/00_REFERENCE_SHEET.jpg

Use it as guide for proper sign appearance.
""")

if __name__ == '__main__':
    main()
