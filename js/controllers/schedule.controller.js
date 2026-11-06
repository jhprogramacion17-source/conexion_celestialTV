/**
 * @file schedule.controller.js
 * @description Conector para el controlador de horarios de transmisión.
 * Delega al módulo principal js/schedule.js.
 */
import { initSchedule, updateScheduleUI } from '../schedule.js';

export function initScheduleController() {
  initSchedule();
}

export { updateScheduleUI, initSchedule };
