import React, { useState, useEffect, useRef } from 'react';
import { getCurrentUser } from '../../scripts/API_endPoint/profile/user.service';
import { Search, Send, X, Reply } from 'lucide-react';

// --- ТИПИ ---
interface ChatPreview {
  room_id: number;
  user_id: number;
  username: string;
  avatar: string | null;
  last_message: string;
}

interface SearchResult {
  id: number;
  username: string;
  full_name: string;
  avatar: string | null;
}

interface Message {
  id?: number;
  sender_id: number;
  content: string;
  timestamp?: string; // Час з бекенду
  replyTo?: {         // Локальне поле для відповіді (поки тільки на фронті)
    username: string;
    content: string;
  } | null;
}

const ChatPage: React.FC = () => {
  // Data State
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [recentChats, setRecentChats] = useState<ChatPreview[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  
  // UI State
  const [activeRoomId, setActiveRoomId] = useState<number | null>(null);
  const [activeChatUser, setActiveChatUser] = useState<{id: number, username: string, avatar: string | null} | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');
  
  // Reply State
  const [replyTo, setReplyTo] = useState<Message | null>(null);

  // Refs
  const socketRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- INIT & HELPERS ---
  useEffect(() => {
    getCurrentUser().then(setUser => setCurrentUser(setUser));
    loadRecentChats();
  }, []);

  const loadRecentChats = () => {
    fetch('http://localhost:8000/api/chat/recent/', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setRecentChats(data));
  };

  const formatTime = (isoString?: string) => {
    if (!isoString) return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // --- SEARCH LOGIC ---
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(() => {
      fetch(`http://localhost:8000/api/users/search/?q=${searchQuery}`, { credentials: 'include' })
        .then(res => res.json())
        .then(data => setSearchResults(data));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // --- CHAT LOGIC ---
  useEffect(() => {
    if (!activeRoomId) return;

    fetch(`http://localhost:8000/api/chat/${activeRoomId}/messages/`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => setMessages(data));

    if (socketRef.current) socketRef.current.close();
    const socket = new WebSocket(`ws://localhost:8000/ws/chat/${activeRoomId}/`);
    socketRef.current = socket;

    socket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      // Тут ми поки не отримуємо replyTo з бекенду, тому воно буде null для вхідних
      setMessages(prev => [...prev, { 
        sender_id: data.sender_id, 
        content: data.message,
        timestamp: new Date().toISOString() 
      }]);
      scrollToBottom();
      loadRecentChats();
    };

    return () => socket.close();
  }, [activeRoomId]);

  const scrollToBottom = () => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const handleSelectChat = async (userId: number, username: string, avatar: string | null) => {
    setActiveChatUser({ id: userId, username, avatar });
    const res = await fetch(`http://localhost:8000/api/chat/start/${userId}/`, { 
        method: 'POST', credentials: 'include' 
    });
    const data = await res.json();
    setActiveRoomId(data.room_id);
    setSearchQuery('');
    setReplyTo(null); // Скидаємо відповідь при зміні чату
  };

  const sendMessage = () => {
    if (!inputText.trim() || !socketRef.current) return;
    
    // Відправляємо на бекенд (поки без reply даних, бо бекенд їх ще не вміє)
    socketRef.current.send(JSON.stringify({
      message: inputText,
      sender_id: currentUser.id
    }));

    // Оновлюємо локально (оптимістично), додаючи дані про відповідь
    // (Примітка: реальне повідомлення прийде через сокет, це для миттєвої реакції UI можна було б юзати,
    // але зараз ми покладаємось на onmessage. Щоб відобразити reply для себе, треба доопрацювати бекенд.
    // АЛЕ, для "візуалізації" ми можемо додати це повідомлення в список вручну, 
    // проте onmessage його продублює. Тому просто очищаємо інпут і reply.)
    
    setInputText('');
    setReplyTo(null);
  };

  // --- RENDER ---
  return (
    <div style={{ display: 'flex', height: '100%', width: '100%', backgroundColor: 'white' }}>
      
      {/* LEFT SIDEBAR */}
      <div style={{ width: '350px', borderRight: '1px solid #e0e0e0', display: 'flex', flexDirection: 'column', backgroundColor: '#fff' }}>
        <div style={{ padding: '16px', borderBottom: '1px solid #f0f0f0' }}>
          <div style={{ position: 'relative', backgroundColor: '#F3F4F6', borderRadius: '12px', display: 'flex', alignItems: 'center' }}>
            <Search size={18} color="#999" style={{ marginLeft: '12px' }} />
            <input 
              placeholder="Search users..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '12px', background: 'transparent', border: 'none', outline: 'none', fontSize: '14px' }}
            />
          </div>
        </div>

        <div style={{ overflowY: 'auto', flex: 1 }}>
          {searchQuery ? (
            <>
              <div style={{ padding: '10px 16px', fontSize: '12px', color: '#999', fontWeight: 'bold' }}>SEARCH RESULTS</div>
              {searchResults.map(u => (
                <div key={u.id} onClick={() => handleSelectChat(u.id, u.username, u.avatar)} style={userItemStyle}>
                  <Avatar url={u.avatar} name={u.username} />
                  <div style={{ marginLeft: '12px' }}>
                    <div style={{ fontWeight: '600', fontSize: '14px' }}>{u.full_name || u.username}</div>
                    <div style={{ fontSize: '12px', color: '#888' }}>@{u.username}</div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            recentChats.map(chat => (
              <div 
                key={chat.room_id} 
                onClick={() => handleSelectChat(chat.user_id, chat.username, chat.avatar)}
                style={{ ...userItemStyle, backgroundColor: activeRoomId === chat.room_id ? '#F3F0FF' : 'white' }}
              >
                <Avatar url={chat.avatar} name={chat.username} />
                <div style={{ marginLeft: '12px', flex: 1, overflow: 'hidden' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: '600', fontSize: '14px', color: '#333' }}>{chat.username}</span>
                  </div>
                  <div style={{ fontSize: '13px', color: '#888', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {chat.last_message}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* RIGHT CHAT AREA */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#F8F9FC' }}>
        {activeRoomId ? (
          <>
            {/* Header */}
            <div style={{ padding: '16px 24px', backgroundColor: 'white', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' }}>
              <Avatar url={activeChatUser?.avatar} name={activeChatUser?.username || "?"} />
              <div style={{ marginLeft: '15px' }}>
                <div style={{ fontWeight: '700', fontSize: '16px', color: '#333' }}>{activeChatUser?.username}</div>
                <div style={{ fontSize: '12px', color: 'green' }}>Online</div>
              </div>
            </div>

            {/* Messages Feed */}
            <div style={{ flex: 1, padding: '20px 40px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {messages.map((msg, idx) => {
                const isMe = msg.sender_id === currentUser?.id;
                
                return (
                  <div 
                    key={idx} 
                    className="group" // Для ховер ефекту кнопки відповіді
                    style={{ 
                      alignSelf: isMe ? 'flex-end' : 'flex-start',
                      maxWidth: '65%',
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative',
                      alignItems: isMe ? 'flex-end' : 'flex-start'
                    }}
                  > 
                    {/* Кнопка Reply (з'являється при наведенні) */}
                    <button 
                        onClick={() => setReplyTo(msg)}
                        style={{
                            position: 'absolute',
                            top: '50%',
                            [isMe ? 'left' : 'right']: '-30px',
                            transform: 'translateY(-50%)',
                            background: 'none', border: 'none', cursor: 'pointer',
                            color: '#ccc',
                            opacity: 0, // Прихована за замовчуванням
                            transition: 'opacity 0.2s'
                        }}
                        // Додамо клас через CSS або inline style для hover пізніше, 
                        // тут спрощений варіант: кнопка завжди є, але прозора.
                        // Краще додати onMouseEnter до батьківського div.
                    >
                        <Reply size={16} />
                    </button>

                    <div 
                        onDoubleClick={() => setReplyTo(msg)} // Швидка відповідь подвійним кліком
                        style={{
                            backgroundColor: isMe ? '#6A5ACD' : 'white',
                            color: isMe ? 'white' : '#333',
                            padding: '10px 16px',
                            borderRadius: '16px',
                            borderBottomRightRadius: isMe ? '4px' : '16px',
                            borderBottomLeftRadius: isMe ? '16px' : '4px',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                            fontSize: '15px',
                            lineHeight: '1.5',
                            cursor: 'pointer'
                        }}
                    >
                      {/* Відображення цитати (якщо вона є - поки заглушка для візуалу) */}
                      {msg.replyTo && (
                          <div style={{ 
                              borderLeft: '2px solid white', 
                              paddingLeft: '8px', 
                              marginBottom: '6px', 
                              opacity: 0.8,
                              fontSize: '13px' 
                          }}>
                              <div style={{ fontWeight: 'bold' }}>{msg.replyTo.username}</div>
                              <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{msg.replyTo.content}</div>
                          </div>
                      )}

                      {msg.content}
                      
                      {/* Час */}
                      <div style={{ 
                          fontSize: '10px', 
                          textAlign: 'right', 
                          marginTop: '4px', 
                          opacity: 0.7,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                          gap: '4px'
                      }}>
                          {formatTime(msg.timestamp)}
                          {isMe && <span>✓</span>} {/* Галочка прочитання */}
                      </div>
                    </div>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div style={{ padding: '20px', backgroundColor: 'white', borderTop: '1px solid #eee' }}>
              
              {/* REPLY BANNER (Візуально) */}
              {replyTo && (
                  <div style={{ 
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '10px 15px', marginBottom: '10px',
                      backgroundColor: '#F8F9FC', borderLeft: '4px solid #6A5ACD', borderRadius: '8px'
                  }}>
                      <div style={{ overflow: 'hidden' }}>
                          <div style={{ color: '#6A5ACD', fontSize: '13px', fontWeight: 'bold' }}>
                              Replying to {replyTo.sender_id === currentUser.id ? 'Yourself' : activeChatUser?.username}
                          </div>
                          <div style={{ fontSize: '13px', color: '#666', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '300px' }}>
                              {replyTo.content}
                          </div>
                      </div>
                      <button onClick={() => setReplyTo(null)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#999' }}>
                          <X size={18} />
                      </button>
                  </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#F3F4F6', padding: '8px', borderRadius: '16px' }}>
                <input 
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  style={{ flex: 1, padding: '10px 15px', background: 'transparent', border: 'none', outline: 'none', fontSize: '15px' }}
                  autoFocus
                />
                <button 
                  onClick={sendMessage}
                  style={{ 
                    width: '40px', height: '40px', borderRadius: '50%', 
                    backgroundColor: inputText.trim() ? '#6A5ACD' : '#ccc', 
                    border: 'none', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: '0.2s'
                  }}
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#aaa' }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>💬</div>
            <h2 style={{ color: '#333' }}>Select a chat to start messaging</h2>
          </div>
        )}
      </div>
    </div>
  );
};

// Styles
const userItemStyle: React.CSSProperties = {
  padding: '12px 16px', display: 'flex', alignItems: 'center', cursor: 'pointer', transition: 'background 0.2s', borderBottom: '1px solid #f9f9f9'
};

const Avatar = ({ url, name }: { url?: string | null, name: string }) => (
  <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#e0e0e0', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', fontWeight: 'bold', fontSize: '16px' }}>
    {url ? <img src={`http://localhost:8000${url}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : name?.[0]?.toUpperCase()}
  </div>
);

export default ChatPage;