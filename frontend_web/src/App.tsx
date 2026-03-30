import { useState } from 'react';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import { use_auth_store } from './store/authStore';

function App() {

  const [is_login_view, set_is_login_view] = useState<boolean>(true);
  const access_token = use_auth_store((state) => state.access_token);
  const logout = use_auth_store((state) => state.logout);

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      
      {!access_token ? (
        <>
          <div style={{ textAlign: 'center', marginBottom: '10px', backgroundColor: '#111', padding: '5px', borderRadius: '30px', border: '1px solid #333' }}>
            <button 
              onClick={() => set_is_login_view(true)}
              style={{ 
                  padding: '10px 25px', 
                  marginRight: '5px', 
                  backgroundColor: is_login_view ? '#333' : 'transparent', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: '25px', 
                  cursor: 'pointer',
                  fontWeight: is_login_view ? 'bold' : 'normal',
                  transition: 'background-color 0.2s'
              }}
            >
              Вхід
            </button>
            <button 
              onClick={() => set_is_login_view(false)}
              style={{ 
                  padding: '10px 25px', 
                  backgroundColor: !is_login_view ? '#333' : 'transparent', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: '25px', 
                  cursor: 'pointer',
                  fontWeight: !is_login_view ? 'bold' : 'normal',
                  transition: 'background-color 0.2s'
              }}
            >
              Реєстрація
            </button>
          </div>

          {is_login_view ? <LoginForm /> : <RegisterForm />}
        </>
      ) : (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <h2 style={{ color: '#fff' }}>Вітаємо в системі!</h2>
          <p style={{ color: '#aaa', marginBottom: '20px' }}>Ваш сеанс активний.</p>
          <button 
            onClick={logout} 
            style={{ 
              padding: '12px 30px', 
              backgroundColor: '#00D1B2', 
              color: '#fff', 
              border: 'none', 
              borderRadius: '25px', 
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Вийти з акаунту
          </button>
        </div>
      )}
      
    </div>
  );
}
export default App;