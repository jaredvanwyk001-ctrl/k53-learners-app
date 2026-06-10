# K53 Road Signs - Sourcing Checklist

## Current Status
✓ App structure is ready  
✓ Placeholder images created (101 signs)  
✓ Folders organized by category  
⏳ Next: Source actual official K53 road sign images

---

## Quick Start Options

### Option A: Use Your Reference Image (EASIEST)
**Time: 1-2 hours**

Your reference image at `assets/signs/00_REFERENCE_SHEET.jpg` contains all official K53 signs.

1. Open the reference image in any image editor (Mac Preview, Windows Photos, GIMP, Photoshop, etc.)
2. For each sign:
   - Zoom in to the sign
   - Use crop tool to isolate just that sign
   - Save as PNG (File → Export/Save As)
   - Move to correct folder
   - Rename to correct code (e.g., R1.png)

**Recommended image editor:** [GIMP](https://www.gimp.org/) (free, works on all platforms)

### Option B: Download from Wikimedia Commons (OFFICIAL)
**Time: 2-4 hours**

Most South African road signs are available on Wikimedia Commons:

1. Go to: https://commons.wikimedia.org
2. Search: "South Africa MUTCD" or "South Africa road sign"
3. Download signs matching your codes
4. Save with correct naming
5. Place in correct folders

### Option C: Combined Approach (RECOMMENDED)
**Time: 1.5-2.5 hours**

Use both:
- Reference image for signs not found online
- Download official versions for common signs (R1, R2, W101, etc.)
- Mix and match for complete coverage

---

## Detailed Instructions by Sign Category

### Regulatory Signs (R-codes)

#### Group 1: Prohibitory Signs (R1-R7)
- R1: STOP sign (red octagon)
- R2: YIELD sign (red inverted triangle)
- R3: No Parking (red circle with P)
- R4: No Stopping (red X over black line)
- R5: No U-Turn (red U symbol)
- R6: No Left Turn (red arrow pointing left)
- R7: No Right Turn (red arrow pointing right)

**Sources:**
- Wikimedia: Search "South Africa MUTCD R" + number
- Your reference sheet: Top left area
- Government: dept-transport.gov.za

#### Group 2: Vehicle Restrictions (R101-R110)
- R101: No Entry
- R102: No Vehicles Both Directions
- R103-R110: Specific vehicle type restrictions

**Sources:**
- Extract from reference image
- Look for red circles with white background

#### Group 3: Speed Limits (R201-R202)
- R201-20, R201-30, R201-40, R201-60, R201-80, R201-100, R201-120
- R202: End of Speed Restriction
- R203-40: Minimum Speed

**Sources:**
- Wikimedia Commons (very common)
- Search: "South Africa speed limit sign"
- Government traffic documents

#### Group 4: Direction & Control (R301-R309)
- R301-R309: Mandatory direction signs (blue circles with white arrows)
- Blue background with white arrow symbols

**Sources:**
- Wikimedia (common in South Africa section)
- Your reference image (look for blue circles with arrows)

### Warning Signs (W-codes)

#### Group 1: Road Hazards (W101-W110)
- W101-W104: Curve and bend warnings
- W105-W106: Steep descent/ascent
- W107-W110: Various road conditions

**Appearance:** Red triangles with black symbols
**Sources:** Wikimedia "South Africa warning sign"

#### Group 2: Intersections (W201-W207)
- W201: T-Junction
- W202: Crossroad
- W203-W204: Side roads
- W205-W207: Y-junction and staggered

**Sources:**
- Your reference image (middle section)
- Look for red triangles with intersection symbols

#### Group 3-7: All Other Warning Signs (W301-W705)
- Similar pattern: Red triangle with black symbol
- Cover: Railways, pedestrians, animals, weather, construction

**Sources:**
- Your reference image (largest section of reference sheet)
- Wikimedia Commons (search "South Africa warning")

### Guidance Signs (G/IN codes)

#### Group 1: Facilities (IN1-IN12)
- Green signs with white symbols
- Hospital, parking, fuel, restaurant, etc.

#### Group 2: Route Markers (G1-G3)
- Unique shield shapes
- National, Regional, Metropolitan routes

#### Group 3: One-Way (G101-G102)
- Blue rectangles with white arrow

**Sources:**
- Your reference image (bottom right)
- Wikimedia Commons
- Look for green or blue rectangular signs

---

## Step-by-Step Process

### Step 1: Gather Images

Choose your method above and start collecting images.

**Checklist:**
- [ ] Create working folder on your computer
- [ ] Decide on extraction vs. download method
- [ ] Allocate 1-3 hours for gathering images
- [ ] Have reference image ready

### Step 2: Organize

For each image:
1. Note the sign code (R1, W101, etc.)
2. Determine category (regulatory/warning/guidance)
3. Rename file to: CODE.png
   - Use underscore for dashes: R201_60.png (not R201-60.png)
4. Save in correct folder:
   - Regulatory → `assets/signs/regulatory/`
   - Warning → `assets/signs/warning/`
   - Guidance → `assets/signs/guidance/`

### Step 3: Quality Check

Before uploading, verify:
- [ ] All files are PNG or JPG
- [ ] File names are exact: R1.png (case-sensitive)
- [ ] Files are in correct category folders
- [ ] Images are clear and readable
- [ ] No corrupted files

### Step 4: Upload

Copy your organized images to:
```
/Users/jj/Desktop/k53-learners-app/assets/signs/
```

### Step 5: Deploy

```bash
cd /Users/jj/Desktop/k53-learners-app
bash deploy.sh
```

### Step 6: Test

1. Go to: https://yourapp.vercel.app (or local)
2. Check "Sign Library" tab
3. Verify official signs display
4. Take a quiz and verify sign images appear
5. Check mistakes list for sign thumbnails

---

## Recommended Workflow

### Hour 1: Preparation
- [ ] Decide on method (A, B, or C)
- [ ] Set up working folder
- [ ] Open reference image

### Hour 2: Gathering
- [ ] Download/extract first 30-40 signs
- [ ] Organize into category folders
- [ ] Verify file names are correct

### Hour 3: Completion
- [ ] Finish remaining 60+ signs
- [ ] Do quality check
- [ ] Upload to app folder

### Hour 4: Deployment
- [ ] Run deploy script
- [ ] Test in app
- [ ] Done! 🎉

---

## Image Quality Guidelines

**File Format:**
- PNG (preferred - transparent background possible)
- JPG (acceptable - will have white background)

**Image Size:**
- Minimum: 100px width
- Recommended: 150-200px width
- Maximum: 300px width
- App scales automatically

**File Size:**
- Typical: 5-50 KB per image
- Maximum: 100 KB per image
- Total: ~5-10 MB for all 101 signs

**Clarity:**
- Official appearance (not drawings/cartoons)
- Clear and readable even when scaled down
- Good contrast

---

## Troubleshooting

**Problem: Can't find certain signs online**
- Solution: Extract from reference image instead
- Most signs are visible in your reference sheet

**Problem: Downloaded image is wrong format**
- Solution: Convert using online tools or image editor
- Mac Preview: File → Export as PNG
- Windows: Use Paint or online converters

**Problem: File naming is confusing**
- Solution: Use this pattern:
  - Take code: R201-60
  - Replace dash with underscore: R201_60
  - Add .png extension: R201_60.png
  - Save in regulatory folder: `regulatory/R201_60.png`

**Problem: Signs aren't showing in app**
- Solution: Clear browser cache and reload
- Check folder structure is exactly right
- Verify file names match sign codes exactly

---

## Support Resources

**Need the reference image enlarged?**
- Use any image viewer to zoom in
- Take screenshots of sections
- Use image editor to zoom and crop

**Need more guidance on specific sign?**
- Check your reference image (00_REFERENCE_SHEET.jpg)
- Compare against Wikipedia "South African road signs"
- Reference official AARTO documents

**App not updating?**
- Verify images are in `/assets/signs/` on your computer
- Run `bash deploy.sh` to upload
- Clear browser cache (Ctrl+Shift+Delete or Cmd+Shift+Delete)
- Wait 30-60 seconds for Vercel to update

---

## Final Checklist

Before declaring success:

- [ ] All 101 sign image files downloaded/created
- [ ] Files organized in correct category folders
- [ ] File names match sign codes exactly
- [ ] Images are PNG or JPG format
- [ ] Images are readable and professional
- [ ] App deployed with new images
- [ ] Sign Library tab shows official signs
- [ ] Quiz questions display sign images
- [ ] Score screen shows sign thumbnails
- [ ] Everything looks authentic and professional

Once complete, you'll have a professional K53 learning app with official road signs! 🚀

---

## Next Steps

1. **Choose your sourcing method** (A, B, or C above)
2. **Gather images** (1-2 hours)
3. **Organize into folders** (15 minutes)
4. **Upload to app** (5 minutes)
5. **Deploy** (1 command: `bash deploy.sh`)
6. **Test and celebrate!** ✓

**Ready to start?** Pick option A, B, or C above and begin gathering your K53 road signs!
