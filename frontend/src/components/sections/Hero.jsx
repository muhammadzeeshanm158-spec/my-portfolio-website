
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";
import axios from "axios";

const Hero = () => {
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchHero = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/hero");

        const data = res.data?.data;
        const heroData = Array.isArray(data) ? data[0] : data;

        if (!cancelled) {
          setHero(heroData || null);
        }
      } catch (err) {
        console.error("Failed to fetch hero data:", err);

        if (!cancelled) {
          setHero(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchHero();

    return () => {
      cancelled = true;
    };
  }, []);

  // Data load hone tak kuch show nahi hoga
  if (loading || !hero) {
    return null;
  }

  // Sirf Admin Panel ka real data
  const title = hero.title?.trim() || "";
  const shortBio = hero.short_bio?.trim() || "";
  const roles = (hero.subtitle || "")
    .split(",")
    .map((role) => role.trim())
    .filter(Boolean);

  const profileImage = hero.profile_image_url?.trim() || "";
  const resumeUrl = hero.resume_url?.trim() || "";

  // Agar koi real content nahi hai to section hide rahega
  const hasContent =
    title || shortBio || roles.length > 0 || profileImage || resumeUrl;

  if (!hasContent) {
    return null;
  }

  return (
    <section
      id="home"
      className="min-h-screen flex items-center bg-[#f8fafc] px-5 sm:px-8 lg:px-20 py-20"
    >
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

        {/* Real Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={`text-center lg:text-left ${
            profileImage ? "order-2 lg:order-1" : "order-1"
          }`}
        >
          {title && (
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight tracking-tight text-slate-900 wrap-break-word">
              {title}
            </h1>
          )}

          {roles.length > 0 && (
            <h2 className="mt-4 text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black leading-tight bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              <Typewriter
                words={roles}
                loop
                cursor
                cursorStyle="|"
                typeSpeed={80}
                deleteSpeed={50}
                delaySpeed={1500}
              />
            </h2>
          )}

          {shortBio && (
            <p className="text-slate-600 text-sm sm:text-base mt-6 leading-relaxed max-w-xl mx-auto lg:mx-0">
              {shortBio}
            </p>
          )}

          {(title || shortBio || roles.length > 0) && (
            <div className="flex flex-wrap justify-center lg:justify-start gap-3 mt-8">
              <a
                href="#projects"
                className="px-6 py-3 rounded-full bg-black text-white text-sm font-bold hover:bg-slate-800 active:scale-95 transition"
              >
                View Projects
              </a>

              {resumeUrl && (
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-full bg-white border border-slate-200 text-slate-900 text-sm font-bold hover:bg-slate-100 active:scale-95 transition"
                >
                  Download CV
                </a>
              )}
            </div>
          )}
        </motion.div>

        {/* Profile Image: Real Admin Data Only */}
        {profileImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-1 lg:order-2 flex justify-center"
          >
            <div className="w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-3xl overflow-hidden bg-linear-to-br from-blue-500 to-purple-500 p-1.5 shadow-2xl">
              {!imageError ? (
                <img
                  src={profileImage}
                  alt={title || "Profile"}
                  onError={() => setImageError(true)}
                  className="w-full h-full rounded-[1.25rem] object-cover"
                />
              ) : null}
            </div>
          </motion.div>
        )}

      </div>
    </section>
  );
};

export default Hero;
