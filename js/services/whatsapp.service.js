/**
 * @file whatsapp.service.js
 * @description Construcción segura y envío de mensajes a WhatsApp API.
 */
import { CONFIG } from '../config/constants.js';
import { buildSafeWhatsAppURL } from '../utils/sanitizer.js';

/**
 * Formatea y envía una petición de oración por WhatsApp.
 * @param {Object} data - Datos del formulario de oración.
 */
export function sendPrayerRequest(data) {
  const { nombre, apellido, edad, estadoCivil, ciudad, peticion, acompanamiento, telefono } = data;

  const acompanamientoTexto = acompanamiento === 'si'
    ? `Sí desea acompañamiento\nTeléfono: ${telefono}`
    : 'No desea acompañamiento en este momento';

  const mensaje =
    `*PETICIÓN DE ORACIÓN — Conexión Celestial TV*\n` +
    `━━━━━━━━━━━━━━━━━━━━━━\n` +
    `*Nombre:* ${nombre} ${apellido}\n` +
    `*Edad:* ${edad} años\n` +
    `*Estado Civil:* ${estadoCivil}\n` +
    `*Ciudad:* ${ciudad}\n` +
    `━━━━━━━━━━━━━━━━━━━━━━\n` +
    `*Petición de Oración:*\n${peticion}\n` +
    `━━━━━━━━━━━━━━━━━━━━━━\n` +
    `*Acompañamiento:* ${acompanamientoTexto}\n` +
    `━━━━━━━━━━━━━━━━━━━━━━\n` +
    `_Enviado desde Conexión Celestial TV_`;

  const url = buildSafeWhatsAppURL(CONFIG.WHATSAPP_API_URL, CONFIG.WHATSAPP_NUMBER, mensaje);
  window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * Formatea y envía un testimonio por WhatsApp.
 * @param {Object} data - Datos del formulario de testimonio.
 */
export function sendTestimony(data) {
  const { nombre, edad, ciudad, testimonio } = data;

  const mensaje =
    `*TESTIMONIO DE FE — Conexión Celestial TV*\n` +
    `━━━━━━━━━━━━━━━━━━━━━━\n` +
    `*Nombre:* ${nombre}\n` +
    `*Edad:* ${edad} años\n` +
    `*Ciudad:* ${ciudad}\n` +
    `━━━━━━━━━━━━━━━━━━━━━━\n` +
    `*Testimonio:*\n${testimonio}\n` +
    `━━━━━━━━━━━━━━━━━━━━━━\n` +
    `_Enviado desde Conexión Celestial TV_`;

  const url = buildSafeWhatsAppURL(CONFIG.WHATSAPP_API_URL, CONFIG.WHATSAPP_NUMBER, mensaje);
  window.open(url, '_blank', 'noopener,noreferrer');
}
