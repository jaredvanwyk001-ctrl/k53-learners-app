# Road Signs Image Setup Guide

## Overview
Your K53 app now supports displaying actual road sign images instead of SVG approximations. The app has been updated to:
- Load images from `/assets/signs/` folder
- Automatically fall back to SVG if images are not found
- Display proper official K53 road signs in the Sign Library, quiz questions, and detail views

## Folder Structure
```
/assets/signs/
├── regulatory/        # Regulatory signs (R codes)
├── warning/          # Warning signs (W codes)
├── guidance/         # Guidance signs (G codes, IN codes)
├── 00_REFERENCE_SHEET.jpg  # Your reference image
└── README.md
```

## File Naming Convention
Organize images with these file names:
- `R1.png` - Stop sign
- `R2.png` - Yield sign
- `R201_60.png` - Speed Limit 60 (note: use underscore for dashes)
- `W101.png` - Curve Right (warning)
- `IN1.png` - Hospital (guidance)
- `G1.png` - National Route Marker

## Where to Find Official K53 Road Sign Images

### Option 1: Official South African Resources
1. **AARTO Official Guide** - Administrative Adjudication of Road Traffic Offences
   - Search: "AARTO road signs guide PDF"
   - Most authoritative source with official sign images

2. **South African Department of Transport**
   - Official government road sign specifications
   - May have downloadable sign documents

3. **K53 Study Guides (Official)**
   - Licensed K53 preparation materials often include official sign images
   - Available from official test centers

### Option 2: Extract from Your Reference Image
If you have high-quality K53 resources:
1. Extract individual sign images from your reference sheet
2. Crop to each sign
3. Save as PNG with the correct naming convention
4. Place in appropriate category folder

### Option 3: Online Repositories
- **Wikimedia Commons** - Some countries share road signs (may not be SA-specific)
- **Government Transportation Agencies** - Check for downloadable resources
- **Educational K53 Websites** - Some sites offer sign image collections

## Quick Setup Instructions

### Step 1: Prepare Your Images
- Ensure images are PNG format (or JPG)
- Recommended size: 100-200px (will scale automatically)
- Clear white background preferred
- Transparent background acceptable

### Step 2: Organize by Category
```
For R-codes (Regulatory):
/assets/signs/regulatory/R1.png
/assets/signs/regulatory/R2.png
/assets/signs/regulatory/R201_60.png
... etc

For W-codes (Warning):
/assets/signs/warning/W101.png
/assets/signs/warning/W102.png
... etc

For G/IN-codes (Guidance):
/assets/signs/guidance/G1.png
/assets/signs/guidance/IN1.png
... etc
```

### Step 3: Test
Once images are in place:
1. Reload the web app
2. Check "Sign Library" tab - should display images
3. Take a quiz - should show sign images in questions
4. Check "Progress" > quiz mistakes - should show sign thumbnails

## Current Sign List Requiring Images

### Regulatory Signs (36 signs)
- R1-R7, R101-R110 (Prohibitory)
- R201-R205 (Speed limits & restrictions)
- R301-R309 (Mandatory direction)

### Warning Signs (45 signs)
- W101-W110 (Road conditions, hazards)
- W201-W207 (Intersections, junctions)
- W301-W310 (Railway, traffic controls, pedestrians)
- W401-W405 (Road narrowing, lane changes)
- W501-W506 (Weather, road surface, conditions)
- W601-W603 (Construction, road works)
- W701-W705 (Animals, pedestrians, hazards)

### Guidance Signs (20 signs)
- IN1-IN12 (Facilities, services)
- G1-G3 (Route markers)
- G101-G102 (One-way directions)

## What Happens Without Images?

The app will:
1. ✓ Still work perfectly
2. ✓ Automatically generate SVG renderings for display
3. ✓ Display all information and quizzes normally
4. ⚠️ Show improved SVG instead of official images

Once you add actual images:
1. Signs will display as proper official K53 road signs
2. Learning will be more authentic and exam-realistic
3. Users will recognize actual signs they'll see on the road

## Troubleshooting

**Images not appearing?**
- Check file naming (exact case-sensitive match required)
- Verify file is in correct category folder
- Try a different image format (PNG vs JPG)
- Clear browser cache

**Want to verify image paths?**
- Open browser Developer Tools (F12)
- Check Network tab - look for 404 errors on sign images
- Failed images will show SVG fallback

## Adding More Signs

To add additional signs beyond the current 101:
1. Update `signsData.json` with new sign data
2. Add image to appropriate `/assets/signs/` subfolder
3. Use correct naming convention
4. Images will automatically display

## Support Files

- `00_REFERENCE_SHEET.jpg` - Your complete reference with all signs
- This guide (ROAD_SIGNS_SETUP.md) - Setup and sourcing instructions
- `signsData.json` - Sign database with image path mappings

## Next Steps

1. Source official K53 road sign images (see options above)
2. Organize into category folders with correct naming
3. Upload to `/assets/signs/` 
4. Deploy and test

Once complete, your K53 app will display authentic official road signs!
