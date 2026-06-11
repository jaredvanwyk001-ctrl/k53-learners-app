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

const CATEGORY_DISPLAY = { signVisual: 'Road Signs', rules: 'Road Rules', controls: 'Vehicle Controls' };

const EXAM_PROFILES = {
  'All':              { signVisual: 20, rules: 30, controls: 8 },
  'Road Signs':       { signVisual: 30 },
  'Road Rules':       { rules: 30 },
  'Vehicle Controls': { controls: 8 },
};

let allQuestions  = { signVisual: [], rules: [], controls: [] };
let allSignsData  = [];
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
//  SIGN SVG RENDERING
// ============================================

function renderSignSVG(sign) {
  const name = sign.name.toLowerCase().replace(/\s+/g, '_');
  const code = sign.code.toLowerCase().replace(/-/g, '_');

  let svg = '';

  if (sign.category === 'Regulatory') {
    if (code === 'r1') {
      svg = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <polygon points="50,8 92,15 98,50 92,85 50,92 8,85 2,50 8,15" fill="#CC0000" stroke="#990000" stroke-width="2"/>
        <polygon points="50,15 88,22 94,50 88,78 50,85 12,78 6,50 12,22" fill="white"/>
        <text x="50" y="65" font-family="Arial,sans-serif" font-size="32" font-weight="bold" fill="#CC0000" text-anchor="middle">STOP</text>
      </svg>`;
    } else if (code === 'r2') {
      svg = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <polygon points="50,5 95,85 5,85" fill="#CC0000" stroke="#990000" stroke-width="2"/>
        <polygon points="50,15 85,75 15,75" fill="white"/>
        <text x="50" y="60" font-family="Arial,sans-serif" font-size="20" font-weight="bold" fill="#CC0000" text-anchor="middle">YIELD</text>
      </svg>`;
    } else if (code === 'r3') {
      svg = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="45" fill="#CC0000" stroke="#990000" stroke-width="2"/>
        <circle cx="50" cy="50" r="40" fill="white"/>
        <line x1="70" y1="30" x2="30" y2="70" stroke="#CC0000" stroke-width="8" stroke-linecap="round"/>
      </svg>`;
    } else if (code === 'r4') {
      svg = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="45" fill="#CC0000" stroke="#990000" stroke-width="2"/>
        <circle cx="50" cy="50" r="40" fill="white"/>
        <line x1="70" y1="30" x2="30" y2="70" stroke="#CC0000" stroke-width="8" stroke-linecap="round"/>
      </svg>`;
    } else if (code === 'r5') {
      svg = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="45" fill="#CC0000" stroke="#990000" stroke-width="2"/>
        <circle cx="50" cy="50" r="40" fill="white"/>
        <path d="M 30 50 Q 50 35 70 50" stroke="#CC0000" stroke-width="6" fill="none"/>
        <line x1="70" y1="50" x2="75" y2="40" stroke="#CC0000" stroke-width="6" stroke-linecap="round"/>
      </svg>`;
    } else if (code === 'r6') {
      svg = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="45" fill="#CC0000" stroke="#990000" stroke-width="2"/>
        <circle cx="50" cy="50" r="40" fill="white"/>
        <polygon points="30,50 50,30 50,70" fill="#CC0000"/>
      </svg>`;
    } else if (code === 'r7') {
      svg = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="45" fill="#CC0000" stroke="#990000" stroke-width="2"/>
        <circle cx="50" cy="50" r="40" fill="white"/>
        <polygon points="70,50 50,30 50,70" fill="#CC0000"/>
      </svg>`;
    } else if (name.includes('speed')) {
      const speed = code.split('_').pop();
      svg = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="45" fill="white" stroke="#CC0000" stroke-width="6"/>
        <text x="50" y="65" font-family="Arial,sans-serif" font-size="48" font-weight="bold" fill="#CC0000" text-anchor="middle">${speed}</text>
        <text x="50" y="85" font-family="Arial,sans-serif" font-size="10" fill="#333" text-anchor="middle">km/h</text>
      </svg>`;
    } else if (code === 'r110') {
      svg = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="45" fill="#CC0000" stroke="#990000" stroke-width="2"/>
        <circle cx="50" cy="50" r="40" fill="white"/>
        <circle cx="40" cy="35" r="6" fill="#CC0000"/>
        <polygon points="30,45 50,60 70,45" fill="#CC0000"/>
      </svg>`;
    } else if (code === 'r202') {
      svg = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <rect x="15" y="15" width="70" height="70" fill="white" stroke="#CC0000" stroke-width="3"/>
        <text x="50" y="55" font-family="Arial,sans-serif" font-size="14" font-weight="bold" fill="#CC0000" text-anchor="middle">End of</text>
        <text x="50" y="72" font-family="Arial,sans-serif" font-size="14" font-weight="bold" fill="#CC0000" text-anchor="middle">Limit</text>
      </svg>`;
    } else if (code === 'r204') {
      svg = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="45" fill="white" stroke="#CC0000" stroke-width="3"/>
        <line x1="30" y1="40" x2="70" y2="40" stroke="#CC0000" stroke-width="4"/>
        <line x1="30" y1="60" x2="70" y2="60" stroke="#CC0000" stroke-width="4"/>
      </svg>`;
    } else if (code === 'r205') {
      svg = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <rect x="15" y="15" width="70" height="70" fill="white" stroke="#CC0000" stroke-width="3"/>
        <text x="50" y="52" font-family="Arial,sans-serif" font-size="12" font-weight="bold" fill="#CC0000" text-anchor="middle">End of</text>
        <text x="50" y="68" font-family="Arial,sans-serif" font-size="12" font-weight="bold" fill="#CC0000" text-anchor="middle">No Over.</text>
      </svg>`;
    } else if (code === 'r301') {
      svg = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <rect x="20" y="20" width="60" height="60" fill="#003DA5" stroke="#001f5c" stroke-width="2" rx="4"/>
        <polygon points="50,30 65,50 50,45 35,50" fill="white"/>
        <line x1="50" y1="50" x2="50" y2="70" stroke="white" stroke-width="3"/>
      </svg>`;
    } else if (code === 'r302') {
      svg = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <rect x="20" y="20" width="60" height="60" fill="#003DA5" stroke="#001f5c" stroke-width="2" rx="4"/>
        <polygon points="35,50 50,35 50,65" fill="white"/>
        <line x1="50" y1="35" x2="65" y2="50" stroke="white" stroke-width="3"/>
      </svg>`;
    } else if (code === 'r303') {
      svg = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <rect x="20" y="20" width="60" height="60" fill="#003DA5" stroke="#001f5c" stroke-width="2" rx="4"/>
        <polygon points="65,50 50,35 50,65" fill="white"/>
        <line x1="50" y1="35" x2="65" y2="50" stroke="white" stroke-width="3"/>
      </svg>`;
    } else if (code === 'r304') {
      svg = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <rect x="15" y="15" width="70" height="70" fill="#003DA5" stroke="#001f5c" stroke-width="2" rx="4"/>
        <polygon points="50,28 62,45 50,42 38,45" fill="white"/>
        <line x1="50" y1="42" x2="50" y2="60" stroke="white" stroke-width="2"/>
        <polygon points="35,60 50,45 50,65" fill="white"/>
      </svg>`;
    } else if (code === 'r305') {
      svg = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <rect x="15" y="15" width="70" height="70" fill="#003DA5" stroke="#001f5c" stroke-width="2" rx="4"/>
        <polygon points="50,28 62,45 50,42 38,45" fill="white"/>
        <line x1="50" y1="42" x2="50" y2="60" stroke="white" stroke-width="2"/>
        <polygon points="65,60 50,45 50,65" fill="white"/>
      </svg>`;
    } else if (code === 'r306') {
      svg = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <rect x="15" y="15" width="70" height="70" fill="#003DA5" stroke="#001f5c" stroke-width="2" rx="4"/>
        <polygon points="35,60 50,45 50,65" fill="white"/>
        <polygon points="65,60 50,45 50,65" fill="white"/>
      </svg>`;
    } else if (code === 'r307') {
      svg = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <rect x="20" y="20" width="60" height="60" fill="#003DA5" stroke="#001f5c" stroke-width="2" rx="4"/>
        <polygon points="35,50 50,35 50,65" fill="white"/>
      </svg>`;
    } else if (code === 'r308') {
      svg = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <rect x="20" y="20" width="60" height="60" fill="#003DA5" stroke="#001f5c" stroke-width="2" rx="4"/>
        <polygon points="65,50 50,35 50,65" fill="white"/>
      </svg>`;
    } else if (code === 'r309') {
      svg = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="42" fill="white" stroke="#003DA5" stroke-width="3"/>
        <path d="M 40 50 A 10 10 0 0 1 60 50" stroke="#003DA5" stroke-width="4" fill="none" stroke-linecap="round"/>
        <polygon points="60,50 68,45 63,57" fill="#003DA5"/>
        <circle cx="40" cy="35" r="1.5" fill="#333"/>
      </svg>`;
    } else {
      svg = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="10" width="80" height="80" fill="#f0f0f0" stroke="#999" stroke-width="2"/>
        <text x="50" y="55" font-family="Arial,sans-serif" font-size="24" font-weight="bold" fill="#333" text-anchor="middle">${sign.code}</text>
      </svg>`;
    }
  } else if (sign.category === 'Warning') {
    svg = `<svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
      <polygon points="50,5 95,110 5,110" fill="#CC0000" stroke="#990000" stroke-width="2"/>
      <polygon points="50,15 85,100 15,100" fill="white"/>
      <text x="50" y="75" font-family="Arial,sans-serif" font-size="32" font-weight="bold" fill="#333" text-anchor="middle">${sign.code.replace('W', '')}</text>
    </svg>`;
  } else if (sign.category === 'Information') {
    svg = `<svg viewBox="0 0 100 80" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="5" width="90" height="70" fill="#1B5E20" stroke="#0d3d1a" stroke-width="2"/>
      <text x="50" y="30" font-family="Arial,sans-serif" font-size="10" font-weight="bold" fill="white" text-anchor="middle">${sign.code}</text>
      <text x="50" y="55" font-family="Arial,sans-serif" font-size="14" font-weight="bold" fill="white" text-anchor="middle">${sign.name.substring(0, 8)}</text>
    </svg>`;
  } else if (sign.category === 'Guidance') {
    svg = `<svg viewBox="0 0 100 80" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="5" width="90" height="70" fill="#003DA5" stroke="#001f5c" stroke-width="2"/>
      <text x="50" y="30" font-family="Arial,sans-serif" font-size="10" font-weight="bold" fill="white" text-anchor="middle">${sign.code}</text>
      <text x="50" y="55" font-family="Arial,sans-serif" font-size="14" font-weight="bold" fill="white" text-anchor="middle">${sign.name.substring(0, 8)}</text>
    </svg>`;
  }

  return svg;
}

// ============================================
//  SIGN CACHE & REFERENCE
// ============================================

function buildSignCache() {
  const filters = document.getElementById('signCacheFilters');
  filters.innerHTML = '';
  const categories = ['All', ...new Set(allSignsData.map(s => s.category))];

  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'filter-btn' + (cat === 'All' ? ' active' : '');
    btn.textContent = cat;
    btn.addEventListener('click', () => {
      document.querySelectorAll('#signCacheFilters .filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderSignCacheGrid(cat);
    });
    filters.appendChild(btn);
  });

  renderSignCacheGrid('All');
}

function renderSignCacheGrid(category) {
  const grid = document.getElementById('signCacheGrid');
  grid.innerHTML = '';

  const signs = category === 'All' ? allSignsData : allSignsData.filter(s => s.category === category);

  signs.forEach(sign => {
    const card = document.createElement('div');
    card.className = 'sign-cache-card';

    const svgContainer = document.createElement('div');
    svgContainer.className = 'sign-cache-svg';

    if (sign.imagePath) {
      const img = document.createElement('img');
      img.src = sign.imagePath;
      img.alt = sign.name;
      img.style.cssText = 'width:100%;height:100%;object-fit:contain;';
      svgContainer.appendChild(img);
    } else {
      svgContainer.innerHTML = renderSignSVG(sign);
    }

    const code = document.createElement('div');
    code.className = 'sign-cache-code';
    code.textContent = sign.code;

    const name = document.createElement('div');
    name.className = 'sign-cache-name';
    name.textContent = sign.name;

    const desc = document.createElement('div');
    desc.className = 'sign-cache-desc';
    desc.textContent = sign.description;

    card.appendChild(svgContainer);
    card.appendChild(code);
    card.appendChild(name);
    card.appendChild(desc);
    grid.appendChild(card);
  });
}

function buildReferenceGuide() {
  const grid = document.getElementById('referenceGrid');
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
  document.getElementById('qCategory').textContent   = q.signName || CATEGORY_DISPLAY[q.category] || q.category;

  // Remove existing media containers
  const existingSign = document.getElementById('signImageContainer');
  if (existingSign) existingSign.remove();
  const existingControl = document.getElementById('controlImageContainer');
  if (existingControl) existingControl.remove();

  // Display sign SVG if this is a sign question
  if (q.signSVG || q.signImagePath) {
    const signWrap = document.createElement('div');
    signWrap.id = 'signImageContainer';
    signWrap.style.cssText = 'text-align:center;margin-bottom:1.5rem;';
    const svgContainer = document.createElement('div');
    svgContainer.style.cssText = 'display:inline-block;width:200px;height:200px;';

    if (q.signImagePath) {
      const img = document.createElement('img');
      img.src = q.signImagePath;
      img.alt = q.signName;
      img.style.cssText = 'width:100%;height:100%;object-fit:contain;';
      svgContainer.appendChild(img);
    } else {
      svgContainer.innerHTML = q.signSVG;
    }

    signWrap.appendChild(svgContainer);
    const qTextEl = document.getElementById('qText');
    qTextEl.parentNode.insertBefore(signWrap, qTextEl);
  }
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
  fetch('signsData.json').then(r => r.json()).catch(() => [])
])
  .then(([questionsData, signsData]) => {
    allSignsData = signsData;

    questionsData.forEach(q => {
      if (allQuestions[q.category]) allQuestions[q.category].push(q);
    });

    if (signsData.length) {
      const signQuestions = generateSignQuestions(signsData);
      allQuestions.signVisual.push(...signQuestions);
    }

    buildFilterBar();
    startQuiz();
    buildSignCache();
    buildReferenceGuide();
    buildVehicleControlsReference();
    buildRoadMarkingsGuide();
    buildProgressDashboard();
  })
  .catch(err => {
    console.error('Failed to load data:', err);
    document.getElementById('qText').textContent =
      'Error loading data. Serve via a local server or deploy to Vercel.';
  });

function generateSignQuestions(signsData) {
  const questions = [];

  signsData.forEach(sign => {
    const otherSigns = signsData.filter(s => s.id !== sign.id);

    const questionObj = {
      category: 'signVisual',
      signCode: sign.code,
      signName: sign.name,
      signSVG: renderSignSVG(sign),
      question: 'What is this road sign called?',
      options: [
        sign.name,
        ...pickRandom(otherSigns, 3).map(s => s.name)
      ].sort(() => Math.random() - 0.5),
      answer: [sign.name, ...pickRandom(otherSigns, 3).map(s => s.name)].sort(() => Math.random() - 0.5).indexOf(sign.name),
      explanation: sign.description
    };

    if (sign.imagePath) {
      questionObj.signImagePath = sign.imagePath;
    }

    questions.push(questionObj);
  });

  return questions;
}
