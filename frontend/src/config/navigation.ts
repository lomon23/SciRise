// Глобальні модулі (Перший вузький сайдбар)
export const globalModules = [
  { id: 'profile', label: 'Профіль', icon: '👤', path: '/workspace/profile' },
  { id: 'groups', label: 'Групи', icon: '📁', path: '/workspace/groups' },
  { id: 'courses', label: 'Курси', icon: '📚', path: '/workspace/courses' },
  { id: 'settings', label: 'Налаштування', icon: '⚙️', path: '/workspace/settings' },
];

// Структура груп (для другого сайдбару, коли обрано модуль "Групи")

// Меню налаштувань (для другого сайдбару, коли обрано модуль "Налаштування")
export const settingsMenu = [
  { id: 'acc', label: 'Акаунт', icon: '🔑', path: '/workspace/settings/account' },
  { id: 'theme', label: 'Вигляд', icon: '🎨', path: '/workspace/settings/appearance' },
];