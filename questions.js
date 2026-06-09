// K53 Learner's Licence Question Bank
const questions = [
  // === ROAD SIGNS ===
  {
    id: 1,
    category: "Road Signs",
    question: "What does a red circular sign generally indicate?",
    options: ["A warning", "A prohibition or restriction", "An instruction to follow", "An information point"],
    answer: 1,
    explanation: "Red circular signs are prohibitory — they tell you what you MUST NOT do, e.g. no entry, speed limits."
  },
  {
    id: 2,
    category: "Road Signs",
    question: "What shape are warning signs in South Africa?",
    options: ["Circle", "Rectangle", "Triangle", "Octagon"],
    answer: 2,
    explanation: "Warning signs are triangular (pointing upward) with a red border, alerting drivers to hazards ahead."
  },
  {
    id: 3,
    category: "Road Signs",
    question: "A yellow diamond-shaped sign means:",
    options: ["Stop ahead", "Give way ahead", "Railway crossing ahead", "A hazard or warning"],
    answer: 3,
    explanation: "Yellow diamond signs are temporary warning signs, often used in construction zones."
  },
  {
    id: 4,
    category: "Road Signs",
    question: "What does a blue circular sign indicate?",
    options: ["Prohibition", "Warning", "Mandatory instruction", "Informational"],
    answer: 2,
    explanation: "Blue circular signs give mandatory positive instructions — actions you MUST do, e.g. turn left ahead."
  },
  {
    id: 5,
    category: "Road Signs",
    question: "An octagonal red sign with white text means:",
    options: ["Yield", "Stop", "Speed limit", "No entry"],
    answer: 1,
    explanation: "The STOP sign is the only octagonal sign. You must come to a complete standstill."
  },

  // === RULES OF THE ROAD ===
  {
    id: 6,
    category: "Rules of the Road",
    question: "When two vehicles arrive at a four-way stop simultaneously, who goes first?",
    options: [
      "The vehicle on the left",
      "The vehicle on the right",
      "The larger vehicle",
      "Whoever sounds their horn first"
    ],
    answer: 1,
    explanation: "At a four-way stop, the vehicle to your RIGHT has right of way when you arrive at the same time."
  },
  {
    id: 7,
    category: "Rules of the Road",
    question: "What is the minimum following distance on a highway at 120 km/h?",
    options: ["1 second", "2 seconds", "3 seconds", "4 seconds"],
    answer: 2,
    explanation: "A minimum 3-second gap is recommended; at 120 km/h this equals approximately 100 metres."
  },
  {
    id: 8,
    category: "Rules of the Road",
    question: "You may NOT overtake when:",
    options: [
      "On a straight road with good visibility",
      "Approaching a pedestrian crossing",
      "In the rightmost lane on a multi-lane road",
      "Travelling at 60 km/h"
    ],
    answer: 1,
    explanation: "Overtaking is prohibited near pedestrian crossings, intersections, railway crossings, and on solid white lines."
  },
  {
    id: 9,
    category: "Rules of the Road",
    question: "The speed limit in a residential area (unless otherwise marked) is:",
    options: ["40 km/h", "50 km/h", "60 km/h", "80 km/h"],
    answer: 1,
    explanation: "The default speed limit in a residential/urban area in South Africa is 60 km/h."
  },
  {
    id: 10,
    category: "Rules of the Road",
    question: "When must you switch on your headlights?",
    options: [
      "Only at night",
      "From sunset to sunrise and when visibility is poor",
      "Only in rain",
      "Only in tunnels"
    ],
    answer: 1,
    explanation: "Headlights are required from sunset to sunrise AND whenever visibility is less than 150 m."
  },

  // === VEHICLE CONTROLS ===
  {
    id: 11,
    category: "Vehicle Controls",
    question: "What is the purpose of the clutch pedal?",
    options: [
      "To apply brakes gradually",
      "To disengage the engine from the gearbox",
      "To control the throttle",
      "To activate the handbrake"
    ],
    answer: 1,
    explanation: "The clutch disengages the engine from the transmission, allowing gear changes."
  },
  {
    id: 12,
    category: "Vehicle Controls",
    question: "When parking on a hill facing uphill, you should:",
    options: [
      "Turn wheels toward the kerb",
      "Turn wheels away from the kerb",
      "Keep wheels straight",
      "Apply only the handbrake"
    ],
    answer: 1,
    explanation: "Facing uphill: turn wheels AWAY from the kerb so if the car rolls, it hits the kerb and stops."
  },
  {
    id: 13,
    category: "Vehicle Controls",
    question: "ABS (Anti-lock Braking System) helps because it:",
    options: [
      "Stops the car faster on dry roads",
      "Prevents wheels from locking so you can still steer while braking",
      "Automatically applies brakes in an emergency",
      "Increases engine braking"
    ],
    answer: 1,
    explanation: "ABS prevents wheel lock-up, maintaining steering control during hard braking."
  },
  {
    id: 14,
    category: "Vehicle Controls",
    question: "A flashing amber traffic light means:",
    options: [
      "Stop — treat as a stop street",
      "Proceed with caution",
      "Speed up to clear the intersection",
      "Only pedestrians may cross"
    ],
    answer: 1,
    explanation: "Flashing amber means proceed with caution — the signal is not fully operational."
  },
  {
    id: 15,
    category: "Vehicle Controls",
    question: "What does it mean if your brake warning light stays on while driving?",
    options: [
      "The handbrake is engaged OR brake fluid is low — stop safely and check",
      "Normal operation — ignore it",
      "Only the ABS system is active",
      "The engine is overheating"
    ],
    answer: 0,
    explanation: "A lit brake warning light while moving indicates the handbrake is on OR dangerously low brake fluid. Stop safely."
  }
];

// Study guide entries (comprehensive K53 reference)
const studyGuide = [
  // ════════════════════════════════════════════════════════════════════════════
  // ROAD SIGNS
  // ════════════════════════════════════════════════════════════════════════════
  {
    topic: "Sign Shapes & Colors",
    content: `<strong>Octagon (Red & White):</strong> STOP — come to a complete standstill.<br>
<strong>Triangle (Red border, White):</strong> WARNING — hazard ahead.<br>
<strong>Circle (Red):</strong> PROHIBITION — what you MUST NOT do (no entry, no parking, no u-turn).<br>
<strong>Circle (Blue):</strong> MANDATORY — what you MUST do (turn left, go straight, proceed).<br>
<strong>Rectangle (Blue/Green/White):</strong> INFORMATION — directions, services, distances.<br>
<strong>Diamond (Yellow):</strong> TEMPORARY WARNING — construction or hazard ahead.`
  },
  {
    topic: "Regulatory Prohibitory Signs",
    content: `<strong>Red circle = DO NOT do this action</strong><br>
• <strong>No Entry:</strong> Red circle with white bar — no vehicles allowed.<br>
• <strong>No Parking:</strong> Red circle with P — stopping briefly OK, but cannot remain.<br>
• <strong>No Stopping:</strong> Red circle with two bars — more restrictive than no parking.<br>
• <strong>No U-Turn:</strong> Red circle with U-turn arrow crossed — cannot reverse direction.<br>
• <strong>No Left/Right Turn:</strong> Red circle with turn arrow crossed.<br>
• <strong>No Overtaking:</strong> Red circle with two cars (one overtaking) crossed.`
  },
  {
    topic: "Mandatory Blue Circle Signs",
    content: `<strong>Blue circle = MUST do this action</strong><br>
• <strong>Proceed Straight Only:</strong> White upward arrow — cannot turn left or right.<br>
• <strong>Turn Left/Right:</strong> White curved arrow — you must turn in that direction.<br>
• <strong>Keep Left/Right:</strong> White arrow pointing left or right — stay on that side of obstacle.<br>
• <strong>Roundabout:</strong> White curved arrow showing counter-clockwise (left) — mandatory traffic flow.<br>
• <strong>Straight or Turn (L/R):</strong> Two arrows showing permitted directions — you may only go these ways.`
  },
  {
    topic: "Warning Signs (Triangular)",
    content: `<strong>Red border, white background = HAZARD AHEAD</strong><br>
<strong>Road Layout:</strong> Curves, steep descent/ascent, uneven road, humps, narrow bridge.<br>
<strong>Intersections:</strong> Crossroads, T-junction, staggered junction, Y-fork.<br>
<strong>Pedestrians & Animals:</strong> Pedestrian crossing, school, children, horse riders, cattle, wild animals.<br>
<strong>Hazards:</strong> Railway crossing, traffic lights, pedestrian crossing, slippery road, loose gravel, sand drift, flooding.<br>
<strong>Road Works:</strong> Construction equipment, flagman directing traffic.<br>
<strong>Traffic Control:</strong> Stop sign ahead, yield sign ahead, road narrows.`
  },
  {
    topic: "Speed Limit & Direction Signs",
    content: `<strong>Speed Limit (Red circle with white number):</strong><br>
• 20 km/h — pedestrian zones, school entrances<br>
• 30 km/h — residential areas, school zones<br>
• 40 km/h — some residential roads<br>
• 60 km/h — urban/residential default speed<br>
• 80 km/h — rural roads<br>
• 100 km/h — open roads outside urban areas<br>
• 120 km/h — freeways/highways<br>
<strong>End of Speed Restriction:</strong> Circular sign with number crossed out = restriction has ended.`
  },
  {
    topic: "Information & Guidance Signs",
    content: `<strong>Blue or green rectangles = INFORMATION & FACILITIES</strong><br>
• <strong>Hospital:</strong> Blue H — medical services nearby.<br>
• <strong>Parking:</strong> Blue P — designated parking area ahead.<br>
• <strong>Fuel Station:</strong> Service information — petrol/fuel available.<br>
• <strong>Restaurant:</strong> Food and refreshment facilities.<br>
• <strong>Telephone:</strong> Emergency or public phone nearby.<br>
• <strong>First Aid:</strong> Medical assistance or first aid post.<br>
• <strong>Route Markers:</strong> N1, R1, M1 (National, Regional, Metropolitan routes).<br>
• <strong>One-Way:</strong> Single arrow — traffic flows in that direction only.`
  },
  {
    topic: "Traffic Lights (Robot) Signal",
    content: `<strong>Red:</strong> STOP completely behind the line. Do not proceed until light changes.<br>
<strong>Amber/Yellow:</strong> Prepare to stop. If already in intersection, clear it safely. Do not enter new intersection.<br>
<strong>Green:</strong> Proceed IF SAFE — check for turning vehicles and pedestrians. Green arrow = MUST turn in that direction.<br>
<strong>Flashing Amber:</strong> Proceed with caution — treat as yield sign. Check intersection before crossing.<br>
<strong>Flashing Red:</strong> Treat as STOP sign. Stop, check all directions, proceed when safe.`
  },

  // ════════════════════════════════════════════════════════════════════════════
  // ROAD RULES & PROCEDURES
  // ════════════════════════════════════════════════════════════════════════════
  {
    topic: "Speed Limits (SA Default Rules)",
    content: `<strong>NO posted sign = use these defaults:</strong><br>
• Urban/Residential: <strong>60 km/h</strong><br>
• Rural roads: <strong>100 km/h</strong><br>
• Freeways/National highways: <strong>120 km/h</strong><br>
<strong>SPECIAL LIMITS:</strong><br>
• School zones: 30-40 km/h (check signs)<br>
• Residential with children: 40 km/h<br>
• Heavy vehicles/towing: often 20 km/h lower than posted<br>
• Learner drivers: follow posted limits exactly<br>
<strong>Posted signs OVERRIDE defaults.</strong> Always obey the sign you see.`
  },
  {
    topic: "The 2-Second & 3-Second Rules",
    content: `<strong>2-Second Rule (minimum following distance):</strong> Pick a fixed object (sign, tree, pole). When the car ahead passes it, count "one Mississippi, two Mississippi." You should not reach it before finishing the count. At 120 km/h this is roughly 60 metres.<br>
<strong>3-Second Rule (safer guideline):</strong> Same method but count to three. At 120 km/h this equals approximately 100 metres.<br>
<strong>BAD WEATHER/LOW VISIBILITY:</strong> Double the distance (4-6 seconds).<br>
<strong>WHY IT MATTERS:</strong> Gives you reaction time to brake safely if the car ahead suddenly stops.`
  },
  {
    topic: "Right of Way at Intersections",
    content: `<strong>4-Way Stop (all vehicles stop):</strong> First arrival goes first. If two arrive together, vehicle on RIGHT has priority. If four arrive together, alternate clockwise starting with the one on the right of the arriving vehicle.<br>
<strong>T-Junction (with yield/no sign):</strong> Vehicle on the through road (top of T) has priority. Side road must yield.<br>
<strong>Yield Sign:</strong> Give way to ALL traffic on the main road. Do not proceed until road is clear.<br>
<strong>Roundabout:</strong> Give way to traffic ALREADY IN the circle and to your RIGHT.<br>
<strong>Uncontrolled Intersection:</strong> Traffic from your right has priority.<br>
<strong>Emergency Vehicles:</strong> Sirens and lights = move LEFT, slow down, STOP if necessary.`
  },
  {
    topic: "Overtaking Rules (When Safe)",
    content: `<strong>OVERTAKING IS ALLOWED:</strong> Solid yellow line (from your side), clear visibility, no approaching traffic, straight road, not near intersections or pedestrian crossings.<br>
<strong>NEVER OVERTAKE on:</strong><br>
• Solid white centre line<br>
• Approaching pedestrian crossing or school<br>
• At or within 50 m of an intersection<br>
• Approaching a railway crossing<br>
• Blind rise or curve (cannot see oncoming traffic)<br>
• When vehicle ahead signals right (turning)<br>
• Dip in road (hides oncoming traffic)<br>
<strong>Overtaking procedure:</strong> Check mirrors, signal left, check blind spot, accelerate smoothly, signal right, return to left lane when you see vehicle behind in your mirror.`
  },
  {
    topic: "Road Markings & Lane Discipline",
    content: `<strong>White Lines (lengthwise):</strong><br>
• Solid white = do not cross (stay in your lane)<br>
• Broken white = may cross if safe to do so<br>
<strong>Yellow Lines (lengthwise):</strong><br>
• Solid yellow = no parking<br>
• Dotted yellow = parking restrictions or no stopping<br>
• Red cross on road = fire hydrant (do not park)<br>
<strong>LANE DISCIPLINE:</strong> Keep left unless overtaking. Right lane is for turning or passing only. Do not camp in right lane on a multi-lane road.`
  },
  {
    topic: "Pedestrian Crossing Rules",
    content: `<strong>MARKED PEDESTRIAN CROSSING:</strong> Pedestrians have right of way. Slow down, be prepared to stop. Do not overtake near a crossing (within 50 m).<br>
<strong>SCHOOL CROSSING PATROL:</strong> When officer holds STOP sign, STOP from both directions until they signal clear.<br>
<strong>UNMARKED CROSSING:</strong> If pedestrian has begun crossing, must yield. Pedestrians should cross at marked points only.<br>
<strong>BLIND PEDESTRIANS:</strong> Always give way. They rely on sound and feel of traffic.<br>
<strong>CHILDREN:</strong> Be extra cautious. Children are unpredictable — reduce speed and watch carefully.`
  },
  {
    topic: "Parking Rules & Etiquette",
    content: `<strong>NEVER PARK:</strong> On a bend, at a crest, on a pedestrian crossing, within 1.5 m of a fire hydrant, in front of a driveway, on a railway crossing, in a no-parking zone (yellow line), blocking emergency access.<br>
<strong>PARALLEL PARKING:</strong> Turn wheels straight before leaving vehicle to avoid rollback. Ensure 0.5 m clearance from kerb.<br>
<strong>UPHILL (facing uphill):</strong> Turn wheels AWAY from kerb (right). If it rolls, it hits the kerb and stops.<br>
<strong>DOWNHILL (facing downhill):</strong> Turn wheels TOWARD kerb (right). If it rolls, it hits the kerb.<br>
<strong>ALWAYS:</strong> Apply handbrake, select Park (automatics) or 1st/Reverse gear (manual).`
  },
  {
    topic: "Alcohol & Driving in SA",
    content: `<strong>LEGAL LIMITS:</strong><br>
• Ordinary drivers: 0.05 g/100 ml blood alcohol<br>
• Professional drivers: 0.02 g/100 ml<br>
• Learner drivers: ZERO (0.00)<br>
<strong>WHAT ALCOHOL DOES:</strong> Slows reaction time, impairs judgment, reduces coordination, distorts vision, increases risk-taking behaviour.<br>
<strong>BEST PRACTICE:</strong> Zero alcohol before driving. Even one drink can impair your ability.<br>
<strong>IF CAUGHT:</strong> Fine, licence suspension, possible jail time, vehicle impoundment.`
  },
  {
    topic: "Headlights & Visibility",
    content: `<strong>MUST USE HEADLIGHTS:</strong><br>
• From sunset to sunrise<br>
• In fog, rain, or dust (visibility < 150 m)<br>
• In tunnels at all times<br>
• When windscreen wipers are needed<br>
<strong>HIGH BEAMS vs LOW BEAMS:</strong> Use high beams on unlit roads at night. DIP (switch to low beams) when:<br>
• Oncoming traffic is within 150 m<br>
• Following another vehicle within 150 m<br>
• Entering a town or lit area<br>
<strong>HEADLIGHT FLASH:</strong> Warn of a hazard or request passage — not a greeting or challenge.`
  },
  {
    topic: "Horn Usage",
    content: `<strong>MUST USE HORN:</strong> To warn other road users of an immediate hazard or your presence.<br>
<strong>PROHIBITED near:</strong> Hospitals, schools (between certain hours), residential areas at night (10 pm - 6 am in some areas).<br>
<strong>DO NOT HOOT:</strong> In frustration, as a greeting, to hurry pedestrians, or unnecessarily.<br>
<strong>REMEMBER:</strong> A horn is a safety tool, not an aggression tool. Use it sparingly and only when needed.`
  },
  {
    topic: "Railway & Level Crossings",
    content: `<strong>UNGUARDED CROSSING (no boom/lights):</strong> Stop at least 5 metres away. Look both ways along the tracks. Only cross when certain no train is coming.<br>
<strong>GUARDED CROSSING (boom/red lights):</strong> STOP when boom is down or lights are flashing. Do not drive around boom or under it. Wait until boom rises and lights stop flashing.<br>
<strong>FLASHING RED LIGHTS = STOP</strong> (same as red traffic light).<br>
<strong>IF STALLED ON TRACKS:</strong> Get out immediately, move away from tracks, and if possible warn oncoming trains by moving at least 100 m along tracks.`
  },
  {
    topic: "Emergency & Breakdown Procedures",
    content: `<strong>IF YOU BREAK DOWN:</strong> Switch on hazard lights, move vehicle off the road onto the emergency lane or safe area. Place warning triangles at least 50 m behind vehicle.<br>
<strong>IF YOU STALL AT INTERSECTION:</strong> Restart engine quickly. If unable, push to safety. Do not abandon vehicle in the intersection.<br>
<strong>TIRE BLOWOUT:</strong> Hold steering wheel firmly, ease off accelerator (don't brake hard), steer straight, and slow down gradually.<br>
<strong>BRAKE FAILURE:</strong> Pump brakes gently, apply handbrake gradually, downshift to lower gear, steer to safe location and stop.<br>
<strong>STEERING FAILURE:</strong> Ease off throttle, steer using body weight, brake gently, and call for help.`
  },
  {
    topic: "Two-Way Traffic & Oncoming Vehicles",
    content: `<strong>ONCOMING TRAFFIC HAS RIGHT OF WAY:</strong> You must yield and adjust your position, speed, or stop to allow safe passage.<br>
<strong>MEETING AT A NARROW POINT:</strong> Whoever reaches first goes first. If arriving simultaneously, both may edge through carefully or one yields.<br>
<strong>IF DAZZLED BY HEADLIGHTS:</strong> Look toward the LEFT edge of the road, slow down, and shield eyes. Never look directly at oncoming lights.<br>
<strong>PASSING PARKED VEHICLES:</strong> Check mirrors, signal, and leave 1 metre clearance. Expect doors to open or vehicles to pull out.`
  },

  // ════════════════════════════════════════════════════════════════════════════
  // VEHICLE CONTROLS & MECHANICS
  // ════════════════════════════════════════════════════════════════════════════
  {
    topic: "The Three Pedals (Manual)",
    content: `<strong>CLUTCH (left pedal):</strong> Disengages engine from gearbox. Press fully to change gear. Release slowly to engage drive. Never ride the clutch (resting foot on it).<br>
<strong>BRAKE (middle pedal):</strong> Applies friction to slow or stop. Press smoothly and progressively. Avoid sudden hard braking unless emergency.<br>
<strong>ACCELERATOR (right pedal):</strong> Controls fuel and air mixture. Increases engine speed. Do not rest foot on it while braking.`
  },
  {
    topic: "Automatic Transmission Basics",
    content: `<strong>P (Park):</strong> Locks transmission. Use when parked. Prevents rolling.<br>
<strong>R (Reverse):</strong> Backward movement. Ensure vehicle is fully stopped before selecting.<br>
<strong>N (Neutral):</strong> No gear engaged. Use at red lights for brief stops or when towed.<br>
<strong>D (Drive):</strong> Forward movement. Gearbox selects appropriate gear automatically. Most common mode.<br>
<strong>L or 1 (Low):</strong> Locks in first gear. Use for engine braking on long descents or slow precise control.<br>
<strong>TIP:</strong> Always keep foot on brake when in Drive or Reverse. Never coast in Neutral.`
  },
  {
    topic: "Braking Systems",
    content: `<strong>FOOT BRAKE:</strong> Hydraulic system. Apply smoothly and progressively. Avoid sudden hard braking unless necessary.<br>
<strong>ABS (Anti-lock Braking System):</strong> Prevents wheel lock-up. Maintains steering control during hard braking. Apply FIRM CONTINUOUS PRESSURE — do not pump.<br>
<strong>ENGINE BRAKING:</strong> Downshift to lower gear. Engine resistance slows the vehicle. Critical for long descents (prevents brake fade).<br>
<strong>HANDBRAKE (Parking Brake):</strong> Holds vehicle stationary. Use only when parked. Can serve as emergency brake if foot brakes fail.`
  },
  {
    topic: "Starting & Stopping (Manual Car)",
    content: `<strong>STARTING:</strong> Depress clutch fully, select first gear, start engine, find biting point (where clutch begins to grip), release handbrake, and apply throttle smoothly as you release the clutch.<br>
<strong>STOPPING:</strong> Brake first to slow down. Depress clutch just before the vehicle stops (prevents stalling). Select Neutral or Park.<br>
<strong>HILL START:</strong> Holding on slope = apply handbrake, find bite point, release handbrake while adding throttle, release clutch smoothly. Takes practice.<br>
<strong>STALL (engine dies):</strong> If it happens, depress clutch, select Neutral, restart. Try again.`
  },
  {
    topic: "Gear Changing (Manual)",
    content: `<strong>CHANGING UP (accelerating):</strong> Press clutch fully, select next gear, release clutch gradually while maintaining throttle, then increase throttle as needed.<br>
<strong>CHANGING DOWN (slowing):</strong> Use brakes first, then depress clutch, select lower gear, release clutch, and reapply throttle if needed.<br>
<strong>REV-MATCHING:</strong> Advanced: Dip throttle briefly while clutch is depressed to match engine revs to wheel speed (smoother downshift). Not required for K53.<br>
<strong>GEAR SEQUENCE:</strong> 1→2→3→4→5. Do not skip gears (e.g. don't go 1→3) — damages gearbox.`
  },
  {
    topic: "Reversing & Maneuvers",
    content: `<strong>REVERSING IN STRAIGHT LINE:</strong> Check mirrors and blind spot. Reverse slowly. Use small steering inputs. Look primarily through rear window, use mirrors for reference.<br>
<strong>REVERSING AROUND CORNER:</strong> Reverse slowly. Turn wheel toward the direction you want the REAR to go. When rear is positioned, straighten wheel and reverse straight.<br>
<strong>3-POINT TURN:</strong> Turn right, reverse with left lock, drive forward — the car does a 3-point turn to face the opposite direction. Essential in narrow streets.<br>
<strong>PARALLEL PARKING:</strong> Pull alongside space, reverse at angle, straighten wheels, pull forward into position. Central to K53 test.`
  },
  {
    topic: "Hill Starts & Descents",
    content: `<strong>HILL START (Manual):</strong> Apply handbrake, find bite point, release handbrake while adding throttle, smoothly release clutch. Requires coordination.<br>
<strong>HILL START (Automatic):</strong> Hold on brake, shift to Drive, ease off brake as you apply throttle slowly. Easier than manual.<br>
<strong>LONG DESCENT:</strong> Select low gear (1st or 2nd) BEFORE descending. Use engine braking. Apply foot brake briefly then release (don't ride it). Prevents brake fade from overheating.<br>
<strong>STEEP UPHILL:</strong> Downshift before losing momentum. Stay in gear — do not coast. Accelerate smoothly to maintain traction.`
  },
  {
    topic: "Tire & Wheel Care",
    content: `<strong>TIRE PRESSURE:</strong> Check when tires are COLD (before driving or 3+ hours after). Under-inflation: poor grip, heat buildup, blowout risk. Over-inflation: harsh ride, reduced contact.<br>
<strong>TREAD DEPTH:</strong> Minimum 1.6 mm (penny test). At 1 mm or less = dangerous on wet roads. Check regularly.<br>
<strong>TIRE ROTATION:</strong> Every 10,000–15,000 km to ensure even wear.<br>
<strong>SPARE TIRE:</strong> Keep it inflated and in good condition. Know how to change a tire safely (use warning triangles, jack safely, secure lug nuts firmly).`
  },
  {
    topic: "Dashboard Warning Lights",
    content: `<strong>🔴 RED LIGHTS = STOP IMMEDIATELY:</strong><br>
• Oil pressure (oilcan symbol) — engine not being lubricated<br>
• Temperature (thermometer in liquid) — engine overheating<br>
• Brake warning (brake pad symbol) — handbrake on OR brake fluid low<br>
• Battery (battery symbol) — charging system failure<br>
<strong>🟡 AMBER LIGHTS = SERVICE SOON:</strong><br>
• Check engine (engine symbol) — emissions fault or service needed<br>
• Engine oil low (oilcan) — top up oil soon<br>
<strong>🟢 GREEN LIGHTS = NORMAL:</strong> Seat belt reminder, indicators active, cruise control on, lights on.`
  },
  {
    topic: "Pre-Drive Check (POWDERS)",
    content: `<strong>P — Petrol:</strong> Check fuel level. Ensure you have enough to reach your destination.<br>
<strong>O — Oil:</strong> Check dipstick when engine is cold. Top up if low.<br>
<strong>W — Water:</strong> Check coolant level in radiator. Top up if low (use distilled water only).<br>
<strong>D — Damage:</strong> Walk around vehicle. Check for dents, cracks, flat tires, or loose parts.<br>
<strong>E — Electrics:</strong> Test headlights, brake lights, indicators, wipers, horn.<br>
<strong>R — Rubber (Tires):</strong> Check pressure and tread depth. Ensure they're safe.<br>
<strong>S — Safety:</strong> Adjust seat, mirrors, steering column. Ensure seatbelt works. No loose items.`
  },
  {
    topic: "Windscreen & Visibility",
    content: `<strong>WINDSCREEN WIPERS:</strong> Use when visibility is reduced by rain, dust, or spray. Replace blades annually or when they streak or miss sections. Avoid using on dry windscreen (damages rubber and glass).<br>
<strong>DEMISTER/DEFROSTER:</strong> Removes condensation or frost from windscreen for clear visibility. Turn on immediately if glass fogs up.<br>
<strong>RAIN & FOG:</strong> Use headlights in rain (even daytime). Reduce speed and increase following distance. Fog lights help visibility but are not substitutes for headlights.<br>
<strong>NIGHT DRIVING:</strong> Adjust mirrors to reduce glare. Clean windscreen inside and out regularly. Watch for animals and pedestrians — they're harder to see at night.`
  },
  {
    topic: "Steering & Handling",
    content: `<strong>STEERING WHEEL POSITION:</strong> Hold at 9 and 3 o'clock (or 10 and 2). Hands at top provides less control.<br>
<strong>SMOOTH STEERING:</strong> Feed the wheel through your hands using push-pull technique (never cross arms). Avoid sudden jerky movements.<br>
<strong>POWER STEERING:</strong> Makes steering lighter. If it fails while driving, steering becomes heavy but still possible — grip firmly and steer gradually to a stop.<br>
<strong>UNDERSTEER (push):</strong> Front wheels lose grip, car goes wide. Ease off throttle to let front tires regain grip.<br>
<strong>OVERSTEER (slide):</strong> Rear slides out. Steer INTO the slide and ease off throttle — do not brake hard.`
  },
  {
    topic: "Skids & Loss of Control",
    content: `<strong>IF YOU SKID:</strong> Steer in the direction you want the front of the car to go. Ease off the accelerator (don't brake hard). Let the car stabilize, then continue.<br>
<strong>ON WET/SLIPPERY ROADS:</strong> Reduce speed, increase following distance, avoid sudden steering or braking. Smooth inputs only.<br>
<strong>AQUAPLANING (hydroplaning):</strong> Tires lose contact with road due to water layer. Ease off throttle, avoid steering or braking. Let the car regain grip naturally.<br>
<strong>ON GRAVEL/DIRT:</strong> Reduce speed significantly. Loose surface = less traction. Avoid hard braking — use engine braking instead.`
  },
  {
    topic: "Turning & Cornering",
    content: `<strong>BRAKE BEFORE THE CORNER:</strong> Always slow down BEFORE entering the curve, not during it. Braking while cornering reduces grip and can cause skidding.<br>
<strong>GENTLE ACCELERATION THROUGH CORNER:</strong> Once you've turned, gentle throttle helps weight transfer and maintains traction.<br>
<strong>SHARP CORNERS:</strong> Very slow speed. Steer progressively. Avoid sudden movements.<br>
<strong>SMOOTH CURVES:</strong> Maintain steady speed through the curve if road conditions are good.<br>
<strong>ROAD CAMBER:</strong> Roads slope inward (crowned) for drainage. This helps cornering grip. Outside wheels get less traction on the slope.`
  },
  {
    topic: "Mirrors & Blind Spots",
    content: `<strong>REAR-VIEW MIRROR:</strong> Shows traffic directly behind. Adjust so you see the full rear window and a bit of either side.<br>
<strong>SIDE MIRRORS:</strong> Show areas alongside the car. Adjust so you see the side of your car on the inner edge and the full lane beside you.<br>
<strong>BLIND SPOT:</strong> Area not visible in mirrors (over your shoulder, behind and to the side). ALWAYS check by turning your head before:<br>
• Changing lanes<br>
• Merging<br>
• Turning<br>
• Opening a door<br>
<strong>MIRROR CHECK FREQUENCY:</strong> Every 8–12 seconds while driving. More often in heavy traffic.`
  },
  {
    topic: "Fatigue & Distraction",
    content: `<strong>FATIGUE WARNING SIGNS:</strong> Heavy eyelids, yawning, difficulty concentrating, drifting lanes, missing signs.<br>
<strong>IF DROWSY:</strong> Pull over safely and rest. Do not continue driving. Fatigue is as dangerous as alcohol.<br>
<strong>DISTRACTIONS TO AVOID:</strong><br>
• Mobile phones (even hands-free is risky)<br>
• Eating or drinking<br>
• Adjusting radio or GPS while moving<br>
• Looking at passengers<br>
• Daydreaming or emotional stress<br>
<strong>SAFEST PRACTICE:</strong> Minimize all distractions. Keep eyes on the road and hands on the wheel at all times.`
  },
  {
    topic: "Weather Conditions",
    content: `<strong>RAIN:</strong> Reduce speed, increase following distance, use headlights, avoid sudden braking, watch for standing water.<br>
<strong>FOG:</strong> Use headlights (even daytime), reduce speed significantly, increase following distance, use fog lights if equipped.<br>
<strong>WIND:</strong> Grip wheel firmly, especially in gusts. Watch for loose debris. Be cautious passing trucks (wind blast).<br>
<strong>ICE/FROST:</strong> Extremely hazardous. Reduce speed dramatically, increase following distance, avoid harsh steering or braking, use gentle inputs only.<br>
<strong>SNOW:</strong> May block traction. Use snow chains if equipped. Reduce speed, increase stopping distance, avoid hills if possible.`
  },
  {
    topic: "Emergency Procedures Summary",
    content: `<strong>TIRE BLOWOUT:</strong> Hold wheel firmly, ease off gas, steer straight, slow gradually, pull to safety.<br>
<strong>BRAKE FAILURE:</strong> Pump brakes, apply handbrake, downshift, steer to safety, signal distress.<br>
<strong>STEERING FAILURE:</strong> Ease off throttle, steer using body weight, brake gently, call for help.<br>
<strong>ENGINE FIRE:</strong> Stop safely, turn off engine, leave vehicle, move away, call emergency services.<br>
<strong>STALLED ON RAILWAY:</strong> Exit vehicle immediately, move away, warn oncoming traffic if possible.<br>
<strong>FLOOD ON ROAD:</strong> Do not attempt to cross if depth unknown. Never drive through running water.`
  }
];
