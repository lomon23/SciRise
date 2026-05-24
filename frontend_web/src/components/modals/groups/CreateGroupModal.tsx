import { useState, type FormEvent } from 'react';
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
    <div className="create-group-modal__overlay">
      <div className="create-group-modal__content">
        <h3>Створити нову групу</h3>
        
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
            <button type="button" onClick={onClose} disabled={loading}>Скасувати</button>
            <button type="submit" disabled={loading || !name.trim()}>
              {loading ? 'Створення...' : 'Створити'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};