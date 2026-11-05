/**
 * @file main.js
 * @description Inicializador general. Detecta la ruta activa y carga el módulo correspondiente.
 */

// ─── Navbar: scroll effect ───────────────────────────────────────────────────
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const toggleBtn = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');

  // Efecto scroll
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('navbar--scrolled', window.scrollY > 40);
  }, { passive: true });

  // Menú hamburguesa
  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      const expanded = toggleBtn.getAttribute('aria-expanded') === 'true';
      toggleBtn.setAttribute('aria-expanded', String(!expanded));
      navMenu.classList.toggle('nav-menu--open');
      toggleBtn.classList.toggle('nav-toggle--open');
    });

    // Cerrar al hacer click en link
    navMenu.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('nav-menu--open');
        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.classList.remove('nav-toggle--open');
      });
    });
  }

  // Marcar link activo
  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav-link').forEach((link) => {
    const href = link.getAttribute('href');
    if (href && (currentPath.endsWith(href) || (href === 'index.html' && (currentPath === '/' || currentPath.endsWith('/'))))) {
      link.classList.add('nav-link--active');
      link.setAttribute('aria-current', 'page');
    }
  });
}

// ─── Animaciones de entrada con IntersectionObserver ─────────────────────────
function initScrollAnimations() {
  const elements = document.querySelectorAll('[data-animate]');
  if (!elements.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    elements.forEach((el) => el.classList.add('animated'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  elements.forEach((el) => observer.observe(el));
}

// ─── Modal de Oración ─────────────────────────────────────────────────────────
function initPrayerModal() {
  const modal = document.getElementById('prayer-modal');
  const closeBtn = document.getElementById('modal-close');
  if (!modal) return;

  function openModal() {
    modal.removeAttribute('hidden');
    modal.classList.add('modal--open');
    document.body.style.overflow = 'hidden';
    modal.querySelector('input, select, textarea')?.focus();
  }

  function closeModal() {
    modal.setAttribute('hidden', '');
    modal.classList.remove('modal--open');
    document.body.style.overflow = '';
  }

  const openTriggers = document.querySelectorAll(
    '#btn-oracion, #service-oracion, #footer-oracion-link, [aria-controls="prayer-modal"]'
  );
  openTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
}

// ─── Inicialización por página ────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  initNavbar();
  initScrollAnimations();

  const path = window.location.pathname;

  // Página principal (index.html)
  if (!path.includes('/pages/')) {
    initPrayerModal();
    const { initPrayerForm } = await import('./controllers/prayerForm.controller.js');
    initPrayerForm();
  }

  // Página de Testimonios
  if (path.includes('testimonios')) {
    const { initTestimonyForm } = await import('./controllers/testimonyForm.controller.js');
    initTestimonyForm();
  }

  // Página de Esperanza
  if (path.includes('esperanza')) {
    const { initVerseView } = await import('./controllers/verseView.controller.js');
    await initVerseView();
  }
});
