/**
 * @file programsData.js
 * @description Parrilla oficial de programas de Conexión Celestial TV.
 * Cada programa tiene una duración de 1 hora (60 minutos).
 * Horarios referenciados en Hora de Colombia (UTC-5).
 */

export const PROGRAMS = [
  {
    id: 'un-momento-con-dios',
    title: 'Un Momento con Dios',
    dayName: 'Martes',
    dayOfWeek: 2, // 0: Dom, 1: Lun, 2: Mar, 3: Mié, 4: Jue, 5: Vie, 6: Sáb
    startHour: 14, // 2:00 PM
    startMinute: 0,
    durationMinutes: 60,
    timeFormatted: '2:00 p. m. — 3:00 p. m.',
    timeShort: '2:00 p. m.',
    host: null,
    category: 'Reflexión y Oración',
    description: 'Un espacio íntimo de reflexión bíblica y comunión con el Padre para renovar tu espíritu y llenar tu tarde de esperanza y paz en Su presencia.',
    icon: 'pray',
    image: 'un_momento_con_dios.jpg'
  },
  {
    id: 'huellas-de-esperanza',
    title: 'Huellas de Esperanza',
    dayName: 'Martes',
    dayOfWeek: 2,
    startHour: 15, // 3:00 PM
    startMinute: 0,
    durationMinutes: 60,
    timeFormatted: '3:00 p. m. — 4:00 p. m.',
    timeShort: '3:00 p. m.',
    host: null,
    category: 'Esperanza y Promesas',
    description: 'Mensajes inspiradores, testimonios reales y promesas de la Palabra de Dios que dejan una huella imborrable de fortaleza y fe viva en tu corazón.',
    icon: 'sun',
    image: 'huellas_de_esperanza.jpg'
  },
  {
    id: 'aqui-entre-nos',
    title: 'Aquí Entre Nos',
    dayName: 'Miércoles',
    dayOfWeek: 3,
    startHour: 10, // 10:00 AM
    startMinute: 0,
    durationMinutes: 60,
    timeFormatted: '10:00 a. m. — 11:00 a. m.',
    timeShort: '10:00 a. m.',
    host: null,
    category: 'Vida Cristiana y Diálogo',
    description: 'Conversaciones sinceras, cálidas y prácticas sobre los desafíos cotidianos de la vida cristiana, salud integral, familia y fe en el mundo actual.',
    icon: 'users',
    image: 'aqui_entre_nos.jpg'
  },
  {
    id: 'contigo-en-oracion',
    title: 'Contigo en Oración',
    dayName: 'Miércoles',
    dayOfWeek: 3,
    startHour: 15, // 3:00 PM
    startMinute: 0,
    durationMinutes: 60,
    timeFormatted: '3:00 p. m. — 4:00 p. m.',
    timeShort: '3:00 p. m.',
    host: null,
    category: 'Intercesión en Vivo',
    description: 'Un altar de intercesión donde unimos nuestras voces ante el Trono de la Gracia, orando en vivo por cada petición y motivo de oración de nuestra audiencia.',
    icon: 'heart-hand',
    image: 'contigo_en_oracion.jpg'
  },
  {
    id: 'antes-del-si',
    title: 'Antes del Sí',
    dayName: 'Jueves',
    dayOfWeek: 4,
    startHour: 10, // 10:00 AM
    startMinute: 0,
    durationMinutes: 60,
    timeFormatted: '10:00 a. m. — 11:00 a. m.',
    timeShort: '10:00 a. m.',
    host: 'José Mejía',
    category: 'Familia y Noviazgo',
    description: 'Orientación espiritual prematrimonial y principios bíblicos para forjar noviazgos con propósito y construir un hogar sólido edificado sobre la Roca.',
    icon: 'rings',
    image: 'antes_del_si.jpg'
  },
  {
    id: 'charlas-con-heydi',
    title: 'Charlas con Heydi',
    dayName: 'Jueves',
    dayOfWeek: 4,
    startHour: 15, // 3:00 PM
    startMinute: 0,
    durationMinutes: 60,
    timeFormatted: '3:00 p. m. — 4:00 p. m.',
    timeShort: '3:00 p. m.',
    host: 'Heydi',
    category: 'Hogar y Testimonios',
    description: 'Espacio de diálogo enriquecedor sobre la vida del hogar, la educación de los hijos y vivencias que fortalecen la fe de toda la familia cristiana.',
    icon: 'mic',
    image: 'charlas_con_heydi.jpg'
  },
  {
    id: 'tardes-de-profecia',
    title: 'Tardes de Profecía',
    dayName: 'Viernes',
    dayOfWeek: 5,
    startHour: 15, // 3:00 PM
    startMinute: 0,
    durationMinutes: 60,
    timeFormatted: '3:00 p. m. — 4:00 p. m.',
    timeShort: '3:00 p. m.',
    host: null,
    category: 'Profecía Bíblica',
    description: 'Estudio bíblico reverente y profundo de las profecías de Daniel y Apocalipsis, arrojando luz y certeza sobre el tiempo del fin y la gloriosa segunda venida de Cristo.',
    icon: 'scroll',
    image: 'tardes_de_profecia.jpg'
  },
  {
    id: 'viernes-sendas-antiguas',
    title: 'Viernes Sendas Antiguas',
    dayName: 'Viernes',
    dayOfWeek: 5,
    startHour: 17, // 5:00 PM
    startMinute: 0,
    durationMinutes: 60,
    timeFormatted: '5:00 p. m. — 6:00 p. m.',
    timeShort: '5:00 p. m.',
    host: null,
    category: 'Recepción de Sábado',
    description: 'Bienvenida al Santo Sábado con himnos tradicionales de la fe adventista, alabanzas de gratitud y quietud devocional para comenzar las horas sagradas.',
    icon: 'church',
    image: 'viernes_sendas_antiguas.jpg'
  },
  {
    id: 'voz-infantil',
    title: 'Voz Infantil',
    dayName: 'Sábado',
    dayOfWeek: 6,
    startHour: 16, // 4:00 PM
    startMinute: 0,
    durationMinutes: 60,
    timeFormatted: '4:00 p. m. — 5:00 p. m.',
    timeShort: '4:00 p. m.',
    host: null,
    category: 'Infantil y Familiar',
    description: 'Historias bíblicas dramatizadas, cantos alegres y lecciones de fe y obediencia preparadas con ternura para los niños y niñas del hogar.',
    icon: 'child',
    image: 'voz_infantil.jpg'
  }
];

