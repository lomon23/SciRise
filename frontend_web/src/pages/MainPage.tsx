import './MainPage.css';
import { Link } from 'react-router-dom';
import { use_auth_store } from '../store/authStore';

const MainPage = () => {
  const token = use_auth_store((state) => state.access_token);

  return (
    <div className="hero-container">
      
      {/* Блок з ілюстрацією */}
      <div className="hero-illustration">
        <div className="hero-circle"></div>
      </div>

      {/* Тексти з твого макету */}
      <h1 className="hero-title">
        One workspace.<br/>Zero busywork.
      </h1>
      
      <p className="hero-subtitle">
        SciRise is where your teams and AI agents capture knowledge, find answers, and automate projects. 
        Now a team of 7 feels like 70.
      </p>

      <div className="hero-buttons">
        {token ? (
          // Якщо юзер вже зайшов
          <Link to="/chat" className="btn-primary">Go to Workspace</Link>
        ) : (
          // Якщо юзер ще гість — показуємо кнопки як на дизайні
          <>
            <Link to="/register" className="btn-primary">Get SciRise free</Link>
            <Link to="/login" className="btn-secondary">Request a demo</Link>
          </>
        )}
      </div>

    </div>
  );
};

export default MainPage;