import { useState, type FormEvent } from 'react';
import { axiosInstance } from '../../../api/axios';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateGroupModal = ({ onClose, onSuccess }: Props) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setError('');
    
    try {
      // Відправляємо POST на бекенд
      await axiosInstance.post('/groups/', { name });
      onSuccess(); // Закриваємо модалку і кажемо сайдбару оновитись
    } catch (err: any) {
      setError('Помилка створення групи');
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
        width: '320px', color: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '16px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      }}>
        <h3 style={{ margin: 0, fontSize: '18px' }}>Створити нову групу</h3>
        
        {error && <div style={{ color: '#ef4444', fontSize: '14px' }}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input
            autoFocus
            placeholder="Назва групи, наприклад: ПМК-11"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ 
              padding: '10px', borderRadius: '6px', border: '1px solid #475569', 
              background: '#0f172a', color: 'white', outline: 'none' 
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button 
              type="button" 
              onClick={onClose} 
              style={{ background: 'transparent', color: '#94a3b8', border: 'none', cursor: 'pointer', padding: '8px' }}
            >
              Скасувати
            </button>
            <button 
              type="submit" 
              disabled={loading || !name.trim()} 
              style={{ 
                background: '#3b82f6', color: 'white', border: 'none', 
                padding: '8px 16px', borderRadius: '6px', cursor: 'pointer',
                opacity: (loading || !name.trim()) ? 0.5 : 1
              }}
            >
              {loading ? 'Створення...' : 'Створити'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};