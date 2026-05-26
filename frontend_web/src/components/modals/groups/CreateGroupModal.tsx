// CreateGroupModal.tsx
import { useState, type FormEvent } from 'react';
import { X } from 'lucide-react';
import { axiosInstance } from '../../../api/axios';
import './CreateGroupModal.scss';

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
      await axiosInstance.post('/groups/', { name });
      onSuccess();
    } catch (err: any) {
      setError('Помилка створення групи');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-group-modal__overlay" onClick={onClose}>
      <div className="create-group-modal__content" onClick={e => e.stopPropagation()}>
        <div className="create-group-modal__header">
          <h3>Створити групу</h3>
          <button className="btn-close" onClick={onClose}>
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>
        
        {error && <div className="create-group-modal__error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="create-group-modal__form">
          <div className="create-group-modal__input-group">
            <label>Назва групи</label>
            <input
              autoFocus
              placeholder="Наприклад: ПМК-11"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          <div className="create-group-modal__actions">
            <button type="button" className="btn-cancel" onClick={onClose} disabled={loading}>Скасувати</button>
            <button type="submit" className="btn-submit" disabled={loading || !name.trim()}>
              {loading ? 'Створення...' : 'Створити'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};