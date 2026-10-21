import React, { useState, useEffect } from "react";
import api from "../../api/api";
import toast, { Toaster } from "react-hot-toast";

const AdminSkills = () => {
  // State: Skills list - hamesha array
  const [skills, setSkills] = useState([]);
  // Form state: Skill add/edit ke liye
  const [form, setForm] = useState({
    skill_name: "",
    category: "Frontend",
    icon_url: "",
    proficiency_level: 80
  });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  // Icon preview ke liye
  const [iconPreview, setIconPreview] = useState("");

  // Categories - Table ke ENUM ke hisab se
  const categories = ["Frontend", "Backend", "Database", "Tools", "Other"];

  // Popular icons - Quick select ke liye
  const popularIcons = [
    { name: "React", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
    { name: "Node.js", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
    { name: "【entity-MongoDB¦canonical_name=MongoDB】", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
    { name: "JavaScript", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
    { name: "Tailwind", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg" },
    { name: "【entity-GitHub¦canonical_name=GitHub】", url: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" },
  ];

  // Fetch all skills
  const fetchSkills = async () => {
    try {
      const res = await api.get("/skills");
      const data = res.data?.data || res.data || [];
      setSkills(Array.isArray(data)? data : []);
    } catch (err) {
      setSkills([]);
    }
  };

  useEffect(() => { fetchSkills(); }, []);

  // Icon URL change par preview update karo
  useEffect(() => {
    setIconPreview(form.icon_url);
  }, [form.icon_url]);

  const validate = () => {
    const e = {};
    if (!form.skill_name.trim()) e.skill_name = "Skill name required";
    if (!form.category) e.category = "Category required";
    if (form.proficiency_level < 0 || form.proficiency_level > 100) e.proficiency_level = "0-100 ke beech me";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fill required fields!");
      return;
    }
    setLoading(true);
    try {
      if (editId) {
        await api.put(`/skills/${editId}`, form);
        toast.success("Skill Updated! ✅");
      } else {
        await api.post("/skills", form);
        toast.success("Skill Added! ✅");
      }
      // Reset form
      setForm({ skill_name: "", category: "Frontend", icon_url: "", proficiency_level: 80 });
      setEditId(null);
      setIconPreview("");
      fetchSkills();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (s) => {
    setForm({
      skill_name: s.skill_name || "",
      category: s.category || "Frontend",
      icon_url: s.icon_url || "",
      proficiency_level: s.proficiency_level || 80
    });
    setEditId(s.id);
    setIconPreview(s.icon_url || "");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this skill?")) return;
    try {
      await api.delete(`/skills/${id}`);
      toast.success("Deleted!");
      fetchSkills();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Manage Skills</h2>
        {editId && (
          <button
            onClick={() => {
              setEditId(null);
              setForm({ skill_name: "", category: "Frontend", icon_url: "", proficiency_level: 80 });
              setErrors({});
              setIconPreview("");
            }}
            className="text-xs sm:text-sm text-gray-500 hover:text-gray-900 border px-3 py-1.5 rounded-full w-fit"
          >
            Cancel Edit ✕
          </button>
        )}
      </div>

      {/* FORM */}
      <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Skill Name */}
          <div>
            <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1.5 block">Skill Name *</label>
            <input
              value={form.skill_name}
              onChange={(e) => setForm({...form, skill_name: e.target.value })}
              placeholder="e.g. React.js, Node.js, Gemini AI"
              className={`border px-4 py-3 rounded-xl w-full text-sm focus:ring-2 focus:ring-gray-900 focus:outline-none ${errors.skill_name? 'border-red-500' : 'border-gray-200'}`}
            />
            {errors.skill_name && <p className="text-red-500 text-xs mt-1">{errors.skill_name}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1.5 block">Category *</label>
              <select
                value={form.category}
                onChange={(e) => setForm({...form, category: e.target.value })}
                className="border border-gray-200 px-4 py-3 rounded-xl w-full text-sm focus:ring-2 focus:ring-gray-900 focus:outline-none bg-white"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Proficiency */}
            <div>
              <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1.5 block">Proficiency ({form.proficiency_level}%)</label>
              <input
                type="range"
                min="0"
                max="100"
                value={form.proficiency_level}
                onChange={(e) => setForm({...form, proficiency_level: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-900"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>0%</span><span>50%</span><span>100%</span>
              </div>
            </div>
          </div>

          {/* Icon URL */}
          <div>
            <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1.5 block">Icon URL</label>
            <div className="flex gap-2">
              <input
                value={form.icon_url}
                onChange={(e) => setForm({...form, icon_url: e.target.value })}
                placeholder="https://.../icon.svg"
                className="border border-gray-200 px-4 py-3 rounded-xl w-full text-sm focus:ring-2 focus:ring-gray-900 focus:outline-none"
              />
              {/* Icon Preview */}
              {iconPreview && (
                <div className="w-12 h-12 border border-gray-200 rounded-xl flex items-center justify-center bg-gray-50 p-2 shrink-0">
                  <img src={iconPreview} alt="icon" className="w-full h-full object-contain" onError={() => setIconPreview("")} />
                </div>
              )}
            </div>

            {/* Quick Icon Select */}
            <div className="mt-3">
              <p className="text-xs text-gray-500 mb-2">Quick Select:</p>
              <div className="flex flex-wrap gap-2">
                {popularIcons.map((icon) => (
                  <button
                    key={icon.name}
                    type="button"
                    onClick={() => setForm({...form, icon_url: icon.url })}
                    className={`border px-2 py-1.5 rounded-full text-xs flex items-center gap-1.5 hover:bg-gray-900 hover:text-white transition ${form.icon_url === icon.url? 'bg-gray-900 text-white' : 'bg-white text-gray-600 border-gray-200'}`}
                  >
                    <img src={icon.url} alt={icon.name} className="w-4 h-4" />
                    {icon.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full sm:w-auto bg-gray-900 text-white px-8 py-3 rounded-full text-sm font-medium disabled:opacity-50 hover:bg-black transition"
          >
            {loading? "Saving..." : editId? "Update Skill" : "+ Add Skill"}
          </button>
        </form>
      </div>

      {/* LIST */}
      <div className="bg-white border border-gray-100 rounded-2xl mt-6 overflow-hidden shadow-sm">
        <div className="p-4 sm:p-5 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-sm sm:text-base">Saved Skills ({skills.length})</h3>
          <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">All skills</span>
        </div>

        {skills.length === 0? (
          <div className="p-12 text-center">
            <p className="text-gray-400 text-sm">No skills yet. Add your first skill!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {skills.map((s, index) => (
              <div key={s.id? `skill-${s.id}` : `skill-index-${index}`} className="p-4 sm:p-5 flex items-center justify-between gap-3 hover:bg-gray-50/50">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {/* Icon */}
                  <div className="w-10 h-10 border border-gray-100 rounded-xl flex items-center justify-center bg-white p-2 shrink-0">
                    {s.icon_url? (
                      <img src={s.icon_url} alt={s.skill_name} className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-xs font-bold text-gray-400">{s.skill_name[0]}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-sm truncate">{s.skill_name}</p>
                    <div className="flex gap-2 mt-1">
                      <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">{s.category}</span>
                      <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{s.proficiency_level}%</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => handleEdit(s)} className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-full text-xs font-medium">Edit</button>
                  <button onClick={() => handleDelete(s.id)} className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-full text-xs font-medium">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSkills;