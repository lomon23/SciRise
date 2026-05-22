import { useState, useEffect, useRef, type FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { axiosInstance } from '../../../api/axios';
import { Input, Button } from '../../../components/ui';

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

  // Фетчимо історію при зміні каналу
  useEffect(() => {
    const fetchMessages = async () => {
      if (!channelId) return;
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/channels/${channelId}/messages/`);
        // Бекенд віддає від новіших до старіших, тому реверсимо для UI
        setMessages(response.data.reverse());
      } catch (error) {
        console.error('Помилка завантаження чату:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [channelId]);

  // Автоскрол донизу при нових повідомленнях
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !channelId) return;

    try {
      const response = await axiosInstance.post(`/channels/${channelId}/messages/`, {
        text: newMessage
      });
      // Одразу додаємо нове повідомлення в локальний стейт, щоб не чекати рефетчу
      setMessages(prev => [...prev, response.data]);
      setNewMessage('');
    } catch (error) {
      console.error('Помилка відправки:', error);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', background: '#0f172a' }}>
      {/* Хедер чату */}
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

      {/* Інпут відправки */}
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