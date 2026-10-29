/**
 * @file sanitizer.js
 * @description Sanitización de inputs contra XSS - OWASP Top 10 A03
 * Usa solo APIs nativas del navegador: DOMParser y textContent.
 */

/**
 * Escapa caracteres peligrosos HTML en un string.
 * @param {string} str - String a sanitizar.
 * @returns {string} String sanitizado.
 */
export function escapeHTML(str) {
  if (typeof str !== 'string') return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;',
  };
  return str.replace(/[&<>"'`=/]/g, (char) => map[char]);
}

/**
 * Sanitiza un string de texto libre eliminando etiquetas HTML y scripts.
 * @param {string} input - Input del usuario.
 * @returns {string} Texto plano seguro.
 */
export function sanitizeText(input) {
  if (typeof input !== 'string') return '';
  // Limitar longitud máxima
  const trimmed = input.trim().substring(0, 2000);
  // Crear elemento temporal para extraer solo texto
  const div = document.createElement('div');
  div.textContent = trimmed;
  return div.innerHTML;
}

/**
 * Sanitiza un número de teléfono: solo dígitos y el signo +
 * @param {string} phone - Número de teléfono raw.
 * @returns {string} Número sanitizado.
 */
export function sanitizePhone(phone) {
  if (typeof phone !== 'string') return '';
  return phone.replace(/[^\d+\s\-()]/g, '').trim().substring(0, 20);
}

/**
 * Construye una URL de WhatsApp de forma segura.
 * @param {string} baseUrl - URL base de wa.me.
 * @param {string} number - Número de destino ya sanitizado.
 * @param {string} message - Mensaje ya sanitizado.
 * @returns {string} URL completa y segura.
 */
export function buildSafeWhatsAppURL(baseUrl, number, message) {
  const safeNumber = number.replace(/[^\d]/g, '');
  const encoded = encodeURIComponent(message);
  return `${baseUrl}${safeNumber}?text=${encoded}`;
}
