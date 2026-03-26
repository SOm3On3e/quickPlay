/**
 * QuickPlay - Casual Gaming Platform
 * Main JavaScript Module
 * ============================================
 */

// ============================================================
// Theme Management
// ============================================================
const ThemeManager = {
  key: 'quickplay-theme',

  init() {
    const saved = localStorage.getItem(this.key) || 'dark';
    this.apply(saved);
  },

  apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(this.key, theme);
    // Update toggle icon
    const btn = document.querySelector('.theme-toggle');
    if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
  },

  toggle() {
    const current = document.documentElement.getAttribute('data-theme');
    this.apply(current === 'dark' ? 'light' : 'dark');
  }
};

// ============================================================
// Mobile Navigation
// ============================================================
const NavManager = {
  init() {
    const toggle = document.querySelector('.menu-toggle');
    const links = document.querySelector('.nav-links');
    if (!toggle || !links) return;

    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
      // Animate hamburger lines
      toggle.classList.toggle('active');
    });

    // Close on link click
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => links.classList.remove('open'));
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!toggle.contains(e.target) && !links.contains(e.target)) {
        links.classList.remove('open');
      }
    });
  },

  // Highlight active page
  setActive() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(a => {
      const href = a.getAttribute('href').split('/').pop();
      if (href === path) a.classList.add('active');
    });
  }
};

// ============================================================
// Game Search & Filter
// ============================================================
const GameFilter = {
  currentCategory: 'all',
  searchQuery: '',

  init() {
    // Category filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentCategory = btn.dataset.category;
        this.applyFilters();
      });
    });

    // Search inputs
    const searchInputs = document.querySelectorAll('.game-search-input');
    searchInputs.forEach(input => {
      input.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.applyFilters();
      });
    });
  },

  applyFilters() {
    const cards = document.querySelectorAll('.game-card[data-category]');
    let visibleCount = 0;

    cards.forEach(card => {
      const category = card.dataset.category || '';
      const title = card.querySelector('.game-title-text')?.textContent.toLowerCase() || '';
      const desc = card.querySelector('.game-desc')?.textContent.toLowerCase() || '';

      const matchCat = this.currentCategory === 'all' || category === this.currentCategory;
      const matchSearch = !this.searchQuery || title.includes(this.searchQuery) || desc.includes(this.searchQuery);

      if (matchCat && matchSearch) {
        card.style.display = '';
        card.style.animation = 'fade-up 0.3s ease forwards';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    // Show empty state
    const emptyState = document.querySelector('.games-empty-state');
    if (emptyState) emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
  }
};

// ============================================================
// Lazy Loading Images
// ============================================================
const LazyLoader = {
  init() {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              observer.unobserve(img);
            }
          }
        });
      }, { rootMargin: '100px' });

      document.querySelectorAll('img[data-src]').forEach(img => observer.observe(img));
    } else {
      // Fallback: load all
      document.querySelectorAll('img[data-src]').forEach(img => {
        img.src = img.dataset.src;
      });
    }
  }
};

// ============================================================
// Toast Notifications
// ============================================================
const Toast = {
  show(message, type = 'success', duration = 3000) {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.borderLeftColor = type === 'success' ? 'var(--accent-green)' : 'var(--accent-primary)';
    toast.classList.add('show');
    clearTimeout(this._timer);
    this._timer = setTimeout(() => toast.classList.remove('show'), duration);
  }
};

// ============================================================
// Scroll Animations (Intersection Observer)
// ============================================================
const ScrollAnimator = {
  init() {
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
  }
};

// ============================================================
// Game Manager (for game pages)
// ============================================================
const GameManager = {
  init() {
    // Play Again button
    const playAgainBtns = document.querySelectorAll('.play-again-btn');
    playAgainBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const iframe = document.querySelector('.game-area iframe');
        if (iframe) {
          iframe.src = iframe.src; // Reload iframe
        }
        const canvas = document.querySelector('#gameCanvas');
        if (canvas && window.resetGame) {
          window.resetGame();
        }
        Toast.show('🎮 Game restarted!');
      });
    });

    // Fullscreen button
    const fsBtn = document.querySelector('.fullscreen-btn');
    if (fsBtn) {
      fsBtn.addEventListener('click', () => {
        const gameArea = document.querySelector('.game-area');
        if (!document.fullscreenElement) {
          gameArea?.requestFullscreen?.();
          fsBtn.textContent = '⊠';
        } else {
          document.exitFullscreen?.();
          fsBtn.textContent = '⛶';
        }
      });
    }
  }
};

// ============================================================
// Tic-Tac-Toe Game
// ============================================================
const TicTacToe = {
  board: Array(9).fill(''),
  currentPlayer: 'X',
  gameOver: false,
  scores: { X: 0, O: 0 },

  winPatterns: [
    [0,1,2],[3,4,5],[6,7,8], // rows
    [0,3,6],[1,4,7],[2,5,8], // cols
    [0,4,8],[2,4,6]          // diagonals
  ],

  init(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    this.render(container);
    window.resetGame = () => this.reset(container);
  },

  render(container) {
    container.innerHTML = `
      <div class="ttt-game" style="width:100%;max-width:420px;margin:0 auto;padding:24px;user-select:none;">
        <div class="ttt-scores" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;font-family:var(--font-display);">
          <div style="text-align:center;">
            <div style="font-size:1.5rem;font-weight:900;color:var(--accent-primary);" id="score-x">0</div>
            <div style="font-size:0.7rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:.1em;">Player X</div>
          </div>
          <div id="ttt-status" style="font-size:0.85rem;color:var(--text-secondary);text-align:center;max-width:140px;line-height:1.3;">X's Turn</div>
          <div style="text-align:center;">
            <div style="font-size:1.5rem;font-weight:900;color:var(--accent-secondary);" id="score-o">0</div>
            <div style="font-size:0.7rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:.1em;">Player O</div>
          </div>
        </div>
        <div id="ttt-board" style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;"></div>
      </div>
    `;
    this.renderBoard(container);
  },

  renderBoard(container) {
    const board = container.querySelector('#ttt-board');
    board.innerHTML = '';
    this.board.forEach((cell, i) => {
      const btn = document.createElement('button');
      btn.style.cssText = `
        aspect-ratio:1;width:100%;border:2px solid var(--border-color);
        background:var(--bg-secondary);border-radius:12px;
        font-family:var(--font-display);font-size:2.4rem;font-weight:900;
        cursor:pointer;transition:all .2s;color:${cell === 'X' ? 'var(--accent-primary)' : 'var(--accent-secondary)'};
        display:flex;align-items:center;justify-content:center;
      `;
      btn.textContent = cell;
      if (!this.gameOver && !cell) {
        btn.addEventListener('mouseenter', () => { btn.style.borderColor = 'var(--accent-primary)'; btn.style.background = 'var(--bg-card)'; });
        btn.addEventListener('mouseleave', () => { btn.style.borderColor = 'var(--border-color)'; btn.style.background = 'var(--bg-secondary)'; });
        btn.addEventListener('click', () => this.makeMove(i, container));
      }
      board.appendChild(btn);
    });
  },

  makeMove(index, container) {
    if (this.board[index] || this.gameOver) return;
    this.board[index] = this.currentPlayer;
    this.renderBoard(container);

    const winner = this.checkWinner();
    const status = container.querySelector('#ttt-status');

    if (winner) {
      this.gameOver = true;
      this.scores[winner]++;
      container.querySelector('#score-x').textContent = this.scores.X;
      container.querySelector('#score-o').textContent = this.scores.O;
      status.textContent = `🎉 Player ${winner} Wins!`;
      status.style.color = winner === 'X' ? 'var(--accent-primary)' : 'var(--accent-secondary)';
      setTimeout(() => this.softReset(container), 2000);
    } else if (this.board.every(c => c)) {
      this.gameOver = true;
      status.textContent = "It's a Draw!";
      setTimeout(() => this.softReset(container), 2000);
    } else {
      this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
      status.textContent = `${this.currentPlayer}'s Turn`;
      status.style.color = '';
    }
  },

  checkWinner() {
    for (const [a, b, c] of this.winPatterns) {
      if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
        return this.board[a];
      }
    }
    return null;
  },

  softReset(container) {
    this.board = Array(9).fill('');
    this.gameOver = false;
    this.currentPlayer = 'X';
    this.renderBoard(container);
    const status = container.querySelector('#ttt-status');
    if (status) { status.textContent = "X's Turn"; status.style.color = ''; }
  },

  reset(container) {
    this.scores = { X: 0, O: 0 };
    this.softReset(container);
    const scoreX = container.querySelector('#score-x');
    const scoreO = container.querySelector('#score-o');
    if (scoreX) scoreX.textContent = 0;
    if (scoreO) scoreO.textContent = 0;
  }
};

// ============================================================
// Memory Match Game
// ============================================================
const MemoryMatch = {
  emojis: ['🎮', '🕹️', '👾', '🎯', '🏆', '⚡', '🔥', '💎'],
  cards: [],
  flipped: [],
  matched: 0,
  moves: 0,
  locked: false,

  init(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    this.start(container);
    window.resetGame = () => this.start(container);
  },

  start(container) {
    this.matched = 0;
    this.moves = 0;
    this.flipped = [];
    this.locked = false;
    this.cards = [...this.emojis, ...this.emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, i) => ({ id: i, emoji, revealed: false, matched: false }));
    this.render(container);
  },

  render(container) {
    container.innerHTML = `
      <div style="width:100%;max-width:480px;margin:0 auto;padding:24px;">
        <div style="display:flex;justify-content:space-between;margin-bottom:20px;font-family:var(--font-display);font-size:0.8rem;letter-spacing:.08em;text-transform:uppercase;">
          <span style="color:var(--text-muted);">Moves: <strong style="color:var(--accent-secondary);" id="mem-moves">0</strong></span>
          <span style="color:var(--text-muted);">Matched: <strong style="color:var(--accent-green);" id="mem-matched">0</strong>/8</span>
        </div>
        <div id="mem-board" style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;"></div>
      </div>
    `;
    this.renderCards(container);
  },

  renderCards(container) {
    const board = container.querySelector('#mem-board');
    board.innerHTML = '';
    this.cards.forEach((card, i) => {
      const btn = document.createElement('div');
      btn.style.cssText = `
        aspect-ratio:1;border-radius:12px;border:2px solid var(--border-color);
        background:${card.revealed || card.matched ? 'var(--bg-card)' : 'var(--bg-secondary)'};
        display:flex;align-items:center;justify-content:center;
        font-size:1.8rem;cursor:pointer;transition:all .2s;
        ${card.matched ? 'border-color:var(--accent-green);box-shadow:0 0 10px rgba(57,255,138,.3);' : ''}
      `;
      btn.textContent = card.revealed || card.matched ? card.emoji : '?';
      if (!card.matched) {
        btn.addEventListener('click', () => this.flip(i, container));
      }
      board.appendChild(btn);
    });
  },

  flip(index, container) {
    if (this.locked || this.flipped.includes(index) || this.cards[index].matched) return;
    this.cards[index].revealed = true;
    this.flipped.push(index);
    this.renderCards(container);

    if (this.flipped.length === 2) {
      this.moves++;
      container.querySelector('#mem-moves').textContent = this.moves;
      this.locked = true;
      const [a, b] = this.flipped;
      if (this.cards[a].emoji === this.cards[b].emoji) {
        this.cards[a].matched = true;
        this.cards[b].matched = true;
        this.matched++;
        container.querySelector('#mem-matched').textContent = this.matched;
        this.flipped = [];
        this.locked = false;
        if (this.matched === 8) {
          setTimeout(() => {
            Toast.show(`🏆 You won in ${this.moves} moves!`);
          }, 300);
        }
        this.renderCards(container);
      } else {
        setTimeout(() => {
          this.cards[a].revealed = false;
          this.cards[b].revealed = false;
          this.flipped = [];
          this.locked = false;
          this.renderCards(container);
        }, 900);
      }
    }
  }
};

// ============================================================
// Snake Game (Canvas)
// ============================================================
const SnakeGame = {
  canvas: null,
  ctx: null,
  snake: [],
  food: {},
  dir: { x: 1, y: 0 },
  nextDir: { x: 1, y: 0 },
  size: 20,
  score: 0,
  highScore: parseInt(localStorage.getItem('snake-hs') || '0'),
  running: false,
  interval: null,
  speed: 130,

  init(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;padding:24px;gap:16px;">
        <div style="display:flex;justify-content:space-between;width:100%;max-width:400px;font-family:var(--font-display);font-size:0.8rem;letter-spacing:.08em;text-transform:uppercase;">
          <span style="color:var(--text-muted);">Score: <strong style="color:var(--accent-green);" id="snake-score">0</strong></span>
          <span style="color:var(--text-muted);">Best: <strong style="color:var(--accent-yellow);" id="snake-hs">${this.highScore}</strong></span>
        </div>
        <canvas id="snakeCanvas" width="400" height="400" style="border:2px solid var(--border-color);border-radius:12px;background:#000;max-width:100%;"></canvas>
        <div id="snake-msg" style="font-family:var(--font-display);font-size:0.85rem;color:var(--text-muted);">Press ENTER or tap to start</div>
        <div style="display:flex;gap:8px;">
          <button class="btn btn-ghost btn-sm" id="snake-start-btn">▶ Start</button>
        </div>
        <!-- Mobile D-Pad -->
        <div class="dpad" style="display:grid;grid-template-columns:repeat(3,44px);grid-template-rows:repeat(2,44px);gap:4px;margin-top:8px;">
          <div></div>
          <button class="btn btn-ghost btn-sm dpad-btn" style="padding:0;justify-content:center;" data-dir="up">▲</button>
          <div></div>
          <button class="btn btn-ghost btn-sm dpad-btn" style="padding:0;justify-content:center;" data-dir="left">◀</button>
          <button class="btn btn-ghost btn-sm dpad-btn" style="padding:0;justify-content:center;" data-dir="down">▼</button>
          <button class="btn btn-ghost btn-sm dpad-btn" style="padding:0;justify-content:center;" data-dir="right">▶</button>
        </div>
      </div>
    `;

    this.canvas = container.querySelector('#snakeCanvas');
    this.ctx = this.canvas.getContext('2d');

    container.querySelector('#snake-start-btn').addEventListener('click', () => this.start(container));
    document.addEventListener('keydown', (e) => this.handleKey(e));

    container.querySelectorAll('.dpad-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const d = btn.dataset.dir;
        if (d === 'up' && this.dir.y !== 1) this.nextDir = { x: 0, y: -1 };
        if (d === 'down' && this.dir.y !== -1) this.nextDir = { x: 0, y: 1 };
        if (d === 'left' && this.dir.x !== 1) this.nextDir = { x: -1, y: 0 };
        if (d === 'right' && this.dir.x !== -1) this.nextDir = { x: 1, y: 0 };
      });
    });

    window.resetGame = () => { this.stop(); this.drawIdle(); };
    this.drawIdle();
  },

  drawIdle() {
    if (!this.ctx) return;
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, 400, 400);
    this.ctx.font = 'bold 20px Orbitron, monospace';
    this.ctx.fillStyle = '#ff3c6e';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('🐍 SNAKE', 200, 180);
    this.ctx.font = '13px Orbitron, monospace';
    this.ctx.fillStyle = '#9090b8';
    this.ctx.fillText('Press START to play', 200, 220);
  },

  start(container) {
    this.stop();
    this.score = 0;
    this.dir = { x: 1, y: 0 };
    this.nextDir = { x: 1, y: 0 };
    this.snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
    this.placeFood();
    this.running = true;
    container.querySelector('#snake-score').textContent = 0;
    container.querySelector('#snake-msg').textContent = 'Use arrows or D-pad';
    this.interval = setInterval(() => this.tick(container), this.speed);
  },

  stop() {
    clearInterval(this.interval);
    this.running = false;
  },

  placeFood() {
    const cols = 400 / this.size;
    const rows = 400 / this.size;
    do {
      this.food = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) };
    } while (this.snake.some(s => s.x === this.food.x && s.y === this.food.y));
  },

  tick(container) {
    this.dir = this.nextDir;
    const head = { x: this.snake[0].x + this.dir.x, y: this.snake[0].y + this.dir.y };
    const cols = 400 / this.size;
    const rows = 400 / this.size;

    // Wall collision
    if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows || this.snake.some(s => s.x === head.x && s.y === head.y)) {
      this.stop();
      if (this.score > this.highScore) {
        this.highScore = this.score;
        localStorage.setItem('snake-hs', this.highScore);
        container.querySelector('#snake-hs').textContent = this.highScore;
      }
      container.querySelector('#snake-msg').textContent = `Game Over! Score: ${this.score}`;
      this.drawGameOver();
      return;
    }

    this.snake.unshift(head);
    if (head.x === this.food.x && head.y === this.food.y) {
      this.score++;
      container.querySelector('#snake-score').textContent = this.score;
      this.placeFood();
      // Speed up slightly
      if (this.score % 5 === 0 && this.speed > 70) {
        this.speed -= 8;
        clearInterval(this.interval);
        this.interval = setInterval(() => this.tick(container), this.speed);
      }
    } else {
      this.snake.pop();
    }

    this.draw();
  },

  draw() {
    const ctx = this.ctx;
    const s = this.size;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, 400, 400);

    // Draw grid lightly
    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    ctx.lineWidth = 0.5;
    for (let x = 0; x < 400; x += s) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 400); ctx.stroke();
    }
    for (let y = 0; y < 400; y += s) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(400, y); ctx.stroke();
    }

    // Draw food
    ctx.fillStyle = '#ff3c6e';
    ctx.shadowColor = '#ff3c6e';
    ctx.shadowBlur = 10;
    ctx.fillRect(this.food.x * s + 2, this.food.y * s + 2, s - 4, s - 4);
    ctx.shadowBlur = 0;

    // Draw snake
    this.snake.forEach((seg, i) => {
      const ratio = 1 - (i / this.snake.length) * 0.7;
      ctx.fillStyle = i === 0 ? '#39ff8a' : `rgba(57,255,138,${ratio})`;
      if (i === 0) { ctx.shadowColor = '#39ff8a'; ctx.shadowBlur = 8; }
      ctx.fillRect(seg.x * s + 1, seg.y * s + 1, s - 2, s - 2);
      ctx.shadowBlur = 0;
    });
  },

  drawGameOver() {
    const ctx = this.ctx;
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(0, 0, 400, 400);
    ctx.font = 'bold 22px Orbitron, monospace';
    ctx.fillStyle = '#ff3c6e';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', 200, 185);
    ctx.font = '13px Orbitron, monospace';
    ctx.fillStyle = '#ffe23c';
    ctx.fillText(`Score: ${this.score}`, 200, 220);
  },

  handleKey(e) {
    if (!this.running) return;
    const map = {
      ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 },
      ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 },
      w: { x: 0, y: -1 }, s: { x: 0, y: 1 },
      a: { x: -1, y: 0 }, d: { x: 1, y: 0 }
    };
    const newDir = map[e.key];
    if (!newDir) return;
    // Prevent reversing
    if (newDir.x !== -this.dir.x || newDir.y !== -this.dir.y) {
      this.nextDir = newDir;
      e.preventDefault();
    }
  }
};

// ============================================================
// 2048 Game
// ============================================================
const Game2048 = {
  grid: [],
  score: 0,
  size: 4,
  colors: {
    0: '#1a1a26', 2: '#4a4a7a', 4: '#5a3aaa', 8: '#e07820',
    16: '#e06020', 32: '#e04040', 64: '#e02020', 128: '#e0c040',
    256: '#e0c000', 512: '#e0b800', 1024: '#e0b000', 2048: '#ff3c6e'
  },

  init(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    this.startGame(container);
    window.resetGame = () => this.startGame(container);
  },

  startGame(container) {
    this.grid = Array.from({ length: this.size }, () => Array(this.size).fill(0));
    this.score = 0;
    this.addTile();
    this.addTile();
    this.render(container);
    this.setupControls(container);
  },

  addTile() {
    const empty = [];
    this.grid.forEach((row, r) => row.forEach((cell, c) => { if (!cell) empty.push([r, c]); }));
    if (!empty.length) return;
    const [r, c] = empty[Math.floor(Math.random() * empty.length)];
    this.grid[r][c] = Math.random() < 0.9 ? 2 : 4;
  },

  render(container) {
    const existing = container.querySelector('.game2048-wrap');
    if (existing) {
      container.querySelector('#score-2048').textContent = this.score;
      this.renderGrid(container);
      return;
    }

    container.innerHTML = `
      <div class="game2048-wrap" style="padding:24px;max-width:400px;margin:0 auto;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;font-family:var(--font-display);">
          <span style="font-size:1.5rem;font-weight:900;color:var(--accent-primary);">2048</span>
          <span style="font-size:0.8rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:.08em;">Score: <strong style="color:var(--accent-yellow);" id="score-2048">0</strong></span>
        </div>
        <div id="grid-2048" style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;background:var(--bg-secondary);border-radius:12px;padding:10px;"></div>
        <p style="margin-top:16px;font-size:0.75rem;color:var(--text-muted);text-align:center;">Use arrow keys or swipe to play</p>
      </div>
    `;
    this.renderGrid(container);
  },

  renderGrid(container) {
    const grid = container.querySelector('#grid-2048');
    if (!grid) return;
    grid.innerHTML = '';
    this.grid.forEach(row => {
      row.forEach(val => {
        const cell = document.createElement('div');
        const bg = this.colors[val] || '#ff3c6e';
        cell.style.cssText = `
          aspect-ratio:1;border-radius:8px;display:flex;align-items:center;justify-content:center;
          background:${bg};font-family:var(--font-display);font-size:${val > 999 ? '1rem' : '1.3rem'};
          font-weight:900;color:${val > 4 ? '#fff' : '#c0c0e0'};
          transition:all .15s;
        `;
        cell.textContent = val || '';
        grid.appendChild(cell);
      });
    });
  },

  setupControls(container) {
    // Keyboard
    if (!this._keyHandler) {
      this._keyHandler = (e) => {
        const map = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' };
        if (map[e.key]) { e.preventDefault(); this.move(map[e.key], container); }
      };
      document.addEventListener('keydown', this._keyHandler);
    }

    // Touch swipe
    let startX, startY;
    container.addEventListener('touchstart', e => { startX = e.touches[0].clientX; startY = e.touches[0].clientY; }, { passive: true });
    container.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      if (Math.abs(dx) > Math.abs(dy)) this.move(dx > 0 ? 'right' : 'left', container);
      else this.move(dy > 0 ? 'down' : 'up', container);
    }, { passive: true });
  },

  move(dir, container) {
    const prev = JSON.stringify(this.grid);
    if (dir === 'left') this.grid = this.grid.map(row => this.mergeRow(row));
    if (dir === 'right') this.grid = this.grid.map(row => this.mergeRow([...row].reverse()).reverse());
    if (dir === 'up') {
      this.grid = this.transpose(this.grid).map(row => this.mergeRow(row));
      this.grid = this.transpose(this.grid);
    }
    if (dir === 'down') {
      this.grid = this.transpose(this.grid).map(row => this.mergeRow([...row].reverse()).reverse());
      this.grid = this.transpose(this.grid);
    }
    if (JSON.stringify(this.grid) !== prev) {
      this.addTile();
      this.render(container);
    }
  },

  mergeRow(row) {
    const tiles = row.filter(v => v);
    for (let i = 0; i < tiles.length - 1; i++) {
      if (tiles[i] === tiles[i + 1]) { tiles[i] *= 2; this.score += tiles[i]; tiles.splice(i + 1, 1); }
    }
    while (tiles.length < this.size) tiles.push(0);
    return tiles;
  },

  transpose(grid) {
    return grid[0].map((_, i) => grid.map(row => row[i]));
  }
};

// ============================================================
// Init on DOM Ready
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  NavManager.init();
  NavManager.setActive();
  GameFilter.init();
  LazyLoader.init();
  ScrollAnimator.init();
  GameManager.init();

  // Bind theme toggle
  const themeBtn = document.querySelector('.theme-toggle');
  if (themeBtn) themeBtn.addEventListener('click', () => ThemeManager.toggle());

  // Init individual games based on page
  if (document.getElementById('ttt-container')) TicTacToe.init('ttt-container');
  if (document.getElementById('memory-container')) MemoryMatch.init('memory-container');
  if (document.getElementById('snake-container')) SnakeGame.init('snake-container');
  if (document.getElementById('game2048-container')) Game2048.init('game2048-container');
});
