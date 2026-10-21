import React, { useState, useEffect } from "react";
import { FaCheckCircle, FaBriefcase, FaFolderOpen } from "react-icons/fa";
import api from "../../api/api";

const About = () => {
  const [about, setAbout] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
   .get("/about")
   .then((res) => {
        const raw = res.data?.data || res.data;
        const data = Array.isArray(raw)? raw[0] : raw;
        if (data) setAbout(data);
        setLoading(false);
      })
   .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section id="about" className="py-12 sm:py-20 bg-gray-50">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400 animate-pulse">Loading about information...</p>
        </div>
      </section>
    );
  }

  if (!about) {
    return (
      <section id="about" className="py-12 sm:py-20 bg-gray-50">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white border border-dashed rounded-2xl sm:rounded-[1.5rem] p-8 sm:p-12">
            <h3 className="font-bold text-base sm:text-lg">About Information Not Found</h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-2">Please add your information from Admin Panel</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="about" className="py-12 sm:py-16 lg:py-20 bg-gray-50 w-full overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-10 sm:gap-12 lg:gap-16 xl:gap-20">

          {/* LEFT CARD - Full width on mobile */}
          <div className="flex-1 w-full lg:max-w- order-2 lg:order-1">
            <div className="relative bg-white rounded-2xl sm:rounded-[1.5rem] p-4 sm:p-6 lg:p-8 shadow-sm border border-gray-100">
              <div className="bg-gray-900 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full blur-2xl"></div>
                <h3 className="text-xl sm:text-2xl font-bold relative z-10">MERN Stack Developer</h3>
                <p className="text-gray-400 mt-2 text-xs sm:text-sm relative z-10">Developer based in Karachi, Pakistan</p>
                <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4 relative z-10">
                  <div className="flex items-center gap-2 sm:gap-3"><FaCheckCircle className="text-green-400 shrink-0" /><span className="text-xs sm:text-sm">Clean & Modern Code</span></div>
                  <div className="flex items-center gap-2 sm:gap-3"><FaCheckCircle className="text-green-400 shrink-0" /><span className="text-xs sm:text-sm">Responsive Design</span></div>
                  <div className="flex items-center gap-2 sm:gap-3"><FaCheckCircle className="text-green-400 shrink-0" /><span className="text-xs sm:text-sm">Fast Performance</span></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-4 sm:mt-6">
                <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 text-center border">
                  <FaBriefcase className="mx-auto text-gray-900 mb-1.5 sm:mb-2" size={20} />
                  <h4 className="text-xl sm:text-2xl font-extrabold text-gray-900">{about.experience_years}+</h4>
                  <p className="text- sm:text-xs text-gray-500 mt-1">Years Experience</p>
                </div>
                <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 text-center border">
                  <FaFolderOpen className="mx-auto text-gray-900 mb-1.5 sm:mb-2" size={20} />
                  <h4 className="text-xl sm:text-2xl font-extrabold text-gray-900">{about.completed_projects}+</h4>
                  <p className="text- sm:text-xs text-gray-500 mt-1">Projects Completed</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT CONTENT - Center on mobile, left on desktop */}
          <div className="flex-1 w-full text-center lg:text-left order-1 lg:order-2">
            <span className="text- sm:text-sm font-bold text-gray-500 tracking-[0.2em] uppercase">Who I Am</span>
            <h2 className="text- sm:text-4xl lg:text-4xl xl:text- font-extrabold text-gray-900 mt-3 leading-[1.15] sm:leading-tight">
              {about.heading}
            </h2>
            <div className="w-16 sm:w-20 h-1 bg-gray-900 mt-4 rounded-full mx-auto lg:mx-0"></div>
            <p className="text-gray-500 leading-relaxed mt-5 sm:mt-6 text- sm:text-base max-w-2xl mx-auto lg:mx-0">
              {about.description}
            </p>
            <a href="#contact"
               className="inline-block mt-7 sm:mt-8 bg-gray-900 text-white px-7 sm:px-8 py-3 sm:py-3 rounded-full text-sm sm:text-base font-medium hover:bg-black transition-all hover:scale-105 active:scale-95 touch-manipulation">
              More About Me
            </a>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;