import React, { useState } from 'react';
import Split from 'react-split';
import ReactMarkdown from 'react-markdown';
import '../../style/workspace/editor_page.css'; // Не забудь імпортувати стилі!

const EditorPage: React.FC = () => {
  // Стейт для тексту (Markdown)
  const [markdownText, setMarkdownText] = useState<string>('# Hello, SkiRise!\n\nStart typing in the editor on the right...');
  
  // Стейт для чату (поки що просто поле вводу)
  const [aiInput, setAiInput] = useState<string>('');

  const cardStyle = {
    backgroundColor: 'white',
    height: '100%',
    overflow: 'auto',
    padding: '20px',
    boxSizing: 'border-box' as 'border-box',
    position: 'relative' as 'relative'
  };

  return (
    <div style={{ height: 'calc(100vh - 40px)', padding: '10px' }}> {/* Відступ від країв */}
      
      {/* Горизонтальний спліт: Ліва (Markdown) vs Права (Editor + AI) */}
      <Split 
        className="split" 
        sizes={[50, 50]} 
        minSize={100} 
        expandToMin={false} 
        gutterSize={10} 
        gutterAlign="center" 
        snapOffset={30} 
        dragInterval={1}
        direction="horizontal"
        cursor="col-resize"
        style={{ height: '100%' }}
      >
        
        {/* === ЛІВА ПАНЕЛЬ: Результат (Markdown Render) === */}
        <div style={{ ...cardStyle, borderRadius: '10px 0 0 10px' }}>
             {/* Заголовок або меню (три крапки) можна додати тут */}
             <div style={{ position: 'absolute', top: '10px', right: '10px', color: '#ccc', cursor: 'pointer' }}>⋮</div>
             
             {/* Власне рендер Markdown */}
             <div className="markdown-body" style={{ color: '#333', lineHeight: '1.6' }}>
                <ReactMarkdown>{markdownText}</ReactMarkdown>
             </div>
        </div>

        {/* === ПРАВА ПАНЕЛЬ: Містить вертикальний спліт === */}
        <div style={{ height: '100%' }}>
            
            <Split
                className="split"
                sizes={[50, 50]}
                minSize={100}
                expandToMin={false}
                gutterSize={10}
                gutterAlign="center"
                snapOffset={30}
                dragInterval={1}
                direction="vertical"
                cursor="row-resize"
                style={{ height: '100%', flexDirection: 'column' }}
            >
                
                {/* --- ВЕРХ: Редактор тексту --- */}
                <div style={{ ...cardStyle, borderRadius: '0 10px 0 0', padding: 0 }}>
                    <div style={{ position: 'absolute', top: '10px', right: '10px', color: '#ccc', cursor: 'pointer', zIndex: 2 }}>⋮</div>
                    <textarea 
                        style={{
                            width: '100%',
                            height: '100%',
                            border: 'none',
                            outline: 'none',
                            resize: 'none',
                            padding: '20px',
                            fontSize: '16px',
                            fontFamily: 'monospace',
                            color: '#555'
                        }}
                        placeholder="Start writing..."
                        value={markdownText}
                        onChange={(e) => setMarkdownText(e.target.value)}
                    />
                </div>

                {/* --- НИЗ: AI Чат (Хардкод) --- */}
                <div style={{ ...cardStyle, borderRadius: '0 0 10px 0', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ position: 'absolute', top: '10px', right: '10px', color: '#ccc', cursor: 'pointer' }}>⋮</div>
                    
                    {/* Область повідомлень (Центральний текст "Чим можу допомогти?") */}
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', fontSize: '18px' }}>
                        Чим можу допомогти?
                    </div>

                    {/* Поле вводу AI */}
                    <div style={{ position: 'relative', marginTop: 'auto' }}>
                        <input 
                            type="text" 
                            placeholder="Start writing..." 
                            value={aiInput}
                            onChange={(e) => setAiInput(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px 40px 12px 15px',
                                borderRadius: '20px',
                                border: '1px solid #6A5ACD', // Фіолетовий бордюр
                                outline: 'none'
                            }}
                        />
                        {/* Кнопка відправки (стрілочка) */}
                        <button style={{
                            position: 'absolute',
                            right: '5px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: '#6A5ACD',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '30px',
                            height: '30px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            ↑
                        </button>
                    </div>
                </div>

            </Split>
        </div>

      </Split>
    </div>
  );
};

export default EditorPage;