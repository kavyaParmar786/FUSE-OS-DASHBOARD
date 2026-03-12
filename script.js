/* ═══════════════════════════════════════════════════════════
   FUSE OS — Main JavaScript
   ═══════════════════════════════════════════════════════════ */

'use strict';

/* ── Navbar scroll behaviour ──────────────────────────────── */
(function initNavbar() {
  const nav    = document.querySelector('.navbar');
  const burger = document.querySelector('.nav-burger');
  const links  = document.querySelector('.nav-links');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  if (burger && links) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      links.classList.toggle('open');
    });
  }

  // Active link highlight
  const navLinks = document.querySelectorAll('.nav-link[href]');
  const current  = location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(l => {
    const href = l.getAttribute('href').split('/').pop();
    if (href === current || (current === '' && href === 'index.html')) {
      l.classList.add('active');
    }
  });
})();

/* ── Particle Background ──────────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  const COLORS = [
    'rgba(0,212,255,',
    'rgba(139,92,246,',
    'rgba(192,132,252,',
    'rgba(6,182,212,',
  ];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createParticle() {
    return {
      x:     Math.random() * W,
      y:     Math.random() * H,
      r:     Math.random() * 2 + 0.5,
      vx:    (Math.random() - 0.5) * 0.35,
      vy:    (Math.random() - 0.5) * 0.35,
      alpha: Math.random() * 0.6 + 0.1,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.02 + 0.01,
    };
  }

  function initParticles() {
    const count = Math.min(Math.floor((W * H) / 12000), 90);
    particles = Array.from({ length: count }, createParticle);
  }

  function drawLine(p1, p2, dist, maxDist) {
    const alpha = (1 - dist / maxDist) * 0.12;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.strokeStyle = `rgba(0,212,255,${alpha})`;
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    const maxDist = 150;

    particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;
      p.pulse += p.pulseSpeed;

      // Wrap edges
      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;
      if (p.y < -10) p.y = H + 10;
      if (p.y > H + 10) p.y = -10;

      const alpha = p.alpha * (0.7 + 0.3 * Math.sin(p.pulse));

      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + alpha + ')';
      ctx.fill();

      // Glow
      if (p.r > 1.2) {
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        grad.addColorStop(0, p.color + alpha * 0.4 + ')');
        grad.addColorStop(1, p.color + '0)');
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      // Connect nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        const q    = particles[j];
        const dx   = p.x - q.x;
        const dy   = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) drawLine(p, q, dist, maxDist);
      }
    });

    requestAnimationFrame(animate);
  }

  resize();
  initParticles();
  animate();

  window.addEventListener('resize', () => {
    resize();
    initParticles();
  }, { passive: true });
})();

/* ── Scroll Reveal ────────────────────────────────────────── */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  els.forEach(el => io.observe(el));
})();

/* ── Animated Counter ─────────────────────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  function animateCount(el) {
    const target   = parseInt(el.dataset.count, 10);
    const suffix   = el.dataset.suffix || '';
    const duration = 2000;
    const start    = performance.now();

    function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const value    = Math.floor(easeOut(progress) * target);
      el.textContent = value.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCount(e.target);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => io.observe(el));
})();

/* ── Commands Page: search + filter ──────────────────────── */
(function initCommands() {
  const searchInput = document.getElementById('cmd-search');
  const catBtns     = document.querySelectorAll('.cmd-cat-btn');
  const groups      = document.querySelectorAll('.commands-group');
  const rows        = document.querySelectorAll('.commands-table tr[data-category]');

  if (!searchInput) return;

  function filter() {
    const q   = searchInput.value.toLowerCase();
    const cat = document.querySelector('.cmd-cat-btn.active')?.dataset.cat || 'all';

    groups.forEach(g => {
      let hasVisible = false;
      g.querySelectorAll('tr[data-category]').forEach(row => {
        const name = row.querySelector('.cmd-name')?.textContent.toLowerCase() || '';
        const desc = row.querySelector('.cmd-desc')?.textContent.toLowerCase() || '';
        const rowCat = row.dataset.category || '';
        const matchSearch = !q || name.includes(q) || desc.includes(q);
        const matchCat    = cat === 'all' || rowCat === cat;
        const show = matchSearch && matchCat;
        row.style.display = show ? '' : 'none';
        if (show) hasVisible = true;
      });
      g.style.display = hasVisible ? '' : 'none';
    });
  }

  searchInput.addEventListener('input', filter);

  catBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      catBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filter();
    });
  });
})();

/* ── Dashboard sidebar nav ────────────────────────────────── */
(function initDashboard() {
  const navItems = document.querySelectorAll('.dash-nav-item');
  const panels   = document.querySelectorAll('.dash-panel[data-panel]');
  if (!navItems.length) return;

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const target = item.dataset.target;
      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');
      panels.forEach(p => {
        p.style.display = (!target || p.dataset.panel === target) ? '' : 'none';
      });
    });
  });
})();

/* ── Smooth anchor scroll ─────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
  });
});

/* ── Glowing cursor trail (subtle) ───────────────────────── */
(function initCursorTrail() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  const MAX = 8;
  const dots = Array.from({ length: MAX }, (_, i) => {
    const d = document.createElement('div');
    d.style.cssText = `
      position:fixed; pointer-events:none; z-index:9998;
      border-radius:50%; transition: opacity 0.3s;
      width:${4 + i}px; height:${4 + i}px;
      background: radial-gradient(circle, rgba(0,212,255,${0.25 - i * 0.025}) 0%, transparent 70%);
    `;
    document.body.appendChild(d);
    return d;
  });

  let mouse = { x: -200, y: -200 };
  let positions = Array.from({ length: MAX }, () => ({ x: -200, y: -200 }));

  document.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }, { passive: true });

  function animTrail() {
    positions[0] = { ...mouse };
    for (let i = 1; i < MAX; i++) {
      positions[i] = {
        x: positions[i].x + (positions[i - 1].x - positions[i].x) * 0.3,
        y: positions[i].y + (positions[i - 1].y - positions[i].y) * 0.3,
      };
    }
    dots.forEach((d, i) => {
      const s = d.style;
      s.left = positions[i].x - (4 + i) / 2 + 'px';
      s.top  = positions[i].y - (4 + i) / 2 + 'px';
    });
    requestAnimationFrame(animTrail);
  }
  animTrail();
})();
