import React, { useState } from 'react';
import Sidebar from '../../components/workspace_components/Sidebar';

const WorkspacePage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', backgroundColor: '#f5f5f5' }}>
      
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div 
        style={{ 
          flex: 1, 
          padding: '40px', 
          marginLeft: isSidebarOpen ? '280px' : '0',
          transition: 'margin-left 0.3s ease-in-out'
        }}
      >
        <h1>Workspace Area</h1>
        <p>This is your empty workspace.</p>
        
        {!isSidebarOpen && (
          <button onClick={toggleSidebar} style={{ padding: '10px 20px', cursor: 'pointer' }}>
            Open Menu
          </button>
        )}
      </div>
    </div>
  );
};

export default WorkspacePage;