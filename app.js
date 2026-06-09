// ============================================
//  K53 Learner's App — main logic
// ============================================

// ---- Tab switching ----
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.page).classList.add('active');
  });
});

// ============================================
//  QUIZ
// ============================================
let quizQuestions = [];
let current = 0;
let score = 0;
let answered = false;

function getCategories() {
  return ['All', ...new Set(questions.map(q => q.category))];
}

function buildFilterBar() {
  const bar = document.getElementById('filterBar');
  bar.innerHTML = '';
  getCategories().forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'filter-btn' + (cat === 'All' ? ' active' : '');
    btn.textContent = cat;
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      startQuiz(cat);
    });
    bar.appendChild(btn);
  });
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function startQuiz(category = 'All') {
  quizQuestions = shuffle(category === 'All' ? questions : questions.filter(q => q.category === category));
  current = 0;
  score = 0;
  document.getElementById('quizArea').style.display = 'block';
  document.getElementById('scoreScreen').style.display = 'none';
  renderQuestion();
}

function renderQuestion() {
  const q = quizQuestions[current];
  answered = false;

  // Progress
  const pct = (current / quizQuestions.length) * 100;
  document.getElementById('progressBar').style.width = pct + '%';
  document.getElementById('qCounter').textContent = `Question ${current + 1} of ${quizQuestions.length}`;
  document.getElementById('qCategory').textContent = q.category;

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
  document.getElementById('explanation').textContent = '';
  document.getElementById('explanation').classList.remove('visible');

  // Next button state
  document.getElementById('nextBtn').disabled = true;
  document.getElementById('nextBtn').style.opacity = '0.4';
}

function selectAnswer(selected, q) {
  if (answered) return;
  answered = true;

  const btns = document.querySelectorAll('.option-btn');
  btns.forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.answer) btn.classList.add('correct');
    else if (i === selected) btn.classList.add('wrong');
  });

  if (selected === q.answer) score++;

  const expEl = document.getElementById('explanation');
  expEl.textContent = '💡 ' + q.explanation;
  expEl.classList.add('visible');

  document.getElementById('nextBtn').disabled = false;
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

function showScore() {
  document.getElementById('quizArea').style.display = 'none';
  const screen = document.getElementById('scoreScreen');
  screen.style.display = 'block';

  const pct = Math.round((score / quizQuestions.length) * 100);
  const pass = pct >= 70;

  const circle = document.getElementById('scoreCircle');
  circle.className = 'score-circle ' + (pass ? 'score-pass' : 'score-fail');
  circle.innerHTML = `<span class="big">${pct}%</span><span class="label">${score}/${quizQuestions.length}</span>`;

  document.getElementById('scoreTitle').textContent = pass ? '🎉 Well done!' : '📚 Keep studying!';
  document.getElementById('scoreMsg').textContent = pass
    ? `You passed with ${pct}%. You're on track for the real K53 test.`
    : `You scored ${pct}%. The pass mark is 70%. Review the study guide and try again.`;
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
//  Init
// ============================================
buildFilterBar();
startQuiz();
buildStudyGuide();
