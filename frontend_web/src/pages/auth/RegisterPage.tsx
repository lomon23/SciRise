import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../api/axios';
import './RegisterPage.scss';

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
      // Б'ємо на ендпоінт реєстрації (перевір URL, зазвичай це /register/ або /auth/register/)
      const response = await axiosInstance.post('/auth/register/', formData);
      
      // Твій бекенд віддає tokens і user. Зберігаємо їх.
      localStorage.setItem('tokens', JSON.stringify(response.data.tokens));
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Перекидаємо у робочу зону
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

  return (
    <div className="auth-page">
      <div className="auth-page__container">
        <h2 className="auth-page__title">Реєстрація в SciRise</h2>
        
        {error && <div className="auth-page__error">{error}</div>}
        
        <form className="auth-page__form" onSubmit={handleSubmit}>
          <div className="auth-page__row">
            <div className="auth-page__input-group">
              <label>Ім'я</label>
              <input name="first_name" type="text" onChange={handleChange} required />
            </div>
            <div className="auth-page__input-group">
              <label>Прізвище</label>
              <input name="last_name" type="text" onChange={handleChange} />
            </div>
          </div>

          <div className="auth-page__input-group">
            <label>Роль</label>
            <select name="role" onChange={handleChange} value={formData.role}>
              <option value="student">Студент</option>
              <option value="tutor">Викладач (Tutor)</option>
            </select>
          </div>

          <div className="auth-page__input-group">
            <label>Email</label>
            <input name="email" type="email" onChange={handleChange} required />
          </div>

          <div className="auth-page__input-group">
            <label>Пароль (мін. 8 символів)</label>
            <input name="password" type="password" minLength={8} onChange={handleChange} required />
          </div>

          <button type="submit" className="auth-page__submit" disabled={loading}>
            {loading ? 'Завантаження...' : 'Створити акаунт'}
          </button>
        </form>

        <div className="auth-page__footer">
          <span>Вже є акаунт?</span>
          <Link to="/login">Увійти</Link>
        </div>
      </div>
    </div>
  );
};