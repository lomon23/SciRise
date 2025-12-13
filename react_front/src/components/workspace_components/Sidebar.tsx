import React from 'react';
import { Link } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: isOpen ? 0 : '-280px',
        width: '280px',
        height: '100vh',
        backgroundColor: '#6A5ACD',
        color: 'white',
        transition: 'left 0.3s ease-in-out',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px',
        boxSizing: 'border-box',
        zIndex: 1000
      }}
    >
      <button 
        onClick={toggleSidebar}
        style={{
          position: 'absolute',
          right: '-40px',
          top: '20px',
          background: '#6A5ACD',
          border: 'none',
          color: 'white',
          padding: '10px',
          cursor: 'pointer',
          borderRadius: '0 5px 5px 0'
        }}
      >
        {isOpen ? '✕' : '☰'}
      </button>

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '40px', marginTop: '10px' }}>
        <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#D3D3D3', marginRight: '15px' }}></div>
        <div>
          <div style={{ fontWeight: 'bold', fontSize: '18px' }}>Username</div>
          <div style={{ fontSize: '14px', opacity: 0.8 }}>@username</div>
          <div style={{ fontSize: '12px', textDecoration: 'underline', cursor: 'pointer', marginTop: '2px' }}>Edit Profile</div>
        </div>
      </div>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Link to="/workspace/profile" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '18px' }}>
          <span>👤</span> My Profile
        </Link>
        
        <Link to="/workspace" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '18px' }}>
          <span>🏠</span> Home
        </Link>

        {/* --- НОВЕ ПОСИЛАННЯ НА EDITOR (Work Space) --- */}
        <Link to="/workspace/editor" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '18px' }}>
          <span>📝</span> Editor
        </Link>

        <Link to="/workspace/settings" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '18px' }}>
          <span>⚙️</span> Settings
        </Link>
      </nav>

      <div style={{ marginTop: 'auto', marginBottom: '20px' }}>
        <Link to="/login" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '18px' }}>
          <span>↪️</span> Logout
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;