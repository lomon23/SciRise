import React, { useState } from 'react';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt:', { username, password, rememberMe });
  };

  return (
    <div className="login-page-container">
      <div className="login-image-section">
        <div style={{ width: '100%', height: '100%', backgroundColor: '#ccc' }}>
            Placeholder for Image
        </div>
      </div>

      <div className="login-form-section">
        <h2>Login</h2>
        <p>Welcome Back! Please Login To Your Account</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username" style={{ display: 'block' }}>User Name</label>
            <input
              id="username"
              type="text"
              placeholder="Enter your user name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <br />

          <div className="form-group">
            <label htmlFor="password" style={{ display: 'block' }}>Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <br />

          <div className="form-actions" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <label>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              {' '}Remember me
            </label>

            <a href="/forgot-password">Forget Password?</a>
          </div>

          <br />

          <button type="submit" style={{ width: '100%' }}>
            Login
          </button>
        </form>

        <br />

        <div className="form-footer">
          <span>Dont Have An Account? </span>
          <a href="/signup">Sign Up</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;