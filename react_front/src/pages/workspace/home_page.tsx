import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createNote, fetchNotes, deleteNote } from '../../scripts/API_endPoint/note/note_service';
import type { Note } from '../../scripts/API_endPoint/note/note_types';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState<Note[]>([]);
  
  // --- STATE ДЛЯ ВИДІЛЕННЯ ---
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedNotes, setSelectedNotes] = useState<Set<number>>(new Set());

  // --- ЗАВАНТАЖЕННЯ ---
  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = () => {
    fetchNotes()
      .then(data => setNotes(data))
      .catch(err => console.error("Error fetching notes:", err));
  };

  // --- ЛОГІКА ДІЙ ---

  const handleCreateNewNote = async () => {
    if (isSelectionMode) return; // Не створюємо, якщо в режимі виділення
    try {
      const newNote = await createNote();
      navigate(`/workspace/editor/${newNote.id}`);
    } catch (error) {
      console.error("Failed to create note:", error);
    }
  };

  const handleCardClick = (id: number) => {
    if (isSelectionMode) {
      toggleSelection(id);
    } else {
      navigate(`/workspace/editor/${id}`);
    }
  };

  const toggleSelection = (id: number) => {
    const newSelected = new Set(selectedNotes);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedNotes(newSelected);
  };

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedNotes(new Set()); // Очищаємо вибір при виході/вході
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedNotes.size} notes?`)) return;

    // Видаляємо паралельно
    const promises = Array.from(selectedNotes).map(id => deleteNote(id));
    
    try {
      await Promise.all(promises);
      // Оновлюємо список локально, щоб не робити зайвий запит
      setNotes(notes.filter(n => !selectedNotes.has(n.id)));
      setIsSelectionMode(false);
      setSelectedNotes(new Set());
    } catch (error) {
      alert("Error deleting notes");
      console.error(error);
    }
  };

  // Форматування дати (наприклад: Dec 17, 12:30)
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' ' + 
           date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  // --- СТИЛІ ---
  const styles = {
    container: { paddingBottom: '80px', fontFamily: "'Inter', sans-serif" },
    headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
    sectionTitle: { fontSize: '22px', fontWeight: '700', color: '#1a1a1a' },
    actionBtn: { 
      padding: '8px 16px', borderRadius: '20px', border: 'none', cursor: 'pointer', 
      fontWeight: '600', fontSize: '14px', transition: 'all 0.2s' 
    },
    
    // Скрол контейнер
    scrollContainer: {
      display: 'flex', gap: '20px', overflowX: 'auto' as 'auto', padding: '10px 5px 20px 5px',
      scrollbarWidth: 'none' as 'none', msOverflowStyle: 'none' as 'none'
    },

    // КАРТКА НОТАТКИ (Новий дизайн)
    card: (isSelected: boolean) => ({
      minWidth: '240px',
      height: '160px',
      backgroundColor: 'white',
      borderRadius: '16px',
      // Якщо вибрано - фіолетова рамка, якщо ні - легка тінь
      border: isSelected ? '2px solid #6A5ACD' : '1px solid #f0f0f0',
      boxShadow: isSelected ? '0 0 0 4px rgba(106, 90, 205, 0.2)' : '0 4px 12px rgba(0,0,0,0.03)',
      display: 'flex', flexDirection: 'column' as 'column',
      cursor: 'pointer',
      position: 'relative' as 'relative',
      transition: 'transform 0.2s, box-shadow 0.2s',
      overflow: 'hidden',
      flexShrink: 0,
      transform: isSelected ? 'translateY(-2px)' : 'none'
    }),

    // Контент картки
    cardContent: { padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' as 'column' },
    cardTitle: { fontSize: '16px', fontWeight: '700', color: '#333', marginBottom: '8px', whiteSpace: 'nowrap' as 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
    cardPreview: { fontSize: '13px', color: '#888', lineHeight: '1.4', flex: 1, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' as 'vertical' },
    cardFooter: { marginTop: 'auto', paddingTop: '15px', fontSize: '11px', color: '#aaa', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },

    // Картка додавання (+)
    addCard: {
      minWidth: '240px', height: '160px', borderRadius: '16px',
      border: '2px dashed #d1d1d1', backgroundColor: '#fafafa',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', flexShrink: 0, transition: 'all 0.2s',
      color: '#aaa'
    },

    // Чекбокс вибору
    checkbox: (isSelected: boolean) => ({
      position: 'absolute' as 'absolute', top: '12px', right: '12px',
      width: '24px', height: '24px', borderRadius: '50%',
      backgroundColor: isSelected ? '#6A5ACD' : 'rgba(0,0,0,0.05)',
      border: isSelected ? 'none' : '2px solid white',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'white', fontSize: '14px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
    }),

    // Плаваюча панель дій
    actionBar: {
      position: 'fixed' as 'fixed', bottom: '30px', left: '50%', transform: 'translateX(-50%)',
      backgroundColor: '#333', color: 'white', padding: '12px 24px', borderRadius: '50px',
      display: 'flex', gap: '20px', alignItems: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
      zIndex: 1000, animation: 'slideUp 0.3s ease-out'
    }
  };

  return (
    <div style={styles.container}>
      
      {/* === HEADER YOUR NOTES === */}
      <div style={styles.headerRow}>
        <h2 style={styles.sectionTitle}>Your Notes</h2>
        
        {/* Кнопка Manage / Cancel */}
        <button 
          onClick={toggleSelectionMode}
          style={{
            ...styles.actionBtn,
            backgroundColor: isSelectionMode ? '#eee' : 'transparent',
            color: isSelectionMode ? '#333' : '#6A5ACD',
            border: isSelectionMode ? 'none' : '1px solid #6A5ACD'
          }}
        >
          {isSelectionMode ? 'Done' : 'Select'}
        </button>
      </div>

      <div style={styles.scrollContainer} className="hide-scrollbar">
        
        {/* 1. Картка "+" (Ховаємо в режимі виділення або робимо неактивною) */}
        <div 
          onClick={handleCreateNewNote}
          style={{ 
            ...styles.addCard,
            opacity: isSelectionMode ? 0.3 : 1,
            pointerEvents: isSelectionMode ? 'none' : 'auto'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#6A5ACD'; e.currentTarget.style.color = '#6A5ACD'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#d1d1d1'; e.currentTarget.style.color = '#aaa'; }}
        >
          <div style={{ fontSize: '40px', fontWeight: '300' }}>+</div>
        </div>

        {/* 2. Список нотаток */}
        {notes.map((note) => {
          const isSelected = selectedNotes.has(note.id);
          
          return (
            <div 
              key={note.id} 
              onClick={() => handleCardClick(note.id)}
              style={styles.card(isSelected)}
              onMouseEnter={(e) => !isSelected && (e.currentTarget.style.transform = 'translateY(-4px)')}
              onMouseLeave={(e) => !isSelected && (e.currentTarget.style.transform = 'none')}
            >
              <div style={styles.cardContent}>
                <div style={styles.cardTitle}>{note.title || "Untitled"}</div>
                
                {/* Прев'ю тексту (вирізаємо # для краси) */}
                <div style={styles.cardPreview}>
                  {note.content ? note.content.replace(/[#*`]/g, '') : "No additional text"}
                </div>

                <div style={styles.cardFooter}>
                  <span>{formatDate(note.updated_at)}</span>
                </div>
              </div>

              {/* Чекбокс (з'являється в режимі виділення) */}
              {isSelectionMode && (
                <div style={styles.checkbox(isSelected)}>
                  {isSelected && '✓'}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* === ПЛАВАЮЧА ПАНЕЛЬ ДІЙ (Bulk Actions) === */}
      {isSelectionMode && selectedNotes.size > 0 && (
        <div style={styles.actionBar}>
          <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{selectedNotes.size} selected</span>
          
          <div style={{ width: '1px', height: '20px', backgroundColor: '#555' }}></div>

          {/* Кнопка Delete */}
          <button 
            onClick={handleBulkDelete}
            style={{ 
              background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer', 
              display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 'bold' 
            }}
          >
            <span>🗑 Delete</span>
          </button>

          {/* Кнопка Favorite (Поки що візуальна, бо бекенд ще не має поля is_favorite) */}
          <button 
            onClick={() => alert("Add to Favorites logic here")}
            style={{ 
              background: 'none', border: 'none', color: 'white', cursor: 'pointer', 
              display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 'bold' 
            }}
          >
            <span>★ Favorite</span>
          </button>
        </div>
      )}

    </div>
  );
};

export default HomePage;