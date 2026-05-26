import { useState, type FormEvent } from 'react';
import { X, Hash, IdCard } from 'lucide-react'; // Додали іконки
import { axiosInstance } from '../../../api/axios';
import './JoinGroupModal.scss';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export const JoinGroupModal = ({ onClose, onSuccess }: Props) => {
  const [groupId, setGroupId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!groupId.trim()) return;

    setLoading(true);
    setError('');
    
    try {
      await axiosInstance.post(`/groups/${groupId}/join/`);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Помилка приєднання. Перевірте ID.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="join-group-modal__overlay" onClick={onClose}>
      {/* Зупиняємо спливання кліку */}
      <div className="join-group-modal__content" onClick={e => e.stopPropagation()}>
        <div className="join-group-modal__header">
          <h3>Приєднатися до групи</h3>
          <button className="btn-close" onClick={onClose}>
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>
        
        {error && <div className="join-group-modal__error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="join-group-modal__form">
          <div className="join-group-modal__input-group">
            <label>ID Групи</label>
            
            {/* Контейнер для інпуту та іконок */}
            <div className="join-group-modal__input-wrapper">
              <span className="icon-left"><Hash size={16} strokeWidth={1.5} /></span>
              <span className="icon-left icon-card"><IdCard size={18} strokeWidth={1.5} /></span>
              
              <input
                autoFocus
                type="number" // Залишаємо number, але приховаємо стрілочки в CSS
                placeholder="Введіть числовий ID..."
                value={groupId}
                onChange={(e) => setGroupId(e.target.value)}
              />
            </div>
          </div>
          
          <div className="join-group-modal__actions">
            <button type="button" className="btn-cancel" onClick={onClose} disabled={loading}>Скасувати</button>
            <button type="submit" className="btn-submit" disabled={loading || !groupId.trim()}>
              {loading ? 'Підключення...' : 'Ввійти'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};