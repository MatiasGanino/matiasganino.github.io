// Todo el contenido sale de acá: el sitio (index.astro) y el CV en PDF para RRHH (cv.astro).
export const cv = {
  nombre: 'Matías Ganino',
  iniciales: 'MG',
  roles: ['Desarrollador Full Stack', 'Analista DBA', 'QA Tester'],
  bajada: 'Construyo y mantengo sistemas web y móviles en producción, del modelo de datos al deploy.',
  disponibilidad: 'Abierto a nuevas oportunidades',
  ubicacion: 'CABA, Argentina',
  email: 'mati.ganino@gmail.com',
  telefono: '', // Si lo completás, aparece en el PDF y en Contacto (el sitio es público)
  linkedin: 'https://www.linkedin.com/in/matias-ganino-743690192/',
  web: 'https://matiasganino.github.io',
  pdf: 'CV-Matias-Ganino.pdf',

  perfil:
    'Desarrollador Full Stack con 4 años de experiencia en la UNSAM, construyendo y manteniendo sistemas web y móviles ' +
    'en producción para la Municipalidad de General San Martín y la propia universidad. Trabajo con Java, ' +
    'Spring Boot, Angular, React Native, Go y PostgreSQL, y me especializo en modernizar sistemas legados.',

  stats: [
    { valor: 4, sufijo: '', label: 'años como desarrollador' },
    { valor: 7, sufijo: '', label: 'sistemas en producción' },
    { valor: 2, sufijo: '', label: 'apps móviles publicadas' },
  ],

  // En el sitio no se muestra (se quitó a pedido); va en el CV en PDF, que es lo que lee RRHH.
  experiencia: [
    {
      rol: 'Desarrollador Full Stack · Analista DBA · QA Tester',
      lugar: 'Universidad Nacional de San Martín (UNSAM)',
      periodo: '2022 — Actualidad',
      items: [
        'Desarrollo full stack de aplicaciones web y móviles para la universidad y la Municipalidad de General San Martín.',
        'Migración de sistemas legados en JSF / PrimeFaces a Spring Boot + Angular (Turnero Municipal y Destinatarios de Programas).',
        'Desarrollo de dos apps móviles publicadas: CogniGym (Google Play y App Store) y ePill (Google Play).',
        'Mantenimiento correctivo y evolutivo de sistemas en producción.',
        'Optimización de bases de datos y análisis de rendimiento (PostgreSQL, SQL).',
        'Pruebas funcionales y de regresión (QA), con metodologías ágiles, GitHub y JIRA.',
      ],
    },
    {
      rol: 'Operador de Datos (temporal)',
      lugar: 'Randstad',
      periodo: '2019 — 2023',
      items: ['Carga y verificación de datos en sistemas de procesamiento de votos para elecciones nacionales.'],
    },
    {
      rol: 'Optimizador de Procesos · Atención al Cliente',
      lugar: 'Fase M Agronomía',
      periodo: '2018 — 2022',
      items: [
        'Mejora de procesos internos para reducir tiempos de atención y gestión.',
        'Soporte y asesoramiento al cliente en productos electrónicos.',
      ],
    },
  ],

  // tipo: 'Desde cero' | 'Migración' | 'Mantenimiento' · dispositivo: 'movil' | 'web' (define el dibujo de la tarjeta)
  // url: opcional, solo para sitios públicos; aparece como link en la tarjeta y en el PDF.
  // freelance: opcional; lo marca con su etiqueta para separarlo del trabajo en relación de dependencia.
  // color: 'muni' | 'apps' | 'empleos' | 'recafe'; los proyectos del mismo grupo comparten el color de la tarjeta.
  // hice: lo que hiciste en el proyecto. Los dos primeros también salen en el CV en PDF: van primero los más fuertes.
  proyectos: [
    {
      nombre: 'RECAFE',
      cliente: 'Cafetería en Agronomía, CABA',
      tipo: 'Desde cero',
      color: 'recafe',
      freelance: true,
      dispositivo: 'web',
      url: 'https://www.recafe.com.ar',
      descripcion: 'Sitio web de la cafetería con la carta online, horarios y ubicación.',
      hice: [
        'Desarrollo completo del sitio y deploy.',
        'Panel con login para que el local edite la carta.',
        'Carta online con filtro por categoría.',
      ],
      stack: ['Astro', 'TypeScript', 'Redis', 'Vercel'],
    },
    {
      nombre: 'CogniGym',
      cliente: 'UNSAM · publicada en Google Play y App Store',
      tipo: 'Desde cero',
      color: 'apps',
      dispositivo: 'movil',
      descripcion:
        'App de entrenamiento cognitivo con 10 juegos para ejercitar la mente.',
      hice: [
        'Backend en Go con API REST: registro anónimo, puntajes y estadísticas de uso.',
        'Backoffice web para gestionar juegos, anuncios y métricas de la app.',
        'App móvil en React Native con juegos como sudoku, ajedrez, crucigrama y adivinar canciones.',
        'Notificaciones push y tareas programadas.',
      ],
      stack: ['React Native', 'Expo', 'Go', 'PostgreSQL'],
    },
    {
      nombre: 'ePill',
      cliente: 'UNSAM · publicada en Google Play',
      tipo: 'Desde cero',
      color: 'apps',
      dispositivo: 'movil',
      descripcion: 'App de recordatorio de medicamentos que organiza el tratamiento del paciente en un solo lugar.',
      hice: [
        'Desarrollo completo de la aplicación móvil.',
        'Autenticación e integración con el backend.',
        'Agenda de tomas, gestión de medicamentos y pedidos.',
      ],
      stack: ['React Native', 'Expo', 'TypeScript'],
    },
    {
      nombre: 'Portal de Empleos',
      cliente: 'Escuela de Ciencia y Tecnología · UNSAM',
      tipo: 'Desde cero',
      color: 'empleos',
      dispositivo: 'web',
      descripcion: 'Bolsa de trabajo que conecta a estudiantes y graduados de la ECyT con ofertas laborales.',
      hice: [
        'Desarrollo full stack, del modelo de datos al deploy.',
        'Publicación de ofertas laborales y gestión de postulaciones.',
        'Perfil y CV del usuario: estudios, carreras, idiomas y experiencia.',
      ],
      stack: ['Angular', 'Spring Boot', 'Java', 'JHipster', 'PostgreSQL'],
    },
    {
      nombre: 'Turnero Municipal',
      cliente: 'Municipalidad de General San Martín',
      tipo: 'Migración',
      color: 'muni',
      dispositivo: 'web',
      descripcion:
        'Sistema de turnos del municipio: backoffice donde cada sede atiende su cola por puesto, y formulario público donde los vecinos sacan y anulan turnos.',
      hice: [
        'Migración en curso del backoffice a una nueva versión en Spring Boot + Angular, sobre la misma base de datos.',
        'Migración del formulario público a React + Go, con los mismos mails y constancias que el anterior.',
        'Mantenimiento correctivo y evolutivo del sistema actual (JSF + PrimeFaces) y de su formulario público.',
        'Notificaciones por mail y SMS, informes de atención y auditoría.',
      ],
      stack: ['Java', 'Spring Boot', 'Angular', 'React', 'Go', 'JSF', 'PrimeFaces', 'PostgreSQL'],
    },
    {
      nombre: 'Destinatarios de Programas',
      cliente: 'Municipalidad de General San Martín',
      tipo: 'Migración',
      color: 'muni',
      dispositivo: 'web',
      descripcion:
        'Sistema de los programas sociales del municipio: los vecinos se inscriben desde un formulario público y el backoffice gestiona destinatarios, beneficios, sedes y presupuesto.',
      hice: [
        'Migración en curso del backoffice a una nueva versión en Spring Boot + Angular.',
        'Mantenimiento correctivo y evolutivo del backoffice actual en JSF + PrimeFaces.',
        'Mantenimiento del formulario público de inscripción (Apache Wicket): datos personales, domicilio georreferenciado y adjuntos.',
        'Preinscripciones desde el formulario, importaciones masivas, reportes y auditoría.',
      ],
      stack: ['Java', 'Spring Boot', 'Angular', 'JSF', 'PrimeFaces', 'Apache Wicket', 'PostgreSQL'],
    },
  ],

  formacion: [
    { titulo: 'Licenciatura en Desarrollo de Software', lugar: 'Universidad Nacional de San Martín', periodo: 'En curso' },
    { titulo: 'Diplomatura en Seguridad de la Información', lugar: 'Universidad Nacional de San Martín', periodo: '2025' },
    { titulo: 'Tecnicatura Universitaria en Programación Informática', lugar: 'Universidad Nacional de San Martín', periodo: '2019 — 2024' },
    { titulo: 'Bachillerato en Economía y Administración', lugar: 'Instituto Parroquial Nuestra Señora de la Unidad', periodo: '2013 — 2017' },
  ],

  // Las dos primeras filas forman la marquesina de arriba del sitio; las otras, la de abajo.
  habilidades: [
    { grupo: 'Lenguajes', items: ['Java', 'Go', 'TypeScript', 'JavaScript', 'SQL', 'HTML', 'CSS'] },
    { grupo: 'Frameworks', items: ['Spring Boot', 'Angular', 'React', 'React Native', 'Expo', 'Astro', 'JHipster', 'JSF / PrimeFaces', 'Apache Wicket'] },
    { grupo: 'Bases de datos', items: ['PostgreSQL', 'MySQL', 'Redis'] },
    { grupo: 'Herramientas y métodos', items: ['Git', 'GitHub', 'Vercel', 'JIRA', 'Metodologías ágiles', 'QA Testing', 'Photoshop', 'Illustrator'] },
  ],

  // Ejemplo: [{ idioma: 'Inglés', nivel: 'Intermedio (lectura técnica)' }]. Vacío = no se muestra.
  idiomas: [],

  especialidades: [
    { titulo: 'Full stack', texto: 'Del modelo de datos al frontend y el deploy, en web y en móvil.' },
    { titulo: 'Bases de datos', texto: 'Optimización de consultas y análisis de rendimiento en PostgreSQL y MySQL.' },
    { titulo: 'Calidad (QA)', texto: 'Pruebas funcionales y de regresión antes de cada versión.' },
    { titulo: 'Modernización', texto: 'Migración de sistemas legados en JSF / PrimeFaces a Spring Boot y Angular.' },
  ],

  competencias: [
    'Trabajo en equipo y comunicación efectiva',
    'Trabajo bajo presión',
    'Organización de múltiples proyectos en simultáneo',
    'Proactividad y adaptabilidad',
  ],
};
