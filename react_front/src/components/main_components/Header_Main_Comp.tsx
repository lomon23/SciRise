import React from 'react';
import { Link } from 'react-router-dom';

const HeaderMainComp: React.FC = () => {
  return (
    // fixed - щоб хедер завжди був зверху
    // bg-white/60 - напівпрозорий білий
    // backdrop-blur-xl - ефект матового скла
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-8 py-4 border-b border-white/40 bg-white/60 backdrop-blur-xl font-sans transition-all duration-300">
      
      {/* Логотип */}
      <div className="flex items-center">
        <Link to="/" className="text-gray-900 hover:text-[#6646b3] transition-colors p-2">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
        </Link>
      </div>

      {/* Меню (Збільшив шрифт до text-base) */}
      <nav className="hidden lg:block">
        <ul className="flex items-center gap-10 list-none m-0 p-0 text-[16px] font-medium text-gray-700">
          <li className="cursor-pointer hover:text-[#6646b3] transition-colors">Notion</li>
          <li className="cursor-pointer hover:text-[#6646b3] transition-colors">Mail</li>
          <li className="cursor-pointer hover:text-[#6646b3] transition-colors">Calendar</li>
          <li className="cursor-pointer hover:text-[#6646b3] transition-colors">AI</li>
          <li className="cursor-pointer hover:text-[#6646b3] transition-colors">Enterprise</li>
          <li className="cursor-pointer hover:text-[#6646b3] transition-colors">Pricing</li>
          <li className="cursor-pointer hover:text-[#6646b3] transition-colors">Explore</li>
          <li>
            <Link to="/workspace" className="text-gray-900 hover:text-[#6646b3] transition-colors">
              Request a demo
            </Link>
          </li>
        </ul>
      </nav>

      {/* Кнопки (Трохи масивніші) */}
      <div className="flex items-center gap-4">
        <Link to="/login">
          <button className="h-11 px-6 flex items-center justify-center text-[15px] font-semibold text-gray-800 hover:bg-white/50 rounded-xl border border-transparent hover:border-gray-200 transition-all">
            Log in
          </button>
        </Link>
        
        <Link to="/register">
          <button className="h-11 px-6 flex items-center justify-center text-[15px] font-semibold text-white bg-[#6646b3] hover:bg-[#543a99] rounded-xl shadow-lg shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95">
            Get SkiRise free
          </button>
        </Link>
      </div>
    </header>
  );
};

export default HeaderMainComp;