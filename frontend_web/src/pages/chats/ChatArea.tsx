import { useState, useEffect, useRef, type FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { Send, Hash } from 'lucide-react';
import { axiosInstance } from '../../api/axios';
import './ChatArea.scss';

export const ChatArea = () => {
  const { channelId } = useParams();
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);

  // Дістаємо поточного юзера
  const userStr = localStorage.getItem('user');
  const currentUser = userStr ? JSON.parse(userStr) : null;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!channelId) return;

    const fetchMessages = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/channels/${channelId}/messages/`);
        setMessages(response.data.results || response.data);
      } catch (error) {
        console.error('Не вдалося завантажити історію чату:', error);
      } finally {
        setLoading(false);
        scrollToBottom();
      }
    };

    fetchMessages();

    socketRef.current = io('http://localhost:3001');

    socketRef.current.on('connect', () => {
      socketRef.current?.emit('join_channel', channelId);
    });

    socketRef.current.on('receive_message', (incomingMessage) => {
      setMessages((prev) => {
        if (prev.some((msg) => msg.id === incomingMessage.id)) return prev;
        return [...prev, incomingMessage];
      });
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [channelId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !channelId) return;

    setSending(true);
    try {
      const response = await axiosInstance.post(`/channels/${channelId}/messages/`, { text });
      
      // ХИРА ШТУКА: примусово кажемо, що це наше повідомлення для миттєвого рендеру
      const savedMessage = { ...response.data, _isMine: true }; 

      setMessages((prev) => [...prev, savedMessage]);
      setText('');

      // У сокет відправляємо оригінальне повідомлення (щоб інші не подумали, що це їхнє)
      socketRef.current?.emit('send_message', {
        channelId: channelId,
        message: response.data,
      });

    } catch (error) {
      console.error('Помилка відправки повідомлення:', error);
    } finally {
      setSending(false);
    }
  };

  if (!channelId) {
    return <div className="chat-area__empty">Оберіть канал для спілкування</div>;
  }

  return (
    <div className="chat-area">
      <div className="chat-area__header">
        <div className="channel-title">
          <Hash size={20} strokeWidth={1.5} className="icon" />
          <h3>Канал {channelId}</h3>
        </div>
      </div>

      <div className="chat-area__messages">
        {loading ? (
          <div className="chat-area__status">Завантаження повідомлень...</div>
        ) : messages.length === 0 ? (
          <div className="chat-area__status">Тут поки тихо. Напишіть першим.</div>
        ) : (
          messages.map((msg) => {
            // Перевіряємо мітку _isMine (якщо ми щойно відправили), АБО звіряємо email/id
            const isMine = msg._isMine || Boolean(
              currentUser && (
                (msg.author_email && msg.author_email === currentUser.email) ||
                (msg.author_name && msg.author_name === currentUser.name) ||
                (msg.author && String(msg.author) === String(currentUser.id))
              )
            );
            
            return (
              <div key={msg.id} className={`chat-message ${isMine ? 'chat-message--mine' : 'chat-message--other'}`}>
                {!isMine && <div className="chat-message__author">{msg.author_name || 'Анонім'}</div>}
                
                <div className="chat-message__content">
                  <span className="chat-message__text">{msg.text}</span>
                  <span className="chat-message__time">
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-area__input-wrapper">
        <form className="chat-area__input-container" onSubmit={handleSendMessage}>
          <input
            type="text"
            className="chat-area__input"
            placeholder="Написати повідомлення..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={sending}
            autoComplete="off"
          />
          <button type="submit" className="chat-area__send-btn" disabled={!text.trim() || sending}>
            <Send size={18} strokeWidth={1.5} />
          </button>
        </form>
      </div>
    </div>
  );
};