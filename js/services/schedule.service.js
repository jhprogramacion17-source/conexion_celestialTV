/**
 * @file schedule.service.js
 * @description Servicio de programación para Conexión Celestial TV.
 * Delega al motor central en js/schedule.js para garantizar consistencia.
 */
import { evaluateSchedule, getColombiaDate, PROGRAMS } from '../schedule.js';

export { getColombiaDate };

/**
 * Evalúa el estado de transmisión contra la parrilla oficial
 * @param {Date} [mockDate] - Fecha opcional para pruebas
 * @returns {{ isOnAir: boolean, currentProgram: object|null, nextProgram: object|null }}
 */
export function getTransmissionStatus(mockDate) {
  const d = mockDate || getColombiaDate();
  const res = evaluateSchedule(d);
  return {
    isOnAir: res.isLive,
    currentProgram: res.currentProgram,
    nextProgram: res.nextProgram
  };
}

export function getAllPrograms() {
  return PROGRAMS;
}
