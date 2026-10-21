import React, { useState, useEffect } from "react";
import api from "../../api/api";
import toast, { Toaster } from "react-hot-toast";

const AdminEducation = () => {
  const [education, setEducation] = useState([]);
  const [form, setForm] = useState({ degree: "", institution: "", start_year: "", end_year: "", description: "" });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const fetchEducation = async () => {
    try {
      const res = await api.get("/education");
      setEducation(res.data?.data || res.data || []);
    } catch (err) {
      setEducation([]);
    }
  };

  useEffect(() => { fetchEducation(); }, []);

  const validate = () => {
    const e = {};
    if (!form.degree.trim()) e.degree = "Degree required";
    if (!form.institution.trim()) e.institution = "Institution required";
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
        await api.put(`/education/${editId}`, form);
        toast.success("Education Updated!");
      } else {
        await api.post("/education", form);
        toast.success("Education Added!");
      }
      setForm({ degree: "", institution: "", start_year: "", end_year: "", description: "" });
      setEditId(null);
      fetchEducation();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (ed) => {
    setForm({
      degree: ed.degree || "",
      institution: ed.institution || "",
      start_year: ed.start_year || "",
      end_year: ed.end_year || "",
      description: ed.description || ""
    });
    setEditId(ed.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete?")) return;
    try {
      await api.delete(`/education/${id}`);
      toast.success("Deleted!");
      fetchEducation();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Manage Education</h2>
        {editId && (
          <button
            onClick={() => {
              setEditId(null);
              setForm({ degree: "", institution: "", start_year: "", end_year: "", description: "" });
              setErrors({});
            }}
            className="text-xs sm:text-sm text-gray-500 hover:text-gray-900 border px-3 py-1.5 rounded-full w-fit"
          >
            Cancel Edit ✕
          </button>
        )}
      </div>

      {/* FORM */}
      <div className="bg-white border border-gray-100 p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-[1.5rem] shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1.5 block">Degree *</label>
              <input
                value={form.degree}
                onChange={(e) => setForm({...form, degree: e.target.value })}
                placeholder="e.g. BS Computer Science"
                className={`border px-4 py-3 rounded-xl w-full text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition ${errors.degree? 'border-red-500 ring-1 ring-red-200' : 'border-gray-200'}`}
              />
              {errors.degree && <p className="text-red-500 text-xs mt-1.5">{errors.degree}</p>}
            </div>
            <div>
              <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1.5 block">Institution *</label>
              <input
                value={form.institution}
                onChange={(e) => setForm({...form, institution: e.target.value })}
                placeholder="e.g. University of Karachi"
                className={`border px-4 py-3 rounded-xl w-full text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition ${errors.institution? 'border-red-500 ring-1 ring-red-200' : 'border-gray-200'}`}
              />
              {errors.institution && <p className="text-red-500 text-xs mt-1.5">{errors.institution}</p>}
            </div>

            <div>
              <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1.5 block">Start Year</label>
              <input
                type="number"
                value={form.start_year}
                onChange={(e) => setForm({...form, start_year: e.target.value })}
                placeholder="e.g. 2020"
                className="border border-gray-200 px-4 py-3 rounded-xl w-full text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
              />
            </div>
            <div>
              <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1.5 block">End Year</label>
              <input
                type="number"
                value={form.end_year}
                onChange={(e) => setForm({...form, end_year: e.target.value })}
                placeholder="e.g. 2024 or Present"
                className="border border-gray-200 px-4 py-3 rounded-xl w-full text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
              />
            </div>
          </div>

          <div>
            <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1.5 block">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({...form, description: e.target.value })}
              placeholder="e.g. Major in Software Engineering, GPA 3.5..."
              className="border border-gray-200 px-4 py-3 rounded-xl w-full text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition resize-none"
              rows={3}
            ></textarea>
          </div>

          <button
            disabled={loading}
            className="w-full sm:w-auto bg-gray-900 text-white px-6 sm:px-8 py-3 rounded-full text-sm font-medium disabled:opacity-50 hover:bg-black active:scale-[0.98] transition-all touch-manipulation"
          >
            {loading? "Saving..." : editId? "Update Education" : "+ Save Education"}
          </button>
        </form>
      </div>

      {/* LIST */}
      <div className="bg-white border border-gray-100 rounded-2xl sm:rounded-[1.5rem] mt-6 overflow-hidden shadow-sm">
        <div className="p-4 sm:p-5 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-sm sm:text-base">Saved Education ({education.length})</h3>
          <span className="text- text-gray-400 bg-gray-50 px-2 py-1 rounded-full">Latest first</span>
        </div>

        {education.length === 0? (
          <div className="p-8 sm:p-12 text-center">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 text-xl">🎓</div>
            <p className="text-gray-400 text-sm">No education entries yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {education.map((ed) => (
              <div key={ed.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:justify-between gap-3 hover:bg-gray-50/50 transition">
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm sm:text-base truncate">{ed.degree}</p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    <span className="font-medium">{ed.institution}</span>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="bg-gray-100 px-2 py-0.5 rounded-full text-">{ed.start_year} - {ed.end_year || 'Present'}</span>
                  </p>
                  {ed.description && (
                    <p className="text-xs sm:text-sm text-gray-500 mt-2 line-clamp-2 leading-relaxed">{ed.description}</p>
                  )}
                </div>
                <div className="flex gap-2 shrink-0 self-start sm:self-center">
                  <button onClick={() => handleEdit(ed)} className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-full text-xs font-medium transition touch-manipulation">Edit</button>
                  <button onClick={() => handleDelete(ed.id)} className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-full text-xs font-medium transition touch-manipulation">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEducation;