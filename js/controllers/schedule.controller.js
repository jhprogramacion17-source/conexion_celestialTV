/**
 * @file schedule.controller.js
 * @description Controlador del DOM para actualizar dinámicamente la tarjeta
 * "Horario de Transmisión" en la página principal (index.html).
 */
import { getTransmissionStatus } from '../services/schedule.service.js';

export function initScheduleController() {
  const card = document.getElementById('transmission-schedule-card');
  if (!card) return;

  function updateScheduleUI() {
    const status = getTransmissionStatus();
    const liveBadge = document.getElementById('schedule-live-badge');
    const liveText = document.getElementById('schedule-live-text');
    const programStatusContainer = document.getElementById('schedule-program-status');
    const ctaYoutubeText = document.getElementById('cta-youtube-text');
    const ctaYoutube = document.getElementById('cta-youtube-schedule');

    if (!liveBadge || !liveText || !programStatusContainer) return;

    if (status.isOnAir && status.currentProgram) {
      // ─── ESTADO: AL AIRE ──────────────────────────────────────────
      liveBadge.className = 'live-badge live-badge--on-air';
      liveText.textContent = 'Transmitiendo en vivo ahora';

      const prog = status.currentProgram;
      programStatusContainer.innerHTML = `
        <div class="live-program-card" aria-label="Programa actual al aire">
          <span class="live-program-tag">AL AIRE AHORA</span>
          <h4 class="live-program-title">${escapeHTML(prog.title)}</h4>
          ${prog.host ? `<p class="live-program-host">Conductor: <strong>${escapeHTML(prog.host)}</strong></p>` : ''}
          <p class="live-program-time">${escapeHTML(prog.dayName)} · ${escapeHTML(prog.timeFormatted)}</p>
        </div>
      `;

      if (ctaYoutube) {
        ctaYoutube.href = 'https://www.youtube.com/@conexioncelestial7-n9k';
      }
      if (ctaYoutubeText) {
        ctaYoutubeText.textContent = `Ver "${prog.title}" en Vivo`;
      }

    } else {
      // ─── ESTADO: FUERA DEL AIRE / MÚSICA CONTINUA ──────────────────
      liveBadge.className = 'live-badge live-badge--off-air';
      liveText.textContent = 'Programación habitual · Alabanzas continuas';

      const nextProg = status.nextProgram;
      if (nextProg) {
        programStatusContainer.innerHTML = `
          <div class="next-program-card" aria-label="Próximo programa en vivo">
            <span class="next-program-tag">PRÓXIMO PROGRAMA</span>
            <h4 class="next-program-title">${escapeHTML(nextProg.title)}</h4>
            ${nextProg.host ? `<p class="next-program-host">Conductor: <strong>${escapeHTML(nextProg.host)}</strong></p>` : ''}
            <p class="next-program-time">${escapeHTML(nextProg.dayName)} a las ${escapeHTML(nextProg.timeShort)} (Hora Col.)</p>
            <a href="./pages/programas.html" class="next-program-link">Ver parrilla completa →</a>
          </div>
        `;
      } else {
        programStatusContainer.innerHTML = '';
      }

      if (ctaYoutube) {
        ctaYoutube.href = 'https://www.youtube.com/@conexioncelestial7-n9k';
      }
      if (ctaYoutubeText) {
        ctaYoutubeText.textContent = 'Ver en YouTube';
      }
    }
  }

  // Ejecución inmediata
  updateScheduleUI();

  // Actualización periódica cada 30 segundos
  setInterval(updateScheduleUI, 30000);
}

function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

