import { Outlet } from 'react-router-dom';
import { GlobalSidebar } from '../../components/layout/sidebar/GlobalSidebar';
import { ContextSidebar } from '../../components/layout/sidebar/ContextSidebar';
import './WorkspaceLayout.scss';

const WorkspaceLayout = () => {
  return (
    <div className="workspace-layout">
      <GlobalSidebar />
      <ContextSidebar />
      <main className="workspace-content">
        <Outlet /> {/* Саме сюди React Router підставить чат або дошку */}
      </main>
    </div>
  );
};

export default WorkspaceLayout;