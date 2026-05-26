import { useState, type FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { axiosInstance } from '../../../api/axios';
import './CreateLesson.scss';

export const CreateLesson = () => {
  const { courseId, moduleId } = useParams();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('# Нова лекція\n\nПочніть писати текст тут...');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Назва та контент не можуть бути порожніми');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Б'ємо на ендпоінт створення лекції всередині модуля
      await axiosInstance.post(`/modules/${moduleId}/lessons/`, {
        title,
        content,
        lesson_type: 'text',
        order: 0
      });
      
      // Після успішного збереження кидаємо назад на сторінку курсу
      navigate(`/workspace/courses/${courseId}`);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Помилка збереження лекції');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-lesson">
      <div className="create-lesson__header">
        <div className="create-lesson__title-input">
          <input 
            type="text" 
            placeholder="Назва лекції..." 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
        </div>
        <div className="create-lesson__actions">
          <button 
            type="button" 
            className="btn-cancel"
            onClick={() => navigate(`/workspace/courses/${courseId}`)}
          >
            Скасувати
          </button>
          <button 
            type="button" 
            className="btn-save"
            onClick={handleSave}
            disabled={loading || !title.trim()}
          >
            {loading ? 'Збереження...' : 'Зберегти лекцію'}
          </button>
        </div>
      </div>

      {error && <div className="create-lesson__error">{error}</div>}

      <div className="create-lesson__workspace">
        {/* Ліва панель: RAW Markdown */}
        <div className="create-lesson__editor">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            spellCheck="false"
          />
        </div>

        {/* Права панель: Live Preview */}
        <div className="create-lesson__preview">
          <div className="markdown-container">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
};