import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../api/axios';
import './LoginPage.scss';
import { FcGoogle } from 'react-icons/fc';
export const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axiosInstance.post('/auth/login/', { email, password });
      localStorage.setItem('tokens', JSON.stringify({
        access: response.data.access,
        refresh: response.data.refresh
      }));
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      navigate('/');
    } catch (err: any) {
      console.error(err);
      setError('Невірний email або пароль');
    } finally {
      setLoading(false);
    }
  };
  const handleGoogleLogin = () => {
    // Тут буде твій редірект на бекенд, який ініціює OAuth2
    window.location.href = 'http://localhost:8000/api/auth/google/';
  };
  return (
    <div className="auth-page">
      <div className="auth-page__left">
        <div className="auth-form-container">
          <h2 className="auth-page__title">Вхід в систему</h2>
          <p className="auth-page__subtitle">Увійдіть у свій робочий простір</p>
          
          {error && <div className="auth-page__error">{error}</div>}
          
          <form className="auth-page__form" onSubmit={handleSubmit}>
            <div className="auth-page__input-group">
              <label>Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                placeholder="email@example.com"
              />
            </div>
            
            <div className="auth-page__input-group">
              <label>Пароль</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                placeholder="Ваш пароль"
              />
            </div>

            <button type="submit" className="auth-page__submit" disabled={loading}>
              {loading ? 'Вхід...' : 'Увійти'}
            </button>
            <button 
              type="button" 
              className="auth-page__google-btn" 
              onClick={handleGoogleLogin}
            >
              <FcGoogle size={20} />
              <span>Увійти через Google</span>
            </button>
          </form>

          <div className="auth-page__footer">
            <span>Немає акаунту?</span>
            <Link to="/register">Зареєструватися</Link>
          </div>
        </div>
      </div>

      <div className="auth-page__right">
        <div className="overlay-text">
          <h2>SciRise Workspace</h2>
          <p>Ваша продуктивність починається тут.</p>
        </div>
      </div>
    </div>
  );
};