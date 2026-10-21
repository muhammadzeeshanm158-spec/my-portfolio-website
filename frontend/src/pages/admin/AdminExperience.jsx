import React, { useState, useEffect } from "react";
import api from "../../api/api";
import toast, { Toaster } from "react-hot-toast";

const AdminExperience = () => {
  const [experiences, setExperiences] = useState([]);
  const [form, setForm] = useState({
    role: "", 
    company_name: "", 
    start_date: "", 
    end_date: "", 
    description: "", 
    is_current: false,
  });
  const [errors, setErrors] = useState({});
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const fetchExperience = async () => {
    try {
      setFetching(true);
      const res = await api.get("/experiences");
      setExperiences(res.data?.data || res.data || []);
    } catch (err) {
      setExperiences([]);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => { fetchExperience(); }, []);

  const validate = () => {
    const newErrors = {};
    if (!form.role.trim()) newErrors.role = "Role is required";
    if (!form.company_name.trim()) newErrors.company_name = "Company required";
    if (!form.start_date) newErrors.start_date = "Start Date required";
    if (!form.is_current && !form.end_date) newErrors.end_date = "End Date required";
    if (!form.description.trim()) newErrors.description = "Description required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fill all required fields!");
      return;
    }
    setLoading(true);
    try {
      // FIXED: Backend ko exact wahi naam bhejo jo table me hai
      const payload = {
        role: form.role,
        company_name: form.company_name,
        start_date: form.start_date,
        end_date: form.is_current ? null : form.end_date,
        description: form.description,
        is_current: form.is_current,
      };

      if (editId) {
        await api.put(`/experiences/${editId}`, payload);
        toast.success("Experience Updated!");
      } else {
        await api.post("/experiences", payload);
        toast.success("Experience Added!");
      }
      setForm({ role: "", company_name: "", start_date: "", end_date: "", description: "", is_current: false });
      setErrors({});
      setEditId(null);
      fetchExperience();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to save!");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (exp) => {
    setForm({
      role: exp.role || "",
      company_name: exp.company_name || "",
      start_date: exp.start_date ? exp.start_date.slice(0, 10) : "",
      end_date: exp.end_date ? exp.end_date.slice(0, 10) : "",
      description: exp.description || "",
      is_current: !exp.end_date,
    });
    setEditId(exp.id);
    setErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete experience?")) return;
    try {
      await api.delete(`/experiences/${id}`);
      toast.success("Deleted!");
      fetchExperience();
    } catch (err) {
      toast.error("Delete failed!");
    }
  };

  const inputClass = (field) => `border px-4 py-3 rounded-xl w-full text-sm outline-none transition focus:ring-2 focus:ring-gray-900 ${errors[field] ? 'border-red-500 bg-red-50 ring-1 ring-red-200' : 'border-gray-200 focus:border-transparent'}`;

  return (
    <div className="w-full max-w-5xl mx-auto">
      <Toaster position="top-right" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Manage Experience</h2>
        <span className="text-xs bg-gray-100 px-3 py-1 rounded-full w-fit">Table: experience</span>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="bg-white border-2 border-gray-200 p-4 sm:p-6 lg:p-8 rounded-2xl shadow-sm space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Role / Job Title *</label>
            <input value={form.role} onChange={(e) => setForm({...form, role: e.target.value })} placeholder="MERN Stack Developer" className={inputClass('role')} />
            {errors.role && <p className="text-red-500 text-xs mt-1.5">{errors.role}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Company Name *</label>
            <input value={form.company_name} onChange={(e) => setForm({...form, company_name: e.target.value })} placeholder="Tech Solutions Pvt Ltd" className={inputClass('company_name')} />
            {errors.company_name && <p className="text-red-500 text-xs mt-1.5">{errors.company_name}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Start Date *</label>
            <input type="date" value={form.start_date} onChange={(e) => setForm({...form, start_date: e.target.value })} className={inputClass('start_date')} />
            {errors.start_date && <p className="text-red-500 text-xs mt-1.5">{errors.start_date}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">End Date {!form.is_current && '*'}</label>
            <input type="date" value={form.end_date} onChange={(e) => setForm({...form, end_date: e.target.value })} className={inputClass('end_date')} disabled={form.is_current} />
            {errors.end_date && <p className="text-red-500 text-xs mt-1.5">{errors.end_date}</p>}
          </div>
          <div className="col-span-1 sm:col-span-2">
            <label className="flex items-center gap-2 px-4 py-3 border-2 border-gray-200 rounded-xl cursor-pointer w-full hover:bg-gray-50 transition">
              <input type="checkbox" checked={form.is_current} onChange={(e) => setForm({...form, is_current: e.target.checked })} className="w-4 h-4 accent-gray-900" />
              <span className="text-sm font-medium">Currently Working Here (Present)</span>
            </label>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Description *</label>
          <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value })} placeholder="What did you do? e.g. Built MERN apps, APIs, Admin panels..." className={`${inputClass('description')} resize-none`} rows={4}></textarea>
          {errors.description && <p className="text-red-500 text-xs mt-1.5">{errors.description}</p>}
        </div>

        <div className="flex gap-3">
          <button disabled={loading} className="w-full sm:w-auto bg-gray-900 text-white px-8 py-3 rounded-full text-sm font-bold hover:bg-black disabled:opacity-50">
            {loading? "Saving..." : editId? "Update Experience" : "+ Save Experience"}
          </button>
          {editId && (
            <button type="button" onClick={() => { setEditId(null); setErrors({}); setForm({ role: "", company_name: "", start_date: "", end_date: "", description: "", is_current: false }); }} className="bg-gray-100 hover:bg-gray-200 px-8 py-3 rounded-full text-sm font-medium">
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* LIST */}
      <div className="bg-white border-2 border-gray-200 rounded-2xl mt-6 overflow-hidden">
        <div className="p-5 font-bold border-b bg-gray-50 flex justify-between">
          <span>Total: {fetching? "Loading..." : experiences.length}</span>
        </div>
        {fetching? <p className="p-8 text-center text-gray-400 animate-pulse">Loading...</p> 
        : experiences.length === 0? <p className="p-12 text-center text-gray-400">No experience yet.</p>
        : (
          <div className="divide-y divide-gray-100">
            {experiences.map((exp) => (
              <div key={exp.id} className="flex justify-between items-start gap-3 p-5 hover:bg-gray-50">
                <div className="flex-1">
                  <p className="font-bold text-gray-900">{exp.role}</p>
                  <p className="text-sm text-gray-500 mt-1">{exp.company_name}</p>
                  <p className="text-xs text-gray-400 mt-1.5 bg-gray-100 inline-block px-2 py-1 rounded-full">
                    {exp.start_date?.slice(0, 10)} to {exp.end_date ? exp.end_date.slice(0, 10) : "Present"}
                  </p>
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">{exp.description}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => handleEdit(exp)} className="bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-xs font-bold">Edit</button>
                  <button onClick={() => handleDelete(exp.id)} className="bg-red-50 text-red-600 px-4 py-2 rounded-full text-xs font-bold">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminExperience;