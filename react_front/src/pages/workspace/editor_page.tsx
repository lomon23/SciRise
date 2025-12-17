import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Save, Trash2, Sparkles, X, Loader2, 
  Bold, Italic, List, Code, Quote, Eye, EyeOff, Heading 
} from 'lucide-react';
import ReactMarkdown from 'react-markdown'; // Імпорт для рендеру
import { getNote, updateNote, deleteNote, aiEditNote } from '../../scripts/API_endPoint/note/note_service';
import type { Note } from '../../scripts/API_endPoint/note/note_types';

const EditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // --- Стейт ---
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  
  // UI
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiInstruction, setAiInstruction] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  // 1. Завантаження
  useEffect(() => {
    if (!id) return;
    const fetchNote = async () => {
      try {
        const data = await getNote(Number(id));
        setNote(data);
      } catch (error) {
        navigate('/workspace');
      } finally {
        setLoading(false);
      }
    };
    fetchNote();
  }, [id, navigate]);

  // 2. Автозбереження
  useEffect(() => {
    if (!note) return;
    setSaveStatus('unsaved');
    const timer = setTimeout(async () => {
      setSaveStatus('saving');
      try {
        await updateNote(note.id, { title: note.title, content: note.content });
        setSaveStatus('saved');
      } catch (error) {
        setSaveStatus('unsaved');
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [note?.title, note?.content]);

  // 3. РОЗУМНЕ ФОРМАТУВАННЯ (Ось тут зміни)
  const applyFormat = (type: 'bold' | 'italic' | 'code' | 'list' | 'quote' | 'heading') => {
    if (!textareaRef.current || !note) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = note.content;

    let newText = text;
    let newCursorPos = end;

    // --- БЛОКОВІ СТИЛІ (Список, Цитата, Заголовок) ---
    if (['list', 'quote', 'heading'].includes(type)) {
      // Знаходимо початок і кінець рядків, які зачіпає виділення
      const lineStart = text.lastIndexOf('\n', start - 1) + 1;
      const lineEnd = text.indexOf('\n', end);
      const actualEnd = lineEnd === -1 ? text.length : lineEnd;

      const selectedLines = text.substring(lineStart, actualEnd).split('\n');
      
      const prefixMap = { list: '- ', quote: '> ', heading: '## ' };
      const prefix = prefixMap[type as 'list' | 'quote' | 'heading'];

      // Перевіряємо, чи всі рядки вже мають цей префікс (щоб видалити його)
      const allHavePrefix = selectedLines.every(line => line.startsWith(prefix));

      const processedLines = selectedLines.map(line => {
        if (allHavePrefix) {
          return line.substring(prefix.length); // Видаляємо префікс
        } else {
          // Якщо вже є якийсь інший префікс (наприклад, список перетворюємо в цитату), спочатку чистимо
          return prefix + line.replace(/^(- |> |## )/, ''); 
        }
      });

      const newBlock = processedLines.join('\n');
      newText = text.substring(0, lineStart) + newBlock + text.substring(actualEnd);
      
      // Оновлюємо курсор, щоб він охоплював новий блок
      newCursorPos = lineStart + newBlock.length;
    } 
    
    // --- ІНЛАЙН СТИЛІ (Жирний, Курсив, Код) ---
    else {
      const symbolMap = { bold: '**', italic: '*', code: '`' };
      const symbol = symbolMap[type as 'bold' | 'italic' | 'code'];
      const selected = text.substring(start, end);

      // Перевірка: чи вже обгорнуто?
      const isWrapped = 
        (text.substring(start - symbol.length, start) === symbol) &&
        (text.substring(end, end + symbol.length) === symbol);

      if (isWrapped) {
        // Видаляємо символи навколо
        newText = text.substring(0, start - symbol.length) + selected + text.substring(end + symbol.length);
        newCursorPos = end - symbol.length;
      } else {
        // Додаємо символи
        newText = text.substring(0, start) + symbol + selected + symbol + text.substring(end);
        newCursorPos = end + symbol.length;
      }
    }

    setNote({ ...note, content: newText });
    
    // Повертаємо фокус
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  // 4. Видалення
  const handleDelete = async () => {
    if (!note || !confirm("Delete note?")) return;
    await deleteNote(note.id);
    navigate('/workspace');
  };

  // 5. AI Magic
  const handleAiSubmit = async () => {
    if (!note || !aiInstruction.trim()) return;
    setIsAiLoading(true);
    try {
      const data = await aiEditNote(note.content, aiInstruction);
      setNote({ ...note, content: data.result });
      setShowAiModal(false);
      setAiInstruction('');
    } catch {
      alert("AI Failed");
    } finally {
      setIsAiLoading(false);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (!note) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#f7f8fa', fontFamily: "'Inter', sans-serif" }}>
      
      {/* HEADER */}
      <div style={{ height: '60px', background: 'white', borderBottom: '1px solid #e5e5e5', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flex: 1 }}>
          <button onClick={() => navigate('/workspace')} style={navBtnStyle}><ArrowLeft size={18} /></button>
          <input 
            value={note.title}
            onChange={(e) => setNote({ ...note, title: e.target.value })}
            placeholder="Untitled Note"
            style={{ fontSize: '18px', fontWeight: '600', border: 'none', outline: 'none', background: 'transparent', width: '100%' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: saveStatus === 'unsaved' ? '#e67e22' : '#27ae60', marginRight: '10px', fontWeight: 500 }}>
             {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'unsaved' ? 'Unsaved' : 'Saved'}
          </span>
          <button onClick={() => setIsPreview(!isPreview)} style={toolBtnStyle} title="Preview">
            {isPreview ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
          <button onClick={() => setShowAiModal(true)} style={{ ...toolBtnStyle, background: '#2c3e50', color: 'white', border: 'none' }}>
            <Sparkles size={16} /> AI Edit
          </button>
          <button onClick={handleDelete} style={{ ...toolBtnStyle, color: '#e74c3c' }}><Trash2 size={18} /></button>
        </div>
      </div>

      {/* WORKSPACE */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', justifyContent: 'center', padding: '20px' }}>
        <div style={{ 
          width: '100%', maxWidth: '900px', background: 'white', borderRadius: '8px', 
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', 
          border: '1px solid #e0e0e0', overflow: 'hidden' 
        }}>
          
          {/* TOOLBAR */}
          {!isPreview && (
            <div style={{ padding: '8px 15px', borderBottom: '1px solid #eee', display: 'flex', gap: '6px', background: '#fafafa' }}>
              <ToolbarButton icon={<Bold size={16}/>} onClick={() => applyFormat('bold')} tooltip="Bold" />
              <ToolbarButton icon={<Italic size={16}/>} onClick={() => applyFormat('italic')} tooltip="Italic" />
              <ToolbarButton icon={<Heading size={16}/>} onClick={() => applyFormat('heading')} tooltip="Heading" />
              <div style={{ width: 1, height: 20, background: '#ddd', margin: '0 5px' }} />
              <ToolbarButton icon={<Code size={16}/>} onClick={() => applyFormat('code')} tooltip="Code" />
              <ToolbarButton icon={<Quote size={16}/>} onClick={() => applyFormat('quote')} tooltip="Quote" />
              <ToolbarButton icon={<List size={16}/>} onClick={() => applyFormat('list')} tooltip="List" />
            </div>
          )}

          {/* EDITOR / PREVIEW */}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            {isPreview ? (
              // Використовуємо бібліотеку для рендеру
              <div className="markdown-preview" style={{ padding: '40px', lineHeight: '1.7', color: '#2c3e50' }}>
                <ReactMarkdown>{note.content}</ReactMarkdown>
              </div>
            ) : (
              <textarea
                ref={textareaRef}
                value={note.content}
                onChange={(e) => setNote({ ...note, content: e.target.value })}
                placeholder="Start typing..."
                style={{
                  flex: 1, border: 'none', outline: 'none', resize: 'none', padding: '40px',
                  fontSize: '15px', fontFamily: "'JetBrains Mono', monospace", lineHeight: '1.6', color: '#333'
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* AI MODAL */}
      {showAiModal && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
           <div style={{ background: 'white', padding: '24px', borderRadius: '16px', width: '450px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
              <h3 style={{ margin: '0 0 15px 0', display: 'flex', gap: '10px' }}><Sparkles size={20} color="#6A5ACD"/> AI Magic</h3>
              <textarea 
                value={aiInstruction} onChange={e => setAiInstruction(e.target.value)}
                placeholder="e.g. Fix grammar, Make shorter..."
                style={{ width: '100%', height: '80px', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '15px' }}
                autoFocus
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button onClick={() => setShowAiModal(false)} style={modalBtnStyle}>Cancel</button>
                <button onClick={handleAiSubmit} disabled={isAiLoading} style={{ ...modalBtnStyle, background: '#6A5ACD', color: 'white' }}>
                  {isAiLoading ? 'Working...' : 'Apply'}
                </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

// Styles
const ToolbarButton: React.FC<{ icon: any, onClick: () => void, tooltip: string }> = ({ icon, onClick, tooltip }) => (
  <button onClick={onClick} title={tooltip} style={{ padding: '6px', borderRadius: '4px', border: 'none', background: 'transparent', cursor: 'pointer', color: '#555' }} onMouseOver={e => e.currentTarget.style.background = '#e0e0e0'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>{icon}</button>
);
const navBtnStyle = { background: 'white', border: '1px solid #ddd', borderRadius: '6px', padding: '6px', cursor: 'pointer', color: '#666', display: 'flex' };
const toolBtnStyle = { background: 'white', border: '1px solid #ddd', borderRadius: '6px', padding: '8px 12px', cursor: 'pointer', color: '#444', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' };
const modalBtnStyle = { padding: '8px 16px', borderRadius: '8px', border: '1px solid #ddd', cursor: 'pointer', background: 'white' };

export default EditorPage;