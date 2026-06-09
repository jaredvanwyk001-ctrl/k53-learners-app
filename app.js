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
//  DATA & CONFIGURATION
// ============================================

const CATEGORY_DISPLAY = {
  signs:    'Road Signs',
  rules:    'Road Rules',
  controls: 'Vehicle Controls',
};

// eNaTIS mock exam profile for "All"; other tabs draw from their single pool
const EXAM_PROFILES = {
  'All':              { signs: 30, rules: 30, controls: 8 },
  'Road Signs':       { signs: 30 },
  'Road Rules':       { rules: 30 },
  'Vehicle Controls': { controls: 8 },
};

let allQuestions = { signs: [], rules: [], controls: [] };
let quizQuestions = [];
let current   = 0;
let score     = 0;
let answered  = false;
let mistakes  = [];
let activeTab = 'All';

// ============================================
//  HELPERS
// ============================================

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickRandom(arr, n) {
  return shuffle(arr).slice(0, n);
}

// ============================================
//  SIGN QUESTIONS — generated from signsData
// ============================================

function generateSignQuestions(signsData) {
  return signsData.map(sign => {
    const others      = signsData.filter(s => s.id !== sign.id);
    const wrongNames  = pickRandom(others, 3).map(s => s.name);
    const allOptions  = shuffle([sign.name, ...wrongNames]);
    const answerIndex = allOptions.indexOf(sign.name);

    return {
      category:     'signs',
      signCode:     sign.code,
      signName:     sign.name,
      signCategory: sign.category,   // Regulatory | Warning | Guidance
      imagePath:    sign.imagePath,
      question:     'What does this road sign indicate?',
      options:      allOptions,
      answer:       answerIndex,
      explanation:  sign.description,
    };
  });
}

// ============================================
//  SIGN IMAGE RENDERER
// ============================================

function buildSignImage(imagePath, signCode, signName, signCategory) {
  const wrap = document.createElement('div');
  wrap.className = 'sign-image-wrap';

  // Category accent class drives the fallback border colour
  const catClass = {
    Regulatory: 'sign-regulatory',
    Warning:    'sign-warning',
    Guidance:   'sign-guidance',
  }[signCategory] || '';

  // Spinner — visible while the image request is in-flight
  const spinner = document.createElement('div');
  spinner.className = 'sign-spinner';

  // Actual image — hidden until it fires onload
  const img = document.createElement('img');
  img.className = 'sign-img';
  img.alt       = `${signCode} — ${signName}`;
  img.style.display = 'none';

  // Fallback tile — shown if the asset 404s or errors
  const fallback = document.createElement('div');
  fallback.className = `sign-fallback ${catClass}`;
  fallback.style.display = 'none';
  fallback.innerHTML = `
    <span class="sign-code">${signCode}</span>
    <span class="sign-name">${signName}</span>
    <span class="sign-cat-label">${signCategory}</span>
  `;

  img.addEventListener('load', () => {
    spinner.style.display = 'none';
    img.style.display     = 'block';
  });

  img.addEventListener('error', () => {
    spinner.style.display       = 'none';
    fallback.style.display      = 'flex';
  });

  // Set src after attaching listeners
  img.src = imagePath;

  wrap.appendChild(spinner);
  wrap.appendChild(img);
  wrap.appendChild(fallback);
  return wrap;
}

// ============================================
//  FILTER BAR
// ============================================

function buildFilterBar() {
  const bar = document.getElementById('filterBar');
  bar.innerHTML = '';
  Object.keys(EXAM_PROFILES).forEach(label => {
    const btn = document.createElement('button');
    btn.className = 'filter-btn' + (label === 'All' ? ' active' : '');
    btn.textContent = label;
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
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

  // Progress bar
  const pct = (current / quizQuestions.length) * 100;
  document.getElementById('progressBar').style.width = pct + '%';
  document.getElementById('qCounter').textContent    = `Question ${current + 1} of ${quizQuestions.length}`;

  // Category badge — show sign sub-category (Regulatory etc.) when available
  document.getElementById('qCategory').textContent =
    q.signCategory || CATEGORY_DISPLAY[q.category] || q.category;

  // --- Sign image ---
  // Remove any image container left from the previous question
  const existing = document.getElementById('signImageContainer');
  if (existing) existing.remove();

  if (q.imagePath) {
    const wrap = buildSignImage(q.imagePath, q.signCode, q.signName, q.signCategory);
    wrap.id = 'signImageContainer';
    const qTextEl = document.getElementById('qText');
    qTextEl.parentNode.insertBefore(wrap, qTextEl);
  }

  // Question text
  document.getElementById('qText').textContent = q.question;

  // Options
  const optionsEl = document.getElementById('options');
  optionsEl.innerHTML = '';
  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = opt;
    btn.addEventListener('click', () => selectAnswer(i, q));
    optionsEl.appendChild(btn);
  });

  // Explanation
  const expEl = document.getElementById('explanation');
  expEl.textContent = '';
  expEl.classList.remove('visible');

  // Next button
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
  if (current >= quizQuestions.length) {
    showScore();
  } else {
    renderQuestion();
  }
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

  buildMistakesList();
}

function buildMistakesList() {
  const existing = document.getElementById('mistakesList');
  if (existing) existing.remove();
  if (mistakes.length === 0) return;

  const container = document.createElement('div');
  container.id = 'mistakesList';
  container.style.cssText = 'margin-top:1.5rem;text-align:left;max-height:460px;overflow-y:auto;';

  const heading = document.createElement('h3');
  heading.textContent = `Questions you got wrong (${mistakes.length})`;
  heading.style.cssText = 'margin-bottom:0.75rem;font-size:1rem;color:#5d6d7e;';
  container.appendChild(heading);

  mistakes.forEach(({ q, chosen }) => {
    const item = document.createElement('div');
    item.style.cssText = [
      'background:#f8f9fa',
      'border-radius:8px',
      'padding:0.85rem 1rem',
      'margin-bottom:0.75rem',
      'border-left:4px solid #e74c3c',
    ].join(';');

    // Show sign code badge for visual questions
    const meta = q.signCode
      ? `<span style="font-size:0.75rem;background:#e8edf3;padding:2px 7px;border-radius:4px;margin-bottom:0.35rem;display:inline-block;">${q.signCode} — ${q.signCategory}</span><br>`
      : '';

    const qText = document.createElement('p');
    qText.style.cssText = 'font-weight:600;margin-bottom:0.4rem;font-size:0.9rem;';
    qText.innerHTML = meta + q.question;

    const wrongLine = document.createElement('p');
    wrongLine.style.cssText = 'color:#a93226;font-size:0.85rem;margin-bottom:0.2rem;';
    wrongLine.textContent = '✗ Your answer: ' + q.options[chosen];

    const correctLine = document.createElement('p');
    correctLine.style.cssText = 'color:#1a7a47;font-size:0.85rem;';
    correctLine.textContent = '✓ Correct: ' + q.options[q.answer];

    item.appendChild(qText);
    item.appendChild(wrongLine);
    item.appendChild(correctLine);
    container.appendChild(item);
  });

  document.getElementById('scoreScreen').appendChild(container);
}

// ============================================
//  STUDY GUIDE
// ============================================

function buildStudyGuide() {
  const grid = document.getElementById('studyGrid');
  grid.innerHTML = '';
  studyGuide.forEach(item => {
    const card = document.createElement('div');
    card.className = 'study-card';

    const header = document.createElement('div');
    header.className = 'study-card-header';
    header.innerHTML = `<span>${item.topic}</span><span class="chevron">▼</span>`;

    const body = document.createElement('div');
    body.className = 'study-card-body';
    body.innerHTML = item.content;

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
//  INIT — load data files, then boot
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
      const visualQuestions = generateSignQuestions(signsData);
      allQuestions.signs.push(...visualQuestions);
    }

    buildFilterBar();
    startQuiz();
    buildStudyGuide();
  })
  .catch(err => {
    console.error('Failed to load question data:', err);
    document.getElementById('qText').textContent =
      'Error loading questions. Serve this app via a local server or deploy to Vercel.';
  });
