import React, { useState, useEffect } from "react";
import api from "../../api/api";
import toast, { Toaster } from "react-hot-toast";

const AdminAbout = () => {
  // State: About entries list - hamesha array rakhenge taaki.map() error na aaye
  const [about, setAbout] = useState([]);
  // Form state: Add/Edit ke liye
  const [form, setForm] = useState({ heading: "", description: "", experience_years: "", completed_projects: "" });
  // Edit mode ke liye ID track karne ke liye
  const [editId, setEditId] = useState(null);
  // Loading state: Button disable karne ke liye
  const [loading, setLoading] = useState(false);
  // Validation errors show karne ke liye
  const [errors, setErrors] = useState({});

  // Fetch About - Backend se data lana
  const fetchAbout = async () => {
    try {
      const res = await api.get("/about");
      // FIX: Backend single object bhejta hai (LIMIT 1), usko array me convert karo
      const apiData = res.data?.data || res.data;

      if (!apiData) {
        // Agar data null hai to empty array
        setAbout([]);
      } else if (Array.isArray(apiData)) {
        // Agar array aaya to direct array set karo
        setAbout(apiData);
      } else {
        // FIXED: Single object hai to array me wrap karo taaki.map() chale aur key warning na aaye
        setAbout([apiData]);
      }
    } catch (err) {
      // Error aane par empty array
      setAbout([]);
    }
  };

  // Component mount par data fetch karo
  useEffect(() => { fetchAbout(); }, []);

  // Validation: Required fields check
  const validate = () => {
    const e = {};
    if (!form.heading.trim()) e.heading = "Heading required";
    if (!form.description.trim()) e.description = "Description required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // Form Submit: Add ya Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fill required fields!");
      return;
    }
    setLoading(true);
    try {
      if (editId) {
        // Update case: Existing record update
        await api.put(`/about/${editId}`, form);
        toast.success("About Updated!");
      } else {
        // Create case: Naya record add
        await api.post("/about", form);
        toast.success("About Added!");
      }
      // Form reset after success
      setForm({ heading: "", description: "", experience_years: "", completed_projects: "" });
      setEditId(null);
      fetchAbout(); // List refresh karo
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Edit button: Form me data fill karo
  const handleEdit = (a) => {
    setForm({
      heading: a.heading || "",
      description: a.description || "",
      experience_years: a.experience_years || "",
      completed_projects: a.completed_projects || ""
    });
    setEditId(a.id);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Upar scroll karo
  };

  // Delete button: Record delete karo
  const handleDelete = async (id) => {
    if (!confirm("Delete?")) return;
    try {
      await api.delete(`/about/${id}`);
      toast.success("Deleted!");
      fetchAbout();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <Toaster position="top-right" />

      {/* Header: Title aur Cancel Edit button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Manage About</h2>
        {editId && (
          <button
            onClick={() => {
              setEditId(null);
              setForm({ heading: "", description: "", experience_years: "", completed_projects: "" });
              setErrors({});
            }}
            className="text-xs sm:text-sm text-gray-500 hover:text-gray-900 border px-3 py-1.5 rounded-full w-fit"
          >
            Cancel Edit ✕
          </button>
        )}
      </div>

      {/* FORM: Add/Edit form */}
      <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-[1.5rem] shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <div>
            <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1.5 block">Heading *</label>
            <input
              value={form.heading}
              onChange={(e) => setForm({...form, heading: e.target.value })}
              placeholder="e.g. Passionate MERN Developer"
              className={`border px-4 py-3 sm:py-3 rounded-xl w-full text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition ${errors.heading? 'border-red-500 ring-1 ring-red-200' : 'border-gray-200'}`}
            />
            {errors.heading && <p className="text-red-500 text-xs mt-1.5">{errors.heading}</p>}
          </div>

          <div>
            <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1.5 block">Description *</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({...form, description: e.target.value })}
              placeholder="Write about yourself..."
              className={`border px-4 py-3 rounded-xl w-full text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition resize-none ${errors.description? 'border-red-500 ring-1 ring-red-200' : 'border-gray-200'}`}
              rows={4}
            ></textarea>
            {errors.description && <p className="text-red-500 text-xs mt-1.5">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1.5 block">Experience Years</label>
              <input
                type="number"
                value={form.experience_years}
                onChange={(e) => setForm({...form, experience_years: e.target.value })}
                placeholder="e.g. 2"
                className="border border-gray-200 px-4 py-3 rounded-xl w-full text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1.5 block">Completed Projects</label>
              <input
                type="number"
                value={form.completed_projects}
                onChange={(e) => setForm({...form, completed_projects: e.target.value })}
                placeholder="e.g. 15"
                className="border border-gray-200 px-4 py-3 rounded-xl w-full text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
              />
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full sm:w-auto bg-gray-900 text-white px-6 sm:px-8 py-3 sm:py-3 rounded-full text-sm font-medium disabled:opacity-50 hover:bg-black active:scale-[0.98] transition-all touch-manipulation"
          >
            {loading? "Saving..." : editId? "Update About" : "+ Save About"}
          </button>
        </form>
      </div>

      {/* LIST: Saved about entries */}
      <div className="bg-white border border-gray-100 rounded-2xl sm:rounded-[1.5rem] mt-6 overflow-hidden shadow-sm">
        <div className="p-4 sm:p-5 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-sm sm:text-base">Saved Entries ({about.length})</h3>
          <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">Latest first</span>
        </div>

        {about.length === 0? (
          <div className="p-8 sm:p-12 text-center">
            <p className="text-gray-400 text-sm">No about entries yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {/* FIXED: Unique key prop - id + index fallback taaki React warning na aaye */}
            {about.map((a, index) => (
              <div key={a.id? `about-${a.id}` : `about-index-${index}`} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:justify-between gap-3 hover:bg-gray-50/50 transition">
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm sm:text-base truncate">{a.heading}</p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-2 leading-relaxed">{a.description}</p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{a.experience_years || 0} Yrs</span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{a.completed_projects || 0} Projects</span>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0 self-start sm:self-center">
                  <button onClick={() => handleEdit(a)} className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-full text-xs font-medium transition touch-manipulation">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(a.id)} className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-full text-xs font-medium transition touch-manipulation">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAbout;