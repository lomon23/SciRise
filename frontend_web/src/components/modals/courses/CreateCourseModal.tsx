import { useState, type FormEvent } from 'react';
import { axiosInstance } from '../../../api/axios';
import './CreateCourseModal.scss';

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-course-modal__overlay">
      <div className="create-course-modal__content">
        <h3>Створити новий курс</h3>
        
        {error && <div className="create-course-modal__error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="create-course-modal__form">
          <div className="create-course-modal__input-group">
            <label>Назва курсу</label>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div className="create-course-modal__input-group">
            <label>Опис</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          
          <label className="create-course-modal__checkbox">
            <input 
              type="checkbox" 
              checked={isPublic} 
              onChange={(e) => setIsPublic(e.target.checked)} 
            />
            Публічний курс (стрічка)
          </label>

          <div className="create-course-modal__actions">
            <button type="button" onClick={onClose} disabled={loading}>Скасувати</button>
            <button type="submit" disabled={loading || !title.trim()}>
              {loading ? '...' : 'Створити'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};