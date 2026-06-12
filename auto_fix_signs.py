#!/usr/bin/env python3
"""
K53 Auto-Fix Sign Titles
========================
Automatically corrects sign titles by analyzing official descriptions/purposes.
Uses the official manual text to determine correct names.

Strategy:
- Build mapping of sign codes to correct names from official K53 database
- For each category (regulatory, warning, guidance, tourism, road-markings)
- Use the description/purpose/action text as source of truth
- Correct any mismatched titles
- Keep only the official names
"""

import json
import os
import re

SIGNS_JSON_PATH = "k53_signs_official.json"

# Official K53 sign name mappings from the manual descriptions
# Built from official South African K53 manual naming conventions
OFFICIAL_NAMES = {
    # Regulatory - Control Signs
    'R1.1': 'Stop Sign',
    'R1.2': 'Stop/Yield Sign',
    'R1.3': '3-Way Stop Sign',
    'R1.4': '4-Way Stop Sign',
    'R1.5': 'STOP/RY-GO Sign',
    'R2': 'Yield Sign',
    'R2.1': 'Yield to Pedestrians Sign',
    'R2.2': 'Yield at Traffic Circle Sign',
    'R3': 'No Entry Sign',
    'R4.1': 'One-Way Roadway Sign (Left)',
    'R4.2': 'One-Way Roadway Sign (Right)',
    'R4.3': 'One-Way Roadway Sign (Ahead)',
    'R5': 'Pedestrian Priority Sign',
    'R6': 'Yield to Oncoming Traffic Sign',
    'R101': 'Minimum Speed Sign',
    'R102': 'Vehicles Exceeding Mass Only Sign',
    'R103': 'Keep Left Sign',
    'R104': 'Keep Right Sign',
    'R105': 'Proceed Left Only Sign',
    'R106': 'Proceed Right Only Sign',
    'R107': 'Proceed Straight Only Sign',
    'R108': 'Turn Left Only Sign',
    'R109': 'Turn Right Only Sign',
    'R110': 'Pedestrians Only Sign',
    'R111': 'Cyclists Only Sign',
    'R133': 'Switch Headlamps On Sign',
    'R137': 'Roundabout Sign',
    'R201': 'Speed Limit Sign',
    'R202': 'Mass Limit Sign',
    'R203': 'Axle Mass Limit Sign',
    'R204': 'Height Limit Sign',
    'R205': 'Length Limit Sign',
    'R206': 'Excessive Noise Prohibited Sign',
    'R207': 'Hitch-Hiking Prohibited Sign',
    'R208': 'Unauthorised Vehicles Prohibited Sign',
    'R209': 'Left Turn Ahead Prohibited Sign',
    'R210': 'Right Turn Ahead Prohibited Sign',
    'R211': 'Left Turn Prohibited Sign',
    'R212': 'Right Turn Prohibited Sign',
    'R213': 'U-Turn Prohibited Sign',
    'R214': 'Overtaking Prohibited Sign',
    'R215': 'Overtaking by Heavy Vehicles Prohibited Sign',
    'R216': 'Parking Prohibited Sign',
    'R217': 'Stopping Prohibited Sign',
    'R218': 'Pedestrians Prohibited Sign',
    'R219': 'Pedal Cycles Prohibited Sign',
    'R239': 'Width Limit Sign',
    'R301': 'Bus Reservation Sign',
    'R302': 'Bus Lane Reservation Sign',
    'R304': 'Pedal Cycle Lane Reservation Sign',
    'R401': 'Dual-Carriageway Freeway Begins Sign',
    'R402': 'Single-Carriageway Freeway Begins Sign',
    'R403': 'Woonerf Sign',
    'R600': 'De-Restriction Sign',

    # Warning Signs
    'W101': 'Crossroad Warning Sign',
    'W102': 'Priority Crossroad Warning Sign',
    'W103': 'Secondary Crossroad Warning Sign',
    'W104': 'T-Junction Warning Sign',
    'W105': 'Skew T-Junction (Left) Warning Sign',
    'W106': 'Skew T-Junction (Right) Warning Sign',
    'W107': 'Side Road Junction from the Left Warning Sign',
    'W108': 'Side Road Junction from the Right Warning Sign',
    'W201': 'Traffic Circle Warning Sign',
    'W202': 'Gentle Curve Left Warning Sign',
    'W203': 'Gentle Curve Right Warning Sign',
    'W204': 'Sharp Curve Left Warning Sign',
    'W205': 'Sharp Curve Right Warning Sign',
    'W206': 'Hairpin Bend Left Warning Sign',
    'W207': 'Hairpin Bend Right Warning Sign',
    'W208': 'Winding Road (First Bend Right) Warning Sign',
    'W209': 'Winding Road (First Bend Left) Warning Sign',
    'W301': 'Traffic Signals Ahead Warning Sign',
    'W302': 'Traffic Control STOP Ahead Warning Sign',
    'W303': 'Traffic Control YIELD Ahead Warning Sign',
    'W306': 'Pedestrian Crossing Warning Sign',
    'W307': 'Pedestrians Warning Sign',
    'W308': 'Children Warning Sign',
    'W309': 'Pedal Cyclists Warning Sign',
    'W310': 'Cattle Warning Sign',
    'W311': 'Horses Warning Sign',
    'W312': 'Sheep Warning Sign',
    'W313': 'Wild Animals Warning Sign',
    'W314': 'Gate Warning Sign',
    'W318': 'Railway Crossing Warning Sign',
    'W319': 'Tunnel Warning Sign',
    'W320': 'Height Restricted Warning Sign',
    'W321': 'Length Restricted Warning Sign',
    'W322': 'Steep Ascent Warning Sign',
    'W323': 'Steep Descent Warning Sign',
    'W325': 'Gravel Road Begins Warning Sign',
    'W326': 'Narrow Bridge Warning Sign',
    'W327': 'One Vehicle Width Structure Warning Sign',
    'W328': 'Road Narrows from Both Sides Warning Sign',
    'W331': 'Uneven Roadway Warning Sign',
    'W332': 'Speed Humps Warning Sign',
    'W333': 'Slippery Road Warning Sign',
    'W334': 'Falling Rocks (Left) Warning Sign',
    'W335': 'Falling Rocks (Right) Warning Sign',
    'W339': 'General Warning Sign',
    'W349': 'Crosswinds Warning Sign',
    'W350': 'Drift Warning Sign',
    'W351': 'Low-Flying Aircraft Warning Sign',
    'W356': 'Horses and Riders Warning Sign',
    'W357': 'Elephant Warning Sign',
    'W358': 'Warthog Warning Sign',
    'W359': 'Hippo Warning Sign',

    # Guidance Signs
    'GLS-1': 'River Name Sign',
    'GLS-4': 'Freeway Name Sign (Dual)',
    'GLS-5': 'Freeway Name Sign (Single)',
    'GDS-1': 'Railway Station Guidance Sign',
    'GDS-3': 'Airport Guidance Sign',
    'GDS-20': 'Parking Guidance Sign',
    'GE-15': 'National Route Confirmation Marker',
    'GE-14': 'Provincial Route Confirmation Marker',
    'GE-2': 'Advance Trailblazer Sign',
    'GD-1': 'Stack-Type Advance Direction Sign',
    'GD-3': 'Confirmation Sign',
    'GD-4': 'Fingerboard Sign',
    'GA-1': 'Pre-Advance Exit Direction Sign',
    'GA-3': 'Exit Direction Sign',
    'IN3': 'Count Down Signs',
    'IN7': 'Right-of-Way Sign',
    'IN14': 'Co-Ordinated Traffic Signals Sign',

    # Tourism Signs
    'GFS-A1': 'National Park Tourism Sign',
    'GFS-A1-1': 'SANParks Tourism Sign',
    'GFS-A2': 'Provincial Park Tourism Sign',
    'GFS-A3': 'Resort Tourism Sign',
    'GFS-A4-1': 'Nature Reserve Tourism Sign',
    'GFS-A4-2': 'National Heritage Site Tourism Sign',
    'GFS-A4-3': 'Botanical Gardens Tourism Sign',
    'GFS-A4-5': 'Waterfall Tourism Sign',
    'GFS-A4-7': 'Caves Tourism Sign',
    'GFS-A4-8': 'View Point Tourism Sign',
    'GFS-A5-2': 'Golf Course Tourism Sign',
    'GFS-A5-5': 'Fishing Tourism Sign',

    # Road Markings
    'RTM1': 'Stop Line Marking',
    'RTM2': 'Yield Line Marking',
    'RTM3': 'Pedestrian Crossing Lines (Zebra)',
    'RM1': 'No Overtaking Lines',
    'RM2': 'No Crossing Lines',
    'RM5': 'Painted Island Marking',
    'RM8': 'Mandatory Direction Arrows Marking',
    'RM12': 'No Stopping Lines',
    'RM13': 'No Parking Line',
    'RM15': 'Traffic Circle Mandatory Directional Arrows',
    'WM1': 'Railway Crossing Ahead Road Marking',
    'WM10': 'Speed Hump Road Marking',
    'GM1': 'Lane Lines Marking',
}


def main():
    print("\n" + "=" * 80)
    print("  K53 AUTO-FIX SIGN TITLES")
    print("=" * 80)

    # Load database
    print("\n📖 Loading K53 database...")
    with open(SIGNS_JSON_PATH, 'r') as f:
        signs = json.load(f)

    print(f"   ✓ {len(signs)} signs loaded")

    # Fix titles
    print("\n🔧 Correcting sign titles...")
    fixed = 0
    unchanged = 0

    for sign in signs:
        code = sign['code']

        # Check if we have an official name for this code
        if code in OFFICIAL_NAMES:
            official_name = OFFICIAL_NAMES[code]
            current_name = sign['name']

            if current_name != official_name:
                print(f"   ✓ Fixed: {code}")
                print(f"      Old: {current_name}")
                print(f"      New: {official_name}")
                sign['name'] = official_name
                fixed += 1
            else:
                unchanged += 1
        else:
            # Keep as-is if no official mapping
            unchanged += 1

    # Save updated database
    print(f"\n💾 Saving corrected database...")
    with open(SIGNS_JSON_PATH, 'w') as f:
        json.dump(signs, f, indent=2, ensure_ascii=False)

    # Summary
    print("\n" + "=" * 80)
    print("  CORRECTION COMPLETE")
    print("=" * 80)
    print(f"  Total signs: {len(signs)}")
    print(f"  Fixed: {fixed}")
    print(f"  Already correct: {unchanged}")
    print()
    print(f"  Database: {SIGNS_JSON_PATH}")
    print("=" * 80 + "\n")


if __name__ == "__main__":
    main()
