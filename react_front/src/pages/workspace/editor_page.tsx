import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Split from 'react-split';
import ReactMarkdown from 'react-markdown';
import { getNote, updateNote } from '../../scripts/API_endPoint/note/note_service';
import '../../style/workspace/editor_page.css';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => { setDebouncedValue(value); }, delay);
    return () => { clearTimeout(handler); };
  }, [value, delay]);
  return debouncedValue;
}

// --- ХЕЛПЕР ДЛЯ ВИТЯГУВАННЯ ЗАГОЛОВКА ---
const extractTitle = (markdown: string): string => {
  // 1. Беремо перший рядок (до ентера)
  const firstLine = markdown.split('\n')[0] || "";
  
  // 2. Прибираємо "решітки" (#) і пробіли, якщо вони є на початку
  // Наприклад: "#  Hello " -> "Hello"
  // Наприклад: "Just text" -> "Just text"
  let title = firstLine.replace(/^#+\s*/, '').trim();

  // 3. Обрізаємо, якщо занадто довгий (опціонально, щоб не ламати верстку карток)
  if (title.length > 50) {
    title = title.substring(0, 50) + "...";
  }

  // 4. Якщо пусто, повертаємо дефолт
  return title || "Untitled Note";
};

const EditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const noteId = Number(id);

  const [markdownText, setMarkdownText] = useState<string>('');
  const [aiInput, setAiInput] = useState<string>('');
  
  const [isDataLoaded, setIsDataLoaded] = useState(false); 
  const [saveStatus, setSaveStatus] = useState<'Saved' | 'Saving...' | 'Unsaved' | 'Loading...'>('Loading...');

  // 1. ЗАВАНТАЖЕННЯ ДАНИХ
  useEffect(() => {
    if (!noteId) return;
    
    setIsDataLoaded(false); 
    setSaveStatus('Loading...');

    getNote(noteId)
      .then(note => {
        setMarkdownText(note.content || ""); 
        setIsDataLoaded(true); 
        setSaveStatus('Saved');
      })
      .catch(err => {
        console.error("Error loading note:", err);
        setSaveStatus('Unsaved');
      });
  }, [noteId]);

  // 2. АВТОЗБЕРЕЖЕННЯ (Тепер з оновленням заголовка!)
  const debouncedContent = useDebounce(markdownText, 1000);

  useEffect(() => {
    if (!noteId || !isDataLoaded) return; 

    const save = async () => {
      setSaveStatus('Saving...');
      
      // --- МАГІЯ ТУТ ---
      // Визначаємо заголовок на льоту
      const newTitle = extractTitle(debouncedContent);

      try {
        // Відправляємо і контент, і новий заголовок
        await updateNote(noteId, { 
            content: debouncedContent,
            title: newTitle 
        });
        
        setSaveStatus('Saved');
        // Тут можна додати оновлення контексту, якщо хочеш щоб в Sidebar назва мінялась миттєво
      } catch (e) {
        setSaveStatus('Unsaved');
        console.error(e);
      }
    };
    
    save();
  }, [debouncedContent, noteId, isDataLoaded]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdownText(e.target.value);
    setSaveStatus('Unsaved');
  };

  const containerStyle = { height: 'calc(100vh - 20px)', padding: '10px' };

  return (
    <div style={containerStyle}>
      <div style={{ position: 'absolute', top: '15px', right: '30px', zIndex: 10, fontSize: '12px', fontWeight: 'bold', color: saveStatus === 'Saved' ? 'green' : saveStatus === 'Unsaved' ? 'red' : 'orange' }}>
        {saveStatus}
      </div>

      <Split 
        className="split" 
        sizes={[50, 50]} 
        minSize={100} 
        expandToMin={false} 
        gutterSize={10} 
        gutterAlign="center" 
        direction="horizontal"
        cursor="col-resize"
        style={{ height: '100%' }}
      >
        <div style={{ backgroundColor: 'white', overflow: 'auto', padding: '20px', borderRadius: '10px 0 0 10px', border: '1px solid #eee' }}>
             <div className="markdown-body">
                {!isDataLoaded ? <p style={{color: '#ccc'}}>Loading...</p> : <ReactMarkdown>{markdownText}</ReactMarkdown>}
             </div>
        </div>

        <div style={{ height: '100%' }}>
            <Split
                className="split-vertical"
                sizes={[70, 30]}
                minSize={100}
                direction="vertical"
                cursor="row-resize"
                style={{ height: '100%' }}
            >
                <div style={{ backgroundColor: 'white', padding: 0, borderRadius: '0 10px 0 0', border: '1px solid #eee' }}>
                    <textarea 
                        style={{ width: '100%', height: '100%', border: 'none', outline: 'none', resize: 'none', padding: '20px', fontSize: '16px', fontFamily: 'monospace', color: '#333' }}
                        placeholder="# Start with a title..."
                        value={markdownText}
                        onChange={handleTextChange}
                        disabled={!isDataLoaded}
                    />
                </div>
                <div style={{ backgroundColor: 'white', borderRadius: '0 0 10px 0', padding: '20px', display: 'flex', flexDirection: 'column', border: '1px solid #eee' }}>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa' }}>
                        AI Copilot ready...
                    </div>
                    <div style={{ position: 'relative' }}>
                        <input 
                            type="text" 
                            placeholder="Ask AI..." 
                            value={aiInput}
                            onChange={(e) => setAiInput(e.target.value)}
                            style={{ width: '100%', padding: '10px', borderRadius: '20px', border: '1px solid #6A5ACD', outline: 'none' }}
                        />
                    </div>
                </div>
            </Split>
        </div>
      </Split>
    </div>
  );
};

export default EditorPage;