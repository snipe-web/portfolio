/**
 * ⚙️ ГЛАВНАЯ КОНФИГУРАЦИЯ
 * Здесь настраиваются основные параметры сайта
 */
const CONFIG = {
  appName: 'LH.Vault',
  appVersion: '2.2',
  defaultTheme: 'dark', // 'light' или 'dark'
  
  // Настройки пользователя по умолчанию (если не вошел)
  guestUser: {
    name: 'Guest User',
    bio: 'Explore & Create',
    avatar: 'https://ui-avatars.com/api/?name=Guest&background=2a2a2a&color=888&rounded=true',
    xp: 0,
    level: 1,
    viewed: []
  },

  // Коды доступа (можно добавить свои)
  accessCodes: ['12345', 'admin', 'root']
};

/**
 * 📂 КАТЕГОРИИ
 * id: { title: 'Заголовок', sub: 'подзаголовок' }
 */
const CATS = {
  'mods':              { title: 'Модификации',     sub: 'все' },
  'mods-tilda':        { title: 'Моды · Tilda',    sub: 'только Tilda' },
  'mods-other':        { title: 'Моды · Прочее',   sub: 'прочие платформы' },
  'tools':             { title: 'Инструменты',     sub: 'все' },
  'tools-design':      { title: 'Инструменты · Дизайн', sub: 'для дизайна' },
  'tools-dev':         { title: 'Инструменты · Dev', sub: 'для разработки' },
  'scripts':           { title: 'Скрипты',         sub: 'все' },
  'scripts-tilda':     { title: 'Скрипты · Tilda', sub: 'только Tilda' },
  'collections':       { title: 'Подборки',        sub: 'все' },
  'collections-figma': { title: 'Подборки · Figma','sub': 'плагины и ресурсы' },
};

/**
 * 📦 БАЗА ДАННЫХ (DB)
 * Добавляйте новые карточки сюда.
 */
const DB = [

  // --- ПРИМЕР МОДИФИКАЦИИ ---
  {
    id: 'multi-class-tilda',
    cats: ['mods', 'mods-tilda'],
    emoji: '🏷',
    name: 'Несколько классов для любого блока в Тильде',
    chips: [
      { text: 'Tilda', cls: 'cy' },
      { text: 'Zero Block', cls: 'cb' },
      { text: 'Работает', cls: 'cg' },
    ],
    status: 'green', statusText: 'Актуально · v1.0',
    version: '1.0 · 17.02.2026',
    source: 'https://lf-code.ru',
    image: '', 
    desc: `Решает одно из главных ограничений Tilda — по умолчанию каждому блоку можно назначить только один CSS-класс.`,
    steps: [
      'Скачай файл модификации',
      'Вставь в HEAD сайта',
      'Используй классы через запятую'
    ],
    code: {
      lang: 'html',
      text: `<script>\n/* Код скрипта здесь */\n</script>`,
    },
    links: [],
  },

  // --- ПРИМЕР ИНСТРУМЕНТА ---
  {
    id: 'colormania',
    cats: ['tools', 'tools-design'],
    emoji: '🎨',
    name: 'ColorMania — пипетка для дизайнеров',
    chips: [
      { text: 'Windows', cls: 'cb' },
      { text: 'Бесплатно', cls: 'cg' },
    ],
    status: 'green', statusText: 'Бесплатно',
    version: 'latest',
    source: 'https://www.blacksunsoftware.com/colormania.html',
    image: '',
    desc: `Идеальная пипетка для дизайнеров и разработчиков.`,
    steps: [],
    code: null,
    links: [
      {
        ico: '💾',
        name: 'ColorMania для Windows',
        desc: 'Официальный сайт',
        url: 'https://www.blacksunsoftware.com/colormania.html',
      }
    ],
  },

  // --- ПРИМЕР СКРИПТА ---
  {
    id: 'utm-blocks',
    cats: ['scripts', 'scripts-tilda'],
    emoji: '⚡',
    name: 'Показ блоков только трафику из рекламы (UTM)',
    chips: [
      { text: 'Tilda', cls: 'cy' },
      { text: 'Marketing', cls: 'co' },
    ],
    status: 'green', statusText: 'Работает',
    version: 'mini-script',
    source: '',
    image: '',
    desc: `Показывает блоки только если в URL есть UTM метки.`,
    steps: ['Добавь блок T123', 'Вставь код', 'Добавь класс uc-ads-block к блокам'],
    code: {
      lang: 'js',
      text: `if(location.search.includes('utm')) { /* logic */ }`,
    },
    links: [],
  },

  // --- ПРИМЕР ПОДБОРКИ ---
  {
    id: 'figma-plugins',
    cats: ['collections', 'collections-figma'],
    emoji: '🎭',
    name: 'Подборка полезных плагинов для Figma',
    chips: [
      { text: 'Figma', cls: 'cp' },
      { text: 'Top 5', cls: 'cy' },
    ],
    status: 'green', statusText: 'Актуально',
    version: '2026',
    source: '',
    image: '',
    desc: `5 плагинов которые реально полезны в работе.`,
    steps: [],
    code: null,
    links: [
      {
        ico: '🔲',
        name: 'Perspective Toolkit',
        desc: 'Работа с перспективой',
        url: 'https://www.figma.com/',
      },
      {
        ico: '✂️',
        name: 'Icons8 BG Remover',
        desc: 'Удаление фона',
        url: 'https://icons8.com/',
      }
    ],
  },
];