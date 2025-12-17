import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../../scripts/API_endPoint/auth/auth.service';
//import type { LoginRequest } from '../../scripts/API_endPoint/auth/auth_types';
// Імпорт Google Login
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Стандартний логін
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await loginUser({ identifier: username, password });
      navigate('/workspace');
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // Google Логін
  const handleGoogleSuccess = async (response: CredentialResponse) => {
    try {
      if (!response.credential) {
        setError("No credential received from Google");
        return;
      }

      // Відправляємо токен на наш бекенд
      const res = await fetch('http://localhost:8000/api/auth/google/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: response.credential }),
      });

      if (res.ok) {
        // Успішний вхід через Google
        navigate('/workspace');
      } else {
        const data = await res.json();
        setError(data.error || 'Google login failed on server');
      }
    } catch (err) {
      console.error(err);
      setError('Google login connection error');
    }
  };

  // Styles
  const inputClasses = "block w-full px-4 py-3 rounded-xl border border-gray-200 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 sm:text-sm bg-gray-50/50 focus:bg-white";
  const labelClasses = "block text-sm font-medium text-gray-700 mb-1.5";

  return (
    <div className="min-h-screen flex font-sans bg-white">
      {/* Ліва частина */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center py-12 px-6 lg:px-20 xl:px-24 z-10 relative bg-white">
        <div className="mx-auto w-full max-w-md">
          
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-purple-600 transition-colors">
              Back to Home
            </Link>
          </div>

          <div className="mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Welcome back</h2>
            <p className="mt-3 text-base text-gray-600">Please enter your details to sign in.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg text-sm">
              <p className="font-bold">Error</p> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className={labelClasses}>User Name or Email</label>
              <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} className={inputClasses} placeholder="Enter your user name or email" />
            </div>

            <div>
              <label className={labelClasses}>Password</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className={inputClasses} placeholder="••••••••" />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="h-4 w-4 text-purple-600 rounded" />
                <span className="ml-2 text-sm text-gray-700">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm font-medium text-purple-600 hover:text-purple-500">Forgot password?</Link>
            </div>

            <button type="submit" disabled={loading} className={`w-full py-3.5 px-4 rounded-xl shadow-lg text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all font-bold ${loading ? 'opacity-70' : ''}`}>
              {loading ? 'Logging in...' : 'Sign in'}
            </button>
          </form>

           <div className="relative mt-8 mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
            <div className="relative flex justify-center text-sm"><span className="px-3 bg-white text-gray-500 font-medium">Or continue with</span></div>
          </div>

          {/* КНОПКА GOOGLE */}
          <div className="flex justify-center w-full">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Login Failed')}
              theme="outline"
              size="large"
              width="400" // Максимальна ширина контейнера
              text="signin_with"
              shape="pill"
            />
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-purple-600 hover:text-purple-500">Sign up now</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Права частина */}
      <div className="hidden lg:block relative w-1/2 bg-gray-900">
        <div className="absolute inset-0 w-full h-full overflow-hidden">
            <div className="absolute inset-0 bg-purple-900/40 mix-blend-multiply z-10"></div>
            <img className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1535378917042-10a22c95931a?q=80&w=1974&auto=format&fit=crop" alt="Robot" />
        </div>
        <div className="absolute bottom-0 left-0 z-30 p-16 md:p-24 text-white">
            <h3 className="text-4xl font-bold mb-6 leading-tight">Welcome back to<br/>the future.</h3>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;