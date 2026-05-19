import { useLocation, useNavigate } from 'react-router-dom';
import { GlobalNavButton } from '../../ui/sidebar-ui/GlobalNavButton';
import { globalModules } from '../../../config/navigation';
import './GlobalSidebar.scss'; 

export const GlobalSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside className="global-sidebar">
      <div className="global-sidebar__nav">
        {globalModules.map((module) => {
          const isActive = location.pathname.startsWith(module.path);
          return (
            <GlobalNavButton
              key={module.id}
              icon={module.icon}
              label={module.label}
              isActive={isActive}
              onClick={() => navigate(module.path)}
            />
          );
        })}
      </div>
    </aside>
  );
};