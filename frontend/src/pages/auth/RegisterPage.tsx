import { useState, useContext, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { axiosInstance } from '../../api/axios';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    role: 'student' // дефолтне значення
  });
  const [error, setError] = useState('');
  
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axiosInstance.post('auth/register/', formData);

      // Наша вюха реєстрації повертає { message, tokens: {access, refresh}, user: {...} }
      const { tokens, user } = response.data;
      
      auth?.login(tokens, user);
      navigate('/workspace');
    } catch (err: any) {
      // Якщо Django кидає помилки валідації (наприклад, такий email вже є), вони будуть в об'єкті
      setError(JSON.stringify(err.response?.data) || 'Помилка реєстрації');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h1>Реєстрація</h1>
      
      {error && <div style={{ color: 'red' }}>{error}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          type="email" name="email" placeholder="Email" 
          value={formData.email} onChange={handleChange} required style={{ padding: '10px' }}
        />
        <input 
          type="text" name="first_name" placeholder="Ім'я" 
          value={formData.first_name} onChange={handleChange} style={{ padding: '10px' }}
        />
        <input 
          type="text" name="last_name" placeholder="Прізвище" 
          value={formData.last_name} onChange={handleChange} style={{ padding: '10px' }}
        />
        <select name="role" value={formData.role} onChange={handleChange} style={{ padding: '10px' }}>
          <option value="student">Учень</option>
          <option value="tutor">Викладач</option>
        </select>
        <input 
          type="password" name="password" placeholder="Пароль (мін. 8 символів)" 
          value={formData.password} onChange={handleChange} required minLength={8} style={{ padding: '10px' }}
        />
        <button type="submit" style={{ padding: '10px', cursor: 'pointer' }}>Створити акаунт</button>
      </form>

      <p>Вже є акаунт? <Link to="/auth/login">Увійти</Link></p>
    </div>
  );
};

export default RegisterPage;