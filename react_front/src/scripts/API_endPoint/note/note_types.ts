// src/scripts/API_endPoint/notes/notes_types.ts
export interface Note {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}
export interface UpdateNoteRequest {
  title?: string;
  content?: string;
}