import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CourseItem.scss';

interface CourseData {
  id: number;
  title: string;
  owner_email: string; // Обов'язково онови interfaces тут
  modules: any[]; 
}

interface Props {
  course: CourseData;
}

export const CourseItem = ({ course }: Props) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // Дістаємо поточного юзера для перевірки прав
  const userStr = localStorage.getItem('user');
  const currentUser = userStr ? JSON.parse(userStr) : null;

  // Логіка доступу: чи викладач І чи його email збігається з email власника курсу
  const isOwner = currentUser?.role === 'tutor' && currentUser?.email === course.owner_email;

  return (
    <div className="course-item">
      <div className="course-item__row">
        <button 
          className="course-item__main-btn"
          onClick={() => navigate(`/workspace/courses/${course.id}`)}
        >
          {course.title}
        </button>
        <button 
          className="course-item__toggle" 
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? '▲' : '▼'}
        </button>
      </div>

      {isOpen && (
        <div className="course-item__accordion">
          {(course.modules || []).map((mod: any) => (
            <div key={mod.id} className="accordion-module">
              <div className="accordion-module__title">{mod.title}</div>
              
              {(mod.lessons || []).map((lesson: any) => (
                <button 
                  key={lesson.id} 
                  className="accordion-lesson"
                  onClick={() => navigate(`/workspace/courses/${course.id}?lesson=${lesson.id}`)}
                >
                  📄 {lesson.title}
                </button>
              ))}
              
              {/* Кнопка додавання лекції доступна тільки ВЛАСНИКУ і чітко прив'язана до модуля */}
              {isOwner && (
                <button 
                  className="accordion-add-btn"
                  onClick={() => navigate(`/workspace/courses/${course.id}/modules/${mod.id}/create-lesson`)}
                >
                  + Додати лекцію
                </button>
              )}
            </div>
          ))}
          {/* Кнопку-дублікат, яка була тут, я прибрав.  */}
        </div>
      )}
    </div>
  );
};