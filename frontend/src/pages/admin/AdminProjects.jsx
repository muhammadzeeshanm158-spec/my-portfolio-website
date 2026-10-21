import React, { useState, useEffect } from "react";
import api from "../../api/api";
import toast, { Toaster } from "react-hot-toast";

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", tech_stack: "", github_link: "", live_link: "" });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const fetchProjects = async () => {
    try {
      const res = await api.get("/projects");
      setProjects(res.data?.data || res.data || []);
    } catch (err) {
      setProjects([]);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const localPreview = URL.createObjectURL(file);
      setPreviewUrl(localPreview);
    }
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title required";
    if (!form.description.trim()) e.description = "Description required";
    if (!form.tech_stack.trim()) e.tech_stack = "Tech stack required";
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
      const payload = new FormData();
      payload.append("title", form.title);
      payload.append("description", form.description);
      payload.append("tech_stack", form.tech_stack);
      payload.append("github_link", form.github_link || "");
      payload.append("live_link", form.live_link || "");
      if (imageFile) {
        payload.append("project_image", imageFile);
      }

      const config = { headers: { "Content-Type": "multipart/form-data" } };

      if (editId) {
        await api.put(`/projects/${editId}`, payload, config);
        toast.success("Project Updated!");
      } else {
        await api.post("/projects", payload, config);
        toast.success("Project Added!");
      }
      
      setForm({ title: "", description: "", tech_stack: "", github_link: "", live_link: "" });
      setImageFile(null);
      setPreviewUrl("");
      setEditId(null);
      setErrors({});
      fetchProjects();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (p) => {
    setForm({
      title: p.title || "", description: p.description || "", tech_stack: p.tech_stack || "",
      github_link: p.github_link || "", live_link: p.live_link || ""
    });
    setEditId(p.id);
    setImageFile(null);
    setPreviewUrl(p.image_url || "");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete project?")) return;
    try {
      await api.delete(`/projects/${id}`);
      toast.success("Deleted!");
      fetchProjects();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const inputClass = (field) => `border px-4 py-3 rounded-xl w-full text-sm outline-none transition focus:ring-2 focus:ring-gray-900 ${errors[field]? 'border-red-500 bg-red-50 ring-1 ring-red-200' : 'border-gray-200 focus:border-transparent'}`;

  return (
    <div className="w-full max-w-5xl mx-auto">
      <Toaster position="top-right" />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Manage Projects</h2>
        {editId && (
          <button onClick={() => { setEditId(null); setForm({ title: "", description: "", tech_stack: "", github_link: "", live_link: "" }); setErrors({}); setImageFile(null); setPreviewUrl(""); }} className="text-xs sm:text-sm text-gray-500 hover:text-gray-900 border px-3 py-1.5 rounded-full w-fit">
            Cancel Edit ✕
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-100 p-4 sm:p-6 lg:p-8 rounded-2xl shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Project Title *</label>
            <input value={form.title} onChange={(e) => setForm({...form, title: e.target.value })} placeholder="e.g. E-Commerce MERN App" className={inputClass('title')} />
            {errors.title && <p className="text-red-500 text-xs mt-1.5">{errors.title}</p>}
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Tech Stack *</label>
            <input value={form.tech_stack} onChange={(e) => setForm({...form, tech_stack: e.target.value })} placeholder="React, Node, MongoDB" className={inputClass('tech_stack')} />
            {errors.tech_stack && <p className="text-red-500 text-xs mt-1.5">{errors.tech_stack}</p>}
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">GitHub Link <span className="text-gray-400">(Optional)</span></label>
            <input value={form.github_link} onChange={(e) => setForm({...form, github_link: e.target.value })} placeholder="https://github.com/..." className="border border-gray-200 px-4 py-3 rounded-xl w-full text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Live Link <span className="text-gray-400">(Optional)</span></label>
            <input value={form.live_link} onChange={(e) => setForm({...form, live_link: e.target.value })} placeholder="https://... (Optional)" className="border border-gray-200 px-4 py-3 rounded-xl w-full text-sm" />
          </div>
          
          {/* ✅ ONLY FILE SELECT - NO URL INPUT */}
          <div className="sm:col-span-2">
            <label className="text-sm font-medium mb-1.5 block">Project Image * (File Select Karo)</label>
            <input type="file" accept="image/*" onChange={handleFileChange} className="border border-gray-200 px-4 py-2.5 rounded-xl w-full text-sm file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:bg-black file:text-white" />
            {previewUrl && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mt-3">
                <img src={previewUrl} alt="preview" className="w-16 h-10 rounded-lg object-cover border" />
                <p className="text-xs text-gray-500 truncate">{imageFile ? imageFile.name : "Existing image"}</p>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-1.5 block">Description *</label>
          <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value })} placeholder="What does this project do?" className={`${inputClass('description')} resize-none`} rows={4}></textarea>
          {errors.description && <p className="text-red-500 text-xs mt-1.5">{errors.description}</p>}
        </div>

        <button disabled={loading} className="w-full sm:w-auto bg-gray-900 text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-black disabled:opacity-50">
          {loading? "Saving..." : editId? "Update Project" : "+ Save Project"}
        </button>
      </form>
    </div>
  );
};

export default AdminProjects;