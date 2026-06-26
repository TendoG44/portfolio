/**
 * Portfolio — Main JavaScript
 * Navigation, animations, thème, formulaire
 */

'use strict';

/* ============================================
   THEME TOGGLE
   ============================================ */
const themeToggle = document.getElementById('theme-toggle');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

function initTheme() {
  const saved = localStorage.getItem('theme');
  if (saved) {
    setTheme(saved);
  } else {
    setTheme(prefersDark.matches ? 'dark' : 'light');
  }
}

themeToggle?.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  setTheme(current === 'dark' ? 'light' : 'dark');
});

initTheme();

/* ============================================
   CUSTOM CURSOR
   ============================================ */
const cursorDot = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');

if (cursorDot && cursorRing && window.matchMedia('(hover: hover)').matches) {
  let mouseX = 0;
  let mouseY = 0;
  let ringX = 0;
  let ringY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;
    requestAnimationFrame(animateRing);
  }
  animateRing();

  const interactiveElements = document.querySelectorAll('a, button, input, textarea, .project-card');
  interactiveElements.forEach((el) => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
  });
}

/* ============================================
   MOBILE NAVIGATION
   ============================================ */
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav__link');

function closeMenu() {
  navToggle?.classList.remove('active');
  navMenu?.classList.remove('open');
  navToggle?.setAttribute('aria-expanded', 'false');
}

navToggle?.addEventListener('click', () => {
  const isOpen = navMenu?.classList.toggle('open');
  navToggle.classList.toggle('active');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener('click', closeMenu);
});

/* ============================================
   HEADER SCROLL EFFECT
   ============================================ */
const header = document.getElementById('header');

function handleScroll() {
  header?.classList.toggle('scrolled', window.scrollY > 50);
}
window.addEventListener('scroll', handleScroll, { passive: true });
handleScroll();

/* ============================================
   ACTIVE NAV LINK ON SCROLL
   ============================================ */
const sections = document.querySelectorAll('section[id]');

function highlightNavLink() {
  const scrollY = window.scrollY + 100;

  sections.forEach((section) => {
    const id = section.getAttribute('id');
    const top = section.offsetTop;
    const height = section.offsetHeight;

    if (scrollY >= top && scrollY < top + height) {
      navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}

window.addEventListener('scroll', highlightNavLink, { passive: true });

/* ============================================
   SCROLL REVEAL (Intersection Observer)
   ============================================ */
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
);

revealElements.forEach((el) => revealObserver.observe(el));

/* ============================================
   TYPING EFFECT
   ============================================ */
const typedElement = document.getElementById('typed-text');
const roles = [
  'Développeur Web',
  'Créateur d\'interfaces',
  'Passionné de code',
  'Designer UI/UX',
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 100;

function typeEffect() {
  if (!typedElement) return;

  const currentRole = roles[roleIndex];

  if (isDeleting) {
    typedElement.textContent = currentRole.substring(0, charIndex - 1);
    charIndex--;
    typeSpeed = 50;
  } else {
    typedElement.textContent = currentRole.substring(0, charIndex + 1);
    charIndex++;
    typeSpeed = 100;
  }

  if (!isDeleting && charIndex === currentRole.length) {
    typeSpeed = 2000;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    typeSpeed = 500;
  }

  setTimeout(typeEffect, typeSpeed);
}

typeEffect();

/* ============================================
   COUNTER ANIMATION
   ============================================ */
const counters = document.querySelectorAll('[data-count]');

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const duration = 2000;
      const start = performance.now();

      function updateCounter(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target);

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          el.textContent = target;
        }
      }

      requestAnimationFrame(updateCounter);
      counterObserver.unobserve(el);
    });
  },
  { threshold: 0.5 }
);

counters.forEach((counter) => counterObserver.observe(counter));

/* ============================================
   SKILL PROGRESS BARS
   ============================================ */
const progressBars = document.querySelectorAll('.skill-card__progress');

const progressObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const bar = entry.target;
      const progress = bar.dataset.progress;
      bar.style.width = `${progress}%`;
      progressObserver.unobserve(bar);
    });
  },
  { threshold: 0.5 }
);

progressBars.forEach((bar) => progressObserver.observe(bar));

/* ============================================
   PROJECT FILTER
   ============================================ */
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterBtns.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    projectCards.forEach((card) => {
      const category = card.dataset.category;
      const show = filter === 'all' || category === filter;
      card.classList.toggle('hidden', !show);

      if (show) {
        card.classList.remove('visible');
        requestAnimationFrame(() => card.classList.add('visible'));
      }
    });
  });
});

/* ============================================
   CONTACT FORM VALIDATION
   ============================================ */
const contactForm = document.getElementById('contact-form');
const toast = document.getElementById('toast');

function showToast(message, type = 'success') {
  if (!toast) return;
  toast.textContent = message;
  toast.className = `toast show ${type}`;

  setTimeout(() => toast.classList.remove('show'), 4000);
}

const validators = {
  name: (value) => {
    if (!value.trim()) return 'Le nom est requis.';
    if (value.trim().length < 2) return 'Le nom doit contenir au moins 2 caractères.';
    return '';
  },
  email: (value) => {
    if (!value.trim()) return 'L\'email est requis.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Email invalide.';
    return '';
  },
  subject: (value) => {
    if (!value.trim()) return 'Le sujet est requis.';
    return '';
  },
  message: (value) => {
    if (!value.trim()) return 'Le message est requis.';
    if (value.trim().length < 10) return 'Le message doit contenir au moins 10 caractères.';
    return '';
  },
};

function validateField(name, value) {
  const errorEl = document.getElementById(`${name}-error`);
  const inputEl = document.getElementById(name);
  const error = validators[name](value);

  if (errorEl) errorEl.textContent = error;
  inputEl?.classList.toggle('error', !!error);

  return !error;
}

contactForm?.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(contactForm);
  let isValid = true;

  for (const [name, value] of formData.entries()) {
    if (!validateField(name, value)) isValid = false;
  }

  if (isValid) {
    showToast('Message envoyé avec succès ! Je vous répondrai bientôt.', 'success');
    contactForm.reset();
  } else {
    showToast('Veuillez corriger les erreurs du formulaire.', 'error');
  }
});

contactForm?.querySelectorAll('input, textarea').forEach((input) => {
  input.addEventListener('blur', () => validateField(input.name, input.value));
  input.addEventListener('input', () => {
    if (input.classList.contains('error')) {
      validateField(input.name, input.value);
    }
  });
});

/* ============================================
   FOOTER YEAR
   ============================================ */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
