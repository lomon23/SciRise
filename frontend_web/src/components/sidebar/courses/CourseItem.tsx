import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronRight, FileText, Plus } from 'lucide-react';
import './CourseItem.scss';

interface CourseData {
  id: number;
  title: string;
  owner_email: string;
  modules: any[]; 
}

interface Props {
  course: CourseData;
}

export const CourseItem = ({ course }: Props) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const userStr = localStorage.getItem('user');
  const currentUser = userStr ? JSON.parse(userStr) : null;
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
          {isOpen ? <ChevronDown size={16} strokeWidth={1.5} /> : <ChevronRight size={16} strokeWidth={1.5} />}
        </button>
      </div>

      {isOpen && (
        <div className="course-item__accordion">
          {(course.modules || []).map((mod: any) => (
            <div key={mod.id} className="accordion-module">
              <div className="accordion-module__title">{mod.title}</div>
              
              <div className="accordion-module__list">
                {(mod.lessons || []).map((lesson: any) => (
                  <button 
                    key={lesson.id} 
                    className="accordion-lesson"
                    onClick={() => navigate(`/workspace/courses/${course.id}?lesson=${lesson.id}`)}
                  >
                    <FileText size={14} strokeWidth={1.5} className="icon" />
                    <span className="text">{lesson.title}</span>
                  </button>
                ))}
              </div>
              
              {isOwner && (
                <button 
                  className="accordion-add-btn"
                  onClick={() => navigate(`/workspace/courses/${course.id}/modules/${mod.id}/create-lesson`)}
                >
                  <Plus size={14} strokeWidth={2} /> Додати лекцію
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};