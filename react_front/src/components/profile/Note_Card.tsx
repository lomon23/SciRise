import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Note } from '../../scripts/API_endPoint/note/note_types';

interface NoteCardProps {
  note: Note;
}

const NoteCard: React.FC<NoteCardProps> = ({ note }) => {
  const navigate = useNavigate();

  // Очищаємо Markdown для прев'ю (прибираємо #, *, >)
  const previewText = note.content 
    ? note.content.replace(/[#*`>]/g, '').slice(0, 60) + (note.content.length > 60 ? '...' : '')
    : "No content yet...";

  // Форматуємо дату
  const date = new Date(note.updated_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <div 
      onClick={() => navigate(`/workspace/editor/${note.id}`)}
      style={{
        minWidth: '240px',
        height: '160px',
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        cursor: 'pointer',
        border: '1px solid #f0f0f0',
        transition: 'transform 0.2s',
        flexShrink: 0 // Щоб не стискалось у скролі
      }}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
    >
      <div>
        {/* Заголовок */}
        <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#333', marginBottom: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {note.title || "Untitled"}
        </div>
        
        {/* Прев'ю тексту */}
        <div style={{ fontSize: '13px', color: '#888', lineHeight: '1.4', height: '3.0em', overflow: 'hidden' }}>
          {previewText}
        </div>
      </div>

      {/* Футер картки (Дата) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: 'auto' }}>
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#6A5ACD' }}></div>
        <span style={{ fontSize: '12px', color: '#aaa' }}>{date}</span>
      </div>
    </div>
  );
};

export default NoteCard;