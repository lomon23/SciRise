// LoginPage.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { loginUser } from '../../scripts/API_endPoint/auth/auth.service';
import type { LoginRequest } from '../../scripts/API_endPoint/auth/auth_types';

const LoginPage: React.FC = () => {
  // --- Стейт (Логіка залишається без змін) ---
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
      identifier: username,
      password: password
    };

    try {
      await loginUser(payload);
      console.log('Login successful');
      // Тут пізніше буде редірект, наприклад: navigate('/workspace');
      alert('Login successful! Redirecting...'); 
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- Стилі (спільні класи для інпутів) ---
  const inputClasses = "block w-full px-4 py-3 rounded-xl border border-gray-200 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 sm:text-sm bg-gray-50/50 focus:bg-white";
  const labelClasses = "block text-sm font-medium text-gray-700 mb-1.5";

  return (
    <div className="min-h-screen flex font-sans bg-white">
      
      {/* --- ЛІВА ЧАСТИНА (Форма) - 50% --- */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center py-12 px-6 lg:px-20 xl:px-24 z-10 relative bg-white">
        <div className="mx-auto w-full max-w-md">
          
          {/* --- 1. Кнопка "Back to Home" --- */}
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-purple-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
              Back to Home
            </Link>
          </div>

          {/* Заголовок */}
          <div className="mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
              Welcome back
            </h2>
            <p className="mt-3 text-base text-gray-600">
              Please enter your details to sign in.
            </p>
          </div>

          {/* Відображення помилки */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg text-sm animate-pulse">
              <p className="font-bold">Error</p>
              {error}
            </div>
          )}

          {/* Форма */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className={labelClasses}>User Name or Email</label>
              <input
                id="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={inputClasses}
                placeholder="Enter your user name or email"
              />
            </div>

            <div>
              <label htmlFor="password" className={labelClasses}>Password</label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClasses}
                placeholder="••••••••"
              />
            </div>

            {/* Remember Me та Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded transition-colors"
                />
                <span className="ml-2 text-sm text-gray-700">Remember me</span>
              </label>

              <Link to="/forgot-password" className="text-sm font-medium text-purple-600 hover:text-purple-500 transition-colors">
                Forgot password?
              </Link>
            </div>

            {/* Login Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-purple-500/30 text-base font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 transform ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5 hover:shadow-xl'}`}
              >
                {loading ? 'Logging in...' : 'Sign in'}
              </button>
            </div>
          </form>

           {/* --- 2. Розділювач та Google кнопка --- */}
           <div className="relative mt-8">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-gray-500 font-medium">Or continue with</span>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 py-3.5 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all"
            >
               {/* Офіційний SVG логотип Google */}
               <svg className="h-5 w-5" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                <g transform="matrix(1, 0, 0, 1, 27.009001, -39.23856)">
                  <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.844 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                  <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.844 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                  <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.734 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                  <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.424 44.599 -10.174 45.789 L -6.774 42.389 C -8.804 40.499 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                </g>
             </svg>
               Sign in with Google
            </button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-purple-600 hover:text-purple-500 transition-colors">
                Sign up now
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* --- ПРАВА ЧАСТИНА (Картинка) - 50% --- */}
      <div className="hidden lg:block relative w-1/2 bg-gray-900">
        <div className="absolute inset-0 w-full h-full overflow-hidden">
            {/* Оверлеї для ефекту */}
            <div className="absolute inset-0 bg-purple-900/40 mix-blend-multiply z-10"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
            
            {/* 3. Нова картинка (Робот/AI) */}
            <img
            className="w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1535378917042-10a22c95931a?q=80&w=1974&auto=format&fit=crop"
            alt="Futuristic AI robot"
            />
        </div>

        {/* Декоративний розділювач */}
        <div className="absolute top-0 bottom-0 left-0 w-8 sm:w-12 bg-white rounded-r-[3rem] z-20 transform -translate-x-1/2"></div>
        
        {/* Текст на картинці */}
        <div className="absolute bottom-0 left-0 z-30 p-16 md:p-24 text-white">
            <h3 className="text-4xl font-bold mb-6 leading-tight drop-shadow-lg">Welcome back to<br/>the future.</h3>
            <p className="text-purple-100 text-lg opacity-90 max-w-md leading-relaxed drop-shadow-md">
                Sign in to access your personalized AI workspace and continue where you left off.
            </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;