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

// Study guide entries (key concepts)
const studyGuide = [
  {
    topic: "Road Sign Categories",
    content: `<strong>Regulatory (Prohibitory):</strong> Red circle — what you MUST NOT do.<br>
<strong>Regulatory (Mandatory):</strong> Blue circle — what you MUST do.<br>
<strong>Warning:</strong> Red-bordered triangle — hazards ahead.<br>
<strong>Informatory:</strong> Rectangles — directions, distances, services.<br>
<strong>Temporary:</strong> Yellow diamond — construction / road works.`
  },
  {
    topic: "Right of Way Rules",
    content: `• At a <strong>4-way stop</strong>: first to arrive goes first; ties go to the vehicle on your <strong>right</strong>.<br>
• At a <strong>T-junction</strong>: vehicles on the through road have priority.<br>
• At a <strong>yield sign</strong>: give way to all traffic on the major road.<br>
• <strong>Emergency vehicles</strong> (sirens on) always have right of way — move left and stop.`
  },
  {
    topic: "Speed Limits (South Africa)",
    content: `• <strong>Urban/residential:</strong> 60 km/h<br>
• <strong>Rural roads:</strong> 100 km/h<br>
• <strong>Freeways/highways:</strong> 120 km/h<br>
Always obey posted signs — they override defaults.`
  },
  {
    topic: "Safe Following Distance",
    content: `Use the <strong>3-second rule</strong>: pick a fixed object; when the car ahead passes it, you should not pass it for at least 3 seconds.<br>
In <strong>bad weather or low visibility</strong>: double to 6 seconds.<br>
At 120 km/h, 3 seconds ≈ <strong>100 metres</strong>.`
  },
  {
    topic: "Overtaking Rules",
    content: `<strong>NEVER overtake:</strong><br>
• On a solid white centre line<br>
• Near pedestrian crossings<br>
• At or approaching intersections<br>
• Near railway crossings<br>
• When a vehicle ahead is signalling to turn right<br>
• On a blind rise or bend`
  },
  {
    topic: "Parking on Hills",
    content: `<strong>Facing uphill:</strong> turn wheels <em>away</em> from the kerb (right).<br>
<strong>Facing downhill:</strong> turn wheels <em>toward</em> the kerb (right).<br>
Always apply the handbrake and leave in gear (P for automatics).`
  },
  {
    topic: "Alcohol & Driving",
    content: `Legal blood alcohol limit: <strong>0.05 g/100 ml</strong> for ordinary drivers.<br>
For professional drivers: <strong>0.02 g/100 ml</strong>.<br>
Best practice: <strong>zero alcohol</strong> before driving. Alcohol slows reaction time, impairs judgment, and reduces coordination.`
  },
  {
    topic: "Dashboard Warning Lights",
    content: `🔴 <strong>Red</strong> = Stop immediately / serious issue.<br>
🟡 <strong>Amber/Yellow</strong> = Caution, service soon.<br>
🟢 <strong>Green</strong> = System active (normal).<br>
Key lights: Engine (amber), Oil pressure (red), Temperature (red), Battery (red), Brake (red).`
  }
];
