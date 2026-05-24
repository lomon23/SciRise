import { useNavigate } from 'react-router-dom';
import './CourseItem.scss';

interface CourseData {
  id: number;
  title: string;
}

interface Props {
  course: CourseData;
}

export const CourseItem = ({ course }: Props) => {
  const navigate = useNavigate();

  return (
    <button 
      className="course-item"
      onClick={() => navigate(`/workspace/courses/${course.id}`)}
    >
      <span className="course-item__title">{course.title}</span>
    </button>
  );
};