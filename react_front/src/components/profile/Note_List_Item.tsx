import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Note } from '../../scripts/API_endPoint/note/note_types';

interface NoteListItemProps {
  note: Note;
}

const NoteListItem: React.FC<NoteListItemProps> = ({ note }) => {
  const navigate = useNavigate();
  
  const date = new Date(note.updated_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });

  return (
    <div 
      onClick={() => navigate(`/workspace/editor/${note.id}`)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        padding: '16px',
        backgroundColor: 'white',
        borderRadius: '12px',
        marginBottom: '10px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.02)',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        border: '1px solid transparent'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#F8F8FF'; // Дуже світлий фіолетовий
        e.currentTarget.style.borderColor = '#E6E6FA';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'white';
        e.currentTarget.style.borderColor = 'transparent';
      }}
    >
      {/* Іконка документа */}
      <div style={{ 
        width: '40px', height: '40px', borderRadius: '10px', 
        backgroundColor: '#F3F0FF', color: '#6A5ACD',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '20px'
      }}>
        📝
      </div>
      
      {/* Інформація */}
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: '600', fontSize: '15px', color: '#333' }}>{note.title || "Untitled"}</div>
        <div style={{ fontSize: '12px', color: '#999' }}>Last edited: {date}</div>
      </div>

      {/* Стрілочка */}
      <div style={{ color: '#ccc' }}>→</div>
    </div>
  );
};

export default NoteListItem;