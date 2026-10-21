import React, { useState, useEffect } from "react";
import api from "../../api/api";
import toast, { Toaster } from "react-hot-toast";

const AdminHero = () => {
  const [hero, setHero] = useState([]);
  const [form, setForm] = useState({ title: "", subtitle: "", short_bio: "", resume_url: "", profile_image_url: "" });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [profileFile, setProfileFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null); // ✅ SIRF YE NAYA ADD KIYA
  const [previewUrl, setPreviewUrl] = useState("");

  const fetchHero = async () => {
    try {
      const res = await api.get("/hero");
      const data = res.data?.data || res.data;
      setHero(Array.isArray(data)? data : data? [data] : []);
    } catch (err) {
      setHero([]);
    }
  };

  useEffect(() => { fetchHero(); }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileFile(file);
      const localPreview = URL.createObjectURL(file);
      setPreviewUrl(localPreview);
      setForm({ ...form, profile_image_url: "" });
    }
  };

  // ✅ SIRF YE NAYA FUNCTION ADD KIYA CV KE LIYE
  const handleResumeFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResumeFile(file);
      setForm({ ...form, resume_url: "" }); // URL khali karo jab file select ho
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() ||!form.subtitle.trim()) {
      toast.error("Title & Subtitle required!");
      return;
    }
    setLoading(true);
    try {
      let payload;
      let config = {};
      
      // ✅ AB RESUME FILE BHI CHECK KARO
      if (profileFile || resumeFile) {
        payload = new FormData();
        payload.append("title", form.title);
        payload.append("subtitle", form.subtitle);
        payload.append("short_bio", form.short_bio);
        payload.append("resume_url", form.resume_url);
        if (profileFile) payload.append("profile_image", profileFile);
        if (resumeFile) payload.append("resume", resumeFile); // ✅ CV FILE
        if (!profileFile && form.profile_image_url) payload.append("profile_image_url", form.profile_image_url);
        config = { headers: { "Content-Type": "multipart/form-data" } };
      } else {
        payload = form;
      }

      if (editId) {
        await api.put(`/hero/${editId}`, payload, config);
        toast.success("Hero Updated!");
      } else {
        await api.post("/hero", payload, config);
        toast.success("Hero Added!");
      }
      setForm({ title: "", subtitle: "", short_bio: "", resume_url: "", profile_image_url: "" });
      setProfileFile(null);
      setResumeFile(null);
      setPreviewUrl("");
      setEditId(null);
      fetchHero();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (h) => {
    setForm({
      title: h.title || "",
      subtitle: h.subtitle || "",
      short_bio: h.short_bio || "",
      resume_url: h.resume_url || "",
      profile_image_url: h.profile_image_url || ""
    });
    setEditId(h.id);
    setProfileFile(null);
    setResumeFile(null);
    setPreviewUrl(h.profile_image_url || "");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this hero?")) return;
    try {
      await api.delete(`/hero/${id}`);
      toast.success("Deleted!");
      fetchHero();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <Toaster position="top-right" />
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-black">Manage Hero</h2>
        {editId && (
          <button onClick={() => { setEditId(null); setForm({ title: "", subtitle: "", short_bio: "", resume_url: "", profile_image_url: "" }); setProfileFile(null); setResumeFile(null); setPreviewUrl(""); }} className="text-xs border px-3 py-1.5 rounded-full">Cancel Edit ✕</button>
        )}
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">Title *</label>
            <input value={form.title} onChange={(e) => setForm({...form, title: e.target.value })} placeholder="Hi, I'm Zeeshan" className="border border-gray-200 px-4 py-3 rounded-xl w-full text-sm outline-none focus:ring-2 focus:ring-black" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">Subtitle * (comma se alag likho for animation)</label>
            <input value={form.subtitle} onChange={(e) => setForm({...form, subtitle: e.target.value })} placeholder="MERN Stack Developer, React Developer, MySQL Expert" className="border border-gray-200 px-4 py-3 rounded-xl w-full text-sm outline-none focus:ring-2 focus:ring-black" />
            <p className="text- text-gray-400 mt-1">Example: MERN Stack Developer, Frontend Developer, Backend Developer</p>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700 mb-1 block">Short Bio</label>
            <textarea value={form.short_bio} onChange={(e) => setForm({...form, short_bio: e.target.value })} placeholder="Short bio..." className="border border-gray-200 px-4 py-3 rounded-xl w-full text-sm outline-none focus:ring-2 focus:ring-black resize-none" rows={3}></textarea>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* ✅ CHANGE: AB CV FILE SELECT HAI - URL NAHI */}
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">Resume / CV (File Select Karo - PDF)</label>
              <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeFileChange} className="border border-gray-200 px-4 py-2.5 rounded-xl w-full text-sm outline-none focus:ring-2 focus:ring-black file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:bg-black file:text-white file:text-xs" />
              {resumeFile && <p className="text-xs text-green-600 mt-1.5">Selected: {resumeFile.name}</p>}
              {!resumeFile && form.resume_url && <p className="text-xs text-gray-400 mt-1.5 truncate">Current: {form.resume_url}</p>}
            </div>
            
            <div>
              <label className="text-xs font-medium text-gray-700 mb-1 block">Profile Image (File Select Karo)</label>
              <input type="file" accept="image/*" onChange={handleFileChange} className="border border-gray-200 px-4 py-2.5 rounded-xl w-full text-sm outline-none focus:ring-2 focus:ring-black file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:bg-black file:text-white file:text-xs" />
              {(previewUrl || form.profile_image_url) && (
                <div className="mt-3 flex items-center gap-3">
                  <img src={previewUrl || form.profile_image_url} alt="Preview" className="w-14 h-14 rounded-full object-cover border-2 border-gray-900" />
                  <span className="text-xs text-gray-500 truncate">{profileFile? profileFile.name : "Purani Image"}</span>
                </div>
              )}
            </div>
          </div>

          <button disabled={loading} className="w-full sm:w-auto bg-black text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-gray-800 disabled:opacity-50">
            {loading? "Saving..." : editId? "Update Hero" : "+ Save Hero"}
          </button>
        </form>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl mt-6 overflow-hidden">
        <div className="p-4 font-bold border-b bg-gray-50/50 text-sm">Total Heroes: {hero.length}</div>
        {hero.length === 0? (
          <div className="p-10 text-center text-sm text-gray-400">No hero data yet</div>
        ) : (
          hero.map((h) => (
            <div key={h.id} className="p-4 flex justify-between gap-3 border-b last:border-0 hover:bg-gray-50/50">
              <div className="min-w-0 flex gap-3 items-center">
                {h.profile_image_url && <img src={h.profile_image_url} className="w-10 h-10 rounded-full object-cover border" alt="" />}
                <div>
                  <p className="font-bold text-sm truncate">{h.title}</p>
                  <p className="text-xs text-gray-500 truncate">{h.subtitle}</p>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => handleEdit(h)} className="bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-xs font-bold">Edit</button>
                <button onClick={() => handleDelete(h.id)} className="bg-red-50 text-red-600 px-4 py-2 rounded-full text-xs font-bold">Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminHero;