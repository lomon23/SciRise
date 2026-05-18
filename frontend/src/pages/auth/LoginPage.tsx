import { useState, useContext, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { axiosInstance } from '../../api/axios';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axiosInstance.post('auth/login/', {
        email,
        password,
      });

      // Бекенд повертає { refresh, access, user: {...} }
      const { access, refresh, user } = response.data;
      
      auth?.login({ access, refresh }, user);
      navigate('/workspace');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Помилка авторизації. Перевір пошту та пароль.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h1>Вхід у SciRise</h1>
      
      {error && <div style={{ color: 'red' }}>{error}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          style={{ padding: '10px' }}
        />
        <input 
          type="password" 
          placeholder="Пароль" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
          style={{ padding: '10px' }}
        />
        <button type="submit" style={{ padding: '10px', cursor: 'pointer' }}>Увійти</button>
      </form>

      <p>Немає акаунту? <Link to="/auth/register">Зареєструватися</Link></p>
    </div>
  );
};

export default LoginPage;