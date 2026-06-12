// K53 Learner's Licence - Main App (2-Tab Layout: Quiz + Study Guide)

const app = {
  // STATE
  currentCategory: 'All',
  quizQuestions: [],
  quizIndex: 0,
  quizScore: 0,
  quizAnswered: false,
  quizMistakes: [],

  // INIT
  init() {
    this.setupTabs();
    this.buildQuizFilters();
    this.buildStudyGuide();
    this.startQuiz();
  },

  // === TAB SWITCHING ===
  setupTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(btn.dataset.page).classList.add('active');
      });
    });
  },

  // === QUIZ SYSTEM ===
  buildQuizFilters() {
    const filterBar = document.getElementById('filterBar');
    const categories = ['All', 'Road Signs', 'Road Rules', 'Vehicle Controls'];

    categories.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = 'filter-btn' + (cat === 'All' ? ' active' : '');
      btn.textContent = cat;
      btn.addEventListener('click', () => {
        document.querySelectorAll('#filterBar .filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentCategory = cat;
        this.startQuiz();
      });
      filterBar.appendChild(btn);
    });
  },

  startQuiz() {
    let questions = [];

    // Get questions based on selected category
    if (this.currentCategory === 'All') {
      questions = QUESTIONS.slice();
    } else {
      questions = QUESTIONS.filter(q => q.category === this.currentCategory).slice();
    }

    this.quizQuestions = this.shuffle(questions);
    this.quizIndex = 0;
    this.quizScore = 0;
    this.quizAnswered = false;
    this.quizMistakes = [];

    document.getElementById('scoreScreen').style.display = 'none';
    document.getElementById('quizArea').style.display = 'block';
    this.renderQuestion();
  },

  renderQuestion() {
    if (!this.quizQuestions.length) return;

    const q = this.quizQuestions[this.quizIndex];
    this.quizAnswered = false;

    // Update progress bar
    const pct = Math.round((this.quizIndex / this.quizQuestions.length) * 100);
    document.getElementById('progressBar').style.width = pct + '%';

    // Update question metadata
    document.getElementById('qCounter').textContent = `Question ${this.quizIndex + 1} of ${this.quizQuestions.length}`;
    document.getElementById('qCategory').textContent = q.category;

    // Update question text
    document.getElementById('qText').textContent = q.question;

    // Render options
    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = '';
    q.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.textContent = opt;
      btn.onclick = () => this.selectAnswer(idx, q);
      optionsDiv.appendChild(btn);
    });

    // Clear explanation
    document.getElementById('explanation').innerHTML = '';
    document.getElementById('nextBtn').textContent = 'Next →';
  },

  selectAnswer(idx, q) {
    if (this.quizAnswered) return;
    this.quizAnswered = true;

    const isCorrect = idx === q.answer;
    if (!isCorrect) {
      this.quizMistakes.push(q);
    } else {
      this.quizScore++;
    }

    // Highlight answer
    const optionBtns = document.querySelectorAll('.option-btn');
    optionBtns.forEach((btn, i) => {
      if (i === q.answer) {
        btn.classList.add('correct');
      } else if (i === idx) {
        btn.classList.add('incorrect');
      }
      btn.disabled = true;
    });

    // Show explanation
    const exp = document.getElementById('explanation');
    exp.innerHTML = `<strong>${isCorrect ? '✓ Correct!' : '✗ Incorrect'}</strong><p>${q.explanation}</p>`;

    // Update next button
    if (this.quizIndex < this.quizQuestions.length - 1) {
      document.getElementById('nextBtn').textContent = 'Next →';
    } else {
      document.getElementById('nextBtn').textContent = 'See Results';
    }
  },

  nextQuestion() {
    if (!this.quizAnswered) return;

    if (this.quizIndex < this.quizQuestions.length - 1) {
      this.quizIndex++;
      this.renderQuestion();
    } else {
      this.showScore();
    }
  },

  showScore() {
    document.getElementById('quizArea').style.display = 'none';
    document.getElementById('scoreScreen').style.display = 'block';

    const total = this.quizQuestions.length;
    const pct = Math.round((this.quizScore / total) * 100);
    const pass = pct >= 75;

    const scoreCircle = document.getElementById('scoreCircle');
    scoreCircle.innerHTML = `
      <span class="big">${pct}%</span>
      <span class="label">${this.quizScore}/${total}</span>
    `;
    scoreCircle.className = pass ? 'score-circle score-pass' : 'score-circle score-fail';

    document.getElementById('scoreTitle').textContent = pass ? '🎉 Passed!' : '❌ Try Again';
    document.getElementById('scoreMsg').textContent = pass
      ? `Great job! You scored ${pct}% which is above the 75% pass mark.`
      : `You scored ${pct}%. You need 75% to pass. Study more and try again!`;

    this.saveProgress(this.currentCategory, pct, this.quizMistakes.length);
  },

  // === STUDY GUIDE - Road Signs Library ===
  buildStudyGuide() {
    const studyGrid = document.getElementById('studyGrid');
    if (!studyGrid) return;

    studyGrid.innerHTML = '';

    if (!SIGNS || !SIGNS.length) {
      studyGrid.innerHTML = '<p>Loading road signs...</p>';
      return;
    }

    SIGNS.forEach(sign => {
      const card = document.createElement('div');
      card.className = 'study-card';

      const img = document.createElement('img');
      img.src = sign.imagePath;
      img.alt = sign.name;
      img.className = 'study-sign-img';
      img.onerror = () => {
        img.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect fill=%22%23f0f0f0%22 width=%22100%22 height=%22100%22/%3E%3Ctext x=%2250%22 y=%2250%22 text-anchor=%22middle%22 dy=%22.3em%22 font-size=%2212%22 fill=%22%23999%22%3E' + sign.code + '%3C/text%3E%3C/svg%3E';
      };

      const code = document.createElement('div');
      code.className = 'study-code';
      code.textContent = sign.code;

      const name = document.createElement('div');
      code.className = 'study-name';
      name.textContent = sign.name;

      const desc = document.createElement('div');
      desc.className = 'study-desc';
      desc.textContent = sign.description;

      card.appendChild(img);
      card.appendChild(code);
      card.appendChild(name);
      card.appendChild(desc);
      studyGrid.appendChild(card);
    });
  },

  saveProgress(category, score, mistakes) {
    const key = `k53-progress-${category}`;
    const attempts = JSON.parse(localStorage.getItem(key) || '[]');
    attempts.push({ score, mistakes, date: new Date().toISOString() });
    localStorage.setItem(key, JSON.stringify(attempts));
  },

  // === HELPERS ===
  shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
};

// Start app when DOM is ready - load official K53 data first
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded. Initializing K53 app with official data...');
  loadK53Data();
});
