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

// eNaTIS mock exam profile for "All" tab; other tabs use their single category
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
let mistakes  = [];   // { q, chosen } for each wrong answer
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

  const pct = (current / quizQuestions.length) * 100;
  document.getElementById('progressBar').style.width = pct + '%';
  document.getElementById('qCounter').textContent    = `Question ${current + 1} of ${quizQuestions.length}`;
  document.getElementById('qCategory').textContent   = CATEGORY_DISPLAY[q.category] || q.category;
  document.getElementById('qText').textContent       = q.question;

  const optionsEl = document.getElementById('options');
  optionsEl.innerHTML = '';
  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = opt;
    btn.addEventListener('click', () => selectAnswer(i, q));
    optionsEl.appendChild(btn);
  });

  const expEl = document.getElementById('explanation');
  expEl.textContent = '';
  expEl.classList.remove('visible');

  document.getElementById('nextBtn').disabled     = true;
  document.getElementById('nextBtn').style.opacity = '0.4';
}

function selectAnswer(selected, q) {
  if (answered) return;
  answered = true;

  // Lock all options and colour correct/wrong
  document.querySelectorAll('.option-btn').forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.answer)  btn.classList.add('correct');
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
  container.style.cssText = [
    'margin-top:1.5rem',
    'text-align:left',
    'max-height:460px',
    'overflow-y:auto',
  ].join(';');

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

    const qText = document.createElement('p');
    qText.style.cssText = 'font-weight:600;margin-bottom:0.4rem;font-size:0.9rem;';
    qText.textContent = q.question;

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
//  INIT — fetch questions.json then boot
// ============================================

fetch('questions.json')
  .then(r => r.json())
  .then(data => {
    data.forEach(q => {
      if (allQuestions[q.category]) allQuestions[q.category].push(q);
    });
    buildFilterBar();
    startQuiz();
    buildStudyGuide();
  })
  .catch(err => {
    console.error('Failed to load questions.json:', err);
    document.getElementById('qText').textContent =
      'Error loading questions. Please serve this app via a local server (e.g. npx serve .) or deploy to Vercel.';
  });
