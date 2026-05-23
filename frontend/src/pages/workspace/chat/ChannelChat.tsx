import { useState, useEffect, useRef, type FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { axiosInstance } from '../../../api/axios';
import { Input, Button } from '../../../components/ui';

// Підключаємося до нашого Node.js сервера (сокетів)
const socket = io('http://localhost:3001');

interface Message {
  id: number;
  text: string;
  created_at: string;
  author_name: string;
}

export const ChannelChat = () => {
  const { channelId } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Фетчинг історії та підписка на сокети
  useEffect(() => {
    if (!channelId) return;

    const fetchMessages = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/channels/${channelId}/messages/`);
        setMessages(response.data.reverse());
      } catch (error) {
        console.error('Помилка завантаження чату:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // Заходимо в кімнату (перетворюємо ID на строку для надійності)
    const roomId = String(channelId);
    console.log("🔌 Пробуємо зайти в канал:", roomId);
    socket.emit('join_channel', roomId);

    // Слухач вхідних повідомлень
    const receiveMessageHandler = (message: Message) => {
      console.log("📥 Прилетіло по сокетах:", message);
      setMessages((prev) => {
        // Запобіжник: якщо це наше ж повідомлення (вже є в стейті), ігноруємо
        if (prev.some(m => m.id === message.id)) return prev;
        return [...prev, message];
      });
    };

    socket.on('receive_message', receiveMessageHandler);

    // Відписка при зміні каналу або закритті компонента
    return () => {
      socket.off('receive_message', receiveMessageHandler);
    };
  }, [channelId]);

  // 2. Автоскрол до останнього повідомлення
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 3. Відправка повідомлення
  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !channelId) return;

    const roomId = String(channelId);

    try {
      // Відправляємо в базу
      const response = await axiosInstance.post(`/channels/${channelId}/messages/`, {
        text: newMessage
      });
      const savedMessage = response.data;

      console.log("📤 Відправляємо в сокети:", savedMessage);
      
      // Відправляємо в реалтайм
      socket.emit('send_message', { 
        channelId: roomId, 
        message: savedMessage 
      });

      // Малюємо в себе миттєво
      setMessages(prev => [...prev, savedMessage]);
      setNewMessage('');
      
    } catch (error) {
      console.error('Помилка відправки:', error);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', background: '#0f172a' }}>
      {/* Хедер */}
      <div style={{ padding: '16px 24px', borderBottom: '1px solid #1e293b', background: '#1e293b', color: '#f8fafc', fontWeight: 600 }}>
        # Канал {channelId}
      </div>

      {/* Зона повідомлень */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {loading ? (
          <div style={{ color: '#94a3b8' }}>Завантаження історії...</div>
        ) : messages.length === 0 ? (
          <div style={{ color: '#64748b', textAlign: 'center', marginTop: 'auto' }}>
            Тут ще немає повідомлень. Напишіть щось першим!
          </div>
        ) : (
          messages.map(msg => (
            <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span style={{ color: '#38bdf8', fontWeight: 600, fontSize: '15px' }}>{msg.author_name}</span>
                <span style={{ color: '#64748b', fontSize: '12px' }}>
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div style={{ color: '#f8fafc', fontSize: '15px', lineHeight: '1.5' }}>
                {msg.text}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Інпут */}
      <div style={{ padding: '24px', background: '#1e293b' }}>
        <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '12px' }}>
          <Input 
            value={newMessage}
            onChange={(e: any) => setNewMessage(e.target.value)}
            placeholder="Написати в канал..."
            style={{ flex: 1 }}
          />
          <Button type="submit" disabled={!newMessage.trim()}>Відправити</Button>
        </form>
      </div>
    </div>
  );
};