import { Link } from 'react-router-dom';
import './Footer.scss'; // Стилі для футера
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__info">
          <span className="footer__copyright">© 2026 SciRise. Всі права захищено.</span>
        </div>
        
        <div className="footer__links">
          <Link to="/privacy">Політика конфіденційності</Link>
          <Link to="/terms">Умови використання</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;