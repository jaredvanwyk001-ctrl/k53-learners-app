// K53 Learner's Licence - Official K53 Data with NRTA-based Questions
// Data loader for official K53 road signs and questions

let SIGNS = [];
let OFFICIAL_DATA_LOADED = false;

// Load official K53 road signs data
async function loadK53Data() {
  try {
    const response = await fetch('./k53_assets/k53_signs.json');
    const k53Signs = await response.json();

    // Transform official data into app format
    SIGNS = k53Signs.map(sign => ({
      id: sign.id,
      code: sign.id.toUpperCase(),
      name: sign.name,
      category: mapCategory(sign.category),
      description: sign.description,
      imagePath: './' + sign.local_path,
      action: extractAction(sign.description)
    }));

    OFFICIAL_DATA_LOADED = true;
    console.log(`✅ Loaded ${SIGNS.length} official K53 signs`);

    // Initialize app after data loads
    if (app && typeof app.init === 'function') {
      app.init();
    }
  } catch (error) {
    console.error('Failed to load K53 signs data:', error);
    // Fallback to minimal data
    SIGNS = createFallbackSigns();
  }
}

// Map official category names to app categories
function mapCategory(officialCategory) {
  const mapping = {
    'regulatory': 'Road Signs',
    'warning': 'Road Signs',
    'guidance': 'Road Signs',
    'tourism': 'Road Signs'
  };
  return mapping[officialCategory] || 'Road Signs';
}

// Extract driver action from description
function extractAction(description) {
  if (!description) return 'Follow instructions';
  const firstSentence = description.split('.')[0];
  return firstSentence || 'Follow instructions';
}

// Fallback data if official data fails to load
function createFallbackSigns() {
  return [
    {
      id: 'stop',
      code: 'STOP',
      name: 'Stop Sign',
      category: 'Road Signs',
      description: 'You must come to a complete stop at the stop line',
      imagePath: './k53_assets/regulatory/stop.png',
      action: 'Come to complete stop'
    }
  ];
}

// === OFFICIAL K53 QUESTIONS (NRTA-BASED) ===
const QUESTIONS = [
  // ROAD SIGNS QUESTIONS
  {
    id: 1,
    category: 'Road Signs',
    question: 'What is the meaning of a red circle with a white horizontal bar?',
    options: ['Stop immediately', 'No entry - do not proceed', 'No parking', 'Yield to traffic'],
    answer: 1,
    explanation: 'The No Entry sign (red circle with white bar) means you must not proceed - entry is prohibited.'
  },
  {
    id: 2,
    category: 'Road Signs',
    question: 'What must you do when you see a triangular warning sign?',
    options: ['Come to a complete stop', 'Reduce speed and be cautious', 'Speed up to pass quickly', 'Flash your headlights'],
    answer: 1,
    explanation: 'Triangular warning signs alert you to hazards ahead. Reduce speed and increase alertness.'
  },
  {
    id: 3,
    category: 'Road Signs',
    question: 'What does a red octagon sign mean?',
    options: ['Yield to traffic', 'No entry', 'Come to a complete stop', 'No parking'],
    answer: 2,
    explanation: 'The octagonal red sign is the STOP sign. You must come to a complete stop before proceeding.'
  },
  {
    id: 4,
    category: 'Road Signs',
    question: 'What does a red inverted triangle mean?',
    options: ['Stop sign', 'Speed limit', 'Give way/Yield sign', 'No entry'],
    answer: 2,
    explanation: 'The inverted red triangle is the Yield or Give Way sign. Reduce speed and give way to other traffic.'
  },
  {
    id: 5,
    category: 'Road Signs',
    question: 'What does a blue circular sign with an arrow indicate?',
    options: ['Warning ahead', 'Prohibition', 'Mandatory instruction - you must go in this direction', 'No parking'],
    answer: 2,
    explanation: 'Blue circular signs with arrows are mandatory instruction signs. You MUST follow the direction indicated.'
  },

  // ROAD RULES QUESTIONS
  {
    id: 6,
    category: 'Road Rules',
    question: 'What is the national speed limit on a freeway in South Africa?',
    options: ['80 km/h', '100 km/h', '110 km/h', '120 km/h'],
    answer: 3,
    explanation: 'The national speed limit on freeways in South Africa is 120 km/h unless otherwise indicated.'
  },
  {
    id: 7,
    category: 'Road Rules',
    question: 'What is the speed limit in a residential area?',
    options: ['40 km/h', '50 km/h', '60 km/h', '80 km/h'],
    answer: 0,
    explanation: 'In residential areas, the speed limit is 40 km/h unless another speed limit is displayed.'
  },
  {
    id: 8,
    category: 'Road Rules',
    question: 'What is the legal maximum blood alcohol content (BAC) for drivers in South Africa?',
    options: ['0.02%', '0.05%', '0.08%', '0.10%'],
    answer: 1,
    explanation: 'The legal BAC limit for drivers in South Africa is 0.05%, which is approximately one standard drink.'
  },
  {
    id: 9,
    category: 'Road Rules',
    question: 'When should a driver use headlights?',
    options: ['Only at night', 'At dusk, at dawn, and at night', 'Only when raining', 'Only when visibility is less than 100m'],
    answer: 1,
    explanation: 'Headlights must be used from dusk through dawn (before sunrise and after sunset) to be seen by other drivers.'
  },
  {
    id: 10,
    category: 'Road Rules',
    question: 'What is the minimum safe following distance behind another vehicle?',
    options: ['1 car length', '2 car lengths', 'At least 2 seconds at your current speed', 'Whatever feels safe'],
    answer: 2,
    explanation: 'The safe following distance is at least 2 seconds at your current speed. In bad weather, this should be increased.'
  },
  {
    id: 11,
    category: 'Road Rules',
    question: 'You are about to overtake a vehicle. What must you do?',
    options: ['Just check your mirror and go', 'Check mirrors, signal, and ensure clear road ahead', 'Flash your headlights first', 'Sound your horn'],
    answer: 1,
    explanation: 'Before overtaking: check mirrors, indicate with a turn signal, and ensure the road is clear for the entire overtaking maneuver.'
  },
  {
    id: 12,
    category: 'Road Rules',
    question: 'At a four-way stop, who has the right of way?',
    options: ['The driver who arrives first', 'Drivers turning right', 'Drivers going straight', 'The vehicle on the right'],
    answer: 0,
    explanation: 'At a four-way stop, the driver who arrives and stops first has the right of way.'
  },
  {
    id: 13,
    category: 'Road Rules',
    question: 'What should you do if your brakes fail?',
    options: ['Shift to neutral and coast', 'Pump the brake pedal and look for an escape route', 'Turn off the engine', 'Swerve to the side immediately'],
    answer: 1,
    explanation: 'If brakes fail, pump the pedal to build pressure, look for an escape route, and use the handbrake as a last resort.'
  },
  {
    id: 14,
    category: 'Road Rules',
    question: 'Can a driver use a cell phone while driving?',
    options: ['Yes, if hands-free', 'Yes, for emergencies only', 'No, it is illegal', 'Yes, if you hold it safely'],
    answer: 2,
    explanation: 'Using a cell phone while driving is illegal in South Africa, even with hands-free devices in many circumstances.'
  },

  // VEHICLE CONTROLS QUESTIONS
  {
    id: 15,
    category: 'Vehicle Controls',
    question: 'What is the function of the steering wheel?',
    options: ['Controls speed', 'Controls direction of the vehicle', 'Controls braking', 'Controls gears'],
    answer: 1,
    explanation: 'The steering wheel controls the direction the vehicle travels.'
  },
  {
    id: 16,
    category: 'Vehicle Controls',
    question: 'Which pedal increases the vehicle\'s speed?',
    options: ['Left pedal (clutch)', 'Middle pedal (brake)', 'Right pedal (accelerator)', 'There is no such pedal'],
    answer: 2,
    explanation: 'The accelerator (right pedal) increases engine power and speed when pressed.'
  },
  {
    id: 17,
    category: 'Vehicle Controls',
    question: 'What does the brake pedal do?',
    options: ['Speeds up the vehicle', 'Slows down or stops the vehicle', 'Changes gears', 'Turns on lights'],
    answer: 1,
    explanation: 'The brake pedal (middle pedal) reduces vehicle speed or brings it to a complete stop.'
  },
  {
    id: 18,
    category: 'Vehicle Controls',
    question: 'In a manual transmission vehicle, what does the clutch pedal do?',
    options: ['Applies the brakes', 'Disconnects the engine from the wheels to allow gear changes', 'Increases engine speed', 'Controls steering'],
    answer: 1,
    explanation: 'The clutch pedal (left pedal) disconnects the engine from the transmission, allowing you to change gears.'
  },
  {
    id: 19,
    category: 'Vehicle Controls',
    question: 'What is the purpose of the gear shift?',
    options: ['To control speed', 'To select which gear the vehicle operates in', 'To brake the vehicle', 'To signal other drivers'],
    answer: 1,
    explanation: 'The gear shift selects which gear (1-5 or R) the vehicle uses, affecting power and speed.'
  },
  {
    id: 20,
    category: 'Vehicle Controls',
    question: 'Where is the handbrake located?',
    options: ['On the steering wheel', 'Between the front seats or to the left of the steering wheel', 'On the floor near the pedals', 'On the right side of the door'],
    answer: 1,
    explanation: 'The handbrake is located between the front seats (as a lever) or to the left of the steering wheel (as a pedal).'
  },
  {
    id: 21,
    category: 'Vehicle Controls',
    question: 'What is the function of the ignition switch?',
    options: ['To turn on the lights', 'To start the engine and power the vehicle\'s electrical system', 'To control the wipers', 'To adjust the mirrors'],
    answer: 1,
    explanation: 'The ignition switch starts the engine and powers all electrical systems in the vehicle.'
  },
  {
    id: 22,
    category: 'Vehicle Controls',
    question: 'Where are the windshield wipers controlled from?',
    options: ['From a button on the dashboard', 'From a stalk on the left side of the steering wheel', 'From the right side of the steering wheel', 'From the headlight switch'],
    answer: 1,
    explanation: 'Windshield wipers are controlled by a stalk (lever) on the left side of the steering wheel.'
  },
  {
    id: 23,
    category: 'Vehicle Controls',
    question: 'How do you adjust the side mirrors?',
    options: ['Manually by reaching out and adjusting them', 'Using control buttons usually on the door or dashboard', 'They adjust automatically', 'From the steering wheel'],
    answer: 1,
    explanation: 'Most modern vehicles have electric buttons on the door or dashboard to adjust the side mirrors.'
  },
  {
    id: 24,
    category: 'Vehicle Controls',
    question: 'What does the horn do?',
    options: ['Turns on the lights', 'Produces an audible alert signal', 'Applies the brakes', 'Adjusts the volume of the radio'],
    answer: 1,
    explanation: 'The horn (usually centered on the steering wheel) produces a sound to alert other road users.'
  }
];

// Load data when script initializes
console.log('K53 Official Data Loader ready. Waiting for app initialization...');
