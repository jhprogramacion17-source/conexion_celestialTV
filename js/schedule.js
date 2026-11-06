/**
 * @file schedule.js
 * @description Módulo dinámico del componente "Horario de Transmisión" para Conexión Celestial TV.
 * Evalúa continuamente en Hora de Colombia (UTC-5) el estado de la programación y
 * conmuta de forma exclusiva entre "VIVO AHORA" y "Próximo Programa" (con reinicio de ciclo Sábado a Martes).
 */

// ─── BASE DE DATOS DE PROGRAMAS (Duración de cada programa: 1 hora) ─────────
export const PROGRAMS = [
  {
    id: 'un-momento-con-dios',
    name: 'Un Momento con Dios',
    day: 2, // Martes (0: Dom, 1: Lun, 2: Mar, 3: Mié, 4: Jue, 5: Vie, 6: Sáb)
    dayName: 'Martes',
    hour: 14, // 14:00
    minute: 0,
    durationMinutes: 60,
    timeFormatted: '2:00 PM'
  },
  {
    id: 'huellas-de-esperanza',
    name: 'Huellas de Esperanza',
    day: 2, // Martes
    dayName: 'Martes',
    hour: 15, // 15:00
    minute: 0,
    durationMinutes: 60,
    timeFormatted: '3:00 PM'
  },
  {
    id: 'aqui-entre-nos',
    name: 'Aquí Entre Nos',
    day: 3, // Miércoles
    dayName: 'Miércoles',
    hour: 10, // 10:00
    minute: 0,
    durationMinutes: 60,
    timeFormatted: '10:00 AM'
  },
  {
    id: 'contigo-en-oracion',
    name: 'Contigo en Oración',
    day: 3, // Miércoles
    dayName: 'Miércoles',
    hour: 15, // 15:00
    minute: 0,
    durationMinutes: 60,
    timeFormatted: '3:00 PM'
  },
  {
    id: 'antes-del-si',
    name: 'Antes del Sí',
    day: 4, // Jueves
    dayName: 'Jueves',
    hour: 10, // 10:00
    minute: 0,
    durationMinutes: 60,
    timeFormatted: '10:00 AM'
  },
  {
    id: 'charlas-con-heydi',
    name: 'Charlas con Heydi',
    day: 4, // Jueves
    dayName: 'Jueves',
    hour: 15, // 15:00
    minute: 0,
    durationMinutes: 60,
    timeFormatted: '3:00 PM'
  },
  {
    id: 'tardes-de-profecia',
    name: 'Tardes de Profecía',
    day: 5, // Viernes
    dayName: 'Viernes',
    hour: 15, // 15:00
    minute: 0,
    durationMinutes: 60,
    timeFormatted: '3:00 PM'
  },
  {
    id: 'sendas-antiguas',
    name: 'Sendas Antiguas',
    day: 5, // Viernes
    dayName: 'Viernes',
    hour: 17, // 17:00
    minute: 0,
    durationMinutes: 60,
    timeFormatted: '5:00 PM'
  },
  {
    id: 'voz-infantil',
    name: 'Voz Infantil',
    day: 6, // Sábado
    dayName: 'Sábado',
    hour: 16, // 16:00
    minute: 0,
    durationMinutes: 60,
    timeFormatted: '4:00 PM'
  }
];

/**
 * Obtiene la fecha y hora actual convertida a la zona horaria de Colombia (UTC-5 sin DST).
 * @returns {Date} Objeto Date con los valores de calendario y hora localizados en Colombia.
 */
export function getColombiaDate() {
  const now = new Date();
  // Se obtiene la representación en la zona horaria 'America/Bogota' (UTC-5)
  const colombiaString = now.toLocaleString('en-US', { timeZone: 'America/Bogota' });
  return new Date(colombiaString);
}

/**
 * Función central de evaluación:
 * 1. Verifica si en el minuto actual hay un programa al aire (dentro de su hora de duración).
 * 2. Si no hay nada al aire, calcula la diferencia hacia el futuro para encontrar el programa
 *    más cercano en la semana, manejando adecuadamente el reinicio del ciclo de sábado a martes.
 * 
 * @param {Date} [nowCol=getColombiaDate()] - Fecha en zona horaria Colombia.
 * @returns {{
 *   isLive: boolean,
 *   currentProgram: object|null,
 *   nextProgram: object|null,
 *   minutesUntilNext: number|null
 * }}
 */
export function evaluateSchedule(nowCol = getColombiaDate()) {
  const currentDay = nowCol.getDay(); // 0: Domingo, 1: Lunes, 2: Martes, etc.
  const currentHour = nowCol.getHours();
  const currentMinute = nowCol.getMinutes();

  // Minutos acumulados transcurridos desde el inicio de la semana (Domingo 00:00)
  const currentWeekMinutes = currentDay * 1440 + currentHour * 60 + currentMinute;
  const TOTAL_WEEK_MINUTES = 7 * 1440; // 10,080 minutos en una semana

  // ─── 1. CONDICIÓN "EN VIVO" ────────────────────────────────────────────────
  for (const prog of PROGRAMS) {
    const progStartMinutes = prog.day * 1440 + prog.hour * 60 + prog.minute;
    const progEndMinutes = progStartMinutes + prog.durationMinutes;

    if (currentWeekMinutes >= progStartMinutes && currentWeekMinutes < progEndMinutes) {
      return {
        isLive: true,
        currentProgram: prog,
        nextProgram: null,
        minutesUntilNext: 0
      };
    }
  }

  // ─── 2. CONDICIÓN "PRÓXIMO PROGRAMA" ───────────────────────────────────────
  // Si no hay transmisión en vivo, buscamos el programa con menor diferencia hacia el futuro
  let closestProgram = null;
  let minDiffMinutes = Infinity;

  for (const prog of PROGRAMS) {
    const progStartMinutes = prog.day * 1440 + prog.hour * 60 + prog.minute;
    let diff = progStartMinutes - currentWeekMinutes;

    // Si la diferencia es <= 0, el programa ya ocurrió esta semana;
    // por lo tanto, su próxima emisión será en la siguiente semana (+10,080 minutos).
    // Esto resuelve el wrap-around del ciclo de Sábado tarde / Domingo / Lunes hacia Martes.
    if (diff <= 0) {
      diff += TOTAL_WEEK_MINUTES;
    }

    if (diff < minDiffMinutes) {
      minDiffMinutes = diff;
      closestProgram = prog;
    }
  }

  return {
    isLive: false,
    currentProgram: null,
    nextProgram: closestProgram,
    minutesUntilNext: minDiffMinutes
  };
}

/**
 * Escapa cadenas de texto para prevenir XSS al inyectar contenido dinámico.
 * @param {string} str 
 * @returns {string}
 */
function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Actualiza la UI del contenedor dinámico y la tarjeta según el estado evaluado.
 */
export function updateScheduleUI() {
  const card = document.querySelector('.schedule-card') || document.getElementById('transmission-schedule-card');
  const container = document.getElementById('schedule-status-container');
  const ctaBtnText = document.getElementById('cta-youtube-text');

  if (!card || !container) return;

  const result = evaluateSchedule();

  // Limpieza exclusiva del único contenedor dinámico
  container.innerHTML = '';

  if (result.isLive && result.currentProgram) {
    // ═════════════════════════════════════════════════════════════════════════
    // ESTADO 1: EN VIVO AHORA
    // ═════════════════════════════════════════════════════════════════════════
    // Agrega la clase CSS .is-live para otorgar el resplandor dorado
    card.classList.add('is-live');

    const prog = result.currentProgram;

    // Renderiza: Nombre del programa activo arriba y "VIVO AHORA" con pseudo-elemento rojo
    container.innerHTML = `
      <div class="schedule-state schedule-state--live">
        <h4 class="schedule-program-name">${escapeHTML(prog.name)}</h4>
        <div class="schedule-live-badge" aria-label="Transmitiendo en vivo ahora">
          VIVO AHORA
        </div>
        <p class="schedule-program-meta">${escapeHTML(prog.dayName)} · ${escapeHTML(prog.timeFormatted)} (Hora Colombia)</p>
      </div>
    `;

    if (ctaBtnText) {
      ctaBtnText.textContent = `Ver "${prog.name}" en Vivo`;
    }

  } else if (result.nextProgram) {
    // ═════════════════════════════════════════════════════════════════════════
    // ESTADO 2: PRÓXIMO PROGRAMA
    // ═════════════════════════════════════════════════════════════════════════
    // La tarjeta pierde la clase .is-live y regresa a su fondo blanco limpio
    card.classList.remove('is-live');

    const next = result.nextProgram;

    // Renderiza: "Próximo programa: [Nombre]" y Subtítulo "[Día] a las [Hora]"
    container.innerHTML = `
      <div class="schedule-state schedule-state--next">
        <div class="schedule-next-label">Próximo programa: ${escapeHTML(next.name)}</div>
        <div class="schedule-next-subtitle">${escapeHTML(next.dayName)} a las ${escapeHTML(next.timeFormatted)}</div>
        <span class="schedule-next-zone">Hora Colombia (UTC-5)</span>
      </div>
    `;

    if (ctaBtnText) {
      ctaBtnText.textContent = 'Ver en YouTube';
    }
  }
}

/**
 * Inicializador del componente con evaluación inmediata y polling continuo cada 60s.
 */
export function initSchedule() {
  updateScheduleUI();
  // Algoritmo de evaluación continua cada 60 segundos (60,000 ms)
  setInterval(updateScheduleUI, 60000);
}

// Inicialización automática si se ejecuta en navegador y el DOM está listo
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      if (document.getElementById('schedule-status-container')) {
        initSchedule();
      }
    });
  } else {
    if (document.getElementById('schedule-status-container')) {
      initSchedule();
    }
  }
}
