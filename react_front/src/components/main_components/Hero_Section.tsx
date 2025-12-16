import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <section className="relative w-full pt-40 pb-20 px-6 overflow-hidden bg-white font-sans isolate min-h-screen flex flex-col items-center">
      
      {/* --- ЖИВИЙ ФОН (Lava Lamp Effect) --- */}
      
      {/* Пляма 1: Фіолетова (ліворуч) */}
      <div 
        className="absolute top-0 -left-4 w-[60vw] h-[60vw] bg-purple-300 rounded-full blur-[100px] opacity-20 mix-blend-multiply filter animate-blob"
        style={{ animationDelay: '0s' }} // Починає одразу
      ></div>
      
      {/* Пляма 2: Бузкова (праворуч) */}
      <div 
        className="absolute top-0 -right-4 w-[60vw] h-[60vw] bg-violet-300 rounded-full blur-[100px] opacity-20 mix-blend-multiply filter animate-blob"
        style={{ animationDelay: '2s' }} // Затримка 2 секунди
      ></div>

      {/* Пляма 3: Рожева (знизу) */}
      <div 
        className="absolute -bottom-32 left-20 w-[60vw] h-[60vw] bg-pink-200 rounded-full blur-[100px] opacity-20 mix-blend-multiply filter animate-blob"
        style={{ animationDelay: '4s' }} // Затримка 4 секунди
      ></div>


      <div className="relative flex flex-col items-center text-center max-w-[1200px] mx-auto z-10">
        
        {/* --- Бейджик --- */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 border border-purple-100 text-[#6646b3] text-sm font-semibold mb-10 hover:bg-white transition-colors cursor-pointer shadow-sm backdrop-blur-sm">
          <span className="px-2 py-0.5 rounded-md bg-[#6646b3] text-white text-[11px] uppercase font-bold tracking-wide">New</span>
          <span>SkiRise 2.0 is mostly available now</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
        </div>

        {/* --- Заголовок --- */}
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-[#0a0a0a] tracking-tight leading-[1.05] mb-8 drop-shadow-sm">
          One workspace. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6646b3] via-purple-500 to-indigo-500">
            Zero busywork.
          </span>
        </h1>
        
        {/* --- Підзаголовок --- */}
        <p className="text-xl md:text-2xl text-gray-600 max-w-3xl leading-relaxed mb-12 font-medium">
          SkiRise is where your teams and AI agents capture knowledge, find answers, and automate projects. Now a team of 7 feels like 70.
        </p>

        {/* --- Кнопки --- */}
        <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto mb-20">
          <button className="px-10 py-5 bg-[#6646b3] text-white text-[18px] font-bold rounded-2xl shadow-xl shadow-purple-200 hover:bg-[#543a99] hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
            Get SkiRise free
          </button>
          
          <button className="px-10 py-5 bg-white text-gray-800 text-[18px] font-bold rounded-2xl border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 shadow-sm">
            Request a demo
          </button>
        </div>

        {/* --- Картинка (Glass Effect) --- */}
        <div className="w-full relative group">
           <div className="absolute -inset-4 bg-gradient-to-r from-purple-100 via-pink-100 to-indigo-100 rounded-[30px] blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
           
           <div className="relative aspect-[16/9] bg-white/40 backdrop-blur-md rounded-2xl border border-white/50 shadow-2xl overflow-hidden flex items-center justify-center">
             <div className="flex flex-col items-center gap-4 opacity-40">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-purple-50 to-white flex items-center justify-center shadow-inner">
                   <svg className="w-10 h-10 text-[#6646b3]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                </div>
                <span className="text-gray-500 font-semibold text-lg">Dashboard Interface Preview</span>
             </div>
           </div>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;