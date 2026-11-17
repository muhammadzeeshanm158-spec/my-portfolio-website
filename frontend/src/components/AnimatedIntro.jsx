import React, { useEffect, useState } from 'react';

const AnimatedIntro = ({ onFinish = () => {} }) => {
  const [hide, setHide] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => (prev >= 100? 100 : prev + 2));
    }, 30);

    const timer = setTimeout(() => {
      setHide(true);
      setTimeout(() => {
        if (typeof onFinish === 'function') {
          onFinish();
        }
      }, 600);
    }, 2500);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [onFinish]);

  return (
    <div className={`fixed inset-0 z-9999 bg-[#0a0a0a] flex flex-col items-center justify-center transition-all duration-700 ease-in-out ${hide? 'opacity-0 scale-110 pointer-events-none' : 'opacity-100 scale-100'}`}>

      {/* Logo */}
      <div className="relative">
        <div className="absolute inset-0 bg-white/10 blur- rounded-full animate-pulse"></div>
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 bg-white text-black rounded-3xl flex items-center justify-center font-extrabold text-3xl sm:text-4xl shadow-2xl animate-[logoPop_1s_ease-out]">
          MZ
        </div>
        <div className="absolute -inset-4 border border-white/10 rounded- animate-[spin_3s_linear_infinite]"></div>
        <div className="absolute -inset-8 border border-white/5 rounded-[2.5rem] animate-[spin_4s_linear_infinite_reverse]"></div>
      </div>

      {/* Name */}
      <div className="mt-8 sm:mt-10 text-center overflow-hidden">
        <h1 className="text-white font-bold text-xl sm:text-2xl tracking-tight animate-[slideUp_0.8s_0.3s_both]">
          Muhammad Zeeshan
        </h1>
        <p className="text-white/50 text-xs sm:text-sm mt-2 tracking-[0.2em] uppercase animate-[slideUp_0.8s_0.5s_both]">
          MERN Developer • Karachi
        </p>
      </div>

      {/* Progress Bar — FIXED */}
      <div className="absolute bottom-12 sm:bottom-16 left-1/2 -translate-x-1/2 w- sm:w-">
        <div className="h- bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-white transition-all duration-100 ease-out" style={{ width: `${progress}%` }}></div>
        </div>
        <p className="text-white/30 text- text-center mt-3 tracking-widest uppercase">
          {progress}% Loading
        </p>
      </div>

      <style>{`
        @keyframes logoPop { 0% { transform: scale(0.5) rotate(-15deg); opacity: 0; } 60% { transform: scale(1.1) rotate(5deg); opacity: 1; } 100% { transform: scale(1) rotate(0deg); opacity: 1; } }
        @keyframes slideUp { 0% { transform: translateY(30px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes spin_reverse { to { transform: rotate(-360deg); } }
      `}</style>
    </div>
  );
};

export default AnimatedIntro;