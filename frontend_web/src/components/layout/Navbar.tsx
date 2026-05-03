import { Link } from 'react-router-dom';
import { use_auth_store } from '../../store/authStore';
import './Navbar.css';

const Navbar = () => {
  const { access_token, clear_access_token } = use_auth_store();

  return (
    <nav className="navbar-container">
      <div className="logo">
        <Link to="/" className="navbar-logo">SciRise</Link>
      </div>
      <div className="navbar-links">
        {!access_token ? (
          <>
            <Link to="/login" className="navbar-link">Увійти</Link>
            <Link to="/register" className="navbar-link">Реєстрація</Link>
          </>
        ) : (
          <>
            <Link to="/chat" className="navbar-link">Чат</Link>
            <Link to="/video" className="navbar-link">Відео</Link>
            <button 
              onClick={clear_access_token} 
              className="navbar-link-logout"
            >
              Вийти
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;