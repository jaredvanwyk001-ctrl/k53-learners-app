// K53 Learner's Licence - Official SADC-RTSM Data Loader
// This file loads official K53 road sign data from k53_signs.json

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
    'regulatory': 'Regulatory',
    'warning': 'Warning',
    'guidance': 'Information',
    'tourism': 'Information'
  };
  return mapping[officialCategory] || officialCategory;
}

// Extract driver action from description
function extractAction(description) {
  if (!description) return 'Follow instructions';

  // First sentence usually contains the main action
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
      category: 'Regulatory',
      description: 'You must come to a complete stop at the stop line',
      imagePath: './k53_assets/regulatory/stop.png',
      action: 'Come to complete stop'
    },
    {
      id: 'yield',
      code: 'YIELD',
      name: 'Yield Sign',
      category: 'Regulatory',
      description: 'Give way to traffic on the road you are entering',
      imagePath: './k53_assets/regulatory/yield.png',
      action: 'Give way to traffic'
    }
  ];
}

// Quiz questions
const QUESTIONS = [
  { id: 1, category: 'road-rules', question: 'What is the speed limit in residential areas?', options: ['40 km/h', '60 km/h', '80 km/h', '100 km/h'], answer: 0, explanation: 'Speed limit in residential areas is 40 km/h.' },
  { id: 2, category: 'road-rules', question: 'When should you use your headlights?', options: ['Only at night', 'At dusk, dawn, and night', 'Whenever another vehicle approaches', 'Only in rain'], answer: 1, explanation: 'Use headlights during dusk, dawn, and at night.' },
  { id: 3, category: 'road-rules', question: 'What is the legal blood alcohol limit?', options: ['0.02%', '0.05%', '0.08%', '0.10%'], answer: 1, explanation: 'The legal limit is 0.05% blood alcohol content.' },
  { id: 4, category: 'road-rules', question: 'At a four-way stop, who goes first?', options: ['Vehicle that arrived first', 'Vehicle turning right', 'Vehicle on the right', 'Straight vehicles'], answer: 0, explanation: 'The vehicle that stopped first has right of way.' },
  { id: 5, category: 'road-rules', question: 'What if your brakes fail?', options: ['Honk continuously', 'Pump brake pedal and find escape route', 'Turn off engine', 'Shift to neutral'], answer: 1, explanation: 'Pump brakes, look for escape route, use handbrake if needed.' },
  { id: 6, category: 'road-rules', question: 'When turning left, which lane?', options: ['Any lane', 'Far right lane', 'Far left lane', 'Second from left'], answer: 2, explanation: 'Always turn from the far left lane.' },
  { id: 7, category: 'road-rules', question: 'What is minimum safe following distance?', options: ['1 car length', '2 car lengths', '3 car lengths', 'At least 2 seconds'], answer: 3, explanation: 'Maintain at least 2 seconds gap at current speed.' },
  { id: 8, category: 'road-rules', question: 'Can you use your cellphone while driving?', options: ['Yes, if hands-free', 'Only for emergencies', 'No, it is illegal', 'Yes, with speakerphone'], answer: 2, explanation: 'Using cellphone while driving is illegal in South Africa.' },
  { id: 9, category: 'road-rules', question: 'What at a red traffic light?', options: ['Stop and wait', 'Turn right if safe', 'Proceed with caution', 'Stop but turn left'], answer: 0, explanation: 'Come to complete stop. Do not proceed until green.' },
  { id: 10, category: 'road-rules', question: 'When is it safe to overtake?', options: ['Whenever lane is clear', 'Only right side, clear visibility', 'Never on curves/hills', 'No oncoming traffic, straight section'], answer: 3, explanation: 'Overtake only with clear visibility and no oncoming traffic.' },

  { id: 20, category: 'vehicle-controls', question: 'What does steering wheel control?', options: ['Engine speed', 'Direction', 'Brake pressure', 'Gear selection'], answer: 1, explanation: 'Steering wheel controls vehicle direction.' },
  { id: 21, category: 'vehicle-controls', question: 'Function of accelerator?', options: ['Braking', 'Increase engine speed', 'Select gears', 'Activate lights'], answer: 1, explanation: 'Accelerator increases engine power.' },
  { id: 22, category: 'vehicle-controls', question: 'What does brake pedal do?', options: ['Increase speed', 'Slow down or stop', 'Select reverse', 'Control wipers'], answer: 1, explanation: 'Brake pedal slows or stops vehicle.' },
  { id: 23, category: 'vehicle-controls', question: 'Clutch pedal function?', options: ['Steering', 'Disconnect engine for gear changes', 'Apply parking brake', 'Turn on lights'], answer: 1, explanation: 'Clutch disconnects engine from wheels.' },
  { id: 24, category: 'vehicle-controls', question: 'Where is handbrake located?', options: ['On steering wheel', 'Between seats or left of wheel', 'On left door', 'Below steering wheel'], answer: 1, explanation: 'Handbrake is between seats or left of steering wheel.' },
  { id: 25, category: 'vehicle-controls', question: 'Gear shift controls?', options: ['Engine temperature', 'Which gear vehicle is in', 'Brake pressure', 'Headlight intensity'], answer: 1, explanation: 'Gear shift selects which gear.' },
  { id: 26, category: 'vehicle-controls', question: 'Ignition switch function?', options: ['Start engine', 'Control fuel', 'Select gears', 'Adjust mirrors'], answer: 0, explanation: 'Ignition switch starts engine.' },
  { id: 27, category: 'vehicle-controls', question: 'Where are wipers controlled?', options: ['Steering wheel hub', 'Left steering wheel stalk', 'Dashboard below wheel', 'On handbrake'], answer: 1, explanation: 'Wipers controlled by left steering wheel stalk.' },
  { id: 28, category: 'vehicle-controls', question: 'How adjust side mirrors?', options: ['From steering wheel', 'Control buttons on door/dashboard', 'Manually by hand', 'Automatically'], answer: 1, explanation: 'Use buttons on door or dashboard.' },
  { id: 29, category: 'vehicle-controls', question: 'What does horn do?', options: ['Control wipers', 'Alert signal', 'Turn lights on/off', 'Automatic transmission'], answer: 1, explanation: 'Horn produces alert sound.' },
];

// Vehicle controls reference
const VEHICLE_CONTROLS = [
  { number: 1, name: 'Steering Wheel', location: 'Front center', function: 'Directs vehicle', usage: ['Turn in direction of travel', 'Use gentle pressure', 'Return to center'], safety: 'Never remove both hands while driving', maintenance: 'Check power steering fluid' },
  { number: 2, name: 'Accelerator', location: 'Right pedal', function: 'Increases speed', usage: ['Press gradually', 'Release to maintain speed', 'Never rest foot on pedal'], safety: 'Smooth acceleration prevents skidding', maintenance: 'Check throttle cable' },
  { number: 3, name: 'Brake Pedal', location: 'Center pedal', function: 'Slows/stops vehicle', usage: ['Press firmly and smoothly', 'Emergency: press hard', 'Do not pump on normal roads'], safety: 'Check brake fluid level', maintenance: 'Replace pads when worn' },
  { number: 4, name: 'Clutch Pedal', location: 'Left pedal (manual)', function: 'Disconnect engine for gears', usage: ['Press fully for gear changes', 'Release slowly', 'Never rest foot on it'], safety: 'Fully press to prevent stalling', maintenance: 'Check clutch fluid' },
  { number: 5, name: 'Gear Shift', location: 'Center console', function: 'Selects gear', usage: ['Press clutch fully first', 'Select appropriate gear', 'Return to neutral at stops'], safety: 'Never shift into Reverse while moving', maintenance: 'Check transmission fluid' },
  { number: 6, name: 'Handbrake', location: 'Between seats', function: 'Keeps car parked', usage: ['Pull firmly when parked', 'Use on slopes', 'Release before driving'], safety: 'Engage on hills', maintenance: 'Check cable tension' },
  { number: 7, name: 'Ignition Switch', location: 'Steering column', function: 'Powers/starts engine', usage: ['Turn clockwise to start', 'Return when running', 'Turn off when stopped'], safety: 'Never remove key while moving', maintenance: 'Keep clean and dry' },
  { number: 8, name: 'Headlights', location: 'Left stalk', function: 'Lights road ahead', usage: ['On at dusk/night', 'High beam on empty roads', 'Dip for oncoming traffic'], safety: 'Always use in poor visibility', maintenance: 'Replace bulbs when dim' },
  { number: 9, name: 'Windshield Wipers', location: 'Left stalk', function: 'Clears windshield', usage: ['Adjust to rainfall rate', 'Low for light rain', 'Fast for heavy rain'], safety: 'Keep windshield clear', maintenance: 'Replace blades every 6-12 months' },
  { number: 10, name: 'Horn', location: 'Steering wheel center', function: 'Alert signal', usage: ['Alert others', 'Short beep for warnings', 'Avoid excessive use'], safety: 'Do not rely only on horn', maintenance: 'Test regularly' },
];

// Road markings reference
const ROAD_MARKINGS = [
  { title: 'Solid White Center Line', meaning: 'No Overtaking', description: 'Solid white line means overtaking is prohibited', examples: ['Curves and bends', 'Hills', 'Intersections', 'Residential areas'] },
  { title: 'Dashed White Center Line', meaning: 'Overtaking Allowed if Safe', description: 'Dashed white line allows overtaking if safe', examples: ['Open roads', 'Long straights', 'Good visibility', 'Rural highways'] },
  { title: 'Double Yellow Lines', meaning: 'No Overtaking Either Side', description: 'Double yellow lines prohibit overtaking', examples: ['Sharp curves', 'Poor visibility', 'Schools', 'Hazardous areas'] },
  { title: 'White Edge Line', meaning: 'Road Boundary', description: 'White edge line marks road boundary', examples: ['Highway edges', 'Lane dividers', 'Parking lots', 'Safe area limits'] },
  { title: 'Yellow Edge Line', meaning: 'No Parking/Stopping', description: 'Yellow edge line prohibits parking', examples: ['Bus lanes', 'Taxi stands', 'Hospital entrances', 'Emergency zones'] },
  { title: 'Dashed White Lane Divider', meaning: 'Lane Change Permitted', description: 'Dashed white allows lane changes if safe', examples: ['Multi-lane roads', 'Divided roads', 'Intersections', 'City streets'] },
  { title: 'Chevron Arrows', meaning: 'Directional Guidance', description: 'Chevron arrows guide traffic direction', examples: ['Intersections', 'Lane guidance', 'One-way streets', 'Highway ends'] },
  { title: 'Stop Line', meaning: 'Stop Before This Line', description: 'White line where you must stop', examples: ['Traffic lights', 'Stop signs', 'Railway crossings', 'Yield intersections'] },
];

// Load data when script initializes
console.log('K53 Data Loader ready. Waiting for app initialization...');
