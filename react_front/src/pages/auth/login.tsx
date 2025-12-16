import React, { useState } from 'react';
import { loginUser } from '../../scripts/API_endPoint/auth/auth.service'; // Імпорт сервісу
import type { LoginRequest } from '../../scripts/API_endPoint/auth/auth_types';

const LoginPage: React.FC = () => {
  // Стейт полів
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  // Стейт UI
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const payload: LoginRequest = {
      identifier: username, // Бекенд чекає саме 'identifier'
      password: password
    };

    try {
      await loginUser(payload);
      console.log('Login successful');
      alert('Login successful!'); 
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-container" style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Ліва частина з картинкою (залишив як у прикладі) */}
      <div className="login-image-section" style={{ flex: 1, backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '80%', height: '80%', backgroundColor: '#ccc', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            Placeholder for Image
        </div>
      </div>

      {/* Права частина з формою */}
      <div className="login-form-section" style={{ flex: 1, padding: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h2>Login</h2>
        <p style={{ color: '#888', marginBottom: '20px' }}>Welcome Back! Please Login To Your Account</p>

        {/* Відображення помилки */}
        {error && <div style={{ color: 'red', marginBottom: '15px', padding: '10px', backgroundColor: '#ffe6e6', borderRadius: '5px' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label htmlFor="username" style={{ display: 'block', marginBottom: '5px' }}>User Name or Email</label>
            <input
              id="username"
              type="text"
              placeholder="Enter your user name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
              required
            />
          </div>

          <div className="form-actions" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px', alignItems: 'center' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ marginRight: '5px' }}
              />
              Remember me
            </label>

            <a href="/forgot-password" style={{ color: '#6A5ACD', textDecoration: 'none' }}>Forget Password?</a>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '12px', 
              backgroundColor: loading ? '#ccc' : '#6A5ACD', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '16px'
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="form-footer" style={{ marginTop: '20px', textAlign: 'center' }}>
          <span>Dont Have An Account? </span>
          <a href="/signup" style={{ color: '#6A5ACD', fontWeight: 'bold', textDecoration: 'none' }}>Sign Up</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;