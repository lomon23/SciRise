import { useState, useEffect, useCallback } from 'react';
import { axiosInstance } from '../../../api/axios';
import { SecondSidebar } from '../core/SecondSidebar';
import { CourseItem } from './CourseItem';
import { CreateCourseModal } from '../../modals/courses/CreateCourseModal';
import './CourseSidebar.scss';

export const CourseSidebar = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Дістаємо юзера з локал стореджа і перевіряємо роль
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const isTutor = user?.role === 'tutor';

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/courses/');
      // Якщо є пагінація — response.data.results, інакше response.data
      setCourses(response.data.results || response.data);
    } catch (error) {
      console.error('Помилка завантаження курсів:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // Кнопка додається ТІЛЬКИ якщо користувач — tutor
  const actionButtons = isTutor ? (
    <div className="course-sidebar__actions">
      <button className="btn-action" onClick={() => setIsModalOpen(true)}>+</button>
    </div>
  ) : null;

  return (
    <>
      <SecondSidebar title="Всі курси" actions={actionButtons}>
        <div className="course-sidebar__list">
          {loading ? (
            <div className="course-sidebar__status">...</div>
          ) : courses.length === 0 ? (
            <div className="course-sidebar__status">Курсів немає</div>
          ) : (
            courses.map((course) => (
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