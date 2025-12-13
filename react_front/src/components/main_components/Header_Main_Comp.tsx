import React from 'react';
import { Link } from 'react-router-dom';

const HeaderMainComp: React.FC = () => {
  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px', borderBottom: '1px solid #ccc' }}>
      <div className="logo-section">
        <Link to="/">Home Icon/Logo</Link>
      </div>

      <nav className="main-nav">
        <ul style={{ display: 'flex', gap: '20px', listStyle: 'none', margin: 0, padding: 0 }}>
          <li>Notion</li>
          <li>Mail</li>
          <li>Calendar</li>
          <li>AI</li>
          <li>Enterprise</li>
          <li>Pricing</li>
          <li>Explore</li>
          <Link to="/workspace">Request a demo</Link>
        </ul>
      </nav>

      <div className="auth-buttons" style={{ display: 'flex', gap: '10px' }}>
        <Link to="/login">
          <button>Log in</button>
        </Link>
        <Link to="/register">
          <button>Get SkiRise free</button>
        </Link>
      </div>
    </header>
  );
};

export default HeaderMainComp;