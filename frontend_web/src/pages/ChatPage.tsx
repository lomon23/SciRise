import React, { useState } from 'react';
import { useSocket } from '../hooks/useSocket';

const ChatPage = () => {
    // Передаємо порожній рядок, бо основний шлях ws/chat/ вже у VITE_WS_URL
    const { messages, sendMessage, isConnected } = useSocket(''); 
    const [text, setText] = useState('');

    return (
        <div style={{ padding: '20px' }}>
            <h1>SciRise Chat Debug</h1>
            
            {/* Статус коннекту */}
            <div style={{ marginBottom: '10px' }}>
                Статус: {isConnected 
                    ? <span style={{ color: 'green', fontWeight: 'bold' }}>● Підключено</span> 
                    : <span style={{ color: 'red', fontWeight: 'bold' }}>○ Відключено</span>
                }
            </div>

            <div style={{ 
                border: '1px solid #333', 
                height: '400px', 
                overflowY: 'auto', 
                background: '#1a1a1a', // Темна тема, як ти любиш
                padding: '15px',
                color: '#eee'
            }}>
                {messages.map((m, i) => (
                    <div key={i} style={{ marginBottom: '10px' }}>
                        <span style={{ 
                            color: m.username === 'ТвійНік' ? '#00D1B2' : '#ffdd57', 
                            fontWeight: 'bold' 
                        }}>
                            {m.username}:
                        </span> 
                        <span style={{ marginLeft: '8px' }}>{m.message}</span>
                    </div>
                ))}
            </div>

            <input 
                value={text} 
                onChange={(e) => setText(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && (sendMessage({ message: text }), setText(''))}
                placeholder="Напиши щось..."
                disabled={!isConnected}
            />
            <button 
                onClick={() => { sendMessage({ message: text }); setText(''); }}
                disabled={!isConnected}
            >
                Відправити
            </button>
        </div>
    );
};

export default ChatPage;