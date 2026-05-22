import { useState, useEffect } from 'react';
import { axiosInstance } from '../../api/axios';

interface Course {
  id: number;
  title: string;
  description: string;
  is_public: boolean;
  price: string;
  owner_name: string;
}

export const CourseFeed = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFeed = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/courses/feed/');
        setCourses(response.data);
      } catch (error) {
        console.error('Помилка завантаження стрічки:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, []);

  return (
    <div style={{ padding: '40px', color: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
      <div>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 600 }}>Стрічка публічних курсів</h1>
        <p style={{ color: '#94a3b8', margin: '4px 0 0', fontSize: '14px' }}>Всі відкриті курси платформи SciRise</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {loading ? (
          <div style={{ color: '#94a3b8' }}>Завантаження...</div>
        ) : courses.length === 0 ? (
          <div style={{ color: '#64748b', gridColumn: '1 / -1', textAlign: 'center', padding: '40px', border: '1px dashed #334155', borderRadius: '8px' }}>
            Поки що немає публічних курсів
          </div>
        ) : (
          courses.map((course) => (
            <div key={course.id} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '18px' }}>{course.title}</h3>
              <p style={{ margin: 0, color: '#94a3b8', fontSize: '14px', flexGrow: 1 }}>
                {course.description || 'Немає опису'}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #334155', paddingTop: '12px', marginTop: 'auto' }}>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Автор: {course.owner_name}</span>
                <button style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                  Переглянути
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};