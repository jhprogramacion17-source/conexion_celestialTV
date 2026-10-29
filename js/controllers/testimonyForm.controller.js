/**
 * @file testimonyForm.controller.js
 * @description Controlador del DOM para el formulario de Testimonios.
 */
import { validateText, validateAge, validateLongText, showFieldError } from '../utils/validator.js';
import { sanitizeText } from '../utils/sanitizer.js';
import { sendTestimony } from '../services/whatsapp.service.js';

export function initTestimonyForm() {
  const form = document.getElementById('testimony-form');
  if (!form) return;

  // Contador de caracteres para el textarea
  const textarea = form.querySelector('#testimony-texto');
  const counter = form.querySelector('#char-counter');
  if (textarea && counter) {
    textarea.addEventListener('input', () => {
      const len = textarea.value.length;
      counter.textContent = `${len}/1500`;
      counter.style.color = len > 1400 ? 'var(--color-warning)' : 'var(--color-text-muted)';
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    const nombre = form.querySelector('#testimony-nombre').value;
    const edad = form.querySelector('#testimony-edad').value;
    const ciudad = form.querySelector('#testimony-ciudad').value;
    const testimonio = form.querySelector('#testimony-texto').value;

    const vNombre = validateText(nombre, 2, 80);
    showFieldError(form.querySelector('#testimony-nombre'), vNombre.message);
    if (!vNombre.valid) isValid = false;

    const vEdad = validateAge(edad);
    showFieldError(form.querySelector('#testimony-edad'), vEdad.message);
    if (!vEdad.valid) isValid = false;

    const vCiudad = validateText(ciudad, 2, 60);
    showFieldError(form.querySelector('#testimony-ciudad'), vCiudad.message);
    if (!vCiudad.valid) isValid = false;

    const vTestimonio = validateLongText(testimonio, 30, 1500);
    showFieldError(form.querySelector('#testimony-texto'), vTestimonio.message);
    if (!vTestimonio.valid) isValid = false;

    if (!isValid) return;

    sendTestimony({
      nombre: sanitizeText(nombre),
      edad: parseInt(edad, 10),
      ciudad: sanitizeText(ciudad),
      testimonio: sanitizeText(testimonio),
    });

    showSuccessMessage(form, '¡Testimonio enviado con éxito! Gracias por compartir lo que Dios ha hecho en tu vida.');
  });
}

function showSuccessMessage(form, msg) {
  let banner = form.querySelector('.form-success');
  if (!banner) {
    banner = document.createElement('div');
    banner.className = 'form-success';
    form.appendChild(banner);
  }
  banner.textContent = msg;
  banner.style.display = 'block';
  form.reset();
  const counter = form.querySelector('#char-counter');
  if (counter) counter.textContent = '0/1500';
  setTimeout(() => { banner.style.display = 'none'; }, 7000);
}
