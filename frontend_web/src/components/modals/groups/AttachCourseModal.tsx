// AttachCourseModal.tsx
import { useState, useEffect, type FormEvent } from 'react';
import { X } from 'lucide-react';
import { axiosInstance } from '../../../api/axios';
import './AttachCourseModal.scss';

interface Props {
  groupId: number;
  onClose: () => void;
  onSuccess: () => void;
}

export const AttachCourseModal = ({ groupId, onClose, onSuccess }: Props) => {
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAllCourses = async () => {
      try {
        const response = await axiosInstance.get('/courses/');
        const data = response.data.results || response.data;
        setCourses(data);
        if (data.length > 0) {
          setSelectedCourseId(data[0].id.toString());
        }
      } catch (err) {
        setError('Не вдалося завантажити список курсів');
      } finally {
        setFetching(false);
      }
    };

    fetchAllCourses();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedCourseId) return;

    setLoading(true);
    setError('');

    try {
      await axiosInstance.post(`/groups/${groupId}/attach-course/${selectedCourseId}/`);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Помилка прикріплення курсу до групи');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="attach-course-modal__overlay" onClick={onClose}>
      <div className="attach-course-modal__content" onClick={e => e.stopPropagation()}>
        <div className="attach-course-modal__header">
          <h3>Прикріпити курс</h3>
          <button className="btn-close" onClick={onClose}>
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {error && <div className="attach-course-modal__error">{error}</div>}

        {fetching ? (
          <div className="attach-course-modal__status">Завантаження курсів...</div>
        ) : courses.length === 0 ? (
          <div className="attach-course-modal__status">
            <p>Немає доступних курсів для прикріплення.</p>
            <button type="button" className="btn-cancel" onClick={onClose}>Закрити</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="attach-course-modal__form">
            <div className="attach-course-modal__input-group">
              <label>Оберіть курс із доступних</label>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                disabled={loading}
              >
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="attach-course-modal__actions">
              <button type="button" className="btn-cancel" onClick={onClose} disabled={loading}>Скасувати</button>
              <button type="submit" className="btn-submit" disabled={loading || !selectedCourseId}>
                {loading ? 'Прикріплення...' : 'Прикріпити'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};