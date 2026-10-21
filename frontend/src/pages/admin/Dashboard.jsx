import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";

const Dashboard = () => {
  const [counts, setCounts] = useState({
    hero: 0,
    about: 0,
    projects: 0,
    skills: 0,
    experience: 0,
    education: 0,
    socials: 0,
    messages: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        // Sab APIs parallel me call karo
        const [hero, about, projects, skills, exp, edu, socials, messages] = await Promise.allSettled([
          api.get("/hero"),
          api.get("/about"),
          api.get("/projects"),
          api.get("/skills"),
          api.get("/experience"),
          api.get("/education"),
          api.get("/social-links"),
          api.get("/messages").catch(() => api.get("/contact")), // messages ya contact jo bhi ho
        ]);

        const getCount = (result) => {
          if (result.status !== 'fulfilled') return 0;
          const data = result.value.data?.data || result.value.data;
          if (Array.isArray(data)) return data.length;
          if (data) return 1; // hero, about jaisa single object
          return 0;
        };

        setCounts({
          hero: getCount(hero),
          about: getCount(about),
          projects: getCount(projects),
          skills: getCount(skills),
          experience: getCount(exp),
          education: getCount(edu),
          socials: getCount(socials),
          messages: getCount(messages),
        });

      } catch (err) {
        console.error("Dashboard count error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  const cards = [
    {
      title: "HERO",
      value: counts.hero,
      label: "Hero Section",
      path: "/admin/hero",
      icon: "🏠",
      color: "bg-blue-500",
    },
    {
      title: "ABOUT",
      value: counts.about,
      label: "About Data",
      path: "/admin/about",
      icon: "👤",
      color: "bg-purple-500",
    },
    {
      title: "PROJECTS",
      value: counts.projects,
      label: "Total Projects",
      path: "/admin/projects",
      icon: "💼",
      color: "bg-orange-500",
    },
    {
      title: "SKILLS",
      value: counts.skills,
      label: "Total Skills",
      path: "/admin/skills",
      icon: "⚡",
      color: "bg-green-500",
    },
    {
      title: "EXPERIENCE",
      value: counts.experience,
      label: "Work History",
      path: "/admin/experience",
      icon: "📈",
      color: "bg-indigo-500",
    },
    {
      title: "EDUCATION",
      value: counts.education,
      label: "Education",
      path: "/admin/education",
      icon: "🎓",
      color: "bg-yellow-500",
    },
    {
      title: "SOCIAL",
      value: counts.socials,
      label: "Social Links",
      path: "/admin/socials",
      icon: "🔗",
      color: "bg-pink-500",
    },
    {
      title: "MESSAGES",
      value: counts.messages,
      label: "New Messages",
      path: "/admin/messages",
      icon: "✉️",
      color: "bg-teal-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your portfolio content {loading && "(Loading...)"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-green-50 text-green-700 text-xs font-bold border border-green-200">
            <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
            Live
          </span>
          <Link
            to="/"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-semibold hover:bg-black hover:text-white transition"
          >
            View Site ↗
          </Link>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Link
            key={card.title}
            to={card.path}
            className="group bg-white rounded-2xl p-5 border border-slate-200 hover:border-slate-300 hover:shadow-lg hover:-translate-y-0.5 transition-all"
          >
            <div className="flex items-start justify-between gap-3">
              <div className={`w-10 h-10 shrink-0 rounded-xl ${card.color} flex items-center justify-center text-lg shadow-sm`}>
                {card.icon}
              </div>
              <span className="text-xs font-bold tracking-widest text-slate-400">{card.title}</span>
            </div>

            <div className="mt-5">
              <div className="text-3xl font-bold leading-none text-slate-900">
                {loading ? "..." : card.value}
              </div>
              <div className="text-sm text-slate-500 mt-2 font-medium">{card.label}</div>
            </div>

            <div className="mt-5 flex items-center gap-2 text-sm font-bold text-slate-900">
              Manage <span>→</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Bottom Info */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <p className="text-sm text-slate-600">
          <span className="font-bold text-slate-900">Zeeshan</span> — {counts.projects + counts.skills + counts.education + counts.experience} items managed
        </p>
        <p className="text-xs text-slate-400">Portfolio Admin Panel</p>
      </div>
    </div>
  );
};

export default Dashboard;