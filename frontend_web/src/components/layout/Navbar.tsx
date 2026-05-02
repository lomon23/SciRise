import { Link } from 'react-router-dom';
import { use_auth_store } from '../../store/authStore';

const Navbar = () => {
  const { access_token, clear_access_token } = use_auth_store();

  return (
    <nav style={{ padding: '20px', borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between' }}>
      <div className="logo">
        <Link to="/" style={{ fontSize: '24px', fontWeight: 'bold', textDecoration: 'none', color: '#00D1B2' }}>SciRise</Link>
      </div>
      <div>
        {!access_token ? (
          <>
            <Link to="/login" style={{ marginRight: '15px' }}>Увійти</Link>
            <Link to="/register">Реєстрація</Link>
          </>
        ) : (
          <>
            <Link to="/chat" style={{ marginRight: '15px' }}>Чат</Link>
            <Link to="/video" style={{ marginRight: '15px' }}>Відео</Link>
            <button onClick={clear_access_token} style={{ cursor: 'pointer' }}>Вийти</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;