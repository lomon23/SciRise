import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Header = () => {
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    // Перевіряємо наявність токенів у стореджі
    const tokens = localStorage.getItem('tokens');
    setIsAuth(!!tokens);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('tokens');
    localStorage.removeItem('user');
    setIsAuth(false);
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header__brand">
        <Link to="/" className="header__logo">SciRise</Link>
      </div>
      
      <nav className="header__nav">
        <a href="#about" className="header__nav-link">Про нас</a>
        <a href="#team" className="header__nav-link">Команда</a>
      </nav>

      <div className="header__auth">
        {isAuth ? (
          <>
            <Link to="/workspace" className="header__auth-link">Воркспейс</Link>
            <button onClick={handleLogout} className="header__auth-btn">Вийти</button>
          </>
        ) : (
          <>
            <Link to="/login" className="header__auth-link">Увійти</Link>
            <Link to="/register" className="header__auth-link header__auth-link--primary">Реєстрація</Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;