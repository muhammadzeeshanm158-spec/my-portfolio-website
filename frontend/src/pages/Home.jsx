import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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

const AppContent = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
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
        {/* PUBLIC */}
        <Route path="/" element={<><Header /><FullHome /><Footer /></>} />
        <Route path="/about" element={<><Header /><About /><Footer /></>} />
        <Route path="/projects" element={<><Header /><Projects /><Footer /></>} />
        <Route path="/skills" element={<><Header /><Skills /><Footer /></>} />
        <Route path="/education" element={<><Header /><Education /><Footer /></>} /> {/* ✅ 2. YE ROUTE ADD KARO - ISKI WAJAH SE 404 AA RAHA THA */}
        <Route path="/experience" element={<><Header /><Experience /><Footer /></>} />
        <Route path="/socials" element={<><Header /><SocialLinks /><Footer /></>} />
        <Route path="/contact" element={<><Header /><Contact /><Footer /></>} />

        {/* ADMIN */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<AdminLayout><Dashboard /></AdminLayout>} />
        <Route path="/admin/hero" element={<AdminLayout><AdminHero /></AdminLayout>} />
        <Route path="/admin/about" element={<AdminLayout><AdminAbout /></AdminLayout>} />
        <Route path="/admin/projects" element={<AdminLayout><AdminProjects /></AdminLayout>} />
        <Route path="/admin/skills" element={<AdminLayout><AdminSkills /></AdminLayout>} />
        <Route path="/admin/experience" element={<AdminLayout><AdminExperience /></AdminLayout>} />
        <Route path="/admin/education" element={<AdminLayout><AdminEducation /></AdminLayout>} />
        <Route path="/admin/socials" element={<AdminLayout><AdminSocial /></AdminLayout>} />
        <Route path="/admin/messages" element={<AdminLayout><AdminMessages /></AdminLayout>} />

        <Route path="*" element={
          <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
            <h1 className="text-6xl sm:text-8xl font-extrabold text-gray-100">404</h1>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-4">Page Not Found</h2>
            <p className="text-gray-500 mt-2">The page you're looking for doesn't exist.</p>
            <a href="/" className="mt-6 bg-gray-900 text-white px-6 py-3 rounded-full text-sm font-medium">Go Home</a>
          </div>
        } />
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