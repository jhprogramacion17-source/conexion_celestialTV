/**
 * @file schedule.service.js
 * @description Servicio para evaluar el estado en vivo y la programación
 * en Hora de Colombia (UTC-5 sin horario de verano).
 */
import { PROGRAMS } from '../data/programsData.js';

/**
 * Obtiene la fecha y hora actual en la zona horaria de Colombia (America/Bogota)
 * @returns {Date}
 */
export function getColombiaDate() {
  const now = new Date();
  const bogotaString = now.toLocaleString('en-US', { timeZone: 'America/Bogota' });
  return new Date(bogotaString);
}

/**
 * Evalúa el estado de transmisión contra la parrilla oficial
 * @param {Date} [mockDate] - Fecha opcional para pruebas
 * @returns {{ isOnAir: boolean, currentProgram: object|null, nextProgram: object|null }}
 */
export function getTransmissionStatus(mockDate) {
  const d = mockDate || getColombiaDate();
  const currentDay = d.getDay(); // 0: Domingo, 1: Lunes ... 6: Sábado
  const currentMinutes = d.getHours() * 60 + d.getMinutes();

  let activeProgram = null;

  // 1. Verificar si hay un programa en vivo en este minuto exacto
  for (const prog of PROGRAMS) {
    if (prog.dayOfWeek === currentDay) {
      const start = prog.startHour * 60 + prog.startMinute;
      const end = start + prog.durationMinutes;
      if (currentMinutes >= start && currentMinutes < end) {
        activeProgram = prog;
        break;
      }
    }
  }

  // 2. Determinar el próximo programa a transmitir
  let nextProgram = null;
  let minDiff = Infinity;

  for (const prog of PROGRAMS) {
    const progStart = prog.startHour * 60 + prog.startMinute;
    let dayDiff = (prog.dayOfWeek - currentDay + 7) % 7;
    let minuteDiff = dayDiff * 24 * 60 + (progStart - currentMinutes);
    if (minuteDiff <= 0) {
      minuteDiff += 7 * 24 * 60; // Próxima semana
    }
    if (minuteDiff < minDiff) {
      minDiff = minuteDiff;
      nextProgram = prog;
    }
  }

  return {
    isOnAir: Boolean(activeProgram),
    currentProgram: activeProgram,
    nextProgram
  };
}

export function getAllPrograms() {
  return PROGRAMS;
}

