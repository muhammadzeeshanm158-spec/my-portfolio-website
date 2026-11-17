import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// ========= PUBLIC LAYOUT =========
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

// ========= PUBLIC SECTIONS =========
import Hero from "./components/sections/Hero";
import About from "./components/sections/About";
import Projects from "./components/sections/Projects";
import Skills from "./components/sections/Skills";
import Experience from "./components/sections/Experience";
import Education from "./components/sections/Education";
import Contact from "./components/sections/Contact";
import SocialLinks from "./components/sections/SocialLinks";

const FullHome = () => (
  <>
    <Hero />
    <About />
    <Projects />
    <Skills />
    <Experience />
    <Education />
    <SocialLinks />
    <Contact />
  </>
);

// ✅ Public ke liye 404 page
const NotFoundPage = () => (
  <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
    <h1 className="text-6xl sm:text-8xl font-extrabold text-gray-100">404</h1>
    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-4">Page Not Found</h2>
    <p className="text-gray-500 mt-2">The page you're looking for doesn't exist.</p>
    <a href="/" className="mt-6 bg-gray-900 text-white px-6 py-3 rounded-full text-sm font-medium">Go Home</a>
  </div>
);

function App() {
  return (
    <Router>
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
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;