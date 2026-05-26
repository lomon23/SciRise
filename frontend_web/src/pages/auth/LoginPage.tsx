import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../api/axios';
import './RegisterPage.scss';

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
      
      // Зберігаємо токени
      localStorage.setItem('tokens', JSON.stringify({
        access: response.data.access,
        refresh: response.data.refresh
      }));
      
      // ЗБЕРІГАЄМО ЮЗЕРА (розкоментовано)
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

  return (
    <div className="auth-page">
      <div className="auth-page__container">
        <h2 className="auth-page__title">Вхід в систему</h2>
        
        {error && <div className="auth-page__error">{error}</div>}
        
        <form className="auth-page__form" onSubmit={handleSubmit}>
          <div className="auth-page__input-group">
            <label>Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="auth-page__input-group">
            <label>Пароль</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="auth-page__submit" disabled={loading}>
            {loading ? 'Вхід...' : 'Увійти'}
          </button>
        </form>

        <div className="auth-page__footer">
          <span>Немає акаунту?</span>
          <Link to="/register">Зареєструватися</Link>
        </div>
      </div>
    </div>
  );
};