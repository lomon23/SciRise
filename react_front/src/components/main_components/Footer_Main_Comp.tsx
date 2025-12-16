import React from 'react';
import { Link } from 'react-router-dom';

const FooterMainComp: React.FC = () => {
  // Спільний клас для посилань
  const linkClass = "text-gray-600 hover:text-[#6646b3] transition-colors cursor-pointer text-[15px]";
  // Клас для заголовків колонок
  const titleClass = "font-bold text-gray-900 text-lg mb-4";

  return (
    <footer className="w-full bg-white border-t border-gray-200 px-6 py-12 md:px-16 font-sans">
      <div className="flex flex-col lg:flex-row justify-between gap-12">
        
        {/* --- Ліва частина: Бренд, Соцмережі, Мова --- */}
        <div className="flex flex-col gap-6 max-w-xs">
          {/* Логотип */}
          <h3 className="text-3xl font-medium text-black">SkiRise</h3>
          
          {/* Соцмережі (SVG іконки) */}
          <div className="flex gap-4 text-gray-500">
            {/* Instagram */}
            <a href="#" className="hover:text-[#6646b3] transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg></a>
            {/* Facebook */}
            <a href="#" className="hover:text-[#6646b3] transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg></a>
            {/* WhatsApp */}
            <a href="#" className="hover:text-[#6646b3] transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg></a>
            {/* LinkedIn */}
            <a href="#" className="hover:text-[#6646b3] transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg></a>
            {/* GitHub */}
            <a href="#" className="hover:text-[#6646b3] transition-colors"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg></a>
          </div>

          {/* Кнопка мови */}
          <div>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 8 6 6"></path><path d="m4 14 6-6 2-3"></path><path d="M2 5h12"></path><path d="M7 2h1"></path><path d="m22 22-5-10-5 10"></path><path d="M14 18h6"></path></svg>
              English (US)
            </button>
          </div>
        </div>

        {/* --- Права частина: Посилання --- */}
        <div className="flex flex-wrap gap-12 sm:gap-24">
          
          {/* Колонка 1: Company */}
          <div className="flex flex-col">
            <h4 className={titleClass}>Company</h4>
            <ul className="flex flex-col gap-3">
              <li className={linkClass}>About us</li>
              <li className={linkClass}>Careers</li>
              <li className={linkClass}>Security</li>
              <li className={linkClass}>Status</li>
              <li className={linkClass}>Terms & privacy</li>
              <li className={linkClass}>Your privacy rights</li>
            </ul>
          </div>

          {/* Колонка 2: Download */}
          <div className="flex flex-col">
            <h4 className={titleClass}>Download</h4>
            <ul className="flex flex-col gap-3">
              <li className={linkClass}>Android</li>
              <li className={linkClass}>Windows</li>
              <li className={linkClass}>Calendar</li>
            </ul>
          </div>

          {/* Колонка 3: SkiRise for + Explore more */}
          <div className="flex flex-col">
            <h4 className={titleClass}>SkiRise for</h4>
            <ul className="flex flex-col gap-3 mb-6">
              <li className={linkClass}>Admin</li>
              <li className={linkClass}>Teacher</li>
              <li className={linkClass}>Student</li>
            </ul>
            
            <Link to="/explore" className="flex items-center gap-1 font-medium text-black hover:text-[#6646b3] transition-colors mt-auto">
              Explore more 
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterMainComp;