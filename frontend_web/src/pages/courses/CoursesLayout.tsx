import { Outlet } from 'react-router-dom';
import { CourseSidebar } from '../../components/sidebar/courses/CourseSidebar';
import './CoursesLayout.scss';

export const CoursesLayout = () => {
  return (
    <div className="courses-layout">
      <CourseSidebar />
      <main className="courses-layout__main">
        {/* Сюди підставиться або заглушка, або сам плеєр курсу */}
        <Outlet />
      </main>
    </div>
  );
};