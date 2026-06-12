#!/usr/bin/env python3
"""
K53 Interactive Sign Verification
==================================
Go through each sign one by one.
Verify that image matches title and description.
Fix any incorrect titles interactively.
"""

import json
import os
from pathlib import Path

SIGNS_JSON_PATH = "k53_signs_official.json"
ASSETS_BASE = "k53_assets"


def clear_screen():
    """Clear terminal screen."""
    os.system('clear' if os.name == 'posix' else 'cls')


def format_text(text, width=70):
    """Wrap text to width."""
    words = text.split()
    lines = []
    current = []
    for word in words:
        if len(' '.join(current + [word])) <= width:
            current.append(word)
        else:
            if current:
                lines.append(' '.join(current))
            current = [word]
    if current:
        lines.append(' '.join(current))
    return '\n'.join(lines)


def main():
    # Load signs
    with open(SIGNS_JSON_PATH, 'r') as f:
        signs = json.load(f)

    # Filter to signs with images and sort by category
    signs_with_images = [
        s for s in signs
        if 'imagePath' in s and os.path.exists(f".{s['imagePath']}")
    ]
    signs_with_images.sort(key=lambda s: (s['category'], s['code']))

    print("\n" + "=" * 80)
    print(f"  K53 SIGN VERIFICATION")
    print(f"  {len(signs_with_images)} signs with images to verify")
    print("=" * 80)
    print()
    print("For each sign:")
    print("  1. Open the image file shown")
    print("  2. Verify the image matches the title and description")
    print("  3. Type Y (correct) or N (wrong)")
    print("  4. If wrong, provide the correct title")
    print()

    fixed_count = 0
    skipped_count = 0

    for idx, sign in enumerate(signs_with_images, 1):
        clear_screen()

        print("=" * 80)
        print(f"  SIGN {idx}/{len(signs_with_images)}")
        print("=" * 80)
        print()

        code = sign['code']
        current_name = sign['name']
        category = sign['category']
        img_path = f".{sign['imagePath']}"

        print(f"Code:       {code}")
        print(f"Category:   {category}")
        print(f"Current:    {current_name}")
        print()
        print("Description:")
        print(format_text(sign.get('description', 'N/A')))
        print()
        print("Purpose:")
        print(format_text(sign.get('purpose', 'N/A')))
        print()
        print("Action:")
        print(format_text(sign.get('action', 'N/A')))
        print()
        print("-" * 80)
        print(f"Image file: {img_path}")
        print()

        while True:
            response = input(
                "Does the image match this title and description? (y/n/skip): "
            ).lower().strip()

            if response == 'y':
                print("✓ Confirmed")
                break
            elif response == 'n':
                # Get correct name
                new_name = input("What is the correct title? ").strip()
                if new_name:
                    sign['name'] = new_name
                    print(f"✓ Updated: {new_name}")
                    fixed_count += 1
                    break
                else:
                    print("No title entered, keeping original")
                    break
            elif response == 'skip':
                skipped_count += 1
                print("⊘ Skipped")
                break
            else:
                print("Invalid response. Please enter y, n, or skip")

        if idx < len(signs_with_images):
            input("\nPress Enter to continue...")

    # Save updated database
    print()
    print("=" * 80)
    print("  SAVING UPDATED DATABASE")
    print("=" * 80)

    with open(SIGNS_JSON_PATH, 'w') as f:
        json.dump(signs, f, indent=2, ensure_ascii=False)

    print()
    print(f"✓ Fixed:   {fixed_count} signs")
    print(f"✓ Confirmed: {len(signs_with_images) - fixed_count - skipped_count}")
    print(f"⊘ Skipped: {skipped_count}")
    print()
    print(f"Updated: {SIGNS_JSON_PATH}")
    print("=" * 80)


if __name__ == "__main__":
    main()
