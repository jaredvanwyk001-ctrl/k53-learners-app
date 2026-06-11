// K53 Learner's Licence - Complete Data

const SIGNS = [
  // === REGULATORY SIGNS ===
  { id: 'R1', code: 'R1', name: 'Stop', category: 'Regulatory', description: 'Come to a complete stop and give way to all traffic', imagePath: './assets/signs/regulatory/R1.svg', action: 'Come to complete stop' },
  { id: 'R2', code: 'R2', name: 'Yield', category: 'Regulatory', description: 'Give way to traffic on the main road', imagePath: './assets/signs/regulatory/R2.svg', action: 'Reduce speed and give way' },
  { id: 'R3', code: 'R3', name: 'No Parking', category: 'Regulatory', description: 'Parking is prohibited at any time', imagePath: './assets/signs/regulatory/R3.svg', action: 'Do not park' },
  { id: 'R4', code: 'R4', name: 'No Stopping', category: 'Regulatory', description: 'Stopping is prohibited at any time', imagePath: './assets/signs/regulatory/R4.svg', action: 'Do not stop' },
  { id: 'R5', code: 'R5', name: 'No Entry', category: 'Regulatory', description: 'Entry is prohibited - wrong way or restricted area', imagePath: './assets/signs/regulatory/R5.svg', action: 'Do not enter' },
  { id: 'R6', code: 'R6', name: 'Do Not Enter', category: 'Regulatory', description: 'Entry prohibited - no traffic in this direction', imagePath: './assets/signs/regulatory/R6.svg', action: 'Do not proceed' },
  { id: 'R7', code: 'R7', name: 'One Way - Left', category: 'Regulatory', description: 'Traffic in this direction only - turn left', imagePath: './assets/signs/regulatory/R7.svg', action: 'Turn left' },
  { id: 'R110', code: 'R110', name: 'Keep Right', category: 'Regulatory', description: 'Keep to the right side of the road', imagePath: './assets/signs/regulatory/R110.svg', action: 'Stay on right side' },
  { id: 'R201', code: 'R201-50', name: 'Speed Limit 50', category: 'Regulatory', description: 'Maximum speed is 50 km/h in this area', imagePath: './assets/signs/prohibitory/R201-50.svg', action: 'Do not exceed 50 km/h' },
  { id: 'R202', code: 'R202', name: 'No Overtaking', category: 'Regulatory', description: 'Overtaking is prohibited in this area', imagePath: './assets/signs/regulatory/R202.svg', action: 'Do not overtake' },
  { id: 'R204', code: 'R204', name: 'No Left Turn', category: 'Regulatory', description: 'Left turns are prohibited at this location', imagePath: './assets/signs/regulatory/R204.svg', action: 'Do not turn left' },
  { id: 'R205', code: 'R205', name: 'No U-Turn', category: 'Regulatory', description: 'U-turns are not permitted', imagePath: './assets/signs/regulatory/R205.svg', action: 'Do not make U-turn' },

  // === MANDATORY SIGNS ===
  { id: 'R101', code: 'R101', name: 'Keep Right', category: 'Mandatory', description: 'Traffic must keep to the right side of this sign', imagePath: './assets/signs/mandatory/R101.svg', action: 'Pass on right side' },
  { id: 'R102', code: 'R102', name: 'Keep Left', category: 'Mandatory', description: 'Traffic must keep to the left side of this sign', imagePath: './assets/signs/mandatory/R102.svg', action: 'Pass on left side' },
  { id: 'R103', code: 'R103', name: 'Turn Left', category: 'Mandatory', description: 'You must turn left at this sign', imagePath: './assets/signs/mandatory/R103.svg', action: 'Turn left' },
  { id: 'R104', code: 'R104', name: 'Turn Right', category: 'Mandatory', description: 'You must turn right at this sign', imagePath: './assets/signs/mandatory/R104.svg', action: 'Turn right' },
  { id: 'R105', code: 'R105', name: 'Go Straight Ahead', category: 'Mandatory', description: 'Continue straight - do not turn', imagePath: './assets/signs/mandatory/R105.svg', action: 'Continue straight' },
  { id: 'R106', code: 'R106', name: 'Turn Left or Right', category: 'Mandatory', description: 'You must turn either left or right', imagePath: './assets/signs/mandatory/R106.svg', action: 'Turn left or right' },
  { id: 'R107', code: 'R107', name: 'Pass Either Side', category: 'Mandatory', description: 'You may pass on either side of this obstruction', imagePath: './assets/signs/mandatory/R107.svg', action: 'Pass either side' },
  { id: 'R108', code: 'R108', name: 'Roundabout', category: 'Mandatory', description: 'Enter the roundabout and follow the arrows', imagePath: './assets/signs/mandatory/R108.svg', action: 'Enter roundabout' },
  { id: 'R109', code: 'R109', name: 'Pedestrian Crossing', category: 'Mandatory', description: 'Pedestrians are permitted to cross here', imagePath: './assets/signs/mandatory/R109.svg', action: 'Be prepared to stop' },

  // === WARNING SIGNS ===
  { id: 'W101', code: 'W101', name: 'Accident Black Spot', category: 'Warning', description: 'High accident rate - reduce speed and be extra vigilant', imagePath: './assets/signs/warning/W101.svg', action: 'Reduce speed, be careful' },
  { id: 'W102', code: 'W102', name: 'Dangerous Curve Left', category: 'Warning', description: 'Sharp curve ahead to the left', imagePath: './assets/signs/warning/W102.svg', action: 'Reduce speed for curve' },
  { id: 'W103', code: 'W103', name: 'Dangerous Curve Right', category: 'Warning', description: 'Sharp curve ahead to the right', imagePath: './assets/signs/warning/W103.svg', action: 'Reduce speed for curve' },
  { id: 'W104', code: 'W104', name: 'Winding Road', category: 'Warning', description: 'Road has multiple curves ahead', imagePath: './assets/signs/warning/W104.svg', action: 'Reduce speed' },
  { id: 'W105', code: 'W105', name: 'Steep Hill Ahead', category: 'Warning', description: 'Steep descent ahead - use low gear', imagePath: './assets/signs/warning/W105.svg', action: 'Use appropriate gear' },
  { id: 'W106', code: 'W106', name: 'Loose Gravel', category: 'Warning', description: 'Loose gravel on road - poor traction', imagePath: './assets/signs/warning/W106.svg', action: 'Reduce speed' },
  { id: 'W107', code: 'W107', name: 'Slippery Road', category: 'Warning', description: 'Road surface is slippery when wet', imagePath: './assets/signs/warning/W107.svg', action: 'Reduce speed' },
  { id: 'W108', code: 'W108', name: 'Pedestrian Crossing', category: 'Warning', description: 'Pedestrians may cross the road here', imagePath: './assets/signs/warning/W108.svg', action: 'Reduce speed, be alert' },
  { id: 'W109', code: 'W109', name: 'School Zone', category: 'Warning', description: 'School ahead - children may be crossing', imagePath: './assets/signs/warning/W109.svg', action: 'Reduce speed' },
  { id: 'W110', code: 'W110', name: 'Play Ground', category: 'Warning', description: 'Playground ahead - children playing', imagePath: './assets/signs/warning/W110.svg', action: 'Reduce speed' },
  { id: 'W111', code: 'W111', name: 'Hospital', category: 'Warning', description: 'Hospital ahead - keep noise low', imagePath: './assets/signs/warning/W111.svg', action: 'Reduce speed' },
  { id: 'W112', code: 'W112', name: 'Elderly People', category: 'Warning', description: 'Elderly people may be crossing', imagePath: './assets/signs/warning/W112.svg', action: 'Be prepared to stop' },
  { id: 'W113', code: 'W113', name: 'Disabled People', category: 'Warning', description: 'Disabled people may be crossing', imagePath: './assets/signs/warning/W113.svg', action: 'Be prepared to stop' },
  { id: 'W114', code: 'W114', name: 'Cyclists', category: 'Warning', description: 'Cyclists may be on the road', imagePath: './assets/signs/warning/W114.svg', action: 'Be alert' },
  { id: 'W115', code: 'W115', name: 'Motorcyclists', category: 'Warning', description: 'Motorcycles expected on this road', imagePath: './assets/signs/warning/W115.svg', action: 'Be alert' },
  { id: 'W116', code: 'W116', name: 'Horse Riders', category: 'Warning', description: 'Horse riders may be on the road', imagePath: './assets/signs/warning/W116.svg', action: 'Be alert' },
  { id: 'W117', code: 'W117', name: 'Cattle', category: 'Warning', description: 'Livestock may be on the road', imagePath: './assets/signs/warning/W117.svg', action: 'Be alert' },
  { id: 'W118', code: 'W118', name: 'Wild Animals', category: 'Warning', description: 'Wild animals may cross the road', imagePath: './assets/signs/warning/W118.svg', action: 'Be alert' },
  { id: 'W119', code: 'W119', name: 'Crossing Animals', category: 'Warning', description: 'Animals may cross the road ahead', imagePath: './assets/signs/warning/W119.svg', action: 'Reduce speed' },
  { id: 'W201', code: 'W201', name: 'Narrow Bridge', category: 'Warning', description: 'Narrow bridge ahead', imagePath: './assets/signs/warning/W201.svg', action: 'Reduce speed' },
  { id: 'W202', code: 'W202', name: 'Level Crossing', category: 'Warning', description: 'Railway crossing ahead', imagePath: './assets/signs/warning/W202.svg', action: 'Stop and look' },
  { id: 'W203', code: 'W203', name: 'Unguarded Level Crossing', category: 'Warning', description: 'Railway crossing without gates', imagePath: './assets/signs/warning/W203.svg', action: 'Stop and look' },
  { id: 'W204', code: 'W204', name: 'Poor Visibility', category: 'Warning', description: 'Visibility is restricted ahead', imagePath: './assets/signs/warning/W204.svg', action: 'Reduce speed' },
  { id: 'W205', code: 'W205', name: 'Intersection Ahead', category: 'Warning', description: 'Road junction ahead', imagePath: './assets/signs/warning/W205.svg', action: 'Be prepared to slow down' },
  { id: 'W206', code: 'W206', name: 'Side Wind', category: 'Warning', description: 'Strong side wind on this section', imagePath: './assets/signs/warning/W206.svg', action: 'Grip wheel firmly' },
  { id: 'W207', code: 'W207', name: 'Windmill', category: 'Warning', description: 'Windmill may cause blinding glare', imagePath: './assets/signs/warning/W207.svg', action: 'Be alert' },
  { id: 'W208', code: 'W208', name: 'Toll Plaza', category: 'Warning', description: 'Toll plaza ahead', imagePath: './assets/signs/warning/W208.svg', action: 'Prepare to pay toll' },
  { id: 'W209', code: 'W209', name: 'Divided Highway Ends', category: 'Warning', description: 'Road changes to two-way traffic', imagePath: './assets/signs/warning/W209.svg', action: 'Be alert' },
  { id: 'W210', code: 'W210', name: 'Merging Traffic', category: 'Warning', description: 'Another road merges ahead', imagePath: './assets/signs/warning/W210.svg', action: 'Be alert' },
  { id: 'W211', code: 'W211', name: 'Tourist Attraction', category: 'Warning', description: 'Tourist site ahead - expect slow traffic', imagePath: './assets/signs/warning/W211.svg', action: 'Be prepared to slow' },
  { id: 'W212', code: 'W212', name: 'Flooded Road', category: 'Warning', description: 'Road may flood during rains', imagePath: './assets/signs/warning/W212.svg', action: 'Do not enter if flooded' },
  { id: 'W213', code: 'W213', name: 'Low Clearance', category: 'Warning', description: 'Restricted height ahead', imagePath: './assets/signs/warning/W213.svg', action: 'Check height of vehicle' },
  { id: 'W215', code: 'W215', name: 'Construction Zone', category: 'Warning', description: 'Road construction or maintenance ahead', imagePath: './assets/signs/warning/W215.svg', action: 'Reduce speed' },
  { id: 'W216', code: 'W216', name: 'Keep Right', category: 'Warning', description: 'Road narrows or obstacle ahead', imagePath: './assets/signs/warning/W216.svg', action: 'Keep to right' },
  { id: 'W217', code: 'W217', name: 'Keep Left', category: 'Warning', description: 'Road narrows or obstacle ahead', imagePath: './assets/signs/warning/W217.svg', action: 'Keep to left' },

  // === INFORMATION SIGNS ===
  { id: 'IN1', code: 'IN1', name: 'Parking', category: 'Information', description: 'Parking area - may be paid or free', imagePath: './assets/signs/information/IN1.svg', action: 'Park here if needed' },
  { id: 'IN2', code: 'IN2', name: 'Hospital', category: 'Information', description: 'Hospital location nearby', imagePath: './assets/signs/information/IN2.svg', action: 'Direction to hospital' },
  { id: 'IN3', code: 'IN3', name: 'Fuel Station', category: 'Information', description: 'Petrol/fuel station nearby', imagePath: './assets/signs/information/IN3.svg', action: 'Refuel here' },
  { id: 'IN4', code: 'IN4', name: 'Restaurant', category: 'Information', description: 'Restaurant or food facility', imagePath: './assets/signs/information/IN4.svg', action: 'Food available' },
  { id: 'IN5', code: 'IN5', name: 'Camping', category: 'Information', description: 'Camping site available', imagePath: './assets/signs/information/IN5.svg', action: 'Camping nearby' },
  { id: 'IN6', code: 'IN6', name: 'Accommodation', category: 'Information', description: 'Lodging available', imagePath: './assets/signs/information/IN6.svg', action: 'Hotel nearby' },
];

const QUESTIONS = [
  // === ROAD RULES ===
  { id: 1, category: 'road-rules', question: 'What is the speed limit in residential areas in South Africa?', options: ['40 km/h', '60 km/h', '80 km/h', '100 km/h'], answer: 0, explanation: 'Speed limit in residential areas is typically 40 km/h unless otherwise indicated.' },
  { id: 2, category: 'road-rules', question: 'When should you use your headlights?', options: ['Only at night', 'At dusk, dawn, and at night', 'Whenever another vehicle approaches', 'Only in rain'], answer: 1, explanation: 'Use headlights during dusk, dawn, and at night for visibility and to be seen by other drivers.' },
  { id: 3, category: 'road-rules', question: 'What is the legal blood alcohol limit for drivers in South Africa?', options: ['0.02%', '0.05%', '0.08%', '0.10%'], answer: 1, explanation: 'The legal limit is 0.05% blood alcohol content (approximately 1 standard drink).' },
  { id: 4, category: 'road-rules', question: 'At a four-way stop, who has right of way?', options: ['The vehicle that arrived first', 'The vehicle turning right', 'The vehicle on the right', 'Vehicles going straight'], answer: 0, explanation: 'The vehicle that stopped first has right of way. If simultaneous, the vehicle on the right proceeds first.' },
  { id: 5, category: 'road-rules', question: 'What should you do if your brakes fail?', options: ['Honk continuously', 'Pump the brake pedal and look for an escape route', 'Turn off the engine', 'Shift to neutral'], answer: 1, explanation: 'Pump the brakes to build pressure, look for an escape route, use the handbrake if needed, and find a safe place to stop.' },
  { id: 6, category: 'road-rules', question: 'When turning left from a multi-lane road, from which lane should you turn?', options: ['Any lane', 'The far right lane', 'The far left lane', 'The second from left'], answer: 2, explanation: 'Always turn from the far left lane when turning left to ensure safety and maintain traffic flow.' },
  { id: 7, category: 'road-rules', question: 'What is the minimum safe following distance behind another vehicle?', options: ['1 car length', '2 car lengths', '3 car lengths', 'At least 2 seconds at your current speed'], answer: 3, explanation: 'Maintain at least a 2-second gap (or more in wet conditions) to allow time to stop safely.' },
  { id: 8, category: 'road-rules', question: 'Can you use your cellphone while driving?', options: ['Yes, if in a hands-free holder', 'Only for emergencies', 'No, it is illegal', 'Yes, if you use speakerphone'], answer: 2, explanation: 'Using a cellphone while driving is illegal in South Africa, even with hands-free devices in many circumstances.' },
  { id: 9, category: 'road-rules', question: 'What should you do at a red traffic light?', options: ['Stop completely and wait for green', 'Turn right if safe', 'Proceed with caution', 'Stop but can turn left'], answer: 0, explanation: 'Come to a complete stop at a red light. Do not proceed until the light is green, except where a green arrow permits.' },
  { id: 10, category: 'road-rules', question: 'When is it safe to overtake?', options: ['Whenever the lane ahead is clear', 'Only on the right side with clear visibility', 'Never on curves or hills', 'When no oncoming traffic is visible for a safe distance'], answer: 3, explanation: 'Overtake only when you have clear visibility for a safe distance, no oncoming traffic, and on straight sections of road.' },

  // === VEHICLE CONTROLS ===
  { id: 20, category: 'vehicle-controls', question: 'What does the steering wheel control?', options: ['Engine speed', 'Direction of the vehicle', 'Brake pressure', 'Gear selection'], answer: 1, explanation: 'The steering wheel controls the direction of the vehicle by turning the front wheels.' },
  { id: 21, category: 'vehicle-controls', question: 'What is the function of the accelerator pedal?', options: ['Control braking', 'Increase engine speed and power', 'Select gears', 'Activate lights'], answer: 1, explanation: 'The accelerator (right pedal) controls engine speed, increasing power when pressed.' },
  { id: 22, category: 'vehicle-controls', question: 'What does the brake pedal do?', options: ['Increase speed', 'Slow down or stop the vehicle', 'Select reverse', 'Control wipers'], answer: 1, explanation: 'The brake pedal (middle pedal) slows down or stops the vehicle by applying brakes.' },
  { id: 23, category: 'vehicle-controls', question: 'What is the clutch pedal used for?', options: ['Steering the vehicle', 'Disconnecting the engine from wheels for gear changes', 'Applying parking brake', 'Turning on lights'], answer: 1, explanation: 'The clutch pedal (left pedal) disconnects the engine from the wheels, allowing gear changes.' },
  { id: 24, category: 'vehicle-controls', question: 'Where is the handbrake typically located?', options: ['On the steering wheel', 'Between the front seats or left of the steering wheel', 'On the left door', 'Below the steering wheel'], answer: 1, explanation: 'The handbrake is usually located between the front seats (lever) or on the left side of the steering wheel (pedal).' },
  { id: 25, category: 'vehicle-controls', question: 'What does the gear shift control?', options: ['Engine temperature', 'Which gear the vehicle is in', 'Brake pressure', 'Headlight intensity'], answer: 1, explanation: 'The gear shift selects which gear (1, 2, 3, 4, 5, R, N) the vehicle is in.' },
  { id: 26, category: 'vehicle-controls', question: 'What is the function of the ignition switch?', options: ['Start the engine', 'Control fuel flow', 'Select gears', 'Adjust mirrors'], answer: 0, explanation: 'The ignition switch starts the engine and powers the vehicle electrical system.' },
  { id: 27, category: 'vehicle-controls', question: 'Where are the wipers controlled from?', options: ['On the steering wheel hub', 'Left side of steering wheel stalk', 'Dashboard below steering wheel', 'On the handbrake'], answer: 1, explanation: 'Windshield wipers are controlled by a lever/stalk on the left side of the steering wheel.' },
  { id: 28, category: 'vehicle-controls', question: 'How do you adjust the side mirrors?', options: ['From the steering wheel', 'Using control buttons on the door or dashboard', 'Manually by hand', 'They adjust automatically'], answer: 1, explanation: 'Most modern vehicles have electric buttons on the door or dashboard to adjust side mirrors.' },
  { id: 29, category: 'vehicle-controls', question: 'What does the horn control?', options: ['Windshield wipers', 'The sound/alert signal', 'Turning lights on/off', 'Automatic transmission'], answer: 1, explanation: 'The horn button (usually center of steering wheel) produces a sound to alert other road users.' },
];

const VEHICLE_CONTROLS = [
  {
    number: 1,
    name: 'Steering Wheel',
    location: 'Front center of vehicle',
    function: 'Directs the vehicle left, right, or straight',
    usage: ['Turn the wheel in the direction you want to go', 'Use gentle pressure for smooth steering', 'Return to center after turning'],
    safety: 'Never remove both hands from steering wheel while driving',
    maintenance: 'Check power steering fluid regularly'
  },
  {
    number: 2,
    name: 'Accelerator Pedal',
    location: 'Right side of footrest',
    function: 'Increases engine power and vehicle speed',
    usage: ['Press gradually to increase speed', 'Release to maintain speed', 'Never rest foot on pedal while not accelerating'],
    safety: 'Smooth acceleration prevents wheel spin and loss of control',
    maintenance: 'Check throttle cable for smooth operation'
  },
  {
    number: 3,
    name: 'Brake Pedal',
    location: 'Center of footrest',
    function: 'Slows down or stops the vehicle',
    usage: ['Press firmly and smoothly to stop', 'In emergency, press hard quickly', 'Never pump brakes except on gravel'],
    safety: 'Brake fluid must be at proper level',
    maintenance: 'Check brake pads regularly - replace when worn'
  },
  {
    number: 4,
    name: 'Clutch Pedal',
    location: 'Left side of footrest (manual cars)',
    function: 'Disconnects engine from wheels for gear changes',
    usage: ['Press fully when changing gears', 'Release slowly to engage gears', 'Never rest foot on pedal'],
    safety: 'Fully press clutch to prevent stalling',
    maintenance: 'Clutch fluid level should be checked'
  },
  {
    number: 5,
    name: 'Gear Shift',
    location: 'Center console or steering column',
    function: 'Selects which gear the vehicle operates in',
    usage: ['Press clutch fully before changing gears', 'Select appropriate gear for speed', 'Return to neutral at red lights (manual)'],
    safety: 'Never shift into Reverse while moving forward',
    maintenance: 'Check transmission fluid regularly'
  },
  {
    number: 6,
    name: 'Handbrake',
    location: 'Between seats or left of steering wheel',
    function: 'Keeps vehicle stationary when parked',
    usage: ['Pull up firmly when parked', 'Use on slopes or soft ground', 'Release before driving'],
    safety: 'Always engage when stopped on hills',
    maintenance: 'Check cable tension and adjustment'
  },
  {
    number: 7,
    name: 'Ignition Switch',
    location: 'Right side of steering column',
    function: 'Powers electrical system and starts engine',
    usage: ['Turn key clockwise to start', 'Return to normal when running', 'Turn off when vehicle is stopped'],
    safety: 'Never remove key while vehicle is moving',
    maintenance: 'Keep switch clean and dry'
  },
  {
    number: 8,
    name: 'Headlight Switch',
    location: 'Left stalk or dashboard',
    function: 'Illuminates the road ahead',
    usage: ['Turn on at dusk and night', 'Use high beam on empty roads', 'Dip high beam for oncoming traffic'],
    safety: 'Always use lights in poor visibility',
    maintenance: 'Replace bulbs when dim'
  },
  {
    number: 9,
    name: 'Windshield Wipers',
    location: 'Left stalk of steering wheel',
    function: 'Clears rain and debris from windshield',
    usage: ['Adjust to match rainfall rate', 'Use low for light rain', 'Use fast for heavy rain'],
    safety: 'Keep windshield clear for visibility',
    maintenance: 'Replace wiper blades every 6-12 months'
  },
  {
    number: 10,
    name: 'Horn',
    location: 'Center of steering wheel',
    function: 'Produces audible alert to other road users',
    usage: ['Use to alert others of your presence', 'Short beep for warnings', 'Avoid excessive use'],
    safety: 'Do not rely only on horn to prevent accidents',
    maintenance: 'Test regularly to ensure it works'
  }
];

const ROAD_MARKINGS = [
  {
    title: 'Solid White Center Line',
    meaning: 'No Overtaking',
    description: 'A solid white line separating opposite directions means overtaking is prohibited. The road ahead is considered dangerous for passing.',
    examples: ['Curves and bends', 'Hills with restricted visibility', 'Approach to intersections', 'Urban residential areas']
  },
  {
    title: 'Dashed White Center Line',
    meaning: 'Overtaking Allowed if Safe',
    description: 'A dashed white line means you may overtake if the road ahead is clear and it is safe to do so. Always check for oncoming traffic.',
    examples: ['Open country roads', 'Long straight sections', 'Roads with good visibility', 'Rural highways']
  },
  {
    title: 'Double Solid Yellow Lines',
    meaning: 'No Overtaking Either Direction',
    description: 'Double yellow lines on your side of the road prohibit overtaking. These indicate particularly dangerous stretches.',
    examples: ['Very sharp curves', 'Poor visibility zones', 'Schools and hospitals', 'Hazardous sections']
  },
  {
    title: 'White Edge Line (Solid)',
    meaning: 'Road Edge / Boundary',
    description: 'A solid white line on the edge of the road marks the boundary. Do not cross this line except when entering/exiting the road.',
    examples: ['Highway edges', 'Lane dividers', 'Parking lot boundaries', 'Safe driving area limits']
  },
  {
    title: 'Yellow Edge Line',
    meaning: 'No Parking / Stopping',
    description: 'Yellow line on the edge means no parking or stopping is allowed. This area must be kept clear for traffic flow.',
    examples: ['Bus lanes', 'Taxi stands', 'Hospital entrances', 'Emergency zones']
  },
  {
    title: 'White Dashed Lane Divider',
    meaning: 'Lane Change Permitted',
    description: 'Dashed white lines between lanes indicate you may change lanes if it is safe to do so. Look carefully before changing.',
    examples: ['Highways with multiple lanes', 'Divided roads', 'Large intersections', 'City streets']
  },
  {
    title: 'Chevron Road Markings',
    meaning: 'Directional Guidance',
    description: 'White chevron arrows guide traffic direction, especially at intersections or lane separations. Follow the arrows.',
    examples: ['Intersection approaches', 'Lane guidance', 'One-way streets', 'Divided highway ends']
  },
  {
    title: 'Stop Line',
    meaning: 'Stop Before This Line',
    description: 'A white line at traffic lights and stop signs marks where you must stop. Never cross this line at red light.',
    examples: ['Traffic lights', 'Stop signs', 'Railway crossings', 'Yield intersections']
  }
];
