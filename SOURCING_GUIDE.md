# K53 Road Signs - Complete Sourcing & Setup Guide

## Current Situation
You have:
- ✓ A comprehensive reference sheet with all K53 road signs (00_REFERENCE_SHEET.jpg)
- ✓ App ready to display images with automatic SVG fallback
- ✓ File naming convention and folder structure ready
- ⏳ Need: Individual road sign image files

## Best Approach: Extract from Your Reference Image

Your reference image contains all 100+ official K53 road signs. The most reliable approach is to extract them:

### Method 1: Quick Automated Extraction (Recommended)

**What you need:**
- Python 3 installed
- PIL/Pillow library (`pip3 install Pillow`)

**How to use:**

1. Run the extraction script:
   ```bash
   python3 extract_signs_from_reference.py
   ```

This will:
- Automatically detect and crop individual signs from your reference image
- Organize them by category (regulatory, warning, guidance)
- Name them correctly (R1.png, W101.png, etc.)
- Place them in the right folders
- Validate the extraction

### Method 2: Manual Extraction (if automated fails)

Use any image editor (Photoshop, GIMP, or even Preview on Mac):

1. Open `assets/signs/00_REFERENCE_SHEET.jpg`
2. For each sign:
   - Zoom in to the sign
   - Crop tightly around the sign
   - Save as PNG with correct name
   - Place in correct folder

**Naming Examples:**
```
Stop Sign → regulatory/R1.png
Yield Sign → regulatory/R2.png
Speed Limit 60 → regulatory/R201_60.png (note: underscore for dash)
Curve Right → warning/W101.png
Hospital → guidance/IN1.png
```

---

## Alternative: Download from Official Online Sources

### Recommended Sources:

1. **Wikimedia Commons - South African Traffic Signs**
   - URL: commons.wikimedia.org
   - Search: "South Africa road sign"
   - Most signs available under CC license
   - Can be downloaded freely

2. **Wikipedia - Road Signs of South Africa**
   - Often linked to Wikimedia images
   - Good reference and source

3. **AARTO Official Documents**
   - Administrative Adjudication of Road Traffic Offences
   - Some resources may be downloadable
   - Most authoritative source

4. **Google Image Search - K53 Specific**
   - Search: "K53 road signs PNG" or "South African learner's test signs"
   - Filter for creative commons/reusable images
   - Verify they're official K53 signs

---

## Step-by-Step Setup Instructions

### Phase 1: Source the Images

**Choose your method:**
- **Fastest:** Extract from reference image (automated)
- **Most thorough:** Mix of extraction + official downloads
- **Official:** Find and download from government sources

### Phase 2: Organize

Once you have images:

```
Place in correct folders:

Regulatory (R-codes):
/assets/signs/regulatory/R1.png
/assets/signs/regulatory/R2.png
/assets/signs/regulatory/R3.png
... (36 signs total)

Warning (W-codes):
/assets/signs/warning/W101.png
/assets/signs/warning/W102.png
... (45 signs total)

Guidance (G/IN-codes):
/assets/signs/guidance/IN1.png
/assets/signs/guidance/IN2.png
/assets/signs/guidance/G1.png
... (20 signs total)
```

### Phase 3: Validate & Deploy

Run validation:
```bash
python3 validate_signs.py
```

This checks:
- All files are in correct folders
- Naming is correct
- Image formats are valid
- No missing critical signs

Then deploy:
```bash
bash deploy.sh
```

---

## Complete Sign List (For Reference)

### Regulatory Signs (36 total)

**Prohibitory (R1-R7, R101-R110):**
- R1: Stop
- R2: Yield/Give Way
- R3: No Parking
- R4: No Stopping
- R5: No U-Turn
- R6: No Left Turn
- R7: No Right Turn
- R101: No Entry
- R102: No Vehicles Both Directions
- R103: No Motor Vehicles
- R104: No Motorcycles
- R105: No Goods Vehicles
- R106: No Buses
- R107: No Minibus Taxis
- R108: No Animal-drawn Vehicles
- R109: No Bicycles
- R110: No Pedestrians

**Speed Limits & Restrictions (R201-R205):**
- R201-20, R201-30, R201-40, R201-60, R201-80, R201-100, R201-120: Speed Limits
- R202: End of Speed Restriction
- R203-40: Minimum Speed 40
- R204: No Overtaking
- R205: End of No Overtaking

**Mandatory Direction (R301-R309):**
- R301: Proceed Straight Only
- R302: Turn Left
- R303: Turn Right
- R304: Straight or Left
- R305: Straight or Right
- R306: Left or Right
- R307: Keep Left
- R308: Keep Right
- R309: Roundabout

### Warning Signs (45 total)

**Road Conditions (W101-W110):**
- W101-W110: Curves, clearance, bridges, intersections, etc.

**Intersections (W201-W207):**
- W201-W207: T-junctions, crossroads, Y-junctions, staggered

**Railway & Traffic (W301-W310):**
- W301-W310: Railway crossings, signals, pedestrians, etc.

**Road Changes (W401-W405):**
- W401-W405: Narrows, two-way, dead ends

**Weather & Surface (W501-W506):**
- W501-W506: Slippery, gravel, sand, flooding, dips

**Construction (W601-W603):**
- W601-W603: Road works, lane closed, flagman

**Animals & Hazards (W701-W705):**
- W701-W705: Cattle, wild animals, horses, pedestrians, children

### Guidance Signs (20 total)

**Facilities (IN1-IN12):**
- IN1: Hospital
- IN2: Parking
- IN3: Police
- IN4: Fuel/Petrol
- IN5: Restaurant
- IN6: Telephone
- IN7: First Aid
- IN8: Fire Extinguisher
- IN9: Camping
- IN10: Caravan Park
- IN11: Viewpoint
- IN12: Hotel/Accommodation

**Route Markers (G1-G3):**
- G1: National Route
- G2: Regional Route
- G3: Metropolitan Route

**One-Way (G101-G102):**
- G101: One-Way Right
- G102: One-Way Left

---

## Recommended Timeline

**Day 1: Extraction**
- Extract signs from reference image (automated or manual)
- Time: 30 mins to 2 hours depending on method

**Day 2: Organization**
- Verify all images are in correct folders
- Check naming conventions
- Delete any corrupted files

**Day 3: Deployment**
- Run validation script
- Deploy to live site
- Test in app

---

## Quality Requirements

For best results, aim for:
- **Format:** PNG (transparent background preferred) or JPG
- **Size:** 150-300px wide (app scales automatically)
- **Quality:** Clear and readable at 100px
- **Clarity:** Official sign appearance (not drawings or approximations)

---

## What Happens If You Skip This?

The app will:
- ✓ Still work perfectly
- ✓ Display SVG approximations automatically
- ✓ All quizzes and learning work normally
- ⚠️ Not show official K53 road signs

Once you add images:
- Official signs display in Sign Library
- Quiz questions show real signs
- More authentic exam preparation
- Better visual learning

---

## Support & Troubleshooting

**Issue: Can't find certain signs online**
- Use your reference image as source
- Extract from reference sheet
- Or use SVG as temporary solution

**Issue: Downloaded images are wrong format**
- Convert using online tools or image editor
- Ensure images are PNG or JPG
- Check file size (should be < 100KB per image)

**Issue: File naming is wrong**
- Use exactly: CODE.png (e.g., R1.png)
- Dashes become underscores (R201-60 → R201_60.png)
- Case-sensitive on most servers

---

## Next Steps

1. **Choose your sourcing method** (extraction or download)
2. **Gather the images** (1-3 hours depending on method)
3. **Organize into folders** (15 mins with script help)
4. **Validate** (run validation script)
5. **Deploy** (one command)

Once complete, your K53 app will display official road signs for authentic exam preparation!

Need help with any step? Check the extraction script or validation tool.
