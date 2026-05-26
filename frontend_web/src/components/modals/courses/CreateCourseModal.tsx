import { useState, type FormEvent } from 'react';
import { X } from 'lucide-react';
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
      setError('Помилка створення курсу. Перевірте дані.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-course-modal__overlay" onClick={onClose}>
      {/* Зупиняємо спливання кліку, щоб не закривалось при кліку на саму форму */}
      <div className="create-course-modal__content" onClick={e => e.stopPropagation()}>
        <div className="create-course-modal__header">
          <h3>Створити новий курс</h3>
          <button className="btn-close" onClick={onClose}>
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>
        
        {error && <div className="create-course-modal__error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="create-course-modal__form">
          <div className="create-course-modal__input-group">
            <label>Назва курсу</label>
            <input
              autoFocus
              placeholder="Наприклад: Основи C++ для кібербезпеки"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div className="create-course-modal__input-group">
            <label>Короткий опис</label>
            <textarea
              placeholder="Про що цей курс? Кому він буде корисний?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>
          
          <label className="create-course-modal__checkbox">
            <input 
              type="checkbox" 
              checked={isPublic} 
              onChange={(e) => setIsPublic(e.target.checked)} 
            />
            <span className="checkbox-text">
              <strong>Публічний курс</strong>
              <span>Буде відображатися у загальній стрічці платформи</span>
            </span>
          </label>

          <div className="create-course-modal__actions">
            <button type="button" className="btn-cancel" onClick={onClose} disabled={loading}>Скасувати</button>
            <button type="submit" className="btn-submit" disabled={loading || !title.trim()}>
              {loading ? 'Створення...' : 'Створити курс'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};