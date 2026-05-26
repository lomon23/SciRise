import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../api/axios';
import './RegisterPage.scss';
import { FcGoogle } from 'react-icons/fc';
export const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    role: 'student'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axiosInstance.post('/auth/register/', formData);
      localStorage.setItem('tokens', JSON.stringify(response.data.tokens));
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/');
    } catch (err: any) {
      console.error(err);
      setError('Помилка реєстрації. Перевірте дані.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleGoogleLogin = () => {
    // Тут буде твій редірект на бекенд, який ініціює OAuth2
    window.location.href = 'http://localhost:8000/api/auth/google/';
  };
  return (
    <div className="auth-page">
      <div className="auth-page__left">
        <div className="auth-form-container">
          <h2 className="auth-page__title">Реєстрація в SciRise</h2>
          <p className="auth-page__subtitle">Створіть акаунт для доступу до платформи</p>
          
          {error && <div className="auth-page__error">{error}</div>}
          
          <form className="auth-page__form" onSubmit={handleSubmit}>
            <div className="auth-page__row">
              <div className="auth-page__input-group">
                <label>Ім'я</label>
                <input name="first_name" type="text" onChange={handleChange} required placeholder="Джон" />
              </div>
              <div className="auth-page__input-group">
                <label>Прізвище</label>
                <input name="last_name" type="text" onChange={handleChange} placeholder="Доу" />
              </div>
            </div>

            <div className="auth-page__input-group">
              <label>Роль</label>
              <div className="custom-select-wrapper">
                <select name="role" onChange={handleChange} value={formData.role}>
                  <option value="student">Студент</option>
                  <option value="tutor">Викладач</option>
                </select>
              </div>
            </div>

            <div className="auth-page__input-group">
              <label>Email</label>
              <input name="email" type="email" onChange={handleChange} required placeholder="email@example.com" />
            </div>

            <div className="auth-page__input-group">
              <label>Пароль</label>
              <input name="password" type="password" minLength={8} onChange={handleChange} required placeholder="Мінімум 8 символів" />
            </div>

            <button type="submit" className="auth-page__submit" disabled={loading}>
              {loading ? 'Обробка...' : 'СТВОРИТИ АКАУНТ'}
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
            <span>Вже є акаунт?</span>
            <Link to="/login">Увійти</Link>
          </div>
        </div>
      </div>
      
      <div className="auth-page__right">
        {/* Картинка задається через SCSS */}
        <div className="auth-page__overlay">
          <div className="overlay-text">
            <h2>SciRise Workspace</h2>
            <p>Усе необхідне для навчання та управління проєктами в одному місці.</p>
          </div>
        </div>
      </div>
    </div>
  );
};