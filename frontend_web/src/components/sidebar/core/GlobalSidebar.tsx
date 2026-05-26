import { useLocation, useNavigate } from 'react-router-dom';
import { globalModules } from '../../../config/navigation';
import './GlobalSidebar.scss';

export const GlobalSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside className="global-sidebar">
      <nav className="global-sidebar__nav">
        {globalModules.map((module) => {
          const isActive = location.pathname.startsWith(module.path);
          const IconComponent = module.icon; // Беремо компонент іконки
          
          return (
            <button
              key={module.id}
              className={`global-sidebar__btn ${isActive ? 'global-sidebar__btn--active' : ''}`}
              onClick={() => navigate(module.path)}
              title={module.label}
            >
              <span className="global-sidebar__icon">
                {/* Рендеримо і задаємо товщину тут */}
                <IconComponent size={22} strokeWidth={1.5} />
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};