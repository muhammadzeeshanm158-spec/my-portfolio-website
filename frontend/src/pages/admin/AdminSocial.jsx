import React, { useState, useEffect } from "react";
import api from "../../api/api";
import toast, { Toaster } from "react-hot-toast";

const AdminSocial = () => {
  const [socials, setSocials] = useState([]);
  const [form, setForm] = useState({
    platform_name: "",
    profile_url: "",
    icon_class: "",
  });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchSocials = async () => {
    try {
      const res = await api.get("/social-links");
      setSocials(res.data?.data || res.data || []);
    } catch { setSocials([]); }
  };

  useEffect(() => { fetchSocials(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.platform_name ||!form.profile_url) {
      toast.error("Platform & URL required!");
      return;
    }
    setLoading(true);
    try {
      if (editId) {
        await api.put(`/social-links/${editId}`, form);
        toast.success("Updated!");
      } else {
        await api.post("/social-links", form);
        toast.success("Added!");
      }
      setForm({ platform_name: "", profile_url: "", icon_class: "" });
      setEditId(null);
      fetchSocials();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally { setLoading(false); }
  };

  const handleEdit = (s) => {
    setForm({
      platform_name: s.platform_name || "",
      profile_url: s.profile_url || "",
      icon_class: s.icon_class || "",
    });
    setEditId(s.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete?")) return;
    await api.delete(`/social-links/${id}`);
    toast.success("Deleted!");
    fetchSocials();
  };

  const getIcon = (name) => {
    const n = name.toLowerCase();
    if (n.includes('【entity-github¦canonical_name=github】')) return '🐙';
    if (n.includes('linkedin')) return '💼';
    if (n.includes('twitter') || n.includes('x')) return '🐦';
    if (n.includes('insta')) return '📸';
    return '🔗';
  };

  return (
    <div className="max-w-5xl mx-auto">
      <Toaster />
      <h2 className="text-2xl font-bold mb-6">Manage Social Links</h2>

      <form onSubmit={handleSubmit} className="bg-white border-2 border-gray-200 p-6 rounded-2xl space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-bold">Platform Name *</label>
            <input value={form.platform_name} onChange={e=>setForm({...form, platform_name: e.target.value})} placeholder="GitHub, LinkedIn" list="platforms" className="mt-1 border-2 border-gray-200 px-4 py-3 rounded-xl w-full text-sm focus:border-gray-900 outline-none" />
            <datalist id="platforms"><option value="GitHub"/><option value="LinkedIn"/><option value="Twitter"/><option value="Instagram"/><option value="Facebook"/></datalist>
          </div>
          <div>
            <label className="text-sm font-bold">Icon Class (Optional)</label>
            <input value={form.icon_class} onChange={e=>setForm({...form, icon_class: e.target.value})} placeholder="FaGithub or leave empty for auto emoji" className="mt-1 border-2 border-gray-200 px-4 py-3 rounded-xl w-full text-sm focus:border-gray-900 outline-none" />
          </div>
        </div>
        <div>
          <label className="text-sm font-bold">Profile URL *</label>
          <input value={form.profile_url} onChange={e=>setForm({...form, profile_url: e.target.value})} placeholder="https://github.com/username" className="mt-1 border-2 border-gray-200 px-4 py-3 rounded-xl w-full text-sm focus:border-gray-900 outline-none" />
        </div>

        {form.profile_url && (
          <div className="flex items-center gap-3 p-3 bg-gray-50 border-2 border-gray-200 rounded-xl">
            <div className="w-10 h-10 bg-gray-900 text-white rounded-xl flex items-center justify-center">{getIcon(form.platform_name)}</div>
            <div><p className="font-bold text-sm">{form.platform_name}</p><p className="text-xs text-gray-500 truncate">{form.profile_url}</p></div>
          </div>
        )}

        <button disabled={loading} className="bg-gray-900 text-white px-8 py-3 rounded-full text-sm font-bold hover:bg-black">
          {loading? "Saving..." : editId? "Update" : "+ Save Social Link"}
        </button>
        {editId && <button type="button" onClick={()=>{setEditId(null); setForm({platform_name:"", profile_url:"", icon_class:""})}} className="ml-3 bg-gray-100 px-6 py-3 rounded-full text-sm">Cancel</button>}
      </form>

      <div className="bg-white border-2 border-gray-200 rounded-2xl mt-6 overflow-hidden">
        <div className="p-4 font-bold border-b bg-gray-50">Total: {socials.length}</div>
        {socials.length===0? <p className="p-10 text-center text-gray-400">No links yet</p> :
        <div className="divide-y">
          {socials.map(s=>(
            <div key={s.id} className="flex justify-between items-center p-4 hover:bg-gray-50">
              <div className="flex items-center gap-3"><div className="w-10 h-10 bg-gray-900 text-white rounded-xl flex items-center justify-center">{getIcon(s.platform_name)}</div><div><p className="font-bold text-sm">{s.platform_name}</p><p className="text-xs text-gray-500 truncate max-w-">{s.profile_url}</p></div></div>
              <div className="flex gap-2"><button onClick={()=>handleEdit(s)} className="bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-xs font-bold">Edit</button><button onClick={()=>handleDelete(s.id)} className="bg-red-50 text-red-600 px-4 py-2 rounded-full text-xs font-bold">Delete</button></div>
            </div>
          ))}
        </div>}
      </div>
    </div>
  );
};

export default AdminSocial;