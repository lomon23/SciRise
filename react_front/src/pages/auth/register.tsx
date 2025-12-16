// RegisterPage.tsx
import React, { useState } from 'react';
import { registerUser } from '../../scripts/API_endPoint/auth/auth.service';
import type { RegisterRequest } from '../../scripts/API_endPoint/auth/auth_types';
import { Link } from 'react-router-dom'; // Додав для посилання на логін

const RegisterPage: React.FC = () => {
  // --- Стейт (Логіка залишається незмінною) ---
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);

    const payload: RegisterRequest = {
      username: email,
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password
    };

    try {
      await registerUser(payload);
      setSuccess(true);
      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- Стилі ---
  // Спільні класи для інпутів (щоб не дублювати код)
  const inputClasses = "block w-full px-4 py-3 rounded-xl border border-gray-200 shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 sm:text-sm bg-gray-50/50 focus:bg-white";
  const labelClasses = "block text-sm font-medium text-gray-700 mb-1.5";

  return (
    <div className="min-h-screen flex font-sans bg-gray-50">
      
      {/* --- ЛІВА ЧАСТИНА (Форма) --- */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 bg-white relative z-10">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          
          {/* Заголовок */}
          <div>
            <h2 className="mt-6 text-4xl font-extrabold text-gray-900 tracking-tight">
              Create account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Start your journey with SkiRise today.
            </p>
          </div>

          <div className="mt-8">
            {/* Повідомлення про помилки/успіх */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg text-sm">
                <p className="font-medium">Error</p>
                {error}
              </div>
            )}
            {success && (
              <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-r-lg text-sm">
                <p className="font-medium">Success</p>
                Registration successful! Please login.
              </div>
            )}

            {/* Форма */}
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* First Name & Last Name в один ряд */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label htmlFor="firstName" className={labelClasses}>First Name</label>
                  <input
                    id="firstName"
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className={inputClasses}
                    placeholder="John"
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="lastName" className={labelClasses}>Last Name</label>
                  <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className={inputClasses}
                    placeholder="Doe"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className={labelClasses}>Email Address</label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClasses}
                  placeholder="john.doe@example.com"
                />
              </div>

              {/* Password */}
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

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className={labelClasses}>Confirm Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={inputClasses}
                  placeholder="••••••••"
                />
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-purple-200/50 text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98]'}`}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Processing...
                    </span>
                  ) : (
                    'Register'
                  )}
                </button>
              </div>
            </form>

            {/* Footer Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                {/* Заміни /login на свій шлях, якщо він інший */}
                <Link to="/login" className="font-medium text-purple-600 hover:text-purple-500 transition-colors">
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* --- ПРАВА ЧАСТИНА (Картинка) --- */}
      {/* hidden lg:block - ховається на мобільних, з'являється на великих екранах */}
      <div className="hidden lg:block relative flex-1 bg-purple-900">
        <div className="absolute inset-0 w-full h-full bg-purple-900/10 mix-blend-multiply z-10 rounded-l-[3rem] pointer-events-none"></div>
        <img
          className="absolute inset-0 w-full h-full object-cover rounded-l-[3rem]"
          // URL картинки з Unsplash (футуристичне навчання)
          src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Futuristic education"
        />
        {/* Текстовий оверлей на картинці (опціонально) */}
        <div className="absolute bottom-0 left-0 z-20 p-16 text-white max-w-lg">
            <h3 className="text-3xl font-bold mb-4">Welcome to the future of learning.</h3>
            <p className="text-purple-100 text-lg opacity-90">Join SkiRise and unlock your potential with AI-driven tools and collaborative workspaces.</p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;