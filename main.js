/* ============================================================
   ARVIN BEARNEZA — PORTFOLIO v2 JAVASCRIPT
   main.js
   ============================================================ */

/* ------------------------------------------------------------
   0. MOBILE BURGER MENU
   ------------------------------------------------------------ */
const navBurger   = document.getElementById('navBurger');
const mobileMenu  = document.getElementById('mobileMenu');

if (navBurger && mobileMenu) {
  const closeMenu = () => {
    navBurger.classList.remove('open');
    mobileMenu.classList.remove('open');
    navBurger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };
  const openMenu = () => {
    navBurger.classList.add('open');
    mobileMenu.classList.add('open');
    navBurger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };
  navBurger.addEventListener('click', () => {
    mobileMenu.classList.contains('open') ? closeMenu() : openMenu();
  });
  mobileMenu.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
}

/* ------------------------------------------------------------
   1. CUSTOM CURSOR
   ------------------------------------------------------------ */
const cursor     = document.getElementById('cursor');
const cursorRing = document.getElementById('cursor-ring');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
  if (prefersReducedMotion) {
    cursorRing.style.left = mouseX + 'px';
    cursorRing.style.top  = mouseY + 'px';
  }
});

if (!prefersReducedMotion) {
  (function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  })();
}

/* ------------------------------------------------------------
   1b. CURSOR-REACTIVE AQUAMARINE GLOW
   Lives behind each section's content (negative z-index in CSS) —
   tracks the pointer relative to whichever section is hovered.
   ------------------------------------------------------------ */
const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (canHover && !prefersReducedMotion) {
  let glowSection = null;

  document.addEventListener('mousemove', (e) => {
    const sec = e.target.closest('section');
    if (sec !== glowSection) {
      if (glowSection) glowSection.classList.remove('glow-active');
      glowSection = sec;
      if (glowSection) glowSection.classList.add('glow-active');
    }
    if (glowSection) {
      const rect = glowSection.getBoundingClientRect();
      glowSection.style.setProperty('--mx', (e.clientX - rect.left) + 'px');
      glowSection.style.setProperty('--my', (e.clientY - rect.top) + 'px');
    }
  });
  document.addEventListener('mouseleave', () => {
    if (glowSection) glowSection.classList.remove('glow-active');
    glowSection = null;
  });
}

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
   1c. 3D TILT — project cards track the pointer in perspective,
   with a glassy highlight (CSS ::before) following along.
   ------------------------------------------------------------ */
if (canHover && !prefersReducedMotion) {
  document.querySelectorAll('.project-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const rx = (0.5 - py) * 6;
      const ry = (px - 0.5) * 6;
      card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      card.style.setProperty('--cx', (px * 100) + '%');
      card.style.setProperty('--cy', (py * 100) + '%');
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

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
  if (prefersReducedMotion) {
    el.childNodes[0].textContent = target;
    return;
  }
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

/* ------------------------------------------------------------
   7b. VIDEO SEQUENCES — cycle intro/outro clips end-to-end
   ------------------------------------------------------------ */
document.querySelectorAll('.proj-video[data-sequence]').forEach((video) => {
  const sources = video.dataset.sequence.split(',');
  let i = 0;
  video.addEventListener('ended', () => {
    i = (i + 1) % sources.length;
    video.src = sources[i];
    video.play().catch(() => {});
  });
});

const elocateSlides = document.querySelectorAll('.elocate-slide');
const elocateDots   = document.querySelectorAll('.edot');

if (elocateSlides.length) {
  let elocateCur = 0;
  let elocateTimer = null;

  const elocateGoTo = (n) => {
    elocateSlides[elocateCur].classList.remove('active');
    elocateDots[elocateCur].classList.remove('active');
    elocateCur = ((n % elocateSlides.length) + elocateSlides.length) % elocateSlides.length;
    elocateSlides[elocateCur].classList.add('active');
    elocateDots[elocateCur].classList.add('active');
  };

  const elocateStart = () => {
    elocateTimer = setInterval(() => elocateGoTo(elocateCur + 1), 3200);
  };

  elocateDots.forEach((d, i) => d.addEventListener('click', () => {
    elocateGoTo(i);
    clearInterval(elocateTimer);
    elocateStart();
  }));

  elocateStart();
}
