import { Link } from 'react-router-dom';


const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__brand">
          <h2>SciRise</h2>
          <p>Інтерактивна платформа для репетиторів та учнів.</p>
        </div>
        
        <div className="footer__links">
          <div className="footer__column">
            <h3>Продукт</h3>
            <Link to="/">Головна</Link>
            <Link to="/auth/register">Реєстрація</Link>
          </div>
          <div className="footer__column">
            <h3>Підтримка</h3>
            <a href="#">FAQ</a>
            <a href="#">Контакти</a>
          </div>
        </div>
      </div>
      
      <div className="footer__bottom">
        <p>&copy; {new Date().getFullYear()} SciRise. Усі права захищені.</p>
      </div>
    </footer>
  );
};

export default Footer;