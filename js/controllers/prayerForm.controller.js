/**
 * @file prayerForm.controller.js
 * @description Controlador del DOM para el formulario de Petición de Oración.
 */
import { validateText, validateAge, validatePhone, validateSelect, validateLongText, showFieldError } from '../utils/validator.js';
import { sanitizeText, sanitizePhone } from '../utils/sanitizer.js';
import { sendPrayerRequest } from '../services/whatsapp.service.js';

export function initPrayerForm() {
  const form = document.getElementById('prayer-form');
  if (!form) return;

  const phoneGroup = document.getElementById('phone-group');
  const acompanamientoRadios = form.querySelectorAll('input[name="acompanamiento"]');

  // Toggle campo teléfono según acompañamiento
  acompanamientoRadios.forEach((radio) => {
    radio.addEventListener('change', () => {
      const showPhone = radio.value === 'si' && radio.checked;
      if (phoneGroup) {
        phoneGroup.style.display = showPhone ? 'block' : 'none';
        phoneGroup.querySelector('input').required = showPhone;
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Obtener valores
    const nombre = form.querySelector('#prayer-nombre').value;
    const apellido = form.querySelector('#prayer-apellido').value;
    const edad = form.querySelector('#prayer-edad').value;
    const estadoCivil = form.querySelector('#prayer-estado-civil').value;
    const ciudad = form.querySelector('#prayer-ciudad').value;
    const peticion = form.querySelector('#prayer-peticion').value;
    const acompanamiento = form.querySelector('input[name="acompanamiento"]:checked')?.value || '';
    const telefonoEl = form.querySelector('#prayer-telefono');

    // Validaciones
    const vNombre = validateText(nombre, 2, 50);
    showFieldError(form.querySelector('#prayer-nombre'), vNombre.message);
    if (!vNombre.valid) isValid = false;

    const vApellido = validateText(apellido, 2, 50);
    showFieldError(form.querySelector('#prayer-apellido'), vApellido.message);
    if (!vApellido.valid) isValid = false;

    const vEdad = validateAge(edad);
    showFieldError(form.querySelector('#prayer-edad'), vEdad.message);
    if (!vEdad.valid) isValid = false;

    const vEstado = validateSelect(estadoCivil);
    showFieldError(form.querySelector('#prayer-estado-civil'), vEstado.message);
    if (!vEstado.valid) isValid = false;

    const vCiudad = validateText(ciudad, 2, 60);
    showFieldError(form.querySelector('#prayer-ciudad'), vCiudad.message);
    if (!vCiudad.valid) isValid = false;

    const vPeticion = validateLongText(peticion, 20, 1000);
    showFieldError(form.querySelector('#prayer-peticion'), vPeticion.message);
    if (!vPeticion.valid) isValid = false;

    if (!acompanamiento) {
      isValid = false;
      const radioGroup = form.querySelector('.radio-group');
      showFieldError(radioGroup, 'Debes elegir una opción de acompañamiento.');
    }

    if (acompanamiento === 'si' && telefonoEl) {
      const vTel = validatePhone(telefonoEl.value);
      showFieldError(telefonoEl, vTel.message);
      if (!vTel.valid) isValid = false;
    }

    if (!isValid) return;

    // Sanitizar y enviar
    sendPrayerRequest({
      nombre: sanitizeText(nombre),
      apellido: sanitizeText(apellido),
      edad: parseInt(edad, 10),
      estadoCivil: sanitizeText(estadoCivil),
      ciudad: sanitizeText(ciudad),
      peticion: sanitizeText(peticion),
      acompanamiento,
      telefono: acompanamiento === 'si' ? sanitizePhone(telefonoEl?.value || '') : '',
    });

    showSuccessMessage(form, '¡Petición enviada con éxito! Nuestro equipo de intercesión orará por ti.');
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
  // Ocultar teléfono de nuevo
  const phoneGroup = document.getElementById('phone-group');
  if (phoneGroup) phoneGroup.style.display = 'none';
  setTimeout(() => { banner.style.display = 'none'; }, 6000);
}
