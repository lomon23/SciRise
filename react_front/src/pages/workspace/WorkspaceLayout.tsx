import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/workspace_components/Sidebar';

const WorkspaceLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    // Змінив backgroundColor на світлий (#F5F6F8) і колір тексту на темний (#333)
    <div style={{ display: 'flex', height: '100vh', width: '100vw', backgroundColor: '#F5F6F8', color: '#333' }}>
      
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div 
        style={{ 
          flex: 1, 
          padding: '40px', 
          marginLeft: isSidebarOpen ? '280px' : '0',
          transition: 'margin-left 0.3s ease-in-out',
          overflowY: 'auto'
        }}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default WorkspaceLayout;