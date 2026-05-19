// Глобальні модулі (Перший вузький сайдбар)
export const globalModules = [
  { id: 'profile', label: 'Профіль', icon: '👤', path: '/workspace/profile' },
  { id: 'groups', label: 'Групи', icon: '📁', path: '/workspace/groups' },
  { id: 'settings', label: 'Налаштування', icon: '⚙️', path: '/workspace/settings' },
];

// Структура груп (для другого сайдбару, коли обрано модуль "Групи")
export const mockGroups = [
  {
    id: 'group-1',
    name: 'SciRise Dev',
    channels: [
      { id: 'c1', type: 'chat', label: 'Загальний', path: '/workspace/groups/group-1/chat/general' },
      { id: 'c2', type: 'board', label: 'Архітектура', path: '/workspace/groups/group-1/board/arch' },
      { id: 'c3', type: 'voice', label: 'Міти', path: '/workspace/groups/group-1/voice/main' },
    ]
  },
  {
    id: 'group-2',
    name: 'Математика',
    channels: [
      { id: 'c4', type: 'chat', label: 'Домашка', path: '/workspace/groups/group-2/chat/hw' },
    ]
  }
];

// Меню налаштувань (для другого сайдбару, коли обрано модуль "Налаштування")
export const settingsMenu = [
  { id: 'acc', label: 'Акаунт', icon: '🔑', path: '/workspace/settings/account' },
  { id: 'theme', label: 'Вигляд', icon: '🎨', path: '/workspace/settings/appearance' },
];