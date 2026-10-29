/**
 * @file validator.js
 * @description Validación estricta de campos de formularios con Regex y tipado.
 */

/**
 * Valida que un string no esté vacío y tenga longitud mínima/máxima.
 * @param {string} value - Valor a validar.
 * @param {number} [min=2] - Longitud mínima.
 * @param {number} [max=100] - Longitud máxima.
 * @returns {{ valid: boolean, message: string }}
 */
export function validateText(value, min = 2, max = 100) {
  const str = String(value).trim();
  if (!str) return { valid: false, message: 'Este campo es obligatorio.' };
  if (str.length < min) return { valid: false, message: `Mínimo ${min} caracteres.` };
  if (str.length > max) return { valid: false, message: `Máximo ${max} caracteres.` };
  // Solo letras (con tildes y ñ), espacios y guiones
  const regex = /^[A-Za-záéíóúÁÉÍÓÚüÜñÑ\s'\-]+$/;
  if (!regex.test(str)) return { valid: false, message: 'Solo se permiten letras y espacios.' };
  return { valid: true, message: '' };
}

/**
 * Valida la edad: número entero entre 1 y 120.
 * @param {string|number} value - Edad a validar.
 * @returns {{ valid: boolean, message: string }}
 */
export function validateAge(value) {
  const num = parseInt(value, 10);
  if (isNaN(num)) return { valid: false, message: 'La edad debe ser un número.' };
  if (num < 1 || num > 120) return { valid: false, message: 'Ingresa una edad válida (1-120).' };
  return { valid: true, message: '' };
}

/**
 * Valida un número de teléfono colombiano o internacional.
 * Acepta: +57..., 3XXXXXXXXX, etc.
 * @param {string} value - Teléfono a validar.
 * @returns {{ valid: boolean, message: string }}
 */
export function validatePhone(value) {
  const str = String(value).trim().replace(/\s/g, '');
  if (!str) return { valid: false, message: 'El teléfono es obligatorio.' };
  const regex = /^(\+?57)?3[0-9]{9}$|^\+[1-9]\d{6,14}$/;
  if (!regex.test(str)) return { valid: false, message: 'Ingresa un número de teléfono válido.' };
  return { valid: true, message: '' };
}

/**
 * Valida que se haya seleccionado un estado civil válido.
 * @param {string} value - Estado civil seleccionado.
 * @returns {{ valid: boolean, message: string }}
 */
export function validateSelect(value) {
  if (!value || value === '' || value === '0') {
    return { valid: false, message: 'Debes seleccionar una opción.' };
  }
  return { valid: true, message: '' };
}

/**
 * Valida un texto largo (petición/testimonio): mínimo 20 caracteres.
 * @param {string} value - Texto largo.
 * @param {number} [min=20] - Longitud mínima.
 * @param {number} [max=1500] - Longitud máxima.
 * @returns {{ valid: boolean, message: string }}
 */
export function validateLongText(value, min = 20, max = 1500) {
  const str = String(value).trim();
  if (!str) return { valid: false, message: 'Este campo es obligatorio.' };
  if (str.length < min) return { valid: false, message: `Por favor escribe al menos ${min} caracteres.` };
  if (str.length > max) return { valid: false, message: `Máximo ${max} caracteres permitidos.` };
  return { valid: true, message: '' };
}

/**
 * Muestra/oculta un mensaje de error en el DOM junto a un campo.
 * @param {HTMLElement} field - El campo de input.
 * @param {string} message - Mensaje de error (vacío = sin error).
 */
export function showFieldError(field, message) {
  // Remover error previo
  const prev = field.parentElement.querySelector('.field-error');
  if (prev) prev.remove();
  field.classList.remove('field--error');

  if (message) {
    field.classList.add('field--error');
    const span = document.createElement('span');
    span.className = 'field-error';
    span.setAttribute('role', 'alert');
    span.textContent = message;
    field.parentElement.appendChild(span);
  }
}
