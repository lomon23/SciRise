import { useLocation, useNavigate } from 'react-router-dom';
import { globalModules } from '../../..//config/navigation';
import './GlobalSidebar.scss'; // Стилі для глобальної сайдбар

export const GlobalSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside className="global-sidebar">
      <nav className="global-sidebar__nav">
        {globalModules.map((module) => {
          // Перевіряємо, чи ми зараз у цьому розділі, щоб потім можна було підсвітити кнопку
          const isActive = location.pathname.startsWith(module.path);
          
          return (
            <button
              key={module.id}
              className={`global-sidebar__btn ${isActive ? 'global-sidebar__btn--active' : ''}`}
              onClick={() => navigate(module.path)}
              title={module.label}
            >
              <span className="global-sidebar__icon">{module.icon}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};