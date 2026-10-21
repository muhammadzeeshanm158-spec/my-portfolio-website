import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const AdminSidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();

  function isActive(path) {
    // ✅ FIX: Ab /zp-secret-2026 se check karega, /admin se nahi!
    if (path === "/zp-secret-2026") return location.pathname === "/zp-secret-2026";
    return location.pathname.startsWith(path);
  }

  const menu = [
    // ✅ FIX: Saare paths /zp-secret-2026 kar diye - ab 404 nahi ayega!
    { name: "Dashboard", path: "/zp-secret-2026", icon: "📊" },
    { name: "Hero", path: "/zp-secret-2026/hero", icon: "🏠" },
    { name: "About", path: "/zp-secret-2026/about", icon: "👤" },
    { name: "Projects", path: "/zp-secret-2026/projects", icon: "💼" },
    { name: "Skills", path: "/zp-secret-2026/skills", icon: "⚡" },
    { name: "Experience", path: "/zp-secret-2026/experience", icon: "📈" },
    { name: "Education", path: "/zp-secret-2026/education", icon: "🎓" },
    { name: "Social Links", path: "/zp-secret-2026/socials", icon: "🔗" },
    { name: "Messages", path: "/zp-secret-2026/messages", icon: "💬" }
  ];

  function handleLogout() {
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('token');
    // ✅ FIX: Logout ke baad secret login pe jayega
    navigate('/zp-secret-2026/login');
  }

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-72 bg-[#111111] text-white flex flex-col z-50 transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen? "translate-x-0" : "-translate-x-full"}`}>

        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white text-black rounded-lg flex items-center justify-center font-black text-sm">MZ</div>
            <div>
              <h2 className="text- font-bold leading-none">Admin Panel</h2>
              <p className="text- text-white/50 mt-1">Dynamic Portfolio</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="lg:hidden w-8 h-8 bg-white/10 hover:bg-white hover:text-black rounded-lg flex items-center justify-center transition-all">✕</button>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {menu.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => window.innerWidth < 1024 && setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[13.5px] font-medium transition-all ${active? "bg-white text-black font-bold" : "text-white/60 hover:text-white hover:bg-white/10"}`}
              >
                <span className="text-">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 shrink-0 space-y-3">
          <Link to="/" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text- text-white/60 hover:text-white hover:bg-white/10 transition">
            <span>🌐</span> View Website
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 bg-[#2a1515] text-[#ff5a5a] hover:bg-red-500 hover:text-white py-3 rounded-xl text- font-bold transition">
            <span>↪</span> Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;