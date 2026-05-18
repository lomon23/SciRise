import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';


const Header = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    auth?.logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header__logo">
        <Link to="/">SciRise</Link>
      </div>
      
      <nav className="header__nav">
        <Link to="/">Головна</Link>
        <a href="#about">Про нас</a>
        <a href="#features">Фічі</a>
      </nav>

      <div className="header__actions">
        {auth?.user ? (
          <>
            <span className="header__greeting">
              Привіт, {auth.user.first_name || auth.user.email.split('@')[0]}
            </span>
            <Link to="/workspace" className="btn-primary">Workspace</Link>
            <button onClick={handleLogout} className="btn-outline">Вийти</button>
          </>
        ) : (
          <>
            <Link to="/auth/login" className="btn-outline">Увійти</Link>
            <Link to="/auth/register" className="btn-primary">Реєстрація</Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;