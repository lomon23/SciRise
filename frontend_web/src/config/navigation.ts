import { User, Users, BookOpen, Settings } from 'lucide-react';

export const globalModules = [
  { id: 'profile', label: 'Профіль', path: '/workspace/profile', icon: User },
  { id: 'groups', label: 'Групи', path: '/workspace/groups', icon: Users },
  { id: 'courses', label: 'Курси', path: '/workspace/courses', icon: BookOpen },
  { id: 'settings', label: 'Налаштування', path: '/workspace/settings', icon: Settings }
];