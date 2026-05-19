import { useLocation, useNavigate } from 'react-router-dom';
import { ContextNavButton } from '../../ui/sidebar-ui/ContextNavButton';
import { mockGroups, settingsMenu } from '../../../config/navigation';
import './ContextSidebar.scss';

export const ContextSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const renderContent = () => {
    if (location.pathname.startsWith('/workspace/settings')) {
      return (
        <>
          <div className="context-sidebar__header">
            <h3>Налаштування</h3>
          </div>
          <div className="context-sidebar__channels">
            {settingsMenu.map((item) => (
              <ContextNavButton
                key={item.id}
                icon={item.icon}
                label={item.label}
                isActive={location.pathname === item.path}
                onClick={() => navigate(item.path)}
              />
            ))}
          </div>
        </>
      );
    }

    if (location.pathname.startsWith('/workspace/groups')) {
      return (
        <>
          <div className="context-sidebar__header">
            <h3>Мої Групи</h3>
          </div>
          <div className="context-sidebar__channels">
            {mockGroups.map((group) => (
              <div key={group.id} className="group-block" style={{ marginBottom: '16px' }}>
                <div className="group-title" style={{ fontSize: '12px', color: '#94a3b8', padding: '0 12px 8px', textTransform: 'uppercase' }}>
                  {group.name}
                </div>
                {group.channels.map((channel) => {
                  const icon = channel.type === 'chat' ? '#' : channel.type === 'board' ? '🎨' : '🔊';
                  return (
                    <ContextNavButton
                      key={channel.id}
                      icon={icon}
                      label={channel.label}
                      isActive={location.pathname === channel.path}
                      onClick={() => navigate(channel.path)}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </>
      );
    }

    return null; 
  };

  return (
    <aside className="context-sidebar">
      {renderContent()}
    </aside>
  );
};