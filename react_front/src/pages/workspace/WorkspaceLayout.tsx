import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../../components/workspace_components/Sidebar';

const WorkspaceLayout: React.FC = () => {
  const location = useLocation();
  const isChatPage = location.pathname.startsWith('/workspace/chat');

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#F8F9FC', overflow: 'hidden' }}>
      
      {/* Sidebar */}
      <Sidebar />
      
      {/* Content Area */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        // Якщо чат - прибираємо відступи, щоб було на весь екран
        padding: isChatPage ? 0 : '30px', 
        overflow: 'hidden' 
      }}>
        <Outlet />
      </div>
      
    </div>
  );
};

export default WorkspaceLayout;