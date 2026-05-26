import { Link } from 'react-router-dom';
import './Footer.scss';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__brand">
          <h2>SciRise</h2>
          <p>Майбутнє освіти та управління командами. Ефективніше, ніж будь-коли.</p>
        </div>

        <div className="footer__menu">
          <h4>Платформа</h4>
          <Link to="/">Головна</Link>
          <Link to="/workspace">Воркспейс</Link>
          <Link to="/courses">Курси</Link>
        </div>

        <div className="footer__menu">
          <h4>Ресурси</h4>
          <Link to="/docs">Документація</Link>
          <Link to="/api">API</Link>
          <Link to="/blog">Блог</Link>
        </div>

        <div className="footer__menu">
          <h4>Контакти</h4>
          <a href="mailto:support@scirise.com">support@scirise.com</a>
          <div className="footer__socials">
            <span>GitHub</span>
            <span>Telegram</span>
            <span>Discord</span>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <span>© 2026 SciRise.</span>
        <div className="footer__legal">
          <Link to="/privacy">Конфіденційність</Link>
          <Link to="/terms">Умови</Link>
        </div>
      </div>
    </footer>
  );
};
export default Footer;