// K53 Learner's Licence - Main App

const app = {
  // STATE
  currentQuiz: 'All',
  quizQuestions: [],
  quizIndex: 0,
  quizScore: 0,
  quizAnswered: false,
  quizMistakes: [],

  // INIT
  init() {
    this.setupTabs();
    this.buildQuizFilters();
    this.buildSignsFilters();
    this.buildReferences();
    this.buildProgressDash();
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
    const filters = document.getElementById('quizFilters');
    const types = ['All', 'Road Signs', 'Road Rules', 'Vehicle Controls'];
    types.forEach(type => {
      const btn = document.createElement('button');
      btn.className = 'filter-btn' + (type === 'All' ? ' active' : '');
      btn.textContent = type;
      btn.addEventListener('click', () => {
        document.querySelectorAll('#quizFilters .filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentQuiz = type;
        this.startQuiz();
      });
      filters.appendChild(btn);
    });
  },

  startQuiz() {
    let questions = [];

    if (this.currentQuiz === 'All' || this.currentQuiz === 'Road Signs') {
      questions = questions.concat(this.generateSignQuestions().slice(0, 20));
    }
    if (this.currentQuiz === 'All' || this.currentQuiz === 'Road Rules') {
      const rules = QUESTIONS.filter(q => q.category === 'road-rules');
      questions = questions.concat(this.shuffle(rules).slice(0, this.currentQuiz === 'All' ? 10 : 30));
    }
    if (this.currentQuiz === 'All' || this.currentQuiz === 'Vehicle Controls') {
      const controls = QUESTIONS.filter(q => q.category === 'vehicle-controls');
      questions = questions.concat(this.shuffle(controls).slice(0, 8));
    }

    this.quizQuestions = this.shuffle(questions);
    this.quizIndex = 0;
    this.quizScore = 0;
    this.quizAnswered = false;
    this.quizMistakes = [];

    document.getElementById('quizCard').style.display = 'block';
    document.getElementById('scoreCard').style.display = 'none';
    this.renderQuestion();
  },

  renderQuestion() {
    if (!this.quizQuestions.length) return;

    const q = this.quizQuestions[this.quizIndex];
    this.quizAnswered = false;

    // Update progress
    const pct = Math.round((this.quizIndex / this.quizQuestions.length) * 100);
    document.getElementById('progressBar').style.width = pct + '%';
    document.getElementById('qNumber').textContent = `Question ${this.quizIndex + 1} of ${this.quizQuestions.length}`;
    document.getElementById('qType').textContent = this.getCategoryDisplay(q);

    // Question content
    const content = document.getElementById('qContent');
    content.innerHTML = '';

    if (q.type === 'sign-visual') {
      const wrap = document.createElement('div');
      wrap.style.cssText = 'text-align:center;margin:1.5rem 0;';
      const img = document.createElement('img');
      img.src = q.signImage;
      img.alt = q.signName;
      img.style.cssText = 'max-width:200px;max-height:200px;border:1px solid #ddd;border-radius:8px;';
      wrap.appendChild(img);
      content.appendChild(wrap);
    }

    const qText = document.createElement('p');
    qText.className = 'q-text';
    qText.textContent = q.question;
    content.appendChild(qText);

    // Options
    const options = document.getElementById('options');
    options.innerHTML = '';
    options.style.display = 'block';
    q.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.textContent = opt;
      btn.onclick = () => this.selectAnswer(idx, q);
      options.appendChild(btn);
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
    const options = document.querySelectorAll('.option-btn');
    options.forEach((btn, i) => {
      if (i === q.answer) {
        btn.classList.add('correct');
      } else if (i === idx) {
        btn.classList.add('incorrect');
      }
      btn.disabled = true;
    });

    // Show explanation
    const exp = document.getElementById('explanation');
    exp.style.display = 'block';
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
    document.getElementById('quizCard').style.display = 'none';
    document.getElementById('scoreCard').style.display = 'block';

    const total = this.quizQuestions.length;
    const pct = Math.round((this.quizScore / total) * 100);
    const pass = pct >= 75;

    document.getElementById('scoreCircle').innerHTML = `
      <span class="score-pct">${pct}%</span>
      <span class="score-label">${this.quizScore}/${total}</span>
    `;
    document.getElementById('scoreTitle').textContent = pass ? '🎉 Passed!' : '❌ Try Again';
    document.getElementById('scoreMsg').textContent = pass
      ? `Great job! You scored ${pct}% which is above the 75% pass mark.`
      : `You scored ${pct}%. You need 75% to pass. Study more and try again!`;

    // Show mistakes
    const mistakesDiv = document.getElementById('scoreMistakes');
    if (this.quizMistakes.length > 0) {
      mistakesDiv.innerHTML = `<h3>Questions You Missed (${this.quizMistakes.length}):</h3><ul>${this.quizMistakes.map(q => `<li><strong>${q.question.substring(0, 60)}...</strong><br>${q.explanation}</li>`).join('')}</ul>`;
    } else {
      mistakesDiv.innerHTML = '<h3>Perfect! No mistakes!</h3>';
    }

    // Save progress
    this.saveProgress(this.currentQuiz, pct, this.quizMistakes.length);
  },

  // === ROAD SIGNS BROWSER ===
  buildSignsFilters() {
    const filters = document.getElementById('signsFilters');
    const categories = ['All', ...new Set(SIGNS.map(s => s.category))];
    let activeCategory = 'All';

    categories.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = 'filter-btn' + (cat === 'All' ? ' active' : '');
      btn.textContent = cat;
      btn.addEventListener('click', () => {
        document.querySelectorAll('#signsFilters .filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.renderSignsGrid(cat);
      });
      filters.appendChild(btn);
    });

    this.renderSignsGrid('All');
  },

  renderSignsGrid(category) {
    const grid = document.getElementById('signsGrid');
    grid.innerHTML = '';

    const signs = category === 'All' ? SIGNS : SIGNS.filter(s => s.category === category);

    signs.forEach(sign => {
      const card = document.createElement('div');
      card.className = 'sign-card';

      const img = document.createElement('img');
      img.src = sign.imagePath;
      img.alt = sign.name;
      img.onerror = () => { img.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect fill=%22%23f0f0f0%22 width=%22100%22 height=%22100%22/%3E%3Ctext x=%2250%22 y=%2250%22 text-anchor=%22middle%22 dy=%22.3em%22 font-size=%2214%22%3E' + sign.code + '%3C/text%3E%3C/svg%3E'; };

      const code = document.createElement('div');
      code.className = 'sign-code';
      code.textContent = sign.code;

      const name = document.createElement('div');
      name.className = 'sign-name';
      name.textContent = sign.name;

      const desc = document.createElement('div');
      desc.className = 'sign-desc';
      desc.textContent = sign.description;

      card.appendChild(img);
      card.appendChild(code);
      card.appendChild(name);
      card.appendChild(desc);
      grid.appendChild(card);
    });
  },

  // === REFERENCE PAGES ===
  buildReferences() {
    this.buildControls();
    this.buildMarkings();
  },

  buildControls() {
    const ref = document.getElementById('controlsReference');
    ref.innerHTML = '';

    VEHICLE_CONTROLS.forEach(ctrl => {
      const card = document.createElement('div');
      card.className = 'ref-card';

      const header = document.createElement('div');
      header.className = 'ref-header';
      header.innerHTML = `<strong>#${ctrl.number} — ${ctrl.name}</strong><span class="chevron">▼</span>`;
      header.onclick = () => this.toggleCard(card);

      const body = document.createElement('div');
      body.className = 'ref-body';
      body.innerHTML = `
        <p><strong>Location:</strong> ${ctrl.location}</p>
        <p><strong>Function:</strong> ${ctrl.function}</p>
        <p><strong>Usage:</strong></p>
        <ul>${ctrl.usage.map(u => `<li>${u}</li>`).join('')}</ul>
        <p><strong>Safety:</strong> ${ctrl.safety}</p>
        <p><strong>Maintenance:</strong> ${ctrl.maintenance}</p>
      `;

      card.appendChild(header);
      card.appendChild(body);
      ref.appendChild(card);
    });
  },

  buildMarkings() {
    const ref = document.getElementById('markingsReference');
    ref.innerHTML = '';

    ROAD_MARKINGS.forEach(marking => {
      const card = document.createElement('div');
      card.className = 'ref-card';

      const header = document.createElement('div');
      header.className = 'ref-header';
      header.innerHTML = `<strong>${marking.title}</strong><br><small>${marking.meaning}</small><span class="chevron">▼</span>`;
      header.onclick = () => this.toggleCard(card);

      const body = document.createElement('div');
      body.className = 'ref-body';
      body.innerHTML = `
        <p><strong>Meaning:</strong> ${marking.description}</p>
        <p><strong>Common Locations:</strong></p>
        <ul>${marking.examples.map(e => `<li>${e}</li>`).join('')}</ul>
      `;

      card.appendChild(header);
      card.appendChild(body);
      ref.appendChild(card);
    });
  },

  toggleCard(card) {
    card.classList.toggle('open');
    const chevron = card.querySelector('.chevron');
    if (chevron) chevron.style.transform = card.classList.contains('open') ? 'rotate(180deg)' : 'rotate(0)';
  },

  // === PROGRESS TRACKING ===
  buildProgressDash() {
    const dash = document.getElementById('progressDash');
    const progress = this.getProgress();

    dash.innerHTML = `
      <div class="progress-section">
        <h3>Overall Statistics</h3>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">${progress.totalAttempts}</div>
            <div class="stat-label">Quizzes Taken</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${progress.overallScore}%</div>
            <div class="stat-label">Average Score</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${progress.passRate}%</div>
            <div class="stat-label">Pass Rate</div>
          </div>
        </div>
      </div>

      <div class="progress-section">
        <h3>Category Breakdown</h3>
        <div class="category-stats">
          ${['Road Signs', 'Road Rules', 'Vehicle Controls'].map(cat => {
            const catData = progress.categories[cat] || { attempts: 0, score: 0 };
            return `
              <div class="category-stat">
                <div class="category-header">
                  <strong>${cat}</strong>
                  <span>${catData.attempts} attempts</span>
                </div>
                <div class="category-bar">
                  <div class="category-fill" style="width: ${catData.score}%"></div>
                </div>
                <div class="category-score">${catData.score}% average</div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <div class="progress-section">
        <h3>Study Tips</h3>
        <ul class="tips-list">
          <li>Focus on weak categories to improve overall score</li>
          <li>Take quizzes regularly to reinforce learning</li>
          <li>Review the Road Signs library to familiarize yourself</li>
          <li>Use the Reference section for quick lookup</li>
          <li>Aim for 75%+ consistently before taking the real test</li>
        </ul>
      </div>
    `;
  },

  saveProgress(category, score, mistakes) {
    const key = `k53-progress-${category}`;
    const attempts = JSON.parse(localStorage.getItem(key) || '[]');
    attempts.push({ score, mistakes, date: new Date().toISOString() });
    localStorage.setItem(key, JSON.stringify(attempts));
  },

  getProgress() {
    const categories = {
      'All': [], 'Road Signs': [], 'Road Rules': [], 'Vehicle Controls': []
    };

    Object.keys(categories).forEach(cat => {
      const key = `k53-progress-${cat}`;
      categories[cat] = JSON.parse(localStorage.getItem(key) || '[]');
    });

    const allAttempts = Object.values(categories).flat();
    const totalAttempts = allAttempts.length;
    const overallScore = totalAttempts ? Math.round(allAttempts.reduce((sum, a) => sum + a.score, 0) / totalAttempts) : 0;
    const passRate = totalAttempts ? Math.round((allAttempts.filter(a => a.score >= 75).length / totalAttempts) * 100) : 0;

    const categoryStats = {};
    ['Road Signs', 'Road Rules', 'Vehicle Controls'].forEach(cat => {
      const attempts = categories[cat];
      categoryStats[cat] = {
        attempts: attempts.length,
        score: attempts.length ? Math.round(attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length) : 0
      };
    });

    return { totalAttempts, overallScore, passRate, categories: categoryStats };
  },

  // === SIGN VISUAL QUESTIONS ===
  generateSignQuestions() {
    const questions = [];

    SIGNS.forEach(sign => {
      const wrongOptions = SIGNS
        .filter(s => s.id !== sign.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(s => s.name);

      const options = [sign.name, ...wrongOptions].sort(() => Math.random() - 0.5);

      questions.push({
        type: 'sign-visual',
        category: 'road-signs',
        signImage: sign.imagePath,
        signName: sign.name,
        signCode: sign.code,
        question: 'What is this road sign called?',
        options: options,
        answer: options.indexOf(sign.name),
        explanation: `${sign.name} (${sign.code}): ${sign.description} Driver action: ${sign.action}`
      });
    });

    return questions;
  },

  // === HELPERS ===
  getCategoryDisplay(q) {
    if (q.type === 'sign-visual') return q.signName;
    if (q.category === 'road-rules') return 'Road Rules';
    if (q.category === 'vehicle-controls') return 'Vehicle Controls';
    return 'Unknown';
  },

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
