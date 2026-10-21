
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const AdminLayout = ({ children }) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(path);
  };

  const menu = [
    { path: "/admin", label: "Dashboard", icon: "📊" },
    { path: "/admin/hero", label: "Hero", icon: "🏠" },
    { path: "/admin/about", label: "About", icon: "👤" },
    { path: "/admin/projects", label: "Projects", icon: "💼" },
    { path: "/admin/skills", label: "Skills", icon: "⚡" },
    { path: "/admin/experience", label: "Experience", icon: "📈" },
    { path: "/admin/education", label: "Education", icon: "🎓" },
    { path: "/admin/socials", label: "Social Links", icon: "🔗" },
    { path: "/admin/messages", label: "Messages", icon: "💬" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("token");
    navigate("/admin/login", { replace: true });
  };

  const closeMobileSidebar = () => {
    setMobileSidebarOpen(false);
  };

  const currentPage =
    menu.find((item) => isActive(item.path))?.label || "Dashboard";

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Mobile Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#0a0a0a] text-white flex flex-col transition-transform duration-300
          ${
            mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }
          ${
            desktopSidebarOpen
              ? "lg:translate-x-0"
              : "lg:-translate-x-full"
          }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-white/10 shrink-0">
          <Link
            to="/admin"
            onClick={closeMobileSidebar}
            className="flex items-center gap-3"
          >
            <div className="w-9 h-9 shrink-0 bg-white text-black rounded-lg flex items-center justify-center font-black text-sm">
              MZ
            </div>

            <span className="font-bold text-sm">Admin Panel</span>
          </Link>

          {/* Close Button: Mobile Only */}
          <button
            type="button"
            onClick={closeMobileSidebar}
            aria-label="Close sidebar"
            className="lg:hidden w-9 h-9 bg-white/10 hover:bg-white hover:text-black rounded-lg flex items-center justify-center transition"
          >
            ✕
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          {menu.map((item) => {
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeMobileSidebar}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                  active
                    ? "bg-white text-black font-bold shadow-lg"
                    : "text-white/65 hover:text-white hover:bg-white/10"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10 space-y-2 shrink-0">
          <Link
            to="/"
            onClick={closeMobileSidebar}
            className="flex items-center gap-3 px-4 py-3 text-sm text-white/65 hover:text-white hover:bg-white/10 rounded-xl transition"
          >
            <span>🌐</span>
            <span>View Website</span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[#1f1515] text-[#ff6b6b] hover:bg-red-500 hover:text-white text-sm font-bold transition"
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`min-h-screen flex flex-col transition-[margin] duration-300 ${
          desktopSidebarOpen ? "lg:ml-72" : "lg:ml-0"
        }`}
      >
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile Sidebar Button */}
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              aria-label="Open sidebar"
              className="lg:hidden w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center hover:bg-zinc-800 active:scale-95 transition"
            >
              ☰
            </button>

            {/* Desktop Sidebar Show/Hide Button */}
            <button
              type="button"
              onClick={() =>
                setDesktopSidebarOpen((previous) => !previous)
              }
              aria-label={
                desktopSidebarOpen ? "Hide sidebar" : "Show sidebar"
              }
              className="hidden lg:flex w-10 h-10 bg-black text-white rounded-xl items-center justify-center hover:bg-zinc-800 active:scale-95 transition"
            >
              ☰
            </button>

            <h1 className="font-bold text-slate-900 text-sm sm:text-base">
              {currentPage}
            </h1>
          </div>

          {/* Admin Profile */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-black text-white rounded-full flex items-center justify-center text-xs font-bold">
              MZ
            </div>

            <span className="hidden sm:block text-sm font-medium text-slate-700">
              Zeeshan
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
