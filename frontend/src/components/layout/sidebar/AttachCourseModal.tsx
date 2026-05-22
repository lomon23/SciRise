import { useState, useEffect, type FormEvent } from 'react';
import { axiosInstance } from '../../../api/axios';
import { Button } from '../../ui'; // Перевір шлях до своїх UI компонентів

interface Course {
  id: number;
  title: string;
}

interface Props {
  groupId: number;
  onClose: () => void;
  onSuccess: () => void;
}

export const AttachCourseModal = ({ groupId, onClose, onSuccess }: Props) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Одразу тягнемо мої курси, щоб було з чого вибирати
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axiosInstance.get('/courses/');
        setCourses(response.data);
      } catch (error) {
        console.error('Помилка завантаження курсів:', error);
      } finally {
        setFetching(false);
      }
    };
    fetchCourses();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedCourseId) return;

    setLoading(true);
    try {
      await axiosInstance.post(`/groups/${groupId}/attach-course/${selectedCourseId}/`);
      onSuccess();
    } catch (err: any) {
      alert('Помилка прив\'язки курсу');
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
        width: '320px', color: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '16px'
      }}>
        <h3 style={{ margin: 0, fontSize: '18px' }}>Прикріпити курс</h3>
        
        {fetching ? (
          <div style={{ color: '#94a3b8' }}>Завантаження курсів...</div>
        ) : courses.length === 0 ? (
          <div style={{ color: '#ef4444', fontSize: '14px' }}>У вас немає створених курсів.</div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <select 
              value={selectedCourseId} 
              onChange={(e) => setSelectedCourseId(Number(e.target.value))}
              style={{ padding: '10px', borderRadius: '6px', background: '#0f172a', color: 'white', border: '1px solid #475569', outline: 'none' }}
              required
            >
              <option value="" disabled>Виберіть курс зі списку...</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <Button type="button" onClick={onClose} style={{ background: 'transparent', border: '1px solid #475569' }}>Скасувати</Button>
              <Button type="submit" disabled={loading || !selectedCourseId}>
                {loading ? 'Збереження...' : 'Прикріпити'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};