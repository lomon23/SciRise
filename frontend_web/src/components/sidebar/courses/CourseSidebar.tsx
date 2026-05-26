import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { axiosInstance } from '../../../api/axios';
import { SecondSidebar } from '../core/SecondSidebar';
import { CourseItem } from './CourseItem';
import { CreateCourseModal } from '../../modals/courses/CreateCourseModal';
import './CourseSidebar.scss';

export const CourseSidebar = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();

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

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses, location.pathname]); 

  const actionButtons = (
    <div className="course-sidebar__actions">
      <button className="btn-action" onClick={() => setIsModalOpen(true)} title="Створити курс">
        <Plus size={18} strokeWidth={1.5} />
      </button>
    </div>
  );

  return (
    <>
      <SecondSidebar title="Всі курси" actions={actionButtons}>
        <div className="course-sidebar__list">
          {loading ? (
            <div className="course-sidebar__status">Завантаження...</div>
          ) : courses.length === 0 ? (
            <div className="course-sidebar__status">Курсів немає</div>
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