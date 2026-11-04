/**
 * @file verseView.controller.js
 * @description Controlador del DOM para renderizar el versículo activo en esperanza.html
 */
import { getActiveVerse } from '../services/verse.service.js';
import { CONFIG } from '../config/constants.js';

export async function initVerseView() {
  const container = document.getElementById('verse-container');
  const loading = document.getElementById('verse-loading');
  if (!container) return;

  // Determinar ruta correcta según la página actual
  const isSubPage = window.location.pathname.includes('/pages/');
  const jsonPath = isSubPage
    ? CONFIG.VERSE_JSON_PATH_SUBPAGE
    : CONFIG.VERSE_JSON_PATH_ROOT;

  try {
    const verse = await getActiveVerse(jsonPath);

    if (loading) loading.remove();

    if (!verse) {
      container.innerHTML = `<p class="verse-error">No se pudo cargar el versículo. Por favor recarga la página.</p>`;
      return;
    }

    // Renderizar versículo
    container.innerHTML = buildVerseHTML(verse);

    // Animación de entrada
    requestAnimationFrame(() => {
      container.classList.add('verse--visible');
    });

  } catch (err) {
    console.error('[VerseView] Error:', err);
    if (loading) loading.remove();
    container.innerHTML = `<p class="verse-error">Error cargando el versículo del día.</p>`;
  }
}

function buildVerseHTML(verse) {
  const imagenUrl = verse.imagenUrl || '';
  const heroStyle = imagenUrl ? `style="background-image:url('${imagenUrl}')"` : '';

  return `
    <article class="verse-card" aria-label="Versículo de esperanza">
      ${imagenUrl ? `
      <div class="verse-hero" ${heroStyle}>
        <div class="verse-hero__overlay"></div>
        <span class="verse-badge">${escapeHTMLContent(verse.categoria || 'Esperanza')}</span>
      </div>` : ''}
      <div class="verse-body">
        <div class="verse-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="ui-icon" aria-hidden="true">
            <path d="M12 2v20"></path>
            <path d="M7 7h10"></path>
          </svg>
        </div>
        <blockquote class="verse-text">
          <p>"${escapeHTMLContent(verse.texto)}"</p>
          <cite class="verse-cite">— ${escapeHTMLContent(verse.cita)}</cite>
        </blockquote>
        ${verse.reflexion ? `
        <div class="verse-reflection">
          <p>${escapeHTMLContent(verse.reflexion)}</p>
        </div>` : ''}
      </div>
    </article>
  `;
}

function escapeHTMLContent(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
