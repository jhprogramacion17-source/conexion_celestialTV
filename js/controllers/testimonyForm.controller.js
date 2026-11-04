/**
 * @file testimonyForm.controller.js
 * @description Controlador del DOM para el formulario de Testimonios.
 */
import { validateText, validateAge, validateLongText, validateSelect, showFieldError } from '../utils/validator.js';
import { sanitizeText } from '../utils/sanitizer.js';
import { sendTestimony } from '../services/whatsapp.service.js';
import { LATAM_LOCATIONS } from '../data/latamLocations.js';

export function initTestimonyForm() {
  const form = document.getElementById('testimony-form');
  if (!form) return;

  // 1. Contador de caracteres para el textarea
  initCharCounter(form);

  // 2. Control Stepper personalizado para Edad (− y +)
  initAgeStepper(form);

  // 3. Selectores dinámicos de País y Ciudad (América Latina)
  initLocationSelectors(form);

  // 4. Envío y validación del formulario
  initSubmitHandler(form);
}

/**
 * Inicializa el contador de caracteres del textarea de testimonio.
 */
function initCharCounter(form) {
  const textarea = form.querySelector('#testimony-texto');
  const counter = form.querySelector('#char-counter');
  if (!textarea || !counter) return;

  textarea.addEventListener('input', () => {
    const len = textarea.value.length;
    counter.textContent = `${len}/1500`;
    counter.style.color = len > 1400 ? 'var(--color-warning)' : 'var(--color-text-muted)';
  });
}

/**
 * Control personalizado de stepper (− y +) para el campo Edad.
 * Respeta min/max (1-120) y asegura soporte táctil para celulares.
 */
function initAgeStepper(form) {
  const input = form.querySelector('#testimony-edad');
  const btnDec = form.querySelector('#testimony-edad-dec');
  const btnInc = form.querySelector('#testimony-edad-inc');
  if (!input || !btnDec || !btnInc) return;

  const min = parseInt(input.getAttribute('min'), 10) || 1;
  const max = parseInt(input.getAttribute('max'), 10) || 120;

  function updateValue(delta) {
    let current = parseInt(input.value, 10);
    if (isNaN(current)) {
      current = delta > 0 ? 18 : 28;
    } else {
      current += delta;
    }

    if (current < min) current = min;
    if (current > max) current = max;

    input.value = current;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    updateState();
  }

  function updateState() {
    const current = parseInt(input.value, 10);
    if (!isNaN(current)) {
      btnDec.disabled = current <= min;
      btnInc.disabled = current >= max;
    } else {
      btnDec.disabled = false;
      btnInc.disabled = false;
    }
  }

  btnDec.addEventListener('click', (e) => {
    e.preventDefault();
    updateValue(-1);
  });

  btnInc.addEventListener('click', (e) => {
    e.preventDefault();
    updateValue(1);
  });

  input.addEventListener('input', updateState);
  input.addEventListener('change', () => {
    let current = parseInt(input.value, 10);
    if (!isNaN(current)) {
      if (current < min) input.value = min;
      if (current > max) input.value = max;
    }
    updateState();
  });

  updateState();
}

/**
 * Llena el selector de países con los países de América Latina y
 * actualiza dinámicamente las ciudades correspondientes.
 */
function initLocationSelectors(form) {
  const selectPais = form.querySelector('#testimony-pais');
  const selectCiudad = form.querySelector('#testimony-ciudad');
  const inputCiudadCustom = form.querySelector('#testimony-ciudad-custom');
  if (!selectPais || !selectCiudad) return;

  // Llenar selector de países
  LATAM_LOCATIONS.forEach((item) => {
    const opt = document.createElement('option');
    opt.value = item.country;
    opt.textContent = item.country;
    selectPais.appendChild(opt);
  });

  // Opción "Otro país..." al final
  const optOtroPais = document.createElement('option');
  optOtroPais.value = '__otro_pais__';
  optOtroPais.textContent = 'Otro país...';
  selectPais.appendChild(optOtroPais);

  selectPais.addEventListener('change', () => {
    const selectedCountry = selectPais.value;

    showFieldError(selectPais, '');
    showFieldError(selectCiudad, '');
    if (inputCiudadCustom) showFieldError(inputCiudadCustom, '');

    selectCiudad.innerHTML = '';
    if (inputCiudadCustom) {
      inputCiudadCustom.style.display = 'none';
      inputCiudadCustom.value = '';
    }

    if (!selectedCountry) {
      selectCiudad.disabled = true;
      selectCiudad.style.display = '';
      const optDefault = document.createElement('option');
      optDefault.value = '';
      optDefault.textContent = 'Primero selecciona un país...';
      selectCiudad.appendChild(optDefault);
      return;
    }

    if (selectedCountry === '__otro_pais__') {
      selectCiudad.disabled = true;
      selectCiudad.style.display = 'none';
      if (inputCiudadCustom) {
        inputCiudadCustom.style.display = 'block';
        inputCiudadCustom.placeholder = 'Escribe tu país y ciudad (ej. España, Madrid)';
        inputCiudadCustom.focus();
      }
      return;
    }

    // País latinoamericano normal
    selectCiudad.style.display = '';
    selectCiudad.disabled = false;

    const optDefault = document.createElement('option');
    optDefault.value = '';
    optDefault.textContent = 'Selecciona tu ciudad...';
    selectCiudad.appendChild(optDefault);

    const found = LATAM_LOCATIONS.find((l) => l.country === selectedCountry);
    if (found && found.cities) {
      found.cities.forEach((cityName) => {
        const opt = document.createElement('option');
        opt.value = cityName;
        opt.textContent = cityName;
        selectCiudad.appendChild(opt);
      });
    }

    // Opción para ciudades no listadas
    const optOtraCiudad = document.createElement('option');
    optOtraCiudad.value = '__otra_ciudad__';
    optOtraCiudad.textContent = 'Otra ciudad...';
    selectCiudad.appendChild(optOtraCiudad);
  });

  selectCiudad.addEventListener('change', () => {
    showFieldError(selectCiudad, '');
    if (!inputCiudadCustom) return;

    if (selectCiudad.value === '__otra_ciudad__') {
      inputCiudadCustom.style.display = 'block';
      inputCiudadCustom.placeholder = 'Escribe tu ciudad o municipio';
      inputCiudadCustom.value = '';
      inputCiudadCustom.focus();
    } else {
      inputCiudadCustom.style.display = 'none';
      inputCiudadCustom.value = '';
    }
  });
}

/**
 * Maneja la validación estricta y el envío del formulario.
 */
function initSubmitHandler(form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    const inputNombre = form.querySelector('#testimony-nombre');
    const inputEdad = form.querySelector('#testimony-edad');
    const selectPais = form.querySelector('#testimony-pais');
    const selectCiudad = form.querySelector('#testimony-ciudad');
    const inputCiudadCustom = form.querySelector('#testimony-ciudad-custom');
    const textareaTestimonio = form.querySelector('#testimony-texto');

    const nombre = inputNombre ? inputNombre.value : '';
    const edad = inputEdad ? inputEdad.value : '';
    const paisVal = selectPais ? selectPais.value : '';
    const ciudadVal = selectCiudad ? selectCiudad.value : '';
    const ciudadCustomVal = inputCiudadCustom ? inputCiudadCustom.value : '';
    const testimonio = textareaTestimonio ? textareaTestimonio.value : '';

    // Validar Nombre
    const vNombre = validateText(nombre, 2, 80);
    showFieldError(inputNombre, vNombre.message);
    if (!vNombre.valid) isValid = false;

    // Validar Edad
    const vEdad = validateAge(edad);
    showFieldError(inputEdad, vEdad.message);
    if (!vEdad.valid) isValid = false;

    // Validar País y Ciudad
    let resolvedPais = paisVal;
    let resolvedCiudad = ciudadVal;

    const vPais = validateSelect(paisVal);
    showFieldError(selectPais, vPais.message);
    if (!vPais.valid) {
      isValid = false;
    }

    if (paisVal === '__otro_pais__') {
      resolvedPais = 'Otro país';
      const vCustom = validateText(ciudadCustomVal, 2, 80);
      showFieldError(inputCiudadCustom, vCustom.valid ? '' : 'Por favor ingresa tu país y ciudad.');
      if (!vCustom.valid) isValid = false;
      resolvedCiudad = ciudadCustomVal;
    } else if (paisVal) {
      if (ciudadVal === '__otra_ciudad__') {
        const vCustom = validateText(ciudadCustomVal, 2, 80);
        showFieldError(inputCiudadCustom, vCustom.valid ? '' : 'Por favor escribe el nombre de tu ciudad.');
        if (!vCustom.valid) isValid = false;
        resolvedCiudad = ciudadCustomVal;
      } else {
        const vCiudad = validateSelect(ciudadVal);
        showFieldError(selectCiudad, vCiudad.message);
        if (!vCiudad.valid) isValid = false;
        resolvedCiudad = ciudadVal;
      }
    } else {
      showFieldError(selectCiudad, 'Debes seleccionar primero un país.');
      isValid = false;
    }

    // Validar Testimonio
    const vTestimonio = validateLongText(testimonio, 30, 1500);
    showFieldError(textareaTestimonio, vTestimonio.message);
    if (!vTestimonio.valid) isValid = false;

    if (!isValid) return;

    sendTestimony({
      nombre: sanitizeText(nombre),
      edad: parseInt(edad, 10),
      pais: sanitizeText(resolvedPais),
      ciudad: sanitizeText(resolvedCiudad),
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

  const selectCiudad = form.querySelector('#testimony-ciudad');
  if (selectCiudad) {
    selectCiudad.innerHTML = '<option value="">Primero selecciona un país...</option>';
    selectCiudad.disabled = true;
    selectCiudad.style.display = '';
  }

  const inputCiudadCustom = form.querySelector('#testimony-ciudad-custom');
  if (inputCiudadCustom) {
    inputCiudadCustom.style.display = 'none';
    inputCiudadCustom.value = '';
  }

  setTimeout(() => { banner.style.display = 'none'; }, 7000);
}
