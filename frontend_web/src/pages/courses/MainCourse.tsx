import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../api/axios';
import { BookOpen } from 'lucide-react';
import './MainCourse.scss';

export const MainCourse = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axiosInstance.get('/courses/'); // Твій endpoint для курсів
        setCourses(response.data);
      } catch (error) {
        console.error('Не вдалося завантажити курси:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="main-course">
      <header className="main-course__header">
        <h1>Публічні курси</h1>
        <p>Оберіть напрямок для навчання</p>
      </header>

      <div className="main-course__grid">
        {loading ? (
          <div>Завантаження...</div>
        ) : courses.length > 0 ? (
          courses.map((course) => (
            <div 
              key={course.id} 
              className="course-tile"
              onClick={() => navigate(`/courses/${course.id}`)}
            >
              <div className="course-tile__icon">
                <BookOpen size={24} />
              </div>
              <div className="course-tile__info">
                <h3>{course.title}</h3>
                <p>{course.description}</p>
              </div>
            </div>
          ))
        ) : (
          <p>Поки що немає доступних курсів.</p>
        )}
      </div>
    </div>
  );
};