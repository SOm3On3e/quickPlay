# 🎮 QuickPlay — Casual Browser Gaming Platform

A complete, production-ready frontend for a free browser gaming platform. Mobile-first, SEO-optimized, and built with vanilla HTML/CSS/JS — zero frameworks, zero dependencies.

---

## 📁 Project Structure

```
quickplay/
│
├── index.html                          # Homepage
├── games.html                          # Games listing page
├── blog.html                           # Blog listing page
├── 404.html                            # Custom error page
├── sitemap.xml                         # XML sitemap for SEO
├── robots.txt                          # Crawler instructions
├── manifest.json                       # PWA web app manifest
│
├── css/
│   └── style.css                       # All styles (1 file, ~900 lines)
│
├── js/
│   └── main.js                         # All JS: theme, nav, games, filters
│
├── games/
│   ├── game-template.html              # ← REUSABLE: copy to add new games
│   ├── snake.html                      # Snake Classic
│   ├── 2048.html                       # 2048 puzzle
│   ├── memory-match.html               # Memory card matching
│   └── tic-tac-toe.html               # Classic X and O
│
└── blog/
    ├── post-template.html              # ← REUSABLE: copy to add new posts
    ├── top-10-games-when-bored.html
    ├── best-browser-games-2026.html
    └── puzzle-games-brain-training.html
```

---

## 🚀 Quick Start

No build process needed — just open files directly in a browser, or serve with any static file server:

```bash
# Python (built-in)
python -m http.server 8080

# Node.js (npx)
npx serve .

# VS Code
# Install "Live Server" extension, right-click index.html → Open with Live Server
```

---

## ➕ How to Add a New Game

1. **Duplicate the template:**

   ```bash
   cp games/game-template.html games/your-game-name.html
   ```

2. **Update the template** — replace all `[PLACEHOLDERS]`:
   - Page `<title>` and `<meta>` tags
   - JSON-LD structured data (name, description, genre, rating)
   - Breadcrumb and H1
   - Game area: use either the JS `div#game-root` or an `<iframe>`
   - "How to Play" cards
   - Next game recommendations

3. **Add your game logic** to `js/main.js` or as a separate script file:

   ```javascript
   // In main.js — add a new game object:
   const MyGame = {
     init(containerId) {
       const container = document.getElementById(containerId);
       // ... game code
     },
   };

   // In DOMContentLoaded:
   if (document.getElementById("my-game-container")) {
     MyGame.init("my-game-container");
   }
   ```

4. **Add a game card** to `games.html` and `index.html` (trending section):

   ```html
   <article class="game-card" data-category="arcade">
     <div class="game-thumb">
       <div class="game-thumb-placeholder">🎯</div>
       <span class="game-badge badge-new">✨ New</span>
       <div class="play-overlay"><div class="play-btn-circle">▶</div></div>
     </div>
     <div class="game-info">
       <div class="game-meta">
         <span class="game-category">Arcade</span>
         <span class="game-rating">★ 4.5</span>
       </div>
       <h2 class="game-title-text">My New Game</h2>
       <p class="game-desc">Short description of the game.</p>
       <div class="game-footer">
         <span class="game-plays">🎮 0 plays</span>
         <a href="games/my-new-game.html" class="btn btn-primary btn-sm"
           >Play Now</a
         >
       </div>
     </div>
   </article>
   ```

5. **Update `sitemap.xml`** — add a new `<url>` entry.

---

## ✍️ How to Add a New Blog Post

1. **Duplicate the template:**

   ```bash
   cp blog/post-template.html blog/your-post-slug.html
   ```

2. **Update all `[PLACEHOLDERS]`** with real content.

3. **Add the post card** to `blog.html` and optionally `index.html`.

4. **Update `sitemap.xml`** with the new URL.

### SEO Checklist for Blog Posts

- [ ] Unique, keyword-rich `<title>` (50–60 chars)
- [ ] Meta `description` with primary keyword (150–160 chars)
- [ ] `<link rel="canonical">` pointing to the live URL
- [ ] JSON-LD `BlogPosting` structured data filled out
- [ ] H1 includes primary keyword
- [ ] H2/H3 hierarchy is logical
- [ ] At least 2 internal links to game pages
- [ ] `<time datetime="YYYY-MM-DD">` on publication date
- [ ] Author name in `itemprop="author"`

---

## 🎨 Design System

### CSS Variables (in `style.css`)

| Variable             | Purpose          | Dark Value |
| -------------------- | ---------------- | ---------- |
| `--bg-primary`       | Page background  | `#0a0a0f`  |
| `--bg-card`          | Card backgrounds | `#1a1a26`  |
| `--accent-primary`   | Pink/Red CTAs    | `#ff3c6e`  |
| `--accent-secondary` | Cyan highlights  | `#00e5ff`  |
| `--accent-yellow`    | Ratings, stats   | `#ffe23c`  |
| `--accent-green`     | Success, live    | `#39ff8a`  |
| `--font-display`     | Headings, brand  | `Orbitron` |
| `--font-body`        | Body text        | `Exo 2`    |

### Component Classes

```css
/* Buttons */
.btn .btn-primary     /* Hot pink CTA */
.btn .btn-secondary   /* Cyan outline */
.btn .btn-ghost       /* Subtle border */
.btn-sm / .btn-lg     /* Size modifiers */

/* Game Cards */
.game-card            /* Container */
.game-thumb           /* Image area */
.game-badge           /* Trending/New/Hot label */
.badge-trending / .badge-new / .badge-hot

/* Blog Cards */
.blog-card
.blog-thumb
.tag .tag-guide / .tag-list / .tag-tips / .tag-review

/* Layout */
.container            /* Max-width wrapper */
.grid-2/3/4           /* Responsive grids */
.games-grid           /* Auto-fill game grid */
.section-pad          /* Section spacing */
```

---

## 🔍 SEO Implementation

Every page includes:

- Semantic HTML (`<header>`, `<main>`, `<article>`, `<section>`, `<footer>`)
- Proper H1→H2→H3 heading hierarchy
- `<meta>` title + description + keywords
- Open Graph tags for social sharing
- JSON-LD structured data (WebSite, VideoGame, BlogPosting)
- `<link rel="canonical">` on every page
- `aria-label` / `role` attributes for accessibility
- `itemprop` microdata on game and blog content
- `sitemap.xml` + `robots.txt`

### JSON-LD Types Used

| Page          | Schema Type            |
| ------------- | ---------------------- |
| Homepage      | `WebSite` + `ItemList` |
| Games listing | `CollectionPage`       |
| Game page     | `VideoGame`            |
| Blog listing  | `Blog`                 |
| Blog post     | `BlogPosting`          |

---

## ⚡ Performance Features

- **No frameworks** — pure HTML/CSS/JS, ~50KB total before gzip
- **One CSS file** — no render-blocking stylesheets
- **Deferred JS** — `<script defer>` on all scripts
- **Lazy loading** — images use `IntersectionObserver`
- **CSS-only animations** — no JS animation libraries
- **Google Fonts** — preconnected, loaded async
- **Minimal DOM** — games render directly into containers

---

## 🌙 Dark / Light Mode

Toggle is built into the navbar. Preference is saved to `localStorage` under the key `quickplay-theme`.

```javascript
// To change theme programmatically:
ThemeManager.apply("light"); // or 'dark'
ThemeManager.toggle(); // flip between the two
```

---

## 📱 Mobile Support

- Mobile-first CSS with breakpoints at 500px, 768px, 900px, 1100px
- Touch controls on Snake (D-pad) and 2048 (swipe detection)
- Hamburger nav menu for small screens
- All games playable on mobile without keyboard

---

## 🔧 Deployment

### Static Hosting (Recommended)

**Netlify:**

```bash
# Drag and drop the folder at netlify.com/drop
# Or via CLI:
npx netlify-cli deploy --prod --dir .
```

**Vercel:**

```bash
npx vercel --prod
```

**GitHub Pages:**

1. Push to a GitHub repo
2. Settings → Pages → Source: `/ (root)` on `main`

### Redirect Rules

Add this to `netlify.toml` for clean 404 handling:

```toml
[[redirects]]
  from = "/*"
  to = "/404.html"
  status = 404
```

---

## 📊 Google Search Console Setup

1. Verify site ownership (HTML tag method recommended)
2. Submit sitemap: `https://yoursite.com/sitemap.xml`
3. Request indexing for key pages after launch
4. Monitor Core Web Vitals under "Experience" tab

---

## 📄 License

MIT License — free to use, modify, and distribute. Attribution appreciated but not required.

---

_Built with ❤️ by QuickPlay. Zero frameworks. Zero nonsense. Just games._
