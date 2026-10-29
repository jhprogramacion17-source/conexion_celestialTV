/**
 * @file verse.service.js
 * @description Fetch asíncrono del JSON de versículos y algoritmo de rotación cada 3 días.
 * La rotación es determinista: misma fecha = mismo versículo para todos los usuarios.
 */
import { CONFIG } from '../config/constants.js';

let verseCache = null;

/**
 * Carga los versículos desde el JSON local, con caché en memoria.
 * @param {string} jsonPath - Ruta al archivo JSON.
 * @returns {Promise<Array>} Array de versículos.
 */
async function loadVerses(jsonPath) {
  if (verseCache) return verseCache;
  try {
    const response = await fetch(jsonPath);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    verseCache = data.versiculos || [];
    return verseCache;
  } catch (err) {
    console.error('[VerseService] Error cargando versículos:', err);
    return [];
  }
}

/**
 * Calcula el índice del versículo activo según la fecha actual.
 * Rotación determinista: cambia cada VERSE_ROTATION_DAYS días desde VERSE_SEED_DATE.
 * @param {number} totalVerses - Total de versículos disponibles.
 * @returns {number} Índice (0-based) del versículo activo.
 */
function getActiveVerseIndex(totalVerses) {
  const seedDate = new Date(CONFIG.VERSE_SEED_DATE);
  const now = new Date();
  // Diferencia en días desde la fecha semilla
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysSinceSeed = Math.floor((now - seedDate) / msPerDay);
  // Cambia cada N días
  const period = Math.floor(daysSinceSeed / CONFIG.VERSE_ROTATION_DAYS);
  return period % totalVerses;
}

/**
 * Obtiene el versículo activo para la fecha actual.
 * @param {string} [jsonPath] - Ruta al JSON (opcional, tiene valor por defecto).
 * @returns {Promise<Object|null>} Versículo activo o null si hay error.
 */
export async function getActiveVerse(jsonPath = CONFIG.VERSE_JSON_PATH_ROOT) {
  const verses = await loadVerses(jsonPath);
  if (!verses.length) return null;
  const index = getActiveVerseIndex(verses.length);
  return verses[index];
}

/**
 * Obtiene la fecha de cambio del próximo versículo.
 * @returns {Date} Fecha del próximo cambio.
 */
export function getNextVerseDate() {
  const seedDate = new Date(CONFIG.VERSE_SEED_DATE);
  const now = new Date();
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysSinceSeed = Math.floor((now - seedDate) / msPerDay);
  const period = Math.floor(daysSinceSeed / CONFIG.VERSE_ROTATION_DAYS);
  const nextChangeDay = (period + 1) * CONFIG.VERSE_ROTATION_DAYS;
  return new Date(seedDate.getTime() + nextChangeDay * msPerDay);
}
