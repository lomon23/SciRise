import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// ✅ ВИПРАВЛЕНО: Розділяємо імпорт компонента і типу
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import zxcvbn from 'zxcvbn';
import { registerUser } from '../../scripts/API_endPoint/auth/auth.service';
import type { RegisterRequest } from '../../scripts/API_endPoint/auth/auth_types';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  // Стейт полів форми
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Стейт сили пароля (0-4)
  const [passwordScore, setPasswordScore] = useState(0);

  // Стейт UI
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // --- ЛОГІКА ПАРОЛЯ ---
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);
    if (val) {
      const result = zxcvbn(val);
      setPasswordScore(result.score);
    } else {
      setPasswordScore(0);
    }
  };

  // Хелпер для кольорів смужки пароля
  const getStrengthStyles = () => {
    switch (passwordScore) {
      case 0: return { color: 'bg-gray-200', width: '10%', label: 'Very Weak', text: 'text-gray-400' };
      case 1: return { color: 'bg-red-500', width: '25%', label: 'Weak', text: 'text-red-500' };
      case 2: return { color: 'bg-yellow-500', width: '50%', label: 'Fair', text: 'text-yellow-500' };
      case 3: return { color: 'bg-blue-500', width: '75%', label: 'Good', text: 'text-blue-500' };
      case 4: return { color: 'bg-green-500', width: '100%', label: 'Strong', text: 'text-green-500' };
      default: return { color: 'bg-gray-200', width: '0%', label: '', text: '' };
    }
  };
  const strength = getStrengthStyles();

  // --- ЛОГІКА GOOGLE ---
  const handleGoogleSuccess = async (response: CredentialResponse) => {
    try {
      if (!response.credential) {
        setError("No credential received from Google");
        return;
      }

      // Відправляємо токен на бекенд
      const res = await fetch('http://localhost:8000/api/auth/google/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: response.credential }),
      });

      if (res.ok) {
        navigate('/workspace'); // Успіх -> впускаємо
      } else {
        const data = await res.json();
        setError(data.error || 'Google registration failed');
      }
    } catch (err) {
      console.error(err);
      setError('Connection error during Google login');
    }
  };

  // --- ЛОГІКА ЗВИЧАЙНОЇ РЕЄСТРАЦІЇ ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Валідація
    if (passwordScore < 2) {
      setError("Password is too weak. Please include numbers/symbols.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);

    const payload: RegisterRequest = {
      username: email, // Використовуємо email як username для старту
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password
    };

    try {
      await registerUser(payload);
      // Після успішної реєстрації можна відразу перекинути на логін
      navigate('/login'); 
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // Styles
  const inputClasses = "block w-full px-4 py-3 rounded-xl border border-gray-200 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 sm:text-sm bg-gray-50/50 focus:bg-white";
  const labelClasses = "block text-sm font-medium text-gray-700 mb-1.5";

  return (
    <div className="min-h-screen flex font-sans bg-white">
      
      {/* ЛІВА ЧАСТИНА (ФОРМА) */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center py-12 px-6 lg:px-20 xl:px-24 z-10 relative bg-white">
        <div className="mx-auto w-full max-w-md">
          
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-purple-600 transition-colors">
              Back to Home
            </Link>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Create account</h2>
            <p className="mt-3 text-base text-gray-600">Start your journey with SkiRise today.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg text-sm">
              <p className="font-bold">Error</p> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className={labelClasses}>First Name</label>
                <input type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)} className={inputClasses} placeholder="John" />
              </div>
              <div className="flex-1">
                <label className={labelClasses}>Last Name</label>
                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className={inputClasses} placeholder="Doe" />
              </div>
            </div>

            <div>
              <label className={labelClasses}>Email Address</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputClasses} placeholder="john@example.com" />
            </div>

            {/* ПАРОЛЬ + ІНДИКАТОР */}
            <div>
              <label className={labelClasses}>Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={handlePasswordChange}
                className={inputClasses}
                placeholder="••••••••"
              />
              {/* Смужка сили пароля */}
              {password && (
                <div className="mt-2 transition-all duration-300">
                  <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${strength.color} transition-all duration-500 ease-out`} 
                      style={{ width: strength.width }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className={`text-xs font-medium ${strength.text}`}>
                      Strength: {strength.label}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className={labelClasses}>Confirm Password</label>
              <input type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputClasses} placeholder="••••••••" />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3.5 px-4 rounded-xl shadow-lg text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition-all font-bold ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5 hover:shadow-xl'}`}
              >
                {loading ? 'Creating Account...' : 'Register'}
              </button>
            </div>
          </form>
          
          {/* РОЗДІЛЮВАЧ */}
          <div className="relative mt-8 mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
            <div className="relative flex justify-center text-sm"><span className="px-3 bg-white text-gray-500 font-medium">Or sign up with</span></div>
          </div>

          {/* КНОПКА GOOGLE */}
          <div className="flex justify-center w-full">
            <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError('Google Signup Failed')}
                theme="outline"
                size="large"
                width="400"
                text="signup_with"
                shape="pill"
            />
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-purple-600 hover:text-purple-500 transition-colors">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* ПРАВА ЧАСТИНА (КАРТИНКА) */}
      <div className="hidden lg:block relative w-1/2 bg-gray-900">
        <div className="absolute inset-0 w-full h-full overflow-hidden">
            <div className="absolute inset-0 bg-purple-900/30 mix-blend-multiply z-10"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10"></div>
            <img className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2065&auto=format&fit=crop" alt="Abstract AI" />
        </div>
        <div className="absolute bottom-0 left-0 z-30 p-16 md:p-24 text-white">
            <h3 className="text-4xl font-bold mb-6 leading-tight drop-shadow-lg">Welcome to the<br/>future of learning.</h3>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;