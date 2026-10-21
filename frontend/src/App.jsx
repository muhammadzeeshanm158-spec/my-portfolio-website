import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { enableProtection } from './utils/protection';

// ========= PUBLIC LAYOUT =========
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import AnimatedIntro from "./components/AnimatedIntro";

// ========= PUBLIC SECTIONS =========
import Hero from "./components/sections/Hero";
import About from "./components/sections/About";
import Projects from "./components/sections/Projects";
import Skills from "./components/sections/Skills";
import Experience from "./components/sections/Experience";
import Education from "./components/sections/Education"; // ✅ 1. IMPORT ADD KARO
import Contact from "./components/sections/Contact";
import SocialLinks from "./components/sections/SocialLinks";

import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Login from "./pages/admin/Login";
import AdminProjects from "./pages/admin/AdminProjects";
import AdminSkills from "./pages/admin/AdminSkills";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminExperience from "./pages/admin/AdminExperience";
import AdminAbout from "./pages/admin/AdminAbout";
import AdminHero from "./pages/admin/AdminHero";
import AdminEducation from "./pages/admin/AdminEducation";
import AdminSocial from "./pages/admin/AdminSocial";

const FullHome = () => (
  <>
    <Hero />
    <About />
    <Projects />
    <Skills />
    <Experience />
    <Education /> {/* ✅ Home pe bhi dikhega */}
    <SocialLinks />
    <Contact />
  </>
);

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
};

// ✅ YE TUMHARA SECRET GUARD HAI - Sirf tum access karoge
const ProtectedRoute = ({ children }) => {
  // ✅ FIX: Tum Login me "token" aur "isAdmin" save kar rahe ho, adminToken nahi!
  const token = localStorage.getItem('token');
  const isAdmin = localStorage.getItem('isAdmin');
  if (!token || isAdmin !== 'true') {
    // ✅ Token nahi to seedha login pe bhejo (secret login pe)
    return <Navigate to="/zp-secret-2026/login" replace />;
  }
  return children;
};

// ✅ Public ke liye 404 page
const NotFoundPage = () => (
  <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
    <h1 className="text-6xl sm:text-8xl font-extrabold text-gray-100">404</h1>
    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-4">Page Not Found</h2>
    <p className="text-gray-500 mt-2">The page you're looking for doesn't exist.</p>
    <a href="/" className="mt-6 bg-gray-900 text-white px-6 py-3 rounded-full text-sm font-medium">Go Home</a>
  </div>
);

const AppContent = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/zp-secret-2026') || location.pathname.startsWith('/admin');
  const [dismissedLocationKey, setDismissedLocationKey] = useState(null);
  const showIntro =!isAdmin && dismissedLocationKey!== location.key;

  useEffect(() => {
    if (import.meta.env.PROD) enableProtection();
  }, []);

  const handleIntroFinish = () => setDismissedLocationKey(location.key);

  return (
    <>
      <ScrollToTop />
      {showIntro &&!isAdmin && <AnimatedIntro onFinish={handleIntroFinish} />}
      <Routes>
        {/* PUBLIC - Ye sab public dekhega */}
        <Route path="/" element={<><Header /><FullHome /><Footer /></>} />
        <Route path="/about" element={<><Header /><About /><Footer /></>} />
        <Route path="/projects" element={<><Header /><Projects /><Footer /></>} />
        <Route path="/skills" element={<><Header /><Skills /><Footer /></>} />
        <Route path="/education" element={<><Header /><Education /><Footer /></>} />
        <Route path="/experience" element={<><Header /><Experience /><Footer /></>} />
        <Route path="/socials" element={<><Header /><SocialLinks /><Footer /></>} />
        <Route path="/contact" element={<><Header /><Contact /><Footer /></>} />

        {/* ✅ ADMIN - AB DONO URL CHALENGE - zp-secret-2026 AUR admin */}
        <Route path="/zp-secret-2026/login" element={<Login />} />
        <Route path="/admin/login" element={<Login />} />
        
        <Route path="/zp-secret-2026" element={<ProtectedRoute><AdminLayout><Dashboard /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><AdminLayout><Dashboard /></AdminLayout></ProtectedRoute>} />

        <Route path="/zp-secret-2026/hero" element={<ProtectedRoute><AdminLayout><AdminHero /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/hero" element={<ProtectedRoute><AdminLayout><AdminHero /></AdminLayout></ProtectedRoute>} />

        <Route path="/zp-secret-2026/about" element={<ProtectedRoute><AdminLayout><AdminAbout /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/about" element={<ProtectedRoute><AdminLayout><AdminAbout /></AdminLayout></ProtectedRoute>} />

        <Route path="/zp-secret-2026/projects" element={<ProtectedRoute><AdminLayout><AdminProjects /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/projects" element={<ProtectedRoute><AdminLayout><AdminProjects /></AdminLayout></ProtectedRoute>} />

        <Route path="/zp-secret-2026/skills" element={<ProtectedRoute><AdminLayout><AdminSkills /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/skills" element={<ProtectedRoute><AdminLayout><AdminSkills /></AdminLayout></ProtectedRoute>} />

        <Route path="/zp-secret-2026/experience" element={<ProtectedRoute><AdminLayout><AdminExperience /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/experience" element={<ProtectedRoute><AdminLayout><AdminExperience /></AdminLayout></ProtectedRoute>} />

        <Route path="/zp-secret-2026/education" element={<ProtectedRoute><AdminLayout><AdminEducation /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/education" element={<ProtectedRoute><AdminLayout><AdminEducation /></AdminLayout></ProtectedRoute>} />

        <Route path="/zp-secret-2026/socials" element={<ProtectedRoute><AdminLayout><AdminSocial /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/socials" element={<ProtectedRoute><AdminLayout><AdminSocial /></AdminLayout></ProtectedRoute>} />

        <Route path="/zp-secret-2026/messages" element={<ProtectedRoute><AdminLayout><AdminMessages /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/messages" element={<ProtectedRoute><AdminLayout><AdminMessages /></AdminLayout></ProtectedRoute>} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;