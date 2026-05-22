import { useState, useEffect, useCallback } from 'react';
import { Button } from '../../components/ui';
import { CreateCourseModal } from '../../components/layout/sidebar/CreateCourseModal';
import { axiosInstance } from '../../api/axios';

interface Course {
  id: number;
  title: string;
  description: string;
  is_public: boolean;
  is_paid: boolean;
  price: string;
  owner_name: string;
}

export const MyCourses = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMyCourses = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/courses/');
      setCourses(response.data);
    } catch (error) {
      console.error('Помилка завантаження курсів:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMyCourses();
  }, [fetchMyCourses]);

  return (
    <div style={{ padding: '40px', color: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 600 }}>Мої курси</h1>
          <p style={{ color: '#94a3b8', margin: '4px 0 0', fontSize: '14px' }}>Курси, які ви створили або вивчаєте</p>
        </div>
        
        <Button onClick={() => setIsModalOpen(true)}>
          + Створити курс
        </Button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {loading ? (
          <div style={{ color: '#94a3b8' }}>Завантаження...</div>
        ) : courses.length === 0 ? (
          <div style={{ color: '#64748b', gridColumn: '1 / -1', textAlign: 'center', padding: '40px', border: '1px dashed #334155', borderRadius: '8px' }}>
            У вас ще немає курсів
          </div>
        ) : (
          courses.map((course) => (
            <div key={course.id} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ margin: 0, fontSize: '18px' }}>{course.title}</h3>
                <span style={{ fontSize: '12px', padding: '2px 8px', borderRadius: '4px', background: course.is_public ? '#065f46' : '#334155', color: course.is_public ? '#34d399' : '#94a3b8' }}>
                  {course.is_public ? 'Публічний' : 'Приватний'}
                </span>
              </div>
              <p style={{ margin: 0, color: '#94a3b8', fontSize: '14px', flexGrow: 1 }}>
                {course.description || 'Немає опису'}
              </p>
              <div style={{ fontSize: '12px', color: '#64748b', borderTop: '1px solid #334155', paddingTop: '12px', marginTop: 'auto' }}>
                Автор: {course.owner_name}
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <CreateCourseModal 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={() => {
            setIsModalOpen(false);
            fetchMyCourses(); // Одразу перемальовуємо
          }} 
        />
      )}
    </div>
  );
};