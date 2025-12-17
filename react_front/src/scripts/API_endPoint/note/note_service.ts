import type { Note } from './note_types'; 

const API_URL = 'http://localhost:8000/api';

// Отримати список
export const fetchNotes = async (): Promise<Note[]> => {
  const response = await fetch(`${API_URL}/notes/all/`, { // Новий URL
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to fetch notes');
  return response.json();
};

// Отримати одну
export const getNote = async (id: number): Promise<Note> => {
  const response = await fetch(`${API_URL}/notes/${id}/`, { // Цей лишився простим
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to fetch note');
  return response.json();
};

// Створити
export const createNote = async (): Promise<Note> => {
  const response = await fetch(`${API_URL}/notes/create/`, { // Новий URL
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Failed to create note');
  return response.json();
};

// Оновити (Автозбереження)
export const updateNote = async (id: number, data: { title?: string, content?: string }): Promise<Note> => {
  const response = await fetch(`${API_URL}/notes/${id}/update/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data), // Відправляємо весь об'єкт
  });

  if (!response.ok) {
    throw new Error('Failed to save note');
  }

  return response.json();
};

export const deleteNote = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/notes/${id}/delete/`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to delete note');
  }
};