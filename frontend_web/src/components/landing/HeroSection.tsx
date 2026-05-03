import { Link } from 'react-router-dom';
import './Landing.css'; // Можеш перейменувати свій MainPage.css або створити цей

const HeroSection = () => {
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

      {/* Кнопки тільки для неавторизованих */}
      <div className="hero-buttons">
        <Link to="/register" className="btn-primary">Get SciRise free</Link>
        <Link to="/login" className="btn-secondary">Request a demo</Link>
      </div>

    </div>
  );
};

export default HeroSection;