import { useState, useEffect, useRef, type FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!channelId) return;

    // Крок 1: Стягуємо історію повідомлень з Джанго через HTTP
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

    // Крок 2: Коннектимось до твоєї Node.js сокет-ноди
    socketRef.current = io('http://localhost:3001');

    socketRef.current.on('connect', () => {
      console.log('🟢 Фронт підключився до Socket.io:', socketRef.current?.id);
      // Заходимо в кімнату каналу
      socketRef.current?.emit('join_channel', channelId);
    });

    // Крок 3: Слухаємо нові повідомлення з кімнати
    socketRef.current.on('receive_message', (incomingMessage) => {
      setMessages((prev) => {
        // Захист від дублів: якщо таке ID вже є в стейті, нічого не робимо
        if (prev.some((msg) => msg.id === incomingMessage.id)) {
          return prev;
        }
        return [...prev, incomingMessage];
      });
    });

    // Чистимо сокет при перемиканні каналів або виході
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [channelId]);

  // Скролимо до свіжих повідомлень
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !channelId) return;

    setSending(true);
    try {
      // 1. Записуємо в базу Джанго по HTTP POST
      const response = await axiosInstance.post(`/channels/${channelId}/messages/`, { text });
      const savedMessage = response.data;

      // 2. Локально додаємо собі в стейт одразу, щоб інтерфейс не тупив
      setMessages((prev) => [...prev, savedMessage]);
      setText('');

      // 3. Пхаємо в сокет Ноди, щоб вона розкинула повідомлення всім іншим у кімнаті
      socketRef.current?.emit('send_message', {
        channelId: channelId,
        message: savedMessage, // Джанго повернув повний об'єкт з id та author_name
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
        <h3>Канал #{channelId}</h3>
      </div>

      <div className="chat-area__messages">
        {loading ? (
          <div className="chat-area__status">...</div>
        ) : messages.length === 0 ? (
          <div className="chat-area__status">Повідомлень немає.</div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="chat-message">
              <div className="chat-message__header">
                <span className="chat-message__author">{msg.author_name}</span>
                <span className="chat-message__time">
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="chat-message__text">{msg.text}</div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-area__input-container" onSubmit={handleSendMessage}>
        <input
          type="text"
          className="chat-area__input"
          placeholder="Написати..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={sending}
          autoComplete="off"
        />
        <button type="submit" className="chat-area__send-btn" disabled={!text.trim() || sending}>
          {sending ? '...' : '➤'}
        </button>
      </form>
    </div>
  );
};