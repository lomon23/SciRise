import { Link } from 'react-router-dom';
import { use_auth_store } from '../store/authStore';
import HeroSection from '../components/landing/HeroSection';
import AboutSection from '../components/landing/AboutSection';
import Footer from '../components/landing/Footer';
import './MainPage.css';

const MainPage = () => {
  const token = use_auth_store((state) => state.access_token);

  // СТАН 1: Залогінений (строго по ТЗ: пустий екран, голі кнопки без стилів)
  if (token) {
    return (
      <div>
        <Link to="/chat"><button>Просто чат</button></Link>
        <Link to="/video"><button>Відео чат</button></Link>
        <Link to="/profile"><button>Профіль</button></Link>
      </div>
    );
  }

  // СТАН 2: Не залогінений (збираємо лендінг з компонентів)
  return (
    <div className="landing-page">
      <HeroSection />
      <AboutSection />
      <Footer />
    </div>
  );
};

export default MainPage;