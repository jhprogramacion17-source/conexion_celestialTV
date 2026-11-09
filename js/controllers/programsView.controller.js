/**
 * @file programsView.controller.js
 * @description Controlador para la página de Programas (pages/programas.html).
 * Maneja el filtrado interactivo por día y el resaltado del programa actual si está al aire.
 */
import { evaluateSchedule } from '../schedule.js';

export function initProgramsView() {
  const filterBtns = document.querySelectorAll('.programs-filter-btn');
  const programCards = document.querySelectorAll('.program-grid-item');

  if (!filterBtns.length || !programCards.length) return;

  // 1. Filtrado por día
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filterDay = btn.getAttribute('data-filter-day');

      programCards.forEach((card) => {
        const cardDay = card.getAttribute('data-day');
        if (filterDay === 'todos' || cardDay === filterDay) {
          card.style.display = '';
          requestAnimationFrame(() => {
            card.classList.add('visible');
          });
        } else {
          card.style.display = 'none';
          card.classList.remove('visible');
        }
      });
    });
  });

  // 2. Resaltar programa al aire si coincide
  const status = evaluateSchedule();
  if (status.isLive && status.currentProgram) {
    const activeCard = document.querySelector(`[data-program-id="${status.currentProgram.id}"]`);
    if (activeCard) {
      activeCard.classList.add('program-card--live');
      const badgeContainer = activeCard.querySelector('.program-card__live-indicator');
      if (badgeContainer) {
        badgeContainer.innerHTML = `
          <span class="live-dot" aria-hidden="true"></span>
          <span>¡AL AIRE AHORA!</span>
        `;
        badgeContainer.style.display = 'inline-flex';
      }
    }
  }
}

