import { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

function App() {
  const [access_token, set_access_token] = useState<string | null>(null);

  const [is_login_view, set_is_login_view] = useState<boolean>(true);

  return (
    
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      
      
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

      
      {is_login_view ? 
  <LoginForm onLoginSuccess={(token: string) => set_access_token(token)} /> : 
  <RegisterForm />
}
      
    </div>
  );
}

export default App;