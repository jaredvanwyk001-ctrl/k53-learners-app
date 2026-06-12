#!/usr/bin/env python3
"""
Interactive Sign Verification
==============================
Display each sign with its image and description.
Let user verify if the image matches, and fix any incorrect mappings.
"""

import json
import os

SIGNS_JSON_PATH = "k53_signs_official.json"

def main():
    with open(SIGNS_JSON_PATH, 'r') as f:
        signs = json.load(f)

    # Filter to signs with images
    signs_with_images = [
        s for s in signs
        if 'imagePath' in s and os.path.exists(f".{s['imagePath']}")
    ]
    signs_with_images.sort(key=lambda s: (s['category'], s['code']))

    print("\n" + "=" * 80)
    print("  INTERACTIVE SIGN VERIFICATION")
    print("=" * 80)
    print()
    print(f"Found {len(signs_with_images)} signs with images")
    print()
    print("Instructions:")
    print("1. View the image file mentioned")
    print("2. Read the title and description")
    print("3. Type Y if correct, N if wrong, S to skip")
    print()

    wrong_mappings = []

    for idx, sign in enumerate(signs_with_images, 1):
        print("-" * 80)
        print(f"SIGN {idx}/{len(signs_with_images)}")
        print("-" * 80)
        print()
        print(f"Code:     {sign['code']}")
        print(f"Title:    {sign['name']}")
        print(f"Category: {sign['category']}")
        print()
        print("Description:")
        desc = sign.get('description', 'N/A')
        for line in desc.split('\n')[:3]:
            print(f"  {line}")
        print()
        print(f"Image file: .{sign['imagePath']}")
        print()

        while True:
            response = input("Does image match this sign? (y/n/s): ").lower().strip()
            if response in ('y', 'n', 's'):
                if response == 'n':
                    print()
                    print("What should this sign actually be?")
                    print("Options:")
                    print("  1. Enter the correct code (e.g., R101)")
                    print("  2. Type 'ignore' to skip")
                    print()
                    correct = input("Correct code or 'ignore': ").strip().upper()
                    if correct != 'IGNORE':
                        wrong_mappings.append({
                            'current_code': sign['code'],
                            'current_id': sign['id'],
                            'correct_code': correct,
                            'image_path': sign['imagePath']
                        })
                        print(f"✓ Marked as incorrect")
                    else:
                        print("✓ Skipped")
                break
            else:
                print("Invalid response. Please enter y, n, or s.")

    # Summary
    print()
    print("=" * 80)
    print("  SUMMARY")
    print("=" * 80)
    print(f"Total verified: {len(signs_with_images)}")
    print(f"Incorrect mappings found: {len(wrong_mappings)}")
    print()

    if wrong_mappings:
        print("Incorrect mappings:")
        for item in wrong_mappings:
            print(f"  {item['current_code']} should be {item['correct_code']}")
        print()
        print("To fix these, edit k53_signs_official.json manually")

    print()


if __name__ == "__main__":
    main()
