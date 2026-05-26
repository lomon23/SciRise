import { Outlet } from 'react-router-dom';
import { GlobalSidebar } from '../../components/sidebar/core/GlobalSidebar';
import './WorkspaceLayout.scss'; // Стилі для робочої зони
import { FloatingVoiceWidget } from '../../components/voice/FloatingVoiceWidget'; // Імпорт плаваючого віджета для войс-чатів
export const WorkspaceLayout = () => {
  return (
    <div className="workspace-layout">
      <GlobalSidebar />
      
      {/* Сюди React Router буде підставляти все інше.
        Наприклад, коли URL /workspace/groups, тут з'явиться Груповий сайдбар і чат.
      */}
      <div className="workspace-layout__content-area">
        <Outlet />
      </div>
      <FloatingVoiceWidget />
    </div>
  );
};