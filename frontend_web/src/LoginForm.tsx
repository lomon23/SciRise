import React, { useState } from 'react';

const LoginForm = () => {
  const [user_email, set_user_email] = useState<string>('');
  const [user_password, set_user_password] = useState<string>('');

  const handleLoginSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 
    console.log('Дані для відправки:', { email: user_email, password: user_password });
    // Пізніше ми тут додамо логіку запиту на бекенд
  };

  return (
    <div style={{ padding: '20px', maxWidth: '320px', margin: '50px auto', fontFamily: 'sans-serif' }}>
      <h2 style={{ textAlign: 'center' }}>Вхід у SciRise</h2>
      
      <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
          <input
            type="email"
            value={user_email}
            onChange={(e) => set_user_email(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Пароль:</label>
          <input
            type="password"
            value={user_password}
            onChange={(e) => set_user_password(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <button type="submit" style={{ padding: '10px', marginTop: '10px', cursor: 'pointer', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
          Увійти
        </button>
      </form>
    </div>
  );
};

export default LoginForm;