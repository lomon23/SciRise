import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom'; // Додай цей імпорт
import { axiosInstance } from '../../../api/axios';
import { SecondSidebar } from '../core/SecondSidebar';
import { CourseItem } from './CourseItem';
import { CreateCourseModal } from '../../modals/courses/CreateCourseModal';
import './CourseSidebar.scss';

export const CourseSidebar = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation(); // Стежимо за зміною шляху

  const fetchCourses = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/courses/');
      setCourses(response.data);
    } catch (error) {
      console.error('Помилка курсів:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Оновлюємо список щоразу, коли заходимо в розділ курсів або змінюємо URL
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses, location.pathname]); 

  const actionButtons = (
    <button className="btn-action" onClick={() => setIsModalOpen(true)}>+</button>
  );

  return (
    <>
      <SecondSidebar title="Всі курси" actions={actionButtons}>
        <div className="course-sidebar__list">
          {loading ? (
            <div className="status">...</div>
          ) : (
            courses.map(course => (
              <CourseItem key={course.id} course={course} />
            ))
          )}
        </div>
      </SecondSidebar>

      {isModalOpen && (
        <CreateCourseModal 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={() => {
            setIsModalOpen(false);
            fetchCourses();
          }} 
        />
      )}
    </>
  );
};