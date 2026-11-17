import React from 'react';

// ========= PUBLIC LAYOUT =========
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

// ========= PUBLIC SECTIONS =========
import Hero from "../components/sections/Hero";
import About from "../components/sections/About";
import Projects from "../components/sections/Projects";
import Skills from "../components/sections/Skills";
import Experience from "../components/sections/Experience";
import Education from "../components/sections/Education";
import Contact from "../components/sections/Contact";
import SocialLinks from "../components/sections/SocialLinks";

const Home = () => {
  return (
    <>
      <Header />
      <Hero />
      <About />
      <Projects />
      <Skills />
      <Experience />
      <Education />
      <SocialLinks />
      <Contact />
      <Footer />
    </>
  );
};

export default Home;