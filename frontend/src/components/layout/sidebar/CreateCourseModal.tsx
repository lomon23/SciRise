import { useState, type FormEvent } from 'react';
import { axiosInstance } from '../../../api/axios';
import { Button, Input } from '../../../components/ui'; // Твої компоненти

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateCourseModal = ({ onClose, onSuccess }: Props) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    setError('');
    
    try {
      await axiosInstance.post('/courses/', { 
        title, 
        description, 
        is_public: isPublic,
        is_paid: false 
      });
      onSuccess();
    } catch (err: any) {
      setError('Помилка створення курсу');
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        background: '#1e293b', padding: '24px', borderRadius: '8px',
        width: '400px', color: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '16px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        <h3 style={{ margin: 0, fontSize: '18px' }}>Створити новий курс</h3>
        
        {error && <div style={{ color: '#ef4444', fontSize: '14px' }}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Input
            autoFocus
            placeholder="Назва курсу (напр. Основи Python)"
            value={title}
            onChange={(e: any) => setTitle(e.target.value)}
          />
          
          {/* Якщо в тебе немає Textarea в UI-кіті, лишаємо звичайну, або заміни на свій компонент */}
          <textarea
            placeholder="Короткий опис..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            style={{ 
              padding: '10px', borderRadius: '6px', border: '1px solid #475569', 
              background: '#0f172a', color: 'white', outline: 'none', resize: 'none',
              fontFamily: 'inherit'
            }}
          />
          
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
            <input 
              type="checkbox" 
              checked={isPublic} 
              onChange={(e) => setIsPublic(e.target.checked)} 
            />
            Зробити публічним (буде в загальній стрічці)
          </label>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
            <Button type="button" onClick={onClose} style={{ background: 'transparent', border: '1px solid #475569' }}>
              Скасувати
            </Button>
            <Button type="submit" disabled={loading || !title.trim()}>
              {loading ? 'Створення...' : 'Створити'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};