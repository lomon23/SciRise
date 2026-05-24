import { useState, type FormEvent } from 'react';
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
    <div className="join-group-modal__overlay">
      <div className="join-group-modal__content">
        <h3>Приєднатися до групи</h3>
        
        {error && <div className="join-group-modal__error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="join-group-modal__form">
          <div className="join-group-modal__input-group">
            <label>ID Групи</label>
            <input
              autoFocus
              type="number"
              placeholder="Введіть числовой ID"
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
            />
          </div>
          
          <div className="join-group-modal__actions">
            <button type="button" onClick={onClose} disabled={loading}>Скасувати</button>
            <button type="submit" disabled={loading || !groupId.trim()}>
              {loading ? 'Підключення...' : 'Ввійти'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};