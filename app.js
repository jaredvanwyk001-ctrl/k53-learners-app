// ============================================
//  K53 Learner's App — main logic
// ============================================

// ---- Page tab switching ----
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.page).classList.add('active');
  });
});

// ============================================
//  QUIZ CONFIGURATION
// ============================================

const CATEGORY_DISPLAY = { signs: 'Road Signs', rules: 'Road Rules', controls: 'Vehicle Controls' };

const EXAM_PROFILES = {
  'All':              { signVisual: 30, rules: 30, controls: 8 },
  'Road Signs':       { signVisual: 30 },
  'Road Rules':       { rules: 30 },
  'Vehicle Controls': { controls: 8 },
};

// signVisual = image-based questions from signsData.json (always have a rendered sign)
// signs      = text-based sign questions from questions.json (kept for potential future use)
let allQuestions  = { signs: [], signVisual: [], rules: [], controls: [] };
let quizQuestions = [];
let current   = 0;
let score     = 0;
let answered  = false;
let mistakes  = [];
let activeTab = 'All';

// ============================================
//  HELPERS
// ============================================

// Strip the explanatory clause that follows a dash in option text.
// "Check oil pressure immediately — risk of engine damage" → "Check oil pressure immediately"
// "Driving in neutral or with clutch depressed — reduces engine braking" → "Driving in neutral or with clutch depressed"
// Also normalises capitalisation and trailing punctuation so all options look identical in style.
function normalizeOption(text) {
  return text
    .replace(/\s+[—–]\s+.+$/s, '')   // strip " — reason" (em-dash / en-dash)
    .replace(/\s+-\s+.+$/s, '')       // strip " - reason" (spaced hyphen)
    .replace(/\.$/, '')               // remove trailing period
    .trim()
    .replace(/^[a-z]/, c => c.toUpperCase()); // sentence case
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickRandom(arr, n) { return shuffle(arr).slice(0, n); }

// ============================================
//  SVG SIGN RENDERER
// ============================================

function createSignSVG(sign) {
  const r = sign.render || {};
  const wrap = (body) =>
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">${body}</svg>`;

  // ---- shared triangle parts ----
  const TRI_OUTER = `<polygon points="100,12 192,180 8,180" fill="#CC0000"/>`;
  const TRI_INNER = `<polygon points="100,30 175,166 25,166" fill="white"/>`;
  const triangle  = (symbol) => wrap(TRI_OUTER + TRI_INNER + symbol);

  // ---- shared prohibition circle ----
  const CIRC_BASE  = `<circle cx="100" cy="100" r="92" fill="white" stroke="#CC0000" stroke-width="14"/>`;
  const DIAG_BAR   = `<line x1="155" y1="45" x2="45" y2="155" stroke="#CC0000" stroke-width="18" stroke-linecap="round"/>`;
  const prohibition = (symbol) => wrap(CIRC_BASE + symbol + DIAG_BAR);

  // ---- shared mandatory circle ----
  const BLUE_CIRC = `<circle cx="100" cy="100" r="92" fill="#1565C0"/>`;
  const mandatory  = (symbol) => wrap(BLUE_CIRC + symbol);

  // ---- warning symbols ----
  const W = {
    CURVE_RIGHT_GENTLE: `<path d="M90,155 L90,105 Q90,75 118,75 L145,75" stroke="#222" stroke-width="11" fill="none" stroke-linecap="round"/>
                         <polygon points="145,62 145,88 164,75" fill="#222"/>`,
    CURVE_RIGHT:  `<path d="M88,155 L88,95 Q88,66 115,66 L140,66" stroke="#222" stroke-width="13" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                   <polygon points="140,52 140,80 162,66" fill="#222"/>`,
    CURVE_LEFT:   `<path d="M112,155 L112,95 Q112,66 85,66 L60,66" stroke="#222" stroke-width="13" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                   <polygon points="60,52 60,80 38,66" fill="#222"/>`,
    WINDING:      `<path d="M100,158 L100,130 Q100,112 118,112 Q136,112 136,95 Q136,78 118,78 Q100,78 100,62 L100,48" stroke="#222" stroke-width="12" fill="none" stroke-linecap="round"/>
                   <polygon points="100,40 88,56 112,56" fill="#222"/>`,
    DESCENT:      `<line x1="66" y1="72" x2="146" y2="152" stroke="#333" stroke-width="13" stroke-linecap="round"/>
                   <polygon points="146,152 122,138 155,130" fill="#333"/>`,
    ASCENT:       `<line x1="66" y1="152" x2="146" y2="72" stroke="#333" stroke-width="13" stroke-linecap="round"/>
                   <polygon points="146,72 122,86 155,94" fill="#333"/>`,
    UNEVEN:       `<path d="M45,135 L70,110 L95,128 L120,100 L145,118 L160,105" stroke="#333" stroke-width="11" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
    HUMPS:        `<path d="M45,145 Q60,110 80,110 Q100,110 100,130 Q100,110 120,110 Q140,110 155,145" stroke="#333" stroke-width="11" fill="none" stroke-linecap="round"/>`,
    LOW_CLEARANCE:`<rect x="42" y="75" width="116" height="12" rx="4" fill="#333"/>
                   <rect x="42" y="87" width="10" height="60" rx="3" fill="#333"/>
                   <rect x="148" y="87" width="10" height="60" rx="3" fill="#333"/>
                   <rect x="72" y="120" width="56" height="22" rx="16" fill="#333"/>`,
    BRIDGE_OPENS: `<rect x="52" y="100" width="44" height="12" rx="3" fill="#333"/>
                   <rect x="104" y="100" width="44" height="12" rx="3" fill="#333"/>
                   <line x1="74" y1="100" x2="60" y2="72" stroke="#333" stroke-width="7" stroke-linecap="round"/>
                   <line x1="126" y1="100" x2="140" y2="72" stroke="#333" stroke-width="7" stroke-linecap="round"/>
                   <rect x="45" y="112" width="110" height="8" rx="3" fill="#333"/>`,
    CROSSROAD:    `<rect x="93" y="62" width="14" height="100" fill="#333" rx="2"/>
                   <rect x="55" y="100" width="90" height="14" fill="#333" rx="2"/>`,
    T_AHEAD:      `<rect x="93" y="62" width="14" height="65" fill="#333" rx="2"/>
                   <rect x="52" y="120" width="96" height="14" fill="#333" rx="2"/>`,
    T_RIGHT:      `<rect x="93" y="62" width="14" height="98" fill="#333" rx="2"/>
                   <rect x="100" y="98" width="65" height="14" fill="#333" rx="2"/>`,
    T_LEFT:       `<rect x="93" y="62" width="14" height="98" fill="#333" rx="2"/>
                   <rect x="35" y="98" width="65" height="14" fill="#333" rx="2"/>`,
    Y_JUNCTION:   `<rect x="93" y="110" width="14" height="50" fill="#333" rx="2"/>
                   <path d="M100,110 L68,68" stroke="#333" stroke-width="14" stroke-linecap="round"/>
                   <path d="M100,110 L132,68" stroke="#333" stroke-width="14" stroke-linecap="round"/>`,
    STAGGER_RL:   `<rect x="93" y="62" width="14" height="98" fill="#333" rx="2"/>
                   <rect x="100" y="78" width="55" height="12" fill="#333" rx="2"/>
                   <rect x="45" y="108" width="55" height="12" fill="#333" rx="2"/>`,
    STAGGER_LR:   `<rect x="93" y="62" width="14" height="98" fill="#333" rx="2"/>
                   <rect x="45" y="78" width="55" height="12" fill="#333" rx="2"/>
                   <rect x="100" y="108" width="55" height="12" fill="#333" rx="2"/>`,
    RAILWAY_UNGUARDED: `<line x1="62" y1="62" x2="138" y2="158" stroke="#333" stroke-width="11" stroke-linecap="round"/>
                        <line x1="138" y1="62" x2="62" y2="158" stroke="#333" stroke-width="11" stroke-linecap="round"/>`,
    RAILWAY_GATE: `<line x1="62" y1="62" x2="138" y2="158" stroke="#333" stroke-width="11" stroke-linecap="round"/>
                   <line x1="138" y1="62" x2="62" y2="158" stroke="#333" stroke-width="11" stroke-linecap="round"/>
                   <rect x="52" y="148" width="96" height="10" rx="4" fill="#CC0000"/>`,
    TRAFFIC_LIGHT:`<rect x="83" y="63" width="34" height="90" rx="8" fill="#222"/>
                   <circle cx="100" cy="78"  r="9" fill="#EE1111"/>
                   <circle cx="100" cy="100" r="9" fill="#FFB300"/>
                   <circle cx="100" cy="122" r="9" fill="#22BB22"/>
                   <rect x="96" y="153" width="8" height="13" fill="#333"/>`,
    STOP_AHEAD:   `<polygon points="82,74 118,74 136,92 136,118 118,136 82,136 64,118 64,92" fill="#CC0000"/>
                   <text x="100" y="116" font-family="Arial Black,sans-serif" font-size="18" font-weight="900" fill="white" text-anchor="middle">STOP</text>`,
    YIELD_AHEAD:  `<polygon points="72,78 128,78 100,126" fill="#CC0000"/>
                   <polygon points="78,86 122,86 100,118" fill="white"/>
                   <text x="100" y="113" font-family="Arial,sans-serif" font-size="10" font-weight="bold" fill="#CC0000" text-anchor="middle">YIELD</text>`,
    NARROW_BRIDGE:`<rect x="62" y="92" width="76" height="18" rx="3" fill="#333"/>
                   <rect x="55" y="88" width="8" height="26" rx="2" fill="#333"/>
                   <rect x="137" y="88" width="8" height="26" rx="2" fill="#333"/>
                   <rect x="52" y="108" width="96" height="8" rx="3" fill="#555"/>`,
    PEDESTRIAN:   `<circle cx="104" cy="72" r="9" fill="#333"/>
                   <line x1="104" y1="81"  x2="100" y2="116" stroke="#333" stroke-width="8"  stroke-linecap="round"/>
                   <line x1="102" y1="91"  x2="80"  y2="106" stroke="#333" stroke-width="7"  stroke-linecap="round"/>
                   <line x1="102" y1="94"  x2="118" y2="104" stroke="#333" stroke-width="7"  stroke-linecap="round"/>
                   <line x1="100" y1="116" x2="82"  y2="145" stroke="#333" stroke-width="7"  stroke-linecap="round"/>
                   <line x1="100" y1="116" x2="114" y2="145" stroke="#333" stroke-width="7"  stroke-linecap="round"/>`,
    SCHOOL:       `<circle cx="84"  cy="78" r="7" fill="#333"/>
                   <line x1="84"  y1="85"  x2="82"  y2="110" stroke="#333" stroke-width="6" stroke-linecap="round"/>
                   <line x1="83"  y1="92"  x2="68"  y2="103" stroke="#333" stroke-width="5" stroke-linecap="round"/>
                   <line x1="83"  y1="92"  x2="96"  y2="101" stroke="#333" stroke-width="5" stroke-linecap="round"/>
                   <line x1="82"  y1="110" x2="74"  y2="134" stroke="#333" stroke-width="5" stroke-linecap="round"/>
                   <line x1="82"  y1="110" x2="90"  y2="134" stroke="#333" stroke-width="5" stroke-linecap="round"/>
                   <circle cx="116" cy="78" r="7" fill="#333"/>
                   <line x1="116" y1="85"  x2="114" y2="110" stroke="#333" stroke-width="6" stroke-linecap="round"/>
                   <line x1="115" y1="92"  x2="102" y2="103" stroke="#333" stroke-width="5" stroke-linecap="round"/>
                   <line x1="115" y1="92"  x2="128" y2="101" stroke="#333" stroke-width="5" stroke-linecap="round"/>
                   <line x1="114" y1="110" x2="106" y2="134" stroke="#333" stroke-width="5" stroke-linecap="round"/>
                   <line x1="114" y1="110" x2="122" y2="134" stroke="#333" stroke-width="5" stroke-linecap="round"/>`,
    CYCLIST:      `<circle cx="78"  cy="125" r="18" fill="none" stroke="#333" stroke-width="7"/>
                   <circle cx="122" cy="125" r="18" fill="none" stroke="#333" stroke-width="7"/>
                   <line x1="78"  y1="125" x2="100" y2="100" stroke="#333" stroke-width="6" stroke-linecap="round"/>
                   <line x1="100" y1="100" x2="122" y2="125" stroke="#333" stroke-width="6" stroke-linecap="round"/>
                   <circle cx="100" cy="82" r="8" fill="#333"/>
                   <line x1="100" y1="90"  x2="100" y2="100" stroke="#333" stroke-width="6" stroke-linecap="round"/>`,
    CHILDREN_PLAYING: `<circle cx="88"  cy="74" r="7" fill="#333"/>
                        <line x1="88"  y1="81"  x2="86"  y2="104" stroke="#333" stroke-width="6" stroke-linecap="round"/>
                        <line x1="87"  y1="88"  x2="72"  y2="98"  stroke="#333" stroke-width="5" stroke-linecap="round"/>
                        <line x1="87"  y1="90"  x2="98"  y2="100" stroke="#333" stroke-width="5" stroke-linecap="round"/>
                        <line x1="86"  y1="104" x2="78"  y2="128" stroke="#333" stroke-width="5" stroke-linecap="round"/>
                        <line x1="86"  y1="104" x2="94"  y2="128" stroke="#333" stroke-width="5" stroke-linecap="round"/>
                        <circle cx="114" cy="76" r="6" fill="#333"/>
                        <line x1="114" y1="82"  x2="116" y2="104" stroke="#333" stroke-width="5" stroke-linecap="round"/>
                        <line x1="115" y1="89"  x2="126" y2="96"  stroke="#333" stroke-width="4" stroke-linecap="round"/>
                        <line x1="116" y1="104" x2="110" y2="126" stroke="#333" stroke-width="4" stroke-linecap="round"/>
                        <line x1="116" y1="104" x2="122" y2="126" stroke="#333" stroke-width="4" stroke-linecap="round"/>`,
    NARROWS_BOTH: `<line x1="55"  y1="68"  x2="86"  y2="158" stroke="#333" stroke-width="11" stroke-linecap="round"/>
                   <line x1="145" y1="68"  x2="114" y2="158" stroke="#333" stroke-width="11" stroke-linecap="round"/>`,
    NARROWS_LEFT: `<line x1="55"  y1="68"  x2="86"  y2="158" stroke="#333" stroke-width="11" stroke-linecap="round"/>
                   <line x1="145" y1="68"  x2="145" y2="158" stroke="#333" stroke-width="11" stroke-linecap="round"/>`,
    NARROWS_RIGHT:`<line x1="55"  y1="68"  x2="55"  y2="158" stroke="#333" stroke-width="11" stroke-linecap="round"/>
                   <line x1="145" y1="68"  x2="114" y2="158" stroke="#333" stroke-width="11" stroke-linecap="round"/>`,
    TWO_WAY:      `<polygon points="72,88 48,110 72,132" fill="#333"/>
                   <rect x="70" y="103" width="60" height="14" fill="#333" rx="2"/>
                   <polygon points="128,88 152,110 128,132" fill="#333"/>`,
    DEAD_END:     `<rect x="93" y="62" width="14" height="70" fill="#333" rx="2"/>
                   <rect x="65" y="128" width="70" height="12" rx="4" fill="#333"/>`,
    SLIPPERY:     `<rect x="68" y="90" width="64" height="26" rx="6" fill="#333"/>
                   <rect x="78" y="74" width="44" height="18" rx="5" fill="#333"/>
                   <circle cx="83"  cy="118" r="9" fill="#444"/>
                   <circle cx="117" cy="118" r="9" fill="#444"/>
                   <path d="M72,133 Q82,139 92,133 Q102,127 112,133 Q122,139 132,133" stroke="#777" stroke-width="4" fill="none" stroke-linecap="round"/>
                   <path d="M72,142 Q82,148 92,142 Q102,136 112,142 Q122,148 132,142" stroke="#777" stroke-width="3" fill="none" stroke-linecap="round"/>`,
    LOOSE_GRAVEL: `<circle cx="72"  cy="125" r="7"  fill="#555"/>
                   <circle cx="92"  cy="118" r="5"  fill="#555"/>
                   <circle cx="110" cy="130" r="8"  fill="#555"/>
                   <circle cx="130" cy="120" r="6"  fill="#555"/>
                   <circle cx="88"  cy="105" r="4"  fill="#555"/>
                   <circle cx="118" cy="108" r="5"  fill="#555"/>
                   <circle cx="100" cy="95"  r="4"  fill="#555"/>`,
    SAND:         `<path d="M55,150 Q70,120 85,140 Q100,160 115,130 Q130,100 145,140" stroke="#c8a050" stroke-width="8" fill="none" stroke-linecap="round"/>
                   <path d="M60,160 Q80,135 100,155 Q120,175 140,155" stroke="#c8a050" stroke-width="6" fill="none" stroke-linecap="round"/>`,
    FLOOD:        `<path d="M52,115 Q66,100 80,115 Q94,130 108,115 Q122,100 136,115 Q145,125 148,118" stroke="#3498db" stroke-width="9" fill="none" stroke-linecap="round"/>
                   <path d="M52,135 Q66,120 80,135 Q94,150 108,135 Q122,120 136,135 Q145,145 148,138" stroke="#3498db" stroke-width="9" fill="none" stroke-linecap="round"/>`,
    LOW_WATER:    `<rect x="55" y="110" width="90" height="8" rx="3" fill="#3498db"/>
                   <rect x="52" y="96"  width="96" height="14" rx="4" fill="#888"/>
                   <rect x="55" y="118" width="90" height="8" rx="3" fill="#3498db"/>`,
    DIP:          `<path d="M55,90 Q75,90 85,120 Q100,155 115,120 Q125,90 145,90" stroke="#333" stroke-width="12" fill="none" stroke-linecap="round"/>`,
    ROAD_WORKS:   `<circle cx="94" cy="72" r="8" fill="#333"/>
                   <rect x="82" y="67" width="24" height="7" rx="3" fill="#E65100"/>
                   <line x1="94" y1="80"  x2="87"  y2="108" stroke="#333" stroke-width="8" stroke-linecap="round"/>
                   <line x1="91" y1="88"  x2="118" y2="97"  stroke="#333" stroke-width="6" stroke-linecap="round"/>
                   <line x1="118" y1="97" x2="132" y2="148" stroke="#333" stroke-width="5" stroke-linecap="round"/>
                   <rect x="124" y="144" width="16" height="11" rx="3" fill="#333"/>
                   <line x1="87" y1="108" x2="77"  y2="140" stroke="#333" stroke-width="7" stroke-linecap="round"/>
                   <line x1="87" y1="108" x2="95"  y2="140" stroke="#333" stroke-width="7" stroke-linecap="round"/>
                   <ellipse cx="133" cy="156" rx="18" ry="7" fill="#795548"/>`,
    FLAGMAN:      `<circle cx="100" cy="68" r="9" fill="#333"/>
                   <line x1="100" y1="77" x2="96" y2="110" stroke="#333" stroke-width="8" stroke-linecap="round"/>
                   <line x1="98"  y1="85" x2="78" y2="75"  stroke="#333" stroke-width="6" stroke-linecap="round"/>
                   <rect x="58"  y="62" width="22" height="14" rx="3" fill="#CC0000"/>
                   <line x1="98"  y1="90" x2="118" y2="100" stroke="#333" stroke-width="6" stroke-linecap="round"/>
                   <line x1="96"  y1="110" x2="86" y2="140" stroke="#333" stroke-width="7" stroke-linecap="round"/>
                   <line x1="96"  y1="110" x2="105" y2="140" stroke="#333" stroke-width="7" stroke-linecap="round"/>`,
    CATTLE:       `<ellipse cx="100" cy="108" rx="32" ry="18" fill="#555"/>
                   <ellipse cx="132" cy="102" rx="14" ry="11" fill="#555"/>
                   <line x1="78"  y1="126" x2="74"  y2="155" stroke="#555" stroke-width="7" stroke-linecap="round"/>
                   <line x1="92"  y1="126" x2="90"  y2="155" stroke="#555" stroke-width="7" stroke-linecap="round"/>
                   <line x1="108" y1="126" x2="110" y2="155" stroke="#555" stroke-width="7" stroke-linecap="round"/>
                   <line x1="122" y1="126" x2="126" y2="155" stroke="#555" stroke-width="7" stroke-linecap="round"/>
                   <line x1="143" y1="97" x2="148" y2="78"  stroke="#555" stroke-width="5" stroke-linecap="round"/>
                   <line x1="140" y1="95" x2="152" y2="82"  stroke="#555" stroke-width="5" stroke-linecap="round"/>`,
    WILD_ANIMALS: `<ellipse cx="100" cy="112" rx="28" ry="16" fill="#666"/>
                   <ellipse cx="126" cy="100" rx="12" ry="10" fill="#666"/>
                   <line x1="126" y1="90" x2="120" y2="68" stroke="#666" stroke-width="6" stroke-linecap="round"/>
                   <line x1="130" y1="92" x2="138" y2="70" stroke="#666" stroke-width="6" stroke-linecap="round"/>
                   <line x1="130" y1="94" x2="148" y2="78" stroke="#666" stroke-width="5" stroke-linecap="round"/>
                   <line x1="78"  y1="128" x2="74"  y2="155" stroke="#666" stroke-width="6" stroke-linecap="round"/>
                   <line x1="90"  y1="128" x2="88"  y2="155" stroke="#666" stroke-width="6" stroke-linecap="round"/>
                   <line x1="108" y1="128" x2="112" y2="155" stroke="#666" stroke-width="6" stroke-linecap="round"/>
                   <line x1="120" y1="128" x2="124" y2="155" stroke="#666" stroke-width="6" stroke-linecap="round"/>`,
    HORSE:        `<ellipse cx="100" cy="105" rx="28" ry="14" fill="#666"/>
                   <ellipse cx="126" cy="95"  rx="12" ry="9"  fill="#666"/>
                   <line x1="136" y1="92" x2="148" y2="72" stroke="#666" stroke-width="7" stroke-linecap="round"/>
                   <line x1="76"  y1="119" x2="72"  y2="148" stroke="#666" stroke-width="6" stroke-linecap="round"/>
                   <line x1="88"  y1="119" x2="86"  y2="148" stroke="#666" stroke-width="6" stroke-linecap="round"/>
                   <line x1="108" y1="119" x2="112" y2="148" stroke="#666" stroke-width="6" stroke-linecap="round"/>
                   <line x1="120" y1="119" x2="122" y2="148" stroke="#666" stroke-width="6" stroke-linecap="round"/>`,
  };

  // ---- prohibitory symbols ----
  const P_SYM = {
    P:              `<text x="100" y="126" font-family="Arial,sans-serif" font-size="100" font-weight="bold" fill="#1565C0" text-anchor="middle">P</text>`,
    DOUBLE_BAR:     `<rect x="46" y="76"  width="108" height="14" rx="3" fill="#333"/>
                     <rect x="46" y="110" width="108" height="14" rx="3" fill="#333"/>`,
    U_TURN:         `<path d="M70,150 L70,80 C70,44 130,44 130,80 L130,130" stroke="#333" stroke-width="12" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                     <polygon points="130,150 117,127 143,127" fill="#333"/>`,
    LEFT_TURN:      `<path d="M125,152 L125,82 Q125,56 100,56 L66,56" stroke="#333" stroke-width="12" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                     <polygon points="50,56 72,43 72,69" fill="#333"/>`,
    RIGHT_TURN:     `<path d="M75,152 L75,82 Q75,56 100,56 L134,56" stroke="#333" stroke-width="12" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                     <polygon points="150,56 128,43 128,69" fill="#333"/>`,
    ALL_VEHICLES:   `<rect x="50" y="82" width="30" height="18" rx="4" fill="#333"/>
                     <rect x="56" y="74" width="18" height="10" rx="3" fill="#333"/>
                     <circle cx="57" cy="102" r="6" fill="#555"/>
                     <circle cx="74" cy="102" r="6" fill="#555"/>
                     <rect x="120" y="82" width="30" height="18" rx="4" fill="#333"/>
                     <rect x="126" y="74" width="18" height="10" rx="3" fill="#333"/>
                     <circle cx="127" cy="102" r="6" fill="#555"/>
                     <circle cx="144" cy="102" r="6" fill="#555"/>`,
    MOTOR_VEHICLE:  `<rect x="52" y="88" width="96" height="30" rx="8" fill="#333"/>
                     <rect x="64" y="72" width="72" height="20" rx="6" fill="#333"/>
                     <circle cx="72"  cy="120" r="10" fill="#555"/>
                     <circle cx="128" cy="120" r="10" fill="#555"/>`,
    MOTORCYCLE:     `<circle cx="72"  cy="112" r="18" fill="none" stroke="#333" stroke-width="7"/>
                     <circle cx="128" cy="112" r="18" fill="none" stroke="#333" stroke-width="7"/>
                     <line x1="72"  y1="112" x2="100" y2="88" stroke="#333" stroke-width="6" stroke-linecap="round"/>
                     <line x1="100" y1="88"  x2="128" y2="112" stroke="#333" stroke-width="6" stroke-linecap="round"/>
                     <line x1="100" y1="88"  x2="96"  y2="68"  stroke="#333" stroke-width="6" stroke-linecap="round"/>
                     <circle cx="96" cy="60" r="8" fill="#333"/>`,
    TRUCK:          `<rect x="38" y="88" width="92" height="36" rx="4" fill="#333"/>
                     <rect x="118" y="73" width="24" height="18" rx="4" fill="#333"/>
                     <circle cx="58"  cy="128" r="9" fill="#555"/>
                     <circle cx="100" cy="128" r="9" fill="#555"/>
                     <circle cx="128" cy="128" r="9" fill="#555"/>`,
    BUS:            `<rect x="48" y="68" width="104" height="64" rx="6" fill="#333"/>
                     <rect x="56" y="78" width="18" height="14" rx="2" fill="#666"/>
                     <rect x="80" y="78" width="18" height="14" rx="2" fill="#666"/>
                     <rect x="104" y="78" width="18" height="14" rx="2" fill="#666"/>
                     <circle cx="68"  cy="136" r="9" fill="#555"/>
                     <circle cx="132" cy="136" r="9" fill="#555"/>`,
    MINIBUS:        `<rect x="50" y="75" width="100" height="52" rx="6" fill="#333"/>
                     <rect x="58" y="84" width="16" height="12" rx="2" fill="#666"/>
                     <rect x="80" y="84" width="16" height="12" rx="2" fill="#666"/>
                     <rect x="102" y="84" width="16" height="12" rx="2" fill="#666"/>
                     <circle cx="68"  cy="130" r="8" fill="#555"/>
                     <circle cx="132" cy="130" r="8" fill="#555"/>`,
    ANIMAL_DRAWN:   `<rect x="52" y="92" width="52" height="36" rx="4" fill="#333"/>
                     <circle cx="65"  cy="132" r="12" fill="none" stroke="#333" stroke-width="5"/>
                     <circle cx="95"  cy="132" r="12" fill="none" stroke="#333" stroke-width="5"/>
                     <line x1="52"  y1="110" x2="108" y2="105" stroke="#333" stroke-width="5" stroke-linecap="round"/>
                     <ellipse cx="130" cy="100" rx="22" ry="12" fill="#333"/>
                     <circle cx="152" cy="90"  r="9"  fill="#333"/>
                     <line x1="120" y1="112" x2="114" y2="132" stroke="#333" stroke-width="4" stroke-linecap="round"/>
                     <line x1="130" y1="112" x2="128" y2="132" stroke="#333" stroke-width="4" stroke-linecap="round"/>
                     <line x1="140" y1="112" x2="142" y2="132" stroke="#333" stroke-width="4" stroke-linecap="round"/>`,
    BICYCLE:        `<circle cx="72"  cy="112" r="20" fill="none" stroke="#333" stroke-width="7"/>
                     <circle cx="128" cy="112" r="20" fill="none" stroke="#333" stroke-width="7"/>
                     <line x1="100" y1="112" x2="128" y2="112" stroke="#333" stroke-width="5" stroke-linecap="round"/>
                     <line x1="100" y1="112" x2="72"  y2="112" stroke="#333" stroke-width="5" stroke-linecap="round"/>
                     <line x1="100" y1="112" x2="112" y2="88"  stroke="#333" stroke-width="5" stroke-linecap="round"/>
                     <line x1="100" y1="112" x2="90"  y2="85"  stroke="#333" stroke-width="5" stroke-linecap="round"/>
                     <line x1="90"  y1="85"  x2="112" y2="88"  stroke="#333" stroke-width="5" stroke-linecap="round"/>
                     <line x1="118" y1="86"  x2="130" y2="88"  stroke="#333" stroke-width="5" stroke-linecap="round"/>
                     <line x1="85"  y1="82"  x2="98"  y2="82"  stroke="#333" stroke-width="5" stroke-linecap="round"/>`,
    PEDESTRIAN_SIL: `<circle cx="100" cy="72" r="9"  fill="#333"/>
                     <line x1="100" y1="81"  x2="98"  y2="116" stroke="#333" stroke-width="8"  stroke-linecap="round"/>
                     <line x1="99"  y1="92"  x2="78"  y2="108" stroke="#333" stroke-width="7"  stroke-linecap="round"/>
                     <line x1="99"  y1="95"  x2="118" y2="104" stroke="#333" stroke-width="7"  stroke-linecap="round"/>
                     <line x1="98"  y1="116" x2="82"  y2="143" stroke="#333" stroke-width="7"  stroke-linecap="round"/>
                     <line x1="98"  y1="116" x2="112" y2="143" stroke="#333" stroke-width="7"  stroke-linecap="round"/>`,
    OVERTAKING:     `<rect x="54" y="76" width="36" height="54" rx="5" fill="#333"/>
                     <rect x="60" y="66" width="24" height="14" rx="4" fill="#333"/>
                     <circle cx="62" cy="132" r="7" fill="#555"/>
                     <circle cx="82" cy="132" r="7" fill="#555"/>
                     <rect x="94" y="86" width="36" height="54" rx="5" fill="#CC0000"/>
                     <rect x="100" y="76" width="24" height="14" rx="4" fill="#CC0000"/>
                     <circle cx="102" cy="142" r="7" fill="#a93226"/>
                     <circle cx="122" cy="142" r="7" fill="#a93226"/>`,
  };

  // ---- mandatory symbols ----
  const M = {
    STRAIGHT:       `<polygon points="100,30 144,88 56,88" fill="white"/>
                     <rect x="88" y="86" width="24" height="78" fill="white" rx="3"/>`,
    LEFT:           `<path d="M125,158 L125,80 Q125,52 100,52 L62,52" stroke="white" stroke-width="14" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                     <polygon points="44,52 68,38 68,66" fill="white"/>`,
    RIGHT:          `<path d="M75,158 L75,80 Q75,52 100,52 L138,52" stroke="white" stroke-width="14" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                     <polygon points="156,52 132,38 132,66" fill="white"/>`,
    STRAIGHT_LEFT:  `<rect x="88" y="85" width="24" height="80" fill="white" rx="2"/>
                     <polygon points="100,30 128,82 72,82" fill="white"/>
                     <rect x="30" y="90" width="60" height="22" fill="white" rx="2"/>
                     <polygon points="18,101 46,80 46,122" fill="white"/>`,
    STRAIGHT_RIGHT: `<rect x="88" y="85" width="24" height="80" fill="white" rx="2"/>
                     <polygon points="100,30 128,82 72,82" fill="white"/>
                     <rect x="110" y="90" width="60" height="22" fill="white" rx="2"/>
                     <polygon points="182,101 154,80 154,122" fill="white"/>`,
    LEFT_RIGHT:     `<rect x="88" y="92" width="24" height="62" fill="white" rx="2"/>
                     <rect x="28" y="92" width="62" height="22" fill="white" rx="2"/>
                     <polygon points="16,103 44,82 44,124" fill="white"/>
                     <rect x="110" y="92" width="62" height="22" fill="white" rx="2"/>
                     <polygon points="184,103 156,82 156,124" fill="white"/>`,
    KEEP_LEFT:      `<path d="M140,158 L140,88 Q140,50 80,50 L55,50" stroke="white" stroke-width="14" fill="none" stroke-linecap="round"/>
                     <polygon points="40,50 62,36 62,64" fill="white"/>`,
    KEEP_RIGHT:     `<path d="M60,158 L60,88 Q60,50 120,50 L145,50" stroke="white" stroke-width="14" fill="none" stroke-linecap="round"/>
                     <polygon points="160,50 138,36 138,64" fill="white"/>`,
    ROUNDABOUT:     `<path d="M55,100 A45,45 0 1,1 100,145" stroke="white" stroke-width="13" fill="none" stroke-linecap="round"/>
                     <polygon points="100,145 86,126 116,130" fill="white"/>`,
  };

  // ================================================================
  //  RENDER DISPATCH
  // ================================================================
  switch (r.type) {

    case 'STOP':
      return wrap(`
        <polygon points="62,8 138,8 192,62 192,138 138,192 62,192 8,138 8,62" fill="#CC0000"/>
        <polygon points="68,16 132,16 184,68 184,132 132,184 68,184 16,132 16,68" fill="none" stroke="white" stroke-width="4"/>
        <text x="100" y="120" font-family="Arial Black,sans-serif" font-size="44" font-weight="900" fill="white" text-anchor="middle">STOP</text>
      `);

    case 'YIELD':
      return wrap(`
        <polygon points="4,18 196,18 100,192" fill="#CC0000"/>
        <polygon points="18,30 182,30 100,176" fill="white"/>
        <text x="100" y="118" font-family="Arial,sans-serif" font-size="26" font-weight="bold" fill="#CC0000" text-anchor="middle">YIELD</text>
      `);

    case 'NO_ENTRY':
      return wrap(`
        <circle cx="100" cy="100" r="92" fill="#CC0000"/>
        <circle cx="100" cy="100" r="92" fill="none" stroke="white" stroke-width="5"/>
        <rect x="22" y="82" width="156" height="36" rx="4" fill="white"/>
      `);

    case 'SPEED_LIMIT': {
      const v  = r.value || '60';
      const fs = v.length > 2 ? 62 : 80;
      const y  = v.length > 2 ? 122 : 128;
      return wrap(`
        <circle cx="100" cy="100" r="92" fill="white" stroke="#CC0000" stroke-width="16"/>
        <text x="100" y="${y}" font-family="Arial,sans-serif" font-size="${fs}" font-weight="bold" fill="#111" text-anchor="middle">${v}</text>
      `);
    }

    case 'MINIMUM_SPEED': {
      const v = r.value || '40';
      return wrap(`
        <circle cx="100" cy="100" r="92" fill="#1565C0"/>
        <text x="100" y="118" font-family="Arial,sans-serif" font-size="72" font-weight="bold" fill="white" text-anchor="middle">${v}</text>
        <rect x="50" y="128" width="100" height="6" fill="white" rx="3"/>
      `);
    }

    case 'DERESTRICTION':
      return wrap(`
        <circle cx="100" cy="100" r="92" fill="white" stroke="#666" stroke-width="6"/>
        <line x1="40" y1="160" x2="160" y2="40" stroke="#666" stroke-width="10" stroke-linecap="round"/>
      `);

    case 'END_NO_OVERTAKING':
      return wrap(`
        <circle cx="100" cy="100" r="92" fill="white" stroke="#666" stroke-width="6"/>
        <rect x="54" y="76" width="36" height="54" rx="5" fill="#888"/>
        <rect x="94" y="86" width="36" height="54" rx="5" fill="#888"/>
        <line x1="40" y1="160" x2="160" y2="40" stroke="#666" stroke-width="10" stroke-linecap="round"/>
      `);

    case 'PROHIBITORY':
      return prohibition(P_SYM[r.symbol] || '');

    case 'MANDATORY_CIRCLE':
      return mandatory(M[r.symbol] || '');

    case 'WARNING_TRIANGLE':
      return triangle(W[r.symbol] || '');

    case 'GUIDANCE_RECT': {
      const bg   = r.color || '#1565C0';
      const txt  = r.text  || '?';
      const fs   = txt.length > 2 ? 38 : txt.length > 1 ? 52 : 120;
      const ty   = txt.length > 2 ? 118 : txt.length > 1 ? 126 : 152;
      return wrap(`
        <rect x="8" y="8" width="184" height="184" rx="12" fill="${bg}"/>
        <text x="100" y="${ty}" font-family="Arial,sans-serif" font-size="${fs}" font-weight="bold" fill="white" text-anchor="middle">${txt}</text>
      `);
    }

    case 'ROUTE_MARKER': {
      const bg  = r.bg     || '#1B5E20';
      const pre = r.prefix || 'N';
      const num = r.num    || '1';
      return wrap(`
        <circle cx="100" cy="100" r="92" fill="${bg}"/>
        <circle cx="100" cy="100" r="92" fill="none" stroke="white" stroke-width="6"/>
        <text x="100" y="76"  font-family="Arial,sans-serif" font-size="20" font-weight="bold" fill="white" text-anchor="middle">${pre === 'N' ? 'NATIONAL' : pre === 'R' ? 'REGIONAL' : 'METRO'}</text>
        <text x="100" y="96"  font-family="Arial,sans-serif" font-size="20" font-weight="bold" fill="white" text-anchor="middle">ROUTE</text>
        <text x="100" y="152" font-family="Arial,sans-serif" font-size="66" font-weight="bold" fill="white" text-anchor="middle">${pre}${num}</text>
      `);
    }

    case 'ONE_WAY': {
      const left = r.dir === 'LEFT';
      return wrap(`
        <rect x="8" y="8" width="184" height="184" rx="12" fill="#333"/>
        <polygon points="${left ? '60,100 130,60 130,140' : '140,100 70,60 70,140'}" fill="white"/>
        <rect x="${left ? '50' : '70'}" y="88" width="60" height="24" fill="white" rx="3"/>
      `);
    }

    default:
      return wrap(`
        <rect x="8" y="8" width="184" height="184" rx="10" fill="#f0f4f8" stroke="#d0d8e4" stroke-width="4" stroke-dasharray="8,4"/>
        <text x="100" y="90"  font-family="Arial,sans-serif" font-size="30" font-weight="bold" fill="#2c3e50" text-anchor="middle">${sign.code || '?'}</text>
        <text x="100" y="118" font-family="Arial,sans-serif" font-size="13" fill="#7f8c9a" text-anchor="middle">${(sign.name || '').slice(0,22)}</text>
      `);
  }
}

// ============================================
//  SIGN IMAGE — inline SVG (no HTTP request)
// ============================================

function buildSignImage(sign) {
  const wrap = document.createElement('div');
  wrap.className = 'sign-image-wrap';
  const inner = document.createElement('div');
  inner.className = 'sign-svg-container';
  inner.innerHTML = createSignSVG(sign);
  wrap.appendChild(inner);
  return wrap;
}

// ============================================
//  SIGN QUESTIONS — generated from signsData
// ============================================

function generateSignQuestions(signsData) {
  const allSubcats = [...new Set(signsData.map(s => s.subCategory))];

  const firstLine = (desc) => {
    const dot = desc.indexOf('.');
    return dot > -1 ? desc.slice(0, dot + 1) : desc;
  };

  // Shuffle and track answer position safely
  function makeOptions(correctVal, wrongVals) {
    const items    = [{ v: correctVal, correct: true },
                      ...wrongVals.map(v => ({ v, correct: false }))];
    const shuffled = shuffle(items);
    return {
      options: shuffled.map(i => i.v),
      answer:  shuffled.findIndex(i => i.correct),
    };
  }

  // Distractor priority: same sub-category → same category → all signs.
  // Same sub-category distractors are the hardest and most educational:
  // speed limits get other speed limits, curve signs get other curve signs, etc.
  function bestPool(sign) {
    const others  = signsData.filter(s => s.id !== sign.id);
    const sameSub = others.filter(s => s.subCategory === sign.subCategory);
    const sameCat = others.filter(s => s.category    === sign.category);
    return sameSub.length >= 3 ? sameSub
         : sameCat.length >= 3 ? sameCat
         : others;
  }

  const all = [];

  signsData.forEach(sign => {
    const pool = bestPool(sign);

    const base = {
      category:     'signs',
      signId:       sign.id,
      signCode:     sign.code,
      signName:     sign.name,
      signCategory: sign.category,
      signRender:   sign.render,
    };

    // ── Q1: Name — distractors from the same sub-category ────────────
    // e.g. "Speed Limit 60" vs "Speed Limit 80 / 100 / 120"
    // e.g. "Sharp Curve Right" vs "Sharp Curve Left / Winding / Descent"
    {
      const { options, answer } = makeOptions(
        sign.name,
        pickRandom(pool, 3).map(s => s.name)
      );
      all.push({ ...base, question: 'What is this road sign called?', options, answer,
                 explanation: sign.description });
    }

    // ── Q2: Meaning — first sentences from same sub-category ─────────
    // Forces careful reading: "max speed is 60" vs "max speed is 80 / 100 / 120"
    {
      const correct = firstLine(sign.description);
      const { options, answer } = makeOptions(
        correct,
        pickRandom(pool, 3).map(s => firstLine(s.description))
      );
      all.push({ ...base, question: 'What does this road sign mean?', options, answer,
                 explanation: `${sign.name} (${sign.code}): ${sign.description}` });
    }

    // ── Q3: Classification — wrong sub-cats from the same main category
    // e.g. Regulatory sign → "Prohibitory / Speed Limits / Control / Mandatory Direction"
    {
      const sameCatSubs = [...new Set(
        signsData
          .filter(s => s.category === sign.category && s.subCategory !== sign.subCategory)
          .map(s => s.subCategory)
      )];
      const subPool = sameCatSubs.length >= 3 ? sameCatSubs
                    : allSubcats.filter(s => s !== sign.subCategory);

      const { options, answer } = makeOptions(sign.subCategory, pickRandom(subPool, 3));
      all.push({ ...base, question: 'Under which sub-category of road sign does this fall?',
                 options, answer,
                 explanation: `This is a "${sign.subCategory}" sign — part of the ${sign.category} signs group.` });
    }
  });

  return all;
}

// ============================================
//  SIGN LIBRARY
// ============================================

let _allSignsData = [];
let _libFilter    = 'All';

function buildSignLibrary(signsData) {
  _allSignsData = signsData;

  // Filter buttons
  const filterBar = document.getElementById('signLibFilters');
  filterBar.innerHTML = '';
  const cats = ['All', 'Regulatory', 'Warning', 'Guidance'];
  cats.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'filter-btn' + (cat === 'All' ? ' active' : '');
    btn.textContent = cat;
    btn.addEventListener('click', () => {
      document.querySelectorAll('#signLibFilters .filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      _libFilter = cat;
      renderSignGrid();
    });
    filterBar.appendChild(btn);
  });

  renderSignGrid();
}

function renderSignGrid() {
  const grid = document.getElementById('signLibGrid');
  grid.innerHTML = '';
  const signs = _libFilter === 'All'
    ? _allSignsData
    : _allSignsData.filter(s => s.category === _libFilter);

  signs.forEach(sign => {
    const card = document.createElement('div');
    card.className = 'sign-lib-card';
    card.innerHTML = createSignSVG(sign) +
      `<span class="slc-code">${sign.code}</span>` +
      `<span class="slc-name">${sign.name}</span>`;
    card.addEventListener('click', () => openSignDetail(sign));
    grid.appendChild(card);
  });
}

function openSignDetail(sign) {
  document.getElementById('signDetailImg').innerHTML  = createSignSVG(sign);
  document.getElementById('signDetailCode').textContent = sign.code;
  document.getElementById('signDetailName').textContent = sign.name;
  document.getElementById('signDetailSub').textContent  = `${sign.category} — ${sign.subCategory}`;
  document.getElementById('signDetailDesc').textContent = sign.description;
  document.getElementById('signDetailOverlay').style.display = 'flex';
}

function closeSignDetail() {
  document.getElementById('signDetailOverlay').style.display = 'none';
}

// ============================================
//  FILTER BAR (quiz tabs)
// ============================================

function buildFilterBar() {
  const bar = document.getElementById('filterBar');
  bar.innerHTML = '';
  Object.keys(EXAM_PROFILES).forEach(label => {
    const btn = document.createElement('button');
    btn.className = 'filter-btn' + (label === 'All' ? ' active' : '');
    btn.textContent = label;
    btn.addEventListener('click', () => {
      document.querySelectorAll('#filterBar .filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeTab = label;
      startQuiz();
    });
    bar.appendChild(btn);
  });
}

// ============================================
//  QUIZ
// ============================================

function startQuiz() {
  const profile = EXAM_PROFILES[activeTab];
  let pool = [];
  for (const [cat, count] of Object.entries(profile)) {
    pool = pool.concat(pickRandom(allQuestions[cat] || [], count));
  }
  quizQuestions = shuffle(pool);
  current  = 0;
  score    = 0;
  mistakes = [];
  answered = false;
  document.getElementById('quizArea').style.display    = 'block';
  document.getElementById('scoreScreen').style.display = 'none';
  renderQuestion();
}

function renderQuestion() {
  const q = quizQuestions[current];
  answered = false;

  document.getElementById('progressBar').style.width = `${(current / quizQuestions.length) * 100}%`;
  document.getElementById('qCounter').textContent    = `Question ${current + 1} of ${quizQuestions.length}`;
  document.getElementById('qCategory').textContent   = q.signCategory || CATEGORY_DISPLAY[q.category] || q.category;

  // Sign image (inline SVG, no spinner needed)
  const existingSign = document.getElementById('signImageContainer');
  if (existingSign) existingSign.remove();
  const existingControl = document.getElementById('controlImageContainer');
  if (existingControl) existingControl.remove();

  if (q.signRender) {
    const wrap = buildSignImage({ render: q.signRender, code: q.signCode, name: q.signName });
    wrap.id = 'signImageContainer';
    const qTextEl = document.getElementById('qText');
    qTextEl.parentNode.insertBefore(wrap, qTextEl);
  }

  // Control diagram image (vehicle controls identification)
  if (q.image && q.imageLabel) {
    const imgWrap = document.createElement('div');
    imgWrap.id = 'controlImageContainer';
    imgWrap.style.cssText = 'margin-bottom:1.25rem;text-align:center;';

    const img = document.createElement('img');
    img.src = q.image;
    img.alt = q.imageLabel;
    img.style.cssText = 'max-width:100%;max-height:280px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.1);';

    imgWrap.appendChild(img);
    const qTextEl = document.getElementById('qText');
    qTextEl.parentNode.insertBefore(imgWrap, qTextEl);
  }

  document.getElementById('qText').textContent = q.question;

  const optionsEl = document.getElementById('options');
  optionsEl.innerHTML = '';
  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className   = 'option-btn';
    btn.textContent = normalizeOption(opt);
    btn.addEventListener('click', () => selectAnswer(i, q));
    optionsEl.appendChild(btn);
  });

  const expEl = document.getElementById('explanation');
  expEl.textContent = '';
  expEl.classList.remove('visible');

  document.getElementById('nextBtn').disabled      = true;
  document.getElementById('nextBtn').style.opacity = '0.4';
}

function selectAnswer(selected, q) {
  if (answered) return;
  answered = true;

  document.querySelectorAll('.option-btn').forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.answer)      btn.classList.add('correct');
    else if (i === selected) btn.classList.add('wrong');
  });

  if (selected === q.answer) {
    score++;
  } else {
    mistakes.push({ q, chosen: selected });
  }

  if (q.explanation) {
    const expEl = document.getElementById('explanation');
    expEl.textContent = '💡 ' + q.explanation;
    expEl.classList.add('visible');
  }

  document.getElementById('nextBtn').disabled      = false;
  document.getElementById('nextBtn').style.opacity = '1';
}

function nextQuestion() {
  current++;
  if (current >= quizQuestions.length) showScore();
  else renderQuestion();
}

// ============================================
//  SCORE SCREEN
// ============================================

function showScore() {
  document.getElementById('quizArea').style.display    = 'none';
  document.getElementById('scoreScreen').style.display = 'block';

  const pct  = Math.round((score / quizQuestions.length) * 100);
  const pass = pct >= 75;

  const circle = document.getElementById('scoreCircle');
  circle.className = 'score-circle ' + (pass ? 'score-pass' : 'score-fail');
  circle.innerHTML = `<span class="big">${pct}%</span><span class="label">${score}/${quizQuestions.length}</span>`;

  document.getElementById('scoreTitle').textContent = pass ? 'Well done!' : 'Keep studying!';
  document.getElementById('scoreMsg').textContent   = pass
    ? `You passed with ${pct}% — above the 75% pass mark. You're on track for the real K53 test.`
    : `You scored ${pct}%. The pass mark is 75%. Review your mistakes below and try again.`;

  // Track progress
  const categoryScores = { signVisual: { correct: 0, total: 0, percentage: 0 }, rules: { correct: 0, total: 0, percentage: 0 }, controls: { correct: 0, total: 0, percentage: 0 } };
  quizQuestions.forEach((q, idx) => {
    const isCorrect = !mistakes.some(m => m.q === q && m.chosen !== q.answer);
    const cat = q.category;
    if (categoryScores[cat]) {
      categoryScores[cat].total++;
      if (isCorrect) categoryScores[cat].correct++;
    }
  });
  Object.keys(categoryScores).forEach(cat => {
    if (categoryScores[cat].total > 0) {
      categoryScores[cat].percentage = Math.round((categoryScores[cat].correct / categoryScores[cat].total) * 100);
    }
  });
  tracker.recordAttempt(score, quizQuestions.length, activeTab, categoryScores);

  buildMistakesList();
}

function buildMistakesList() {
  const existing = document.getElementById('mistakesList');
  if (existing) existing.remove();
  if (!mistakes.length) return;

  const container = document.createElement('div');
  container.id = 'mistakesList';
  container.style.cssText = 'margin-top:1.5rem;text-align:left;max-height:460px;overflow-y:auto;';

  const heading = document.createElement('h3');
  heading.textContent = `Questions you got wrong (${mistakes.length})`;
  heading.style.cssText = 'margin-bottom:0.75rem;font-size:1rem;color:#5d6d7e;';
  container.appendChild(heading);

  mistakes.forEach(({ q, chosen }) => {
    const item = document.createElement('div');
    item.style.cssText = 'background:#f8f9fa;border-radius:8px;padding:0.85rem 1rem;margin-bottom:0.75rem;border-left:4px solid #e74c3c;';

    // Thumbnail for sign questions
    if (q.signRender) {
      const thumb = document.createElement('div');
      thumb.style.cssText = 'float:right;margin-left:0.75rem;';
      thumb.innerHTML = createSignSVG({ render: q.signRender, code: q.signCode, name: q.signName });
      thumb.querySelector('svg').style.cssText = 'width:52px;height:52px;';
      item.appendChild(thumb);
    }

    const meta = q.signCode
      ? `<span style="font-size:0.75rem;background:#e8edf3;padding:2px 7px;border-radius:4px;display:inline-block;margin-bottom:0.3rem;">${q.signCode} — ${q.signCategory}</span><br>`
      : '';
    const qText = document.createElement('p');
    qText.style.cssText = 'font-weight:600;margin-bottom:0.4rem;font-size:0.9rem;';
    qText.innerHTML = meta + q.question;

    const wrongLine = document.createElement('p');
    wrongLine.style.cssText = 'color:#a93226;font-size:0.85rem;margin-bottom:0.2rem;';
    wrongLine.textContent = '✗ Your answer: ' + normalizeOption(q.options[chosen]);

    const correctLine = document.createElement('p');
    correctLine.style.cssText = 'color:#1a7a47;font-size:0.85rem;';
    correctLine.textContent = '✓ Correct: ' + normalizeOption(q.options[q.answer]);

    item.appendChild(qText);
    item.appendChild(wrongLine);
    item.appendChild(correctLine);
    container.appendChild(item);
  });

  document.getElementById('scoreScreen').appendChild(container);
}

// ============================================
//  VEHICLE CONTROLS REFERENCE
// ============================================

const vehicleControls = [
  {
    number: 1,
    name: "Indicator/Warning Lights",
    location: "Dashboard (center-top)",
    function: "Displays warning and indicator lights to alert you to vehicle problems and system status",
    usage: [
      "Monitor lights during startup and while driving",
      "Red lights indicate serious problems — stop safely immediately",
      "Amber/yellow lights indicate caution or service needed",
      "Green/blue lights show activated systems (lights, wipers, etc.)"
    ],
    safety: "Never ignore warning lights. They alert you to engine, brake, electrical, or cooling problems that could cause accidents.",
    maintenance: "Check dashboard regularly; have warning light issues diagnosed immediately by a mechanic."
  },
  {
    number: 2,
    name: "Turn Indicator/Signal Stalk",
    location: "Left side of steering wheel",
    function: "Signals your intention to turn or change lanes to other road users",
    usage: [
      "Push down to signal left turn",
      "Push up to signal right turn",
      "Signal at least 30 meters before turning",
      "Release stalk after completing the turn"
    ],
    safety: "Failure to signal is illegal. Always signal your intentions — it gives others time to react and prevents accidents.",
    maintenance: "Check that lights blink correctly. Rapid blinking indicates a burned-out bulb that needs replacement."
  },
  {
    number: 3,
    name: "Gear Shift Lever",
    location: "Center console (between driver and passenger)",
    function: "Selects the transmission gear (P, R, N, D, L) to control vehicle movement",
    usage: [
      "P (Park) — when stopped or parked; brake pedal must be pressed to shift out",
      "R (Reverse) — for backing up",
      "N (Neutral) — engine running but not driving (rare use)",
      "D (Drive) — normal forward driving",
      "L (Low) — for steep hills or towing; provides engine braking"
    ],
    safety: "Always place in Park and set handbrake before leaving the vehicle. Never shift gears while accelerating.",
    maintenance: "Shift smoothly; jerky shifting damages transmission. Service automatic transmission fluid every 100,000 km."
  },
  {
    number: 4,
    name: "Handbrake/Parking Brake",
    location: "Between driver seat and center console (or electronic button/switch)",
    function: "Holds the vehicle stationary when parked, especially on slopes",
    usage: [
      "Engage when parking to prevent rolling",
      "On steep slopes, turn steering wheel toward curb for extra safety",
      "Release before driving (red warning light disappears)",
      "For manual cars, can assist in emergency braking"
    ],
    safety: "Always use the handbrake. It's your backup if foot brakes fail. A slipping handbrake is a safety hazard.",
    maintenance: "Have handbrake tension checked annually. If it slips, service cables and brake shoes immediately."
  },
  {
    number: 5,
    name: "Clutch Pedal",
    location: "Far left pedal (manual transmission vehicles only)",
    function: "Disconnects engine from transmission to allow smooth gear changes",
    usage: [
      "Press fully down before changing gears",
      "Release smoothly while applying accelerator to avoid stalling",
      "Never rest foot on it while driving — causes premature wear",
      "In hill starts, use clutch bite point to hold vehicle"
    ],
    safety: "Smooth clutch control prevents jerky movements that could cause accidents. Abrupt releases can cause stalling.",
    maintenance: "Don't ride the clutch. Excessive wear requires expensive replacement (R3,000-8,000). Check clutch play regularly."
  },
  {
    number: 6,
    name: "Brake Pedal",
    location: "Center pedal (all vehicles)",
    function: "Applies brakes to slow down or stop the vehicle",
    usage: [
      "Apply smooth, progressive pressure for normal braking",
      "In emergencies, press firmly but maintain steering control",
      "Light braking in wet/slippery conditions to prevent skidding",
      "Avoid riding the brake pedal (keeping foot resting on it)"
    ],
    safety: "Most important control for safety. Never press brake and accelerator simultaneously. Soft/mushy pedal indicates system fault — stop safely immediately.",
    maintenance: "Check brakes every 10,000-15,000 km. Replace pads before they grind (which damages rotors). Brake failure requires emergency stop."
  },
  {
    number: 7,
    name: "Accelerator/Gas Pedal",
    location: "Right pedal (all vehicles)",
    function: "Controls engine speed and vehicle speed",
    usage: [
      "Use smooth, gradual pressure for steady acceleration",
      "Avoid sudden acceleration which causes jerking and instability",
      "For fuel economy, accelerate slowly and maintain steady speed",
      "Release gradually to decelerate (coasting)"
    ],
    safety: "Sudden acceleration can cause loss of traction, skidding, and accidents. Smooth control is always safer and more efficient.",
    maintenance: "A stuck accelerator is dangerous — do NOT drive. Never use heavy throttle in low gear or it damages the engine."
  },
  {
    number: 8,
    name: "Sun Visor & Interior Lights",
    location: "Top center of windscreen (sun visor); ceiling lights throughout cabin",
    function: "Blocks sunlight from driver's eyes; provides interior cabin lighting",
    usage: [
      "Lower visor to reduce glare from sun or reflected light",
      "Rotate to side windows for side glare",
      "Flip down mirror for cosmetic use",
      "Use interior lights for cabin visibility when parked or at night"
    ],
    safety: "Adjust visor before driving, not while moving. Never obstruct forward vision. Interior lights help see passengers and check instruments.",
    maintenance: "Check visor mounting. Interior lights should work for night visibility and safety."
  },
  {
    number: 9,
    name: "Door Handles",
    location: "Outside and inside each vehicle door",
    function: "Opens and closes vehicle doors for entering and exiting",
    usage: [
      "Pull outside handle to open door (use before entering)",
      "Push inside handle to exit vehicle",
      "Ensure door is fully closed before driving (listen for click)",
      "Always check mirrors/blind spots before opening door on road"
    ],
    safety: "Check for approaching vehicles/cyclists before opening door to prevent 'dooring' accidents. Never open doors while driving.",
    maintenance: "Ensure all doors lock and close properly. Stuck/damaged handles are safety hazards and should be repaired immediately."
  },
  {
    number: 10,
    name: "Window & Door Lock Controls",
    location: "Driver's door armrest (power windows); buttons/switches on door (locks)",
    function: "Opens/closes windows and locks/unlocks all vehicle doors electronically",
    usage: [
      "Lock all doors immediately after entering vehicle and before driving",
      "Use child locks on rear doors to prevent children exiting while moving",
      "Power windows allow one-handed operation while driving",
      "Unlock doors only when parked or safe"
    ],
    safety: "Always lock doors while driving for security and safety. Electronic locks may fail — know how to unlock manually in emergencies.",
    maintenance: "Check that all windows seal properly and locks engage firmly. Power window motors can fail and require replacement (R2,000-5,000)."
  },
  {
    number: 11,
    name: "Wiper & Washer Controls",
    location: "Right side of steering wheel (stalk)",
    function: "Cleans windscreen with wipers and washer fluid for visibility and safety",
    usage: [
      "Intermittent — light drizzle or periodic cleaning",
      "Slow — light rain with steady precipitation",
      "Fast — heavy rain requiring continuous wiping",
      "Washer spray — press button/pull lever to spray cleaning fluid"
    ],
    safety: "Maintain clear windscreen visibility in all conditions. Worn wipers leave streaks and reduce visibility, creating safety hazards.",
    maintenance: "Replace wiper blades every 1-2 years (R200-500). Check washer fluid monthly and refill regularly. Worn blades scratch windscreen (R3,000+ replacement)."
  },
  {
    number: 12,
    name: "Horn Pad",
    location: "Center of steering wheel (pad or logo area)",
    function: "Sounds audible warning to alert other road users of your presence or danger",
    usage: [
      "Press to sound horn when warning others of danger",
      "Use in emergencies to avoid collisions",
      "Single tap for polite warning",
      "Avoid excessive honking or aggressive horn use"
    ],
    safety: "Horn is a safety device — use only to warn of danger, not aggressively. Excessive honking is illegal and creates road rage.",
    maintenance: "Test horn regularly for proper function. Non-working horn should be repaired for safety. Fuses and relays may need replacement."
  }
];

function buildVehicleControlsReference() {
  const grid = document.getElementById('controlsGrid');
  grid.innerHTML = '';
  vehicleControls.forEach(control => {
    const card = document.createElement('div');
    card.className = 'study-card';

    const header = document.createElement('div');
    header.className = 'study-card-header';
    header.innerHTML = `<span><strong>#${control.number}</strong> — ${control.name}</span><span class="chevron">▼</span>`;

    const body = document.createElement('div');
    body.className = 'study-card-body';
    body.innerHTML = `
      <p><strong>Location:</strong> ${control.location}</p>
      <p><strong>Function:</strong> ${control.function}</p>
      <p><strong>How to Use:</strong></p>
      <ul style="margin: 0.5rem 0 0.5rem 1.5rem; padding: 0;">
        ${control.usage.map(u => `<li style="margin-bottom: 0.3rem;">${u}</li>`).join('')}
      </ul>
      <p><strong>Safety:</strong> ${control.safety}</p>
      <p><strong>Maintenance:</strong> ${control.maintenance}</p>
    `;

    header.addEventListener('click', () => {
      const open = body.classList.toggle('open');
      header.classList.toggle('open', open);
    });

    card.appendChild(header);
    card.appendChild(body);
    grid.appendChild(card);
  });
}

// ============================================
//  ROAD MARKINGS GUIDE
// ============================================

const roadMarkings = [
  {
    title: "Solid White Center Line",
    meaning: "No Overtaking",
    description: "You are NOT permitted to cross this line to overtake. The road ahead is considered dangerous for passing.",
    svg: `<svg viewBox="0 0 400 120" style="border: 1px solid #ddd; border-radius: 8px;"><rect width="400" height="120" fill="#f9f9f9"/><rect y="55" width="400" height="10" fill="#333"/><line x1="0" y1="70" x2="400" y2="70" stroke="white" stroke-width="6" stroke-dasharray="0"/><text x="10" y="30" font-size="14" font-weight="bold">CENTER LINE</text><text x="10" y="105" font-size="12" fill="#555">Solid = NO overtaking</text></svg>`,
    examples: [
      "Curves or bends in the road",
      "Hills with restricted visibility",
      "Urban residential roads",
      "Roads with history of accidents"
    ]
  },
  {
    title: "Dashed White Center Line",
    meaning: "Overtaking Allowed (if Safe)",
    description: "You MAY overtake if the road ahead is clear and it is safe to do so. Always check for oncoming traffic.",
    svg: `<svg viewBox="0 0 400 120" style="border: 1px solid #ddd; border-radius: 8px;"><rect width="400" height="120" fill="#f9f9f9"/><rect y="55" width="400" height="10" fill="#333"/><line x1="0" y1="70" x2="400" y2="70" stroke="white" stroke-width="6" stroke-dasharray="20,20"/><text x="10" y="30" font-size="14" font-weight="bold">CENTER LINE</text><text x="10" y="105" font-size="12" fill="#555">Dashed = Overtake if safe</text></svg>`,
    examples: [
      "Open country roads",
      "Long straight sections",
      "Roads with good visibility",
      "Rural highways"
    ]
  },
  {
    title: "Double Solid Yellow Center Lines",
    meaning: "No Overtaking Either Direction",
    description: "Neither direction may cross this line. The most restrictive marking used in very dangerous areas.",
    svg: `<svg viewBox="0 0 400 120" style="border: 1px solid #ddd; border-radius: 8px;"><rect width="400" height="120" fill="#f9f9f9"/><rect y="55" width="400" height="10" fill="#333"/><line x1="0" y1="60" x2="400" y2="60" stroke="#FFD700" stroke-width="5"/><line x1="0" y1="80" x2="400" y2="80" stroke="#FFD700" stroke-width="5"/><text x="10" y="30" font-size="14" font-weight="bold">CENTER LINES</text><text x="10" y="105" font-size="12" fill="#555">Double solid = NO passing either way</text></svg>`,
    examples: [
      "Blind curves",
      "Road work zones",
      "Intersections",
      "School zones"
    ]
  },
  {
    title: "Solid Yellow Edge Line",
    meaning: "No Stopping or Parking",
    description: "You cannot stop or park in this zone. The area must be kept clear for traffic flow or emergency access.",
    svg: `<svg viewBox="0 0 400 120" style="border: 1px solid #ddd; border-radius: 8px;"><rect width="400" height="120" fill="#f9f9f9"/><rect y="55" width="400" height="10" fill="#333"/><line x1="5" y1="70" x2="5" y2="85" stroke="#FFD700" stroke-width="6"/><text x="20" y="30" font-size="14" font-weight="bold">EDGE LINE</text><text x="20" y="105" font-size="12" fill="#555">Solid Yellow = NO stopping or parking</text></svg>`,
    examples: [
      "Fire hydrant zones",
      "Hospital entrances",
      "Bus stops",
      "Fire station exits"
    ]
  },
  {
    title: "Dashed Yellow Edge Line",
    meaning: "Limited Parking (30 min)",
    description: "You may park temporarily but not for extended periods. Typically allows 30 minutes maximum.",
    svg: `<svg viewBox="0 0 400 120" style="border: 1px solid #ddd; border-radius: 8px;"><rect width="400" height="120" fill="#f9f9f9"/><rect y="55" width="400" height="10" fill="#333"/><line x1="5" y1="70" x2="5" y2="100" stroke="#FFD700" stroke-width="5" stroke-dasharray="15,10"/><text x="20" y="30" font-size="14" font-weight="bold">EDGE LINE</text><text x="20" y="105" font-size="12" fill="#555">Dashed Yellow = Limited parking (30 min)</text></svg>`,
    examples: [
      "Shopping district zones",
      "Metered parking areas",
      "Loading zones (short-term)",
      "Customer parking"
    ]
  },
  {
    title: "White Lane Markings (Solid)",
    meaning: "Cannot Change Lanes",
    description: "Solid white lines between lanes indicate you must stay in your lane. Lane changes are prohibited.",
    svg: `<svg viewBox="0 0 400 120" style="border: 1px solid #ddd; border-radius: 8px;"><rect width="400" height="120" fill="#f9f9f9"/><rect y="55" width="400" height="10" fill="#333"/><line x1="0" y1="30" x2="400" y2="30" stroke="white" stroke-width="4"/><line x1="0" y1="90" x2="400" y2="90" stroke="white" stroke-width="4"/><line x1="0" y1="60" x2="400" y2="60" stroke="white" stroke-width="6"/><text x="10" y="50" font-size="14" font-weight="bold">LANE MARKINGS</text><text x="10" y="115" font-size="12" fill="#555">Solid = Stay in lane, no changes</text></svg>`,
    examples: [
      "Before highway exits",
      "Turn lanes",
      "Bus lanes",
      "Restricted zones"
    ]
  },
  {
    title: "White Lane Markings (Dashed)",
    meaning: "May Change Lanes (if Safe)",
    description: "Dashed white lines between lanes allow you to change lanes. Always check mirrors and signal.",
    svg: `<svg viewBox="0 0 400 120" style="border: 1px solid #ddd; border-radius: 8px;"><rect width="400" height="120" fill="#f9f9f9"/><rect y="55" width="400" height="10" fill="#333"/><line x1="0" y1="30" x2="400" y2="30" stroke="white" stroke-width="4"/><line x1="0" y1="90" x2="400" y2="90" stroke="white" stroke-width="4"/><line x1="0" y1="60" x2="400" y2="60" stroke="white" stroke-width="3" stroke-dasharray="15,10"/><text x="10" y="50" font-size="14" font-weight="bold">LANE MARKINGS</text><text x="10" y="115" font-size="12" fill="#555">Dashed = May change lanes if safe</text></svg>`,
    examples: [
      "Normal highway driving",
      "Multi-lane roads",
      "Regular traffic zones",
      "Between traffic lanes"
    ]
  },
  {
    title: "Diagonal Hatched Lines",
    meaning: "Do NOT Enter",
    description: "Buffer zones that you must not drive in. These separate traffic or protect hazard areas.",
    svg: `<svg viewBox="0 0 400 120" style="border: 1px solid #ddd; border-radius: 8px;"><rect width="400" height="120" fill="#f9f9f9"/><rect y="55" width="400" height="10" fill="#333"/><line x1="0" y1="35" x2="400" y2="35" stroke="white" stroke-width="3"/><line x1="0" y1="85" x2="400" y2="85" stroke="white" stroke-width="3"/><line x1="0" y1="40" x2="400" y2="80" stroke="white" stroke-width="2" stroke-dasharray="5,5" opacity="0.7"/><line x1="0" y1="50" x2="400" y2="90" stroke="white" stroke-width="2" stroke-dasharray="5,5" opacity="0.7"/><text x="10" y="25" font-size="14" font-weight="bold">HATCHING</text><text x="10" y="115" font-size="12" fill="#555">Diagonal lines = NO ENTRY buffer zone</text></svg>`,
    examples: [
      "Toll plaza separation",
      "Median dividers",
      "Lane divergence zones",
      "Road work areas"
    ]
  },
  {
    title: "White Arrow on Lane",
    meaning: "Mandatory Direction",
    description: "You must follow the arrow's direction in that lane. Turning or changing lanes differently is illegal.",
    svg: `<svg viewBox="0 0 400 120" style="border: 1px solid #ddd; border-radius: 8px;"><rect width="400" height="120" fill="#f9f9f9"/><rect y="55" width="400" height="10" fill="#333"/><polygon points="150,30 200,70 150,110 180,70" fill="white" opacity="0.8"/><text x="220" y="50" font-size="14" font-weight="bold">LANE ARROW</text><text x="220" y="75" font-size="12" fill="#555">Follow the direction</text><text x="10" y="115" font-size="12" fill="#555">Arrow = Mandatory direction for lane</text></svg>`,
    examples: [
      "Approach intersections",
      "Highway exits",
      "Turn lanes",
      "Traffic control zones"
    ]
  },
  {
    title: "Ladder/Dash Pattern Across Lane",
    meaning: "Prepare to Stop/Give Way",
    description: "Warns of a hazard ahead (intersection, pedestrian crossing). Reduce speed and be ready to stop.",
    svg: `<svg viewBox="0 0 400 120" style="border: 1px solid #ddd; border-radius: 8px;"><rect width="400" height="120" fill="#f9f9f9"/><rect y="55" width="400" height="10" fill="#333"/><line x1="50" y1="40" x2="50" y2="100" stroke="white" stroke-width="8"/><line x1="100" y1="40" x2="100" y2="100" stroke="white" stroke-width="8"/><line x1="150" y1="40" x2="150" y2="100" stroke="white" stroke-width="8"/><line x1="200" y1="40" x2="200" y2="100" stroke="white" stroke-width="8"/><line x1="250" y1="40" x2="250" y2="100" stroke="white" stroke-width="8"/><line x1="300" y1="40" x2="300" y2="100" stroke="white" stroke-width="8"/><line x1="350" y1="40" x2="350" y2="100" stroke="white" stroke-width="8"/><text x="10" y="25" font-size="14" font-weight="bold">LADDER MARKINGS</text><text x="10" y="115" font-size="12" fill="#555">Dashes across = Hazard ahead, reduce speed</text></svg>`,
    examples: [
      "Pedestrian crossings",
      "Intersections",
      "Traffic lights",
      "Yield signs"
    ]
  }
];

function buildRoadMarkingsGuide() {
  const grid = document.getElementById('markingsGrid');
  grid.innerHTML = '';
  roadMarkings.forEach(marking => {
    const card = document.createElement('div');
    card.className = 'study-card';

    const header = document.createElement('div');
    header.className = 'study-card-header';
    header.innerHTML = `<span><strong>${marking.title}</strong><br><small style="opacity:0.7">${marking.meaning}</small></span><span class="chevron">▼</span>`;

    const body = document.createElement('div');
    body.className = 'study-card-body';
    body.innerHTML = `
      ${marking.svg}
      <p><strong>Meaning:</strong> ${marking.description}</p>
      <p><strong>Common Locations:</strong></p>
      <ul style="margin: 0.5rem 0 0 1.5rem; padding: 0;">
        ${marking.examples.map(e => `<li style="margin-bottom: 0.3rem;">${e}</li>`).join('')}
      </ul>
    `;

    header.addEventListener('click', () => {
      const open = body.classList.toggle('open');
      header.classList.toggle('open', open);
    });

    card.appendChild(header);
    card.appendChild(body);
    grid.appendChild(card);
  });
}

// ============================================
//  PROGRESS TRACKING
// ============================================

class ProgressTracker {
  constructor() {
    this.loadProgress();
  }

  loadProgress() {
    const saved = localStorage.getItem('k53_progress');
    this.attempts = saved ? JSON.parse(saved) : [];
  }

  recordAttempt(score, total, category, categoryScores) {
    const attempt = {
      date: new Date().toISOString(),
      score: score,
      total: total,
      percentage: Math.round((score / total) * 100),
      category: category,
      categoryScores: categoryScores
    };
    this.attempts.push(attempt);
    localStorage.setItem('k53_progress', JSON.stringify(this.attempts));
  }

  getStats() {
    if (this.attempts.length === 0) return null;

    const totalAttempts = this.attempts.length;
    const overallPercentages = this.attempts.map(a => a.percentage);
    const averageScore = Math.round(overallPercentages.reduce((a, b) => a + b, 0) / totalAttempts);
    const lastScore = this.attempts[this.attempts.length - 1].percentage;
    const bestScore = Math.max(...overallPercentages);
    const passCount = this.attempts.filter(a => a.percentage >= 75).length;
    const passRate = Math.round((passCount / totalAttempts) * 100);

    // Category breakdown
    const categoryStats = {};
    const categories = ['signVisual', 'rules', 'controls'];
    categories.forEach(cat => {
      const scores = this.attempts
        .filter(a => a.categoryScores && a.categoryScores[cat])
        .map(a => a.categoryScores[cat].percentage || 0);
      if (scores.length > 0) {
        categoryStats[cat] = {
          name: CATEGORY_DISPLAY[cat],
          average: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
          attempts: scores.length,
          weak: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) < 70
        };
      }
    });

    return {
      totalAttempts,
      averageScore,
      lastScore,
      bestScore,
      passCount,
      passRate,
      categoryStats,
      allScores: overallPercentages
    };
  }
}

const tracker = new ProgressTracker();

function practiceWeakAreas() {
  const stats = tracker.getStats();
  if (!stats || !stats.categoryStats) return;

  // Find weak categories (< 75%)
  const weakCategories = Object.keys(stats.categoryStats).filter(
    cat => stats.categoryStats[cat].weak
  );

  if (weakCategories.length === 0) {
    alert('Great job! No weak areas detected. You\'re ready for the test! 🎉');
    return;
  }

  // Set weak area mode and start quiz
  activeTab = 'Weak Areas Practice';
  const profile = { signVisual: 0, rules: 0, controls: 0 };
  weakCategories.forEach(cat => {
    profile[cat] = 30; // Get 30 questions from each weak category
  });

  let pool = [];
  for (const [cat, count] of Object.entries(profile)) {
    if (count > 0) {
      pool = pool.concat(pickRandom(allQuestions[cat] || [], count));
    }
  }

  if (pool.length === 0) {
    alert('No questions found for weak areas.');
    return;
  }

  quizQuestions = shuffle(pool);
  current = 0;
  score = 0;
  mistakes = [];
  answered = false;
  document.getElementById('quizArea').style.display = 'block';
  document.getElementById('scoreScreen').style.display = 'none';

  // Show which areas are being practiced
  const weakAreasText = weakCategories.map(c => CATEGORY_DISPLAY[c]).join(', ');
  const notice = document.createElement('div');
  notice.style.cssText = 'background: #eaf3fc; border: 2px solid #3498db; border-radius: 8px; padding: 1rem; margin-bottom: 1rem; color: #1565C0; font-weight: 600;';
  notice.innerHTML = `📌 Focused Practice Mode: ${weakAreasText}`;
  document.getElementById('quizArea').parentNode.insertBefore(notice, document.getElementById('quizArea'));

  renderQuestion();
}

function buildProgressDashboard() {
  const stats = tracker.getStats();
  const dashboard = document.getElementById('progressDashboard');

  if (!stats) {
    dashboard.innerHTML = `
      <div style="text-align: center; padding: 3rem 1rem;">
        <p style="font-size: 1.2rem; color: #7f8c9a;">No quiz attempts yet. Take some quizzes to see your progress!</p>
        <button class="btn btn-primary" onclick="document.querySelector('[data-page=quizPage]').click()" style="margin-top: 1rem;">
          Start a Quiz
        </button>
      </div>
    `;
    return;
  }

  // Check if there are weak areas
  const weakAreas = Object.keys(stats.categoryStats).filter(cat => stats.categoryStats[cat].weak);

  dashboard.innerHTML = `
    <div style="max-width: 600px; margin: 0 auto;">
      ${weakAreas.length > 0 ? `
        <div style="background: #fff3cd; border: 2px solid #ffc107; border-radius: 8px; padding: 1rem; margin-bottom: 1.5rem;">
          <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem;">
            <span style="font-size: 1.5rem;">⚠️</span>
            <div>
              <strong style="color: #856404;">Weak Areas Detected</strong>
              <p style="margin: 0.25rem 0 0 0; font-size: 0.9rem; color: #856404;">
                ${weakAreas.map(c => stats.categoryStats[c].name).join(', ')} needs improvement
              </p>
            </div>
          </div>
          <button class="btn btn-primary" onclick="practiceWeakAreas()" style="width: 100%; margin-top: 0.5rem;">
            📚 Practice Weak Areas
          </button>
        </div>
      ` : `
        <div style="background: #d4edda; border: 2px solid #28a745; border-radius: 8px; padding: 1rem; margin-bottom: 1.5rem; text-align: center;">
          <p style="margin: 0; color: #155724; font-weight: 600;">✓ No weak areas! All categories above 75%</p>
        </div>
      `}

      <!-- Overall Stats -->
      <div class="quiz-card" style="text-align: center; margin-bottom: 1.5rem;">
        <h2 style="margin-bottom: 0.5rem;">Your K53 Progress</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1rem 0;">
          <div style="padding: 1rem; background: #f0f4f8; border-radius: 8px;">
            <div style="font-size: 2rem; font-weight: bold; color: #3498db;">${stats.totalAttempts}</div>
            <div style="font-size: 0.9rem; color: #7f8c9a;">Quiz Attempts</div>
          </div>
          <div style="padding: 1rem; background: #f0f4f8; border-radius: 8px;">
            <div style="font-size: 2rem; font-weight: bold; color: #2ecc71;">${stats.passCount}</div>
            <div style="font-size: 0.9rem; color: #7f8c9a;">Passed (${stats.passRate}%)</div>
          </div>
          <div style="padding: 1rem; background: #f0f4f8; border-radius: 8px;">
            <div style="font-size: 2rem; font-weight: bold; color: #3498db;">${stats.averageScore}%</div>
            <div style="font-size: 0.9rem; color: #7f8c9a;">Average Score</div>
          </div>
          <div style="padding: 1rem; background: #f0f4f8; border-radius: 8px;">
            <div style="font-size: 2rem; font-weight: bold; color: #f39c12;">${stats.bestScore}%</div>
            <div style="font-size: 0.9rem; color: #7f8c9a;">Best Score</div>
          </div>
        </div>
      </div>

      <!-- Last 5 Attempts -->
      <div class="quiz-card" style="margin-bottom: 1.5rem;">
        <h3 style="margin-bottom: 1rem;">Recent Attempts</h3>
        <div style="max-height: 250px; overflow-y: auto;">
          ${stats.allScores.slice(-5).reverse().map((score, idx) => {
            const attemptNum = stats.totalAttempts - idx;
            const pass = score >= 75;
            return `
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; border-bottom: 1px solid #ecf0f1;">
                <div>
                  <strong>Quiz ${attemptNum}</strong>
                  <div style="font-size: 0.85rem; color: #7f8c9a;">
                    ${new Date(tracker.attempts[tracker.attempts.length - idx - 1].date).toLocaleDateString()}
                  </div>
                </div>
                <div style="font-size: 1.3rem; font-weight: bold; color: ${pass ? '#2ecc71' : '#e74c3c'};">
                  ${score}% ${pass ? '✓' : '✗'}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Category Performance -->
      <div class="quiz-card">
        <h3 style="margin-bottom: 1rem;">Performance by Category</h3>
        ${Object.entries(stats.categoryStats).map(([key, cat]) => {
          const weak = cat.weak;
          return `
            <div style="margin-bottom: 1rem;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <div>
                  <strong>${cat.name}</strong>
                  <div style="font-size: 0.85rem; color: #7f8c9a;">${cat.attempts} attempts</div>
                </div>
                <div style="font-size: 1.2rem; font-weight: bold; color: ${weak ? '#e74c3c' : '#2ecc71'};">
                  ${cat.average}% ${weak ? '⚠️' : '✓'}
                </div>
              </div>
              <div style="background: #ecf0f1; height: 8px; border-radius: 4px; overflow: hidden;">
                <div style="background: ${weak ? '#e74c3c' : '#2ecc71'}; height: 100%; width: ${cat.average}%;"></div>
              </div>
              ${weak ? '<div style="font-size: 0.85rem; color: #e74c3c; margin-top: 0.3rem;">⚠️ Weak area - focus study here</div>' : ''}
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

// ============================================
//  INIT
// ============================================

Promise.all([
  fetch('questions.json').then(r => r.json()),
  fetch('signsData.json').then(r => r.json()).catch(() => []),
])
  .then(([questionsData, signsData]) => {
    questionsData.forEach(q => {
      if (allQuestions[q.category]) allQuestions[q.category].push(q);
    });

    if (signsData.length) {
      allQuestions.signVisual.push(...generateSignQuestions(signsData));
      buildSignLibrary(signsData);
    }

    buildFilterBar();
    startQuiz();
    buildVehicleControlsReference();
    buildRoadMarkingsGuide();
    buildProgressDashboard();
  })
  .catch(err => {
    console.error('Failed to load data:', err);
    document.getElementById('qText').textContent =
      'Error loading questions. Serve via a local server or deploy to Vercel.';
  });
