// K53 Learner's Licence - Official SADC-RTSM Sign Database

const SIGNS = [
  // === REGULATORY SIGNS (R1, R2, R3, R4, R5, R6, R7, R110, R202, R204, R205, R301-R309) ===
  { id: 'R1', code: 'R1', name: 'Stop', category: 'Regulatory', description: 'You must come to a complete stop and give way to all traffic. Do not proceed until it is safe', imagePath: './assets/signs/regulatory/R1.svg', action: 'Come to complete stop and give way' },
  { id: 'R2', code: 'R2', name: 'Yield', category: 'Regulatory', description: 'Give way to traffic on the road you are entering. Reduce speed and be prepared to stop', imagePath: './assets/signs/regulatory/R2.svg', action: 'Give way to traffic on main road' },
  { id: 'R3', code: 'R3', name: 'No Parking', category: 'Regulatory', description: 'Parking is prohibited at any time in this area', imagePath: './assets/signs/regulatory/R3.svg', action: 'Do not park' },
  { id: 'R4', code: 'R4', name: 'No Stopping', category: 'Regulatory', description: 'Stopping is prohibited at any time, even briefly. Only apply in areas where the sign is displayed', imagePath: './assets/signs/regulatory/R4.svg', action: 'Do not stop' },
  { id: 'R5', code: 'R5', name: 'No Entry', category: 'Regulatory', description: 'Entry is prohibited. This road is restricted - do not enter under any circumstances', imagePath: './assets/signs/regulatory/R5.svg', action: 'Do not enter' },
  { id: 'R6', code: 'R6', name: 'No Entry (Vehicles)', category: 'Regulatory', description: 'Entry prohibited for vehicles. This area is only for pedestrians or specific vehicle types', imagePath: './assets/signs/regulatory/R6.svg', action: 'Do not proceed' },
  { id: 'R7', code: 'R7', name: 'Mandatory Direction', category: 'Regulatory', description: 'You must follow the direction indicated by the arrow on this sign', imagePath: './assets/signs/regulatory/R7.svg', action: 'Follow indicated direction' },
  { id: 'R110', code: 'R110', name: 'Keep Right', category: 'Regulatory', description: 'Keep to the right side of this sign. Traffic must pass to the right of the sign', imagePath: './assets/signs/regulatory/R110.svg', action: 'Keep right of sign' },
  { id: 'R202', code: 'R202', name: 'No Overtaking', category: 'Regulatory', description: 'Overtaking is prohibited in this area. Do not attempt to pass other vehicles', imagePath: './assets/signs/regulatory/R202.svg', action: 'Do not overtake' },
  { id: 'R204', code: 'R204', name: 'No Left Turn', category: 'Regulatory', description: 'Left turns are prohibited at this location. You may not turn left here', imagePath: './assets/signs/regulatory/R204.svg', action: 'Do not turn left' },
  { id: 'R205', code: 'R205', name: 'No U-Turn', category: 'Regulatory', description: 'U-turns are prohibited. You may not reverse direction or make a complete turnaround', imagePath: './assets/signs/regulatory/R205.svg', action: 'Do not make U-turn' },
  { id: 'R301', code: 'R301', name: 'No Parking (Restricted Days)', category: 'Regulatory', description: 'Parking is prohibited on the days and times shown on the sign', imagePath: './assets/signs/regulatory/R301.svg', action: 'Check parking times' },
  { id: 'R302', code: 'R302', name: 'No Stopping (Restricted)', category: 'Regulatory', description: 'Stopping is prohibited during the times specified on the sign', imagePath: './assets/signs/regulatory/R302.svg', action: 'Check stopping times' },
  { id: 'R303', code: 'R303', name: 'Parking Zone', category: 'Regulatory', description: 'Parking is permitted in this area during the hours shown on the sign', imagePath: './assets/signs/regulatory/R303.svg', action: 'Park in designated area' },
  { id: 'R304', code: 'R304', name: 'Two-Hour Parking', category: 'Regulatory', description: 'Parking is allowed for a maximum of 2 hours. Check the time board for details', imagePath: './assets/signs/regulatory/R304.svg', action: 'Maximum 2 hours parking' },
  { id: 'R305', code: 'R305', name: 'Parking Zone End', category: 'Regulatory', description: 'The parking zone ends at this sign. Parking restrictions change after this point', imagePath: './assets/signs/regulatory/R305.svg', action: 'Parking zone ended' },
  { id: 'R306', code: 'R306', name: 'No Parking Zone End', category: 'Regulatory', description: 'The no parking zone ends here. You may now park if otherwise permitted', imagePath: './assets/signs/regulatory/R306.svg', action: 'Can now park' },
  { id: 'R307', code: 'R307', name: 'Minibus Zone', category: 'Regulatory', description: 'This area is reserved for minibus taxi parking and operation', imagePath: './assets/signs/regulatory/R307.svg', action: 'Minibus area only' },
  { id: 'R308', code: 'R308', name: 'Taxi Rank', category: 'Regulatory', description: 'This is an official taxi rank. Follow traffic flow and queue procedures', imagePath: './assets/signs/regulatory/R308.svg', action: 'Follow taxi rank rules' },
  { id: 'R309', code: 'R309', name: 'Bus Stop', category: 'Regulatory', description: 'This is a bus stop area. Do not park or stop in this zone during operating hours', imagePath: './assets/signs/regulatory/R309.svg', action: 'Do not block bus stop' },

  // === SPEED LIMIT SIGNS (R201 series with various speeds) ===
  { id: 'R201-5', code: 'R201-5', name: 'Speed Limit 5 km/h', category: 'Regulatory', description: 'Maximum speed 5 km/h - extremely hazardous area or parking lot', imagePath: './assets/signs/prohibitory/R201-5.svg', action: 'Do not exceed 5 km/h' },
  { id: 'R201-10', code: 'R201-10', name: 'Speed Limit 10 km/h', category: 'Regulatory', description: 'Maximum speed 10 km/h - very hazardous residential area or complex', imagePath: './assets/signs/prohibitory/R201-10.svg', action: 'Do not exceed 10 km/h' },
  { id: 'R201-20', code: 'R201-20', name: 'Speed Limit 20 km/h', category: 'Regulatory', description: 'Maximum speed 20 km/h - hazardous residential or school zone', imagePath: './assets/signs/prohibitory/R201-20.svg', action: 'Do not exceed 20 km/h' },
  { id: 'R201-30', code: 'R201-30', name: 'Speed Limit 30 km/h', category: 'Regulatory', description: 'Maximum speed 30 km/h - busy residential or shopping area', imagePath: './assets/signs/prohibitory/R201-30.svg', action: 'Do not exceed 30 km/h' },
  { id: 'R201-40', code: 'R201-40', name: 'Speed Limit 40 km/h', category: 'Regulatory', description: 'Maximum speed 40 km/h - urban residential area speed limit', imagePath: './assets/signs/prohibitory/R201-40.svg', action: 'Do not exceed 40 km/h' },
  { id: 'R201-50', code: 'R201-50', name: 'Speed Limit 50 km/h', category: 'Regulatory', description: 'Maximum speed 50 km/h - urban built-up area speed limit', imagePath: './assets/signs/prohibitory/R201-50.svg', action: 'Do not exceed 50 km/h' },
  { id: 'R201-60', code: 'R201-60', name: 'Speed Limit 60 km/h', category: 'Regulatory', description: 'Maximum speed 60 km/h - urban area or business district', imagePath: './assets/signs/prohibitory/R201-60.svg', action: 'Do not exceed 60 km/h' },
  { id: 'R201-70', code: 'R201-70', name: 'Speed Limit 70 km/h', category: 'Regulatory', description: 'Maximum speed 70 km/h - urban or semi-urban road', imagePath: './assets/signs/prohibitory/R201-70.svg', action: 'Do not exceed 70 km/h' },
  { id: 'R201-75', code: 'R201-75', name: 'Speed Limit 75 km/h', category: 'Regulatory', description: 'Maximum speed 75 km/h - main road with moderate traffic', imagePath: './assets/signs/prohibitory/R201-75.svg', action: 'Do not exceed 75 km/h' },
  { id: 'R201-80', code: 'R201-80', name: 'Speed Limit 80 km/h', category: 'Regulatory', description: 'Maximum speed 80 km/h - main road or open area', imagePath: './assets/signs/prohibitory/R201-80.svg', action: 'Do not exceed 80 km/h' },
  { id: 'R201-90', code: 'R201-90', name: 'Speed Limit 90 km/h', category: 'Regulatory', description: 'Maximum speed 90 km/h - open rural road', imagePath: './assets/signs/prohibitory/R201-90.svg', action: 'Do not exceed 90 km/h' },
  { id: 'R201-100', code: 'R201-100', name: 'Speed Limit 100 km/h', category: 'Regulatory', description: 'Maximum speed 100 km/h - freeway or national road', imagePath: './assets/signs/prohibitory/R201-100.svg', action: 'Do not exceed 100 km/h' },
  { id: 'R201-120', code: 'R201-120', name: 'Speed Limit 120 km/h', category: 'Regulatory', description: 'Maximum speed 120 km/h - national freeway or highway', imagePath: './assets/signs/prohibitory/R201-120.svg', action: 'Do not exceed 120 km/h' },

  // === MANDATORY SIGNS (R101-R109 - Blue circles with white symbols) ===
  { id: 'R101', code: 'R101', name: 'Keep Right', category: 'Mandatory', description: 'All traffic must keep to the right side of this sign. This is an instruction sign', imagePath: './assets/signs/mandatory/R101.svg', action: 'Keep right' },
  { id: 'R101-600', code: 'R101-600', name: 'Keep Right (600m)', category: 'Mandatory', description: 'Keep right for 600 meters - this is a distance marker for mandatory instructions', imagePath: './assets/signs/mandatory/R101-600.svg', action: 'Keep right for 600m' },
  { id: 'R102', code: 'R102', name: 'Keep Left', category: 'Mandatory', description: 'All traffic must keep to the left side of this sign. This is an instruction sign', imagePath: './assets/signs/mandatory/R102.svg', action: 'Keep left' },
  { id: 'R103', code: 'R103', name: 'Turn Left (Ahead)', category: 'Mandatory', description: 'You must turn left at or after this sign. This is a mandatory instruction', imagePath: './assets/signs/mandatory/R103.svg', action: 'Turn left' },
  { id: 'R104', code: 'R104', name: 'Turn Right (Ahead)', category: 'Mandatory', description: 'You must turn right at or after this sign. This is a mandatory instruction', imagePath: './assets/signs/mandatory/R104.svg', action: 'Turn right' },
  { id: 'R105', code: 'R105', name: 'Go Straight Ahead', category: 'Mandatory', description: 'You must proceed straight ahead. Do not turn at this intersection', imagePath: './assets/signs/mandatory/R105.svg', action: 'Continue straight' },
  { id: 'R106', code: 'R106', name: 'Turn Right or Go Straight', category: 'Mandatory', description: 'You must either turn right or proceed straight ahead. Left turn is prohibited', imagePath: './assets/signs/mandatory/R106.svg', action: 'Turn right or go straight' },
  { id: 'R107', code: 'R107', name: 'Pass on Either Side', category: 'Mandatory', description: 'Traffic may pass on either the left or right side of this sign. Follow the arrows', imagePath: './assets/signs/mandatory/R107.svg', action: 'Pass either side' },
  { id: 'R108', code: 'R108', name: 'Roundabout', category: 'Mandatory', description: 'You are approaching or at a roundabout. Follow the directional arrows and traffic flow', imagePath: './assets/signs/mandatory/R108.svg', action: 'Enter roundabout' },
  { id: 'R109', code: 'R109', name: 'Pedestrian Crossing Point', category: 'Mandatory', description: 'Pedestrians are permitted and must use this crossing point. Drivers must be prepared to stop', imagePath: './assets/signs/mandatory/R109.svg', action: 'Pedestrian crossing' },

  // === WARNING SIGNS (W101-W217 and TW series - Red and white triangles) ===
  { id: 'W101', code: 'W101', name: 'Accident Black Spot', category: 'Warning', description: 'High concentration of accidents in this area. Reduce speed and exercise extreme caution', imagePath: './assets/signs/warning/W101.svg', action: 'Reduce speed significantly' },
  { id: 'W102', code: 'W102', name: 'Dangerous Curve Left', category: 'Warning', description: 'Sharp curve ahead to the left. Reduce speed and keep right to avoid collision', imagePath: './assets/signs/warning/W102.svg', action: 'Reduce speed for left curve' },
  { id: 'W103', code: 'W103', name: 'Dangerous Curve Right', category: 'Warning', description: 'Sharp curve ahead to the right. Reduce speed and keep left to avoid collision', imagePath: './assets/signs/warning/W103.svg', action: 'Reduce speed for right curve' },
  { id: 'W104', code: 'W104', name: 'Winding Road', category: 'Warning', description: 'Road ahead has multiple curves in succession. Reduce speed and increase alertness', imagePath: './assets/signs/warning/W104.svg', action: 'Reduce speed for curves' },
  { id: 'W105', code: 'W105', name: 'Steep Hill Down', category: 'Warning', description: 'Steep descent ahead. Select a lower gear to control speed and avoid brake overheating', imagePath: './assets/signs/warning/W105.svg', action: 'Use low gear' },
  { id: 'W106', code: 'W106', name: 'Loose Gravel', category: 'Warning', description: 'Gravel or loose surface on road. Reduce speed - poor traction may cause skidding', imagePath: './assets/signs/warning/W106.svg', action: 'Reduce speed' },
  { id: 'W107', code: 'W107', name: 'Slippery Road', category: 'Warning', description: 'Road surface may be slippery due to ice, water, or loose surface. Reduce speed and exercise caution', imagePath: './assets/signs/warning/W107.svg', action: 'Reduce speed' },
  { id: 'W108', code: 'W108', name: 'Pedestrian Crossing', category: 'Warning', description: 'Pedestrians may cross the road at this point. Reduce speed and be prepared to stop', imagePath: './assets/signs/warning/W108.svg', action: 'Be prepared to stop' },
  { id: 'W109', code: 'W109', name: 'School Zone', category: 'Warning', description: 'School is nearby - children may be crossing. Reduce speed and exercise extreme caution', imagePath: './assets/signs/warning/W109.svg', action: 'Reduce speed' },
  { id: 'W110', code: 'W110', name: 'Play Ground', category: 'Warning', description: 'Playground is in the area - children at play. Reduce speed and be very alert', imagePath: './assets/signs/warning/W110.svg', action: 'Reduce speed' },
  { id: 'W111', code: 'W111', name: 'Hospital', category: 'Warning', description: 'Hospital is nearby. Reduce speed and keep noise low to avoid disturbing patients', imagePath: './assets/signs/warning/W111.svg', action: 'Reduce speed' },
  { id: 'W112', code: 'W112', name: 'Elderly People Crossing', category: 'Warning', description: 'Elderly people may be crossing. Reduce speed and be prepared to stop immediately', imagePath: './assets/signs/warning/W112.svg', action: 'Be prepared to stop' },
  { id: 'W113', code: 'W113', name: 'Disabled People Crossing', category: 'Warning', description: 'Disabled people may be crossing. Reduce speed and be prepared to stop and assist if needed', imagePath: './assets/signs/warning/W113.svg', action: 'Be prepared to stop' },
  { id: 'W114', code: 'W114', name: 'Cyclists', category: 'Warning', description: 'Cyclists may be present on the road. Give them space and be alert', imagePath: './assets/signs/warning/W114.svg', action: 'Be alert for cyclists' },
  { id: 'W115', code: 'W115', name: 'Motorcyclists', category: 'Warning', description: 'Motorcycles expected on this road. Be alert for their sudden movements', imagePath: './assets/signs/warning/W115.svg', action: 'Be alert' },
  { id: 'W116', code: 'W116', name: 'Horse Riders', category: 'Warning', description: 'Horse riders may be on the road. Reduce speed and be aware of their unpredictability', imagePath: './assets/signs/warning/W116.svg', action: 'Be alert' },
  { id: 'W117', code: 'W117', name: 'Livestock on Road', category: 'Warning', description: 'Livestock may be crossing or grazing on the road. Reduce speed and be very alert', imagePath: './assets/signs/warning/W117.svg', action: 'Reduce speed' },
  { id: 'W118', code: 'W118', name: 'Wild Animals', category: 'Warning', description: 'Wild animals may cross the road. Reduce speed and be ready to stop or swerve safely', imagePath: './assets/signs/warning/W118.svg', action: 'Reduce speed' },
  { id: 'W119', code: 'W119', name: 'Migratory Animals', category: 'Warning', description: 'Animals regularly cross this area. Reduce speed and be alert', imagePath: './assets/signs/warning/W119.svg', action: 'Reduce speed' },
  { id: 'W201', code: 'W201', name: 'Narrow Bridge', category: 'Warning', description: 'Bridge ahead is narrower than the road. Reduce speed and be prepared to meet oncoming traffic', imagePath: './assets/signs/warning/W201.svg', action: 'Reduce speed' },
  { id: 'W202', code: 'W202', name: 'Level Crossing with Gates', category: 'Warning', description: 'Railway crossing ahead with gates. Stop if lights flash or gates are closing. Look and listen', imagePath: './assets/signs/warning/W202.svg', action: 'Stop and look' },
  { id: 'W203', code: 'W203', name: 'Level Crossing - No Gates', category: 'Warning', description: 'Unguarded railway crossing ahead. Stop, look left and right, and listen before crossing', imagePath: './assets/signs/warning/W203.svg', action: 'Stop and look both ways' },
  { id: 'W204', code: 'W204', name: 'Poor Visibility', category: 'Warning', description: 'Visibility is restricted ahead (fog, dust, or road layout). Reduce speed significantly', imagePath: './assets/signs/warning/W204.svg', action: 'Reduce speed' },
  { id: 'W205', code: 'W205', name: 'Road Intersection', category: 'Warning', description: 'Road junction ahead with cross traffic. Reduce speed and be prepared to yield or stop', imagePath: './assets/signs/warning/W205.svg', action: 'Be prepared to stop' },
  { id: 'W206', code: 'W206', name: 'Side Wind', category: 'Warning', description: 'Strong side wind in this area. Grip the steering wheel firmly and reduce speed if necessary', imagePath: './assets/signs/warning/W206.svg', action: 'Grip wheel firmly' },
  { id: 'W207', code: 'W207', name: 'Wind Mill', category: 'Warning', description: 'Windmill in area may cause blinding reflections. Reduce speed and be alert', imagePath: './assets/signs/warning/W207.svg', action: 'Be alert' },
  { id: 'W208', code: 'W208', name: 'Toll Plaza', category: 'Warning', description: 'Toll plaza ahead. Reduce speed and be ready to stop and pay toll fees', imagePath: './assets/signs/warning/W208.svg', action: 'Prepare to stop' },
  { id: 'W209', code: 'W209', name: 'Divided Highway Ends', category: 'Warning', description: 'Divided highway ahead ends - road becomes two-way traffic. Exercise caution and reduce speed', imagePath: './assets/signs/warning/W209.svg', action: 'Be alert' },
  { id: 'W210', code: 'W210', name: 'Merging Traffic', category: 'Warning', description: 'Another road merges into this one ahead. Be alert for merging vehicles', imagePath: './assets/signs/warning/W210.svg', action: 'Be alert' },
  { id: 'W211', code: 'W211', name: 'Tourist Attraction', category: 'Warning', description: 'Tourist attraction ahead - expect heavy and unpredictable traffic. Reduce speed', imagePath: './assets/signs/warning/W211.svg', action: 'Reduce speed' },
  { id: 'W212', code: 'W212', name: 'Flooded Road Possible', category: 'Warning', description: 'Road may flood during heavy rain. Do not attempt to drive through floodwater', imagePath: './assets/signs/warning/W212.svg', action: 'Avoid if flooded' },
  { id: 'W213', code: 'W213', name: 'Low Height Clearance', category: 'Warning', description: 'Restricted vertical clearance ahead. Check your vehicle height before proceeding', imagePath: './assets/signs/warning/W213.svg', action: 'Check height' },
  { id: 'W215', code: 'W215', name: 'Construction Zone', category: 'Warning', description: 'Road construction or maintenance ahead. Reduce speed and follow temporary traffic signs', imagePath: './assets/signs/warning/W215.svg', action: 'Reduce speed' },
  { id: 'W216', code: 'W216', name: 'Narrow Road Right', category: 'Warning', description: 'Road narrows on the right. Keep to the left side of the road', imagePath: './assets/signs/warning/W216.svg', action: 'Keep left' },
  { id: 'W217', code: 'W217', name: 'Narrow Road Left', category: 'Warning', description: 'Road narrows on the left. Keep to the right side of the road', imagePath: './assets/signs/warning/W217.svg', action: 'Keep right' },

  // === ADDITIONAL WARNING SIGNS (TW series - temporary/alternative markings) ===
  { id: 'TW101', code: 'TW101', name: 'Danger', category: 'Warning', description: 'General danger ahead. Exercise caution and reduce speed', imagePath: './assets/signs/warning/TW101.svg', action: 'Be careful' },
  { id: 'TW102', code: 'TW102', name: 'Uneven Road', category: 'Warning', description: 'Uneven or damaged road surface ahead. Reduce speed to avoid damage to vehicle', imagePath: './assets/signs/warning/TW102.svg', action: 'Reduce speed' },
  { id: 'TW103', code: 'TW103', name: 'Slippery Road (Alternative)', category: 'Warning', description: 'Road surface is slippery. Reduce speed and increase following distance', imagePath: './assets/signs/warning/TW103.svg', action: 'Reduce speed' },
  { id: 'TW104', code: 'TW104', name: 'Steep Slope', category: 'Warning', description: 'Steep road ahead. Select appropriate gear for climbing or descending', imagePath: './assets/signs/warning/TW104.svg', action: 'Use appropriate gear' },
  { id: 'TW105', code: 'TW105', name: 'Skid Risk', category: 'Warning', description: 'High risk of skidding. Reduce speed and be careful with acceleration and braking', imagePath: './assets/signs/warning/TW105.svg', action: 'Reduce speed' },
  { id: 'TW106', code: 'TW106', name: 'Two-Way Traffic', category: 'Warning', description: 'Road ahead has two-way traffic. Stay in your lane and be alert for oncoming vehicles', imagePath: './assets/signs/warning/TW106.svg', action: 'Stay in lane' },
  { id: 'TW107', code: 'TW107', name: 'Diversion', category: 'Warning', description: 'Traffic is diverted from the normal route. Follow diversion signs carefully', imagePath: './assets/signs/warning/TW107.svg', action: 'Follow diversion' },
  { id: 'TW108', code: 'TW108', name: 'Rough Road', category: 'Warning', description: 'Road surface is rough or uneven. Reduce speed to avoid vehicle damage', imagePath: './assets/signs/warning/TW108.svg', action: 'Reduce speed' },
  { id: 'TW109', code: 'TW109', name: 'Dust or Smoke', category: 'Warning', description: 'Dust or smoke may reduce visibility. Reduce speed and use headlights', imagePath: './assets/signs/warning/TW109.svg', action: 'Reduce speed' },
  { id: 'TW110', code: 'TW110', name: 'Falling Objects', category: 'Warning', description: 'Objects may fall from cliffs or overhead. Be alert and ready to take evasive action', imagePath: './assets/signs/warning/TW110.svg', action: 'Be alert' },
  { id: 'TW111', code: 'TW111', name: 'Soft Shoulder', category: 'Warning', description: 'Road shoulder is soft or unstable. Do not leave the road surface', imagePath: './assets/signs/warning/TW111.svg', action: 'Stay on road' },

  // === INFORMATION SIGNS (IN1-IN6, IN20, and GDLS/GFS series) ===
  { id: 'IN1', code: 'IN1', name: 'Parking', category: 'Information', description: 'Parking area available - may be paid parking, reserved, or free', imagePath: './assets/signs/information/IN1.svg', action: 'Parking available' },
  { id: 'IN2', code: 'IN2', name: 'Hospital', category: 'Information', description: 'Hospital or medical facility in the direction shown by the arrow', imagePath: './assets/signs/information/IN2.svg', action: 'Hospital ahead' },
  { id: 'IN3', code: 'IN3', name: 'Fuel Station', category: 'Information', description: 'Petrol/diesel fuel station in the direction indicated', imagePath: './assets/signs/information/IN3.svg', action: 'Fuel station ahead' },
  { id: 'IN4', code: 'IN4', name: 'Restaurant', category: 'Information', description: 'Restaurant or food service facility in the direction shown', imagePath: './assets/signs/information/IN4.svg', action: 'Food available' },
  { id: 'IN5', code: 'IN5', name: 'Camping', category: 'Information', description: 'Camping or caravan site available in the direction shown', imagePath: './assets/signs/information/IN5.svg', action: 'Camping nearby' },
  { id: 'IN6', code: 'IN6', name: 'Accommodation', category: 'Information', description: 'Hotel, guesthouse, or lodging available in the direction indicated', imagePath: './assets/signs/information/IN6.svg', action: 'Accommodation available' },
  { id: 'IN20', code: 'IN20', name: 'Shopping Center', category: 'Information', description: 'Shopping mall or commercial center in the direction shown', imagePath: './assets/signs/svg-information-other/IN20.svg', action: 'Shopping center' },
  { id: 'IN20-RHT', code: 'IN20-RHT', name: 'Shopping Center (RHT)', category: 'Information', description: 'Shopping center in right-hand traffic area', imagePath: './assets/signs/svg-information-other/IN20-RHT.svg', action: 'Shopping center' },

  // === GUIDANCE SIGNS (GDLS/GFS - For navigation and directional information) ===
  { id: 'GDLS-A1-1', code: 'GDLS A1-1', name: 'Guidance Sign - Variant 1', category: 'Guidance', description: 'General guidance and directional sign for navigation', imagePath: './assets/signs/svg-other/GDLS A1-1.svg', action: 'Follow direction' },
  { id: 'GDLS-A1-5', code: 'GDLS A1-5', name: 'Guidance Sign - Variant 5', category: 'Guidance', description: 'Directional guidance for main roads and routes', imagePath: './assets/signs/svg-other/GDLS A1-5.svg', action: 'Follow direction' },
  { id: 'GDLS-A1-6', code: 'GDLS A1-6', name: 'Guidance Sign - Variant 6', category: 'Guidance', description: 'Directional guidance sign for navigation', imagePath: './assets/signs/svg-other/GDLS A1-6.svg', action: 'Follow direction' },
  { id: 'GDLS-A1-7', code: 'GDLS A1-7', name: 'Guidance Sign - Variant 7', category: 'Guidance', description: 'Directional navigation sign', imagePath: './assets/signs/svg-other/GDLS A1-7.svg', action: 'Follow direction' },
  { id: 'GDLS-A1-8', code: 'GDLS A1-8', name: 'Guidance Sign - Variant 8', category: 'Guidance', description: 'Main road guidance and direction sign', imagePath: './assets/signs/svg-other/GDLS A1-8.svg', action: 'Follow direction' },
  { id: 'GDLS-A1-9', code: 'GDLS A1-9', name: 'Guidance Sign - Variant 9', category: 'Guidance', description: 'Directional sign for navigation on main routes', imagePath: './assets/signs/svg-other/GDLS A1-9.svg', action: 'Follow direction' },
  { id: 'GDLS-A1-10', code: 'GDLS A1-10', name: 'Guidance Sign - Variant 10', category: 'Guidance', description: 'Navigation guidance sign', imagePath: './assets/signs/svg-other/GDLS A1-10.svg', action: 'Follow direction' },
  { id: 'GDLS-A1-11', code: 'GDLS A1-11', name: 'Guidance Sign - Variant 11', category: 'Guidance', description: 'Directional and informational sign', imagePath: './assets/signs/svg-other/GDLS A1-11.svg', action: 'Follow direction' },
  { id: 'GDLS-A1-12', code: 'GDLS A1-12', name: 'Guidance Sign - Variant 12', category: 'Guidance', description: 'Main route guidance sign', imagePath: './assets/signs/svg-other/GDLS A1-12.svg', action: 'Follow direction' },
  { id: 'GDLS-A1-14', code: 'GDLS A1-14', name: 'Guidance Sign - Variant 14', category: 'Guidance', description: 'Navigation and direction sign', imagePath: './assets/signs/svg-other/GDLS A1-14.svg', action: 'Follow direction' },
  { id: 'GDLS-A2-1', code: 'GDLS A2-1', name: 'Guidance Sign A2 - Variant 1', category: 'Guidance', description: 'Secondary road guidance sign', imagePath: './assets/signs/svg-other/GDLS A2-1.svg', action: 'Follow direction' },
  { id: 'GDLS-A2-2', code: 'GDLS A2-2', name: 'Guidance Sign A2 - Variant 2', category: 'Guidance', description: 'Secondary road navigation', imagePath: './assets/signs/svg-other/GDLS A2-2.svg', action: 'Follow direction' },
  { id: 'GDLS-A2-4', code: 'GDLS A2-4', name: 'Guidance Sign A2 - Variant 4', category: 'Guidance', description: 'Secondary road guidance', imagePath: './assets/signs/svg-other/GDLS A2-4.svg', action: 'Follow direction' },
  { id: 'GDLS-A2-11', code: 'GDLS A2-11', name: 'Guidance Sign A2 - Variant 11', category: 'Guidance', description: 'Secondary road direction', imagePath: './assets/signs/svg-other/GDLS A2-11.svg', action: 'Follow direction' },
  { id: 'GDLS-A2-12', code: 'GDLS A2-12', name: 'Guidance Sign A2 - Variant 12', category: 'Guidance', description: 'Secondary route navigation', imagePath: './assets/signs/svg-other/GDLS A2-12.svg', action: 'Follow direction' },
  { id: 'GDLS-A2-13', code: 'GDLS A2-13', name: 'Guidance Sign A2 - Variant 13', category: 'Guidance', description: 'Secondary road guidance', imagePath: './assets/signs/svg-other/GDLS A2-13.svg', action: 'Follow direction' },
  { id: 'GDLS-A2-14', code: 'GDLS A2-14', name: 'Guidance Sign A2 - Variant 14', category: 'Guidance', description: 'Secondary road direction sign', imagePath: './assets/signs/svg-other/GDLS A2-14.svg', action: 'Follow direction' },
  { id: 'GDLS-A2-15', code: 'GDLS A2-15', name: 'Guidance Sign A2 - Variant 15', category: 'Guidance', description: 'Secondary route navigation', imagePath: './assets/signs/svg-other/GDLS A2-15.svg', action: 'Follow direction' },
  { id: 'GFS-B4-3', code: 'GFS B4-3', name: 'Route Marker', category: 'Guidance', description: 'Route identification and directional marker', imagePath: './assets/signs/svg-other/GFS B4-3.svg', action: 'Follow route' },
  { id: 'TR311', code: 'TR311', name: 'Traffic Control Sign 311', category: 'Guidance', description: 'Traffic management and route control sign', imagePath: './assets/signs/svg-other/TR311.svg', action: 'Follow directions' },
  { id: 'TR311-P', code: 'TR311-P', name: 'Traffic Control Sign 311-P', category: 'Guidance', description: 'Parking direction control sign', imagePath: './assets/signs/svg-other/TR311-P.svg', action: 'Follow direction' },
  { id: 'TR323', code: 'TR323', name: 'Traffic Control Sign 323', category: 'Guidance', description: 'Traffic direction and control sign', imagePath: './assets/signs/svg-other/TR323.svg', action: 'Follow directions' },
  { id: 'TR323-P', code: 'TR323-P', name: 'Traffic Control Sign 323-P', category: 'Guidance', description: 'Parking control and direction sign', imagePath: './assets/signs/svg-other/TR323-P.svg', action: 'Follow direction' },
];

const QUESTIONS = [
  // === ROAD RULES ===
  { id: 1, category: 'road-rules', question: 'What is the speed limit in residential areas in South Africa?', options: ['40 km/h', '60 km/h', '80 km/h', '100 km/h'], answer: 0, explanation: 'Speed limit in residential areas is typically 40 km/h unless otherwise indicated by signage.' },
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
    meaning: 'Overtaking Allowed (if Safe)',
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
