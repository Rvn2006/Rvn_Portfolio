/* ============================================================
   ARVIN BEARNEZA — PORTFOLIO v2 JAVASCRIPT
   main.js
   ============================================================ */

/* ------------------------------------------------------------
   1. CUSTOM CURSOR
   ------------------------------------------------------------ */
const cursor     = document.getElementById('cursor');
const cursorRing = document.getElementById('cursor-ring');

let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

(function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top  = ringY + 'px';
  requestAnimationFrame(animateRing);
})();

document.querySelectorAll('a, button, .project-card, .skill-item, .role-pill').forEach((el) => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform     = 'translate(-50%,-50%) scale(2.5)';
    cursorRing.style.transform = 'translate(-50%,-50%) scale(1.5)';
    cursorRing.style.borderColor = 'var(--accent2)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform     = 'translate(-50%,-50%) scale(1)';
    cursorRing.style.transform = 'translate(-50%,-50%) scale(1)';
    cursorRing.style.borderColor = 'var(--accent)';
  });
});

/* ------------------------------------------------------------
   2. SCROLL REVEAL
   ------------------------------------------------------------ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 75);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

/* ------------------------------------------------------------
   3. STATS COUNTER ANIMATION
   ------------------------------------------------------------ */
function animateCounter(el, target) {
  let current = 0;
  const step = () => {
    current = Math.min(current + Math.ceil(target / 30), target);
    el.childNodes[0].textContent = current;
    if (current < target) requestAnimationFrame(step);
  };
  step();
}

const statsBar = document.querySelector('.stats-bar');
if (statsBar) {
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('.stat-num[data-target]').forEach((el) => {
        const target = parseInt(el.dataset.target, 10);
        if (!isNaN(target)) animateCounter(el, target);
      });
      statsObserver.unobserve(entry.target);
    });
  }, { threshold: 0.5 });
  statsObserver.observe(statsBar);
}

/* ------------------------------------------------------------
   4. ACTIVE NAV LINK ON SCROLL
   ------------------------------------------------------------ */
const navLinks = document.querySelectorAll('.nav-links a');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const id = entry.target.id || '';
      navLinks.forEach((link) => {
        link.style.color = '';
        if (link.getAttribute('href') === '#' + id) {
          link.style.color = 'var(--accent)';
        }
      });
    }
  });
}, { threshold: 0.35 });

document.querySelectorAll('section[id]').forEach((s) => navObserver.observe(s));

/* ------------------------------------------------------------
   5. SMOOTH SCROLL
   ------------------------------------------------------------ */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ------------------------------------------------------------
   6. LED WALL CARD — RANDOM BLINK ANIMATION
   ------------------------------------------------------------ */
const ledDots = document.querySelectorAll('.led-dot:not(.active)');

if (ledDots.length) {
  setInterval(() => {
    ledDots.forEach((dot) => {
      dot.style.opacity = Math.random() > 0.6 ? '0.25' : '0.06';
    });
  }, 400);
}

/* ------------------------------------------------------------
   7. VIDEO CARDS — PAUSE ON LOW-POWER MODE HINT
   ------------------------------------------------------------ */
const videos = document.querySelectorAll('.proj-video');
const videoObs = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.play().catch(() => {});
    } else {
      entry.target.pause();
    }
  });
}, { threshold: 0.2 });

videos.forEach((v) => videoObs.observe(v));

  const slides = document.querySelectorAll('.elocate-slide');
    const dots   = document.querySelectorAll('.edot');
    let cur = 0;
    if (slides.length) {
      function goTo(n) {
        slides[cur].classList.remove('active');
        dots[cur].classList.remove('active');
        cur = n;
        slides[cur].classList.add('active');
        dots[cur].classList.add('active');
      }
      dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));
      setInterval(() => goTo((cur + 1) % slides.length), 3200)
    }
