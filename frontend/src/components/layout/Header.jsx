import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  // ✅ FIX 1: Scroll pe header ko shadow dena
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ✅ FIX 2: Mobile menu open pe scroll lock
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [isMenuOpen]);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/projects', label: 'Projects' },
    { path: '/skills', label: 'Skills' },
    { path: '/education', label: 'Education' },
    { path: '/experience', label: 'Experience' },
    { path: '/contact', label: 'Contact' },
    { path: '/socials', label: 'Social' },
  ];

  return (
    <>
      {/* ✅ FIX 3: Header ko FIXED kiya - sticky ki jagah fixed */}
      <header className={`fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md border-b-2 transition-all duration-300 ${
        isScrolled ? 'border-gray-300 shadow-lg py-2' : 'border-gray-200 shadow-sm py-0'
      }`}>
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex justify-between items-center">

          {/* Logo */}
          <Link to="/" className="text-lg sm:text-xl lg:text-2xl font-extrabold tracking-tight shrink-0">
            <span className="bg-gray-900 text-white px-2.5 py-1 rounded-lg">MZ</span>
            <span className="text-gray-900 ml-2">Portfolio</span>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative font-medium py-2 text-sm group ${
                  isActive(link.path) ? 'text-black font-bold' : 'text-gray-600 hover:text-black'
                }`}
              >
                {link.label}
                <span
                  className={`absolute left-0 bottom-0 h-[2.5px] bg-black rounded-full transition-all duration-300 ${
                    isActive(link.path) ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-100'
                  }`}
                />
              </Link>
            ))}
          </nav>

          {/* Hire Me */}
          <div className="hidden lg:flex items-center">
            <Link
              to="/contact"
              className="bg-gray-900 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-black hover:scale-105 active:scale-95 transition-all border-2 border-gray-900"
            >
              Hire Me
            </Link>
          </div>

          {/* Mobile Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden text-gray-900 p-2 -mr-2 w-10 h-10 flex items-center justify-center border-2 border-gray-200 rounded-xl bg-white"
          >
            {isMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <>
            {/* ✅ FIX 4: top- bug fix kiya */}
            <div className="lg:hidden fixed inset-0 top- bg-black/20 backdrop-blur-sm z-40" onClick={() => setIsMenuOpen(false)} />
            <div className="lg:hidden absolute top-full left-0 w-full bg-white border-t-2 border-gray-200 px-4 py-6 flex flex-col gap-1 shadow-xl z-50 max-h-[calc(100vh-73px)] overflow-y-auto">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`py-3 px-3 rounded-xl text-base font-medium flex justify-between border-2 ${
                    isActive(link.path) ? 'bg-gray-900 text-white border-gray-900' : 'text-gray-700 hover:bg-gray-100 border-transparent'
                  }`}
                >
                  {link.label}
                  {isActive(link.path) && <span className="w-2 h-2 bg-white rounded-full mt-2"></span>}
                </Link>
              ))}
              <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="bg-gray-900 text-white px-6 py-3.5 rounded-full text-center mt-4 font-bold border-2 border-gray-900">
                Hire Me
              </Link>
            </div>
          </>
        )}
      </header>

      {/* ✅ FIX 5: Header fixed hai to content ko neeche karne ke liye spacer */}
      <div className="h- sm:h-"></div>
    </>
  );
};

export default Header;