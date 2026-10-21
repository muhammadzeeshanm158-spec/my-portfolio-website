import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import toast, { Toaster } from "react-hot-toast";

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await api.get('/messages');
      const data = res.data?.data || res.data || res.data?.messages || [];
      setMessages(Array.isArray(data)? data : []);
    } catch (err) {
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMessages(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this message?')) return;
    try {
      await api.delete(`/messages/${id}`);
      toast.success("Message deleted!");
      fetchMessages();
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <Toaster position="top-right" />

      {/* Header Responsive */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Contact Messages</h2>
        <span className="text-xs bg-gray-100 px-3 py-1 rounded-full w-fit">{messages.length} messages</span>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl sm:rounded-[1.5rem] overflow-hidden shadow-sm">
        <div className="p-4 sm:p-5 font-bold border-b bg-gray-50/50 flex flex-col sm:flex-row justify-between gap-3 sm:items-center">
          <span className="text-sm sm:text-base">Total Messages: {loading? "Loading..." : messages.length}</span>
          <button onClick={fetchMessages} disabled={loading} className="text-xs bg-gray-900 text-white px-4 sm:px-5 py-2 sm:py-2 rounded-full hover:bg-black transition disabled:opacity-50 w-fit active:scale-95 touch-manipulation">
            {loading? "Refreshing..." : "↻ Refresh"}
          </button>
        </div>

        {messages.length === 0? (
          <div className="p-8 sm:p-12 text-center">
            <p className="text-4xl sm:text-5xl mb-3">📭</p>
            <p className="text-gray-500 text-sm sm:text-base">No messages yet</p>
            <p className="text-gray-400 text-xs sm:text-sm mt-1 max-w-sm mx-auto">Messages from the contact form will appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {messages.map((m, index) => (
              <div key={`message-${m.id || index}`} className="p-4 sm:p-5 hover:bg-gray-50/50 transition group">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    {/* Name + Email - Responsive */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      <h4 className="font-bold text-gray-900 text-sm sm:text-base truncate">{m.name}</h4>
                      <span className="text-xs font-normal text-gray-500 truncate sm:bg-gray-100 sm:px-2 sm:py-0.5 sm:rounded-full">{m.email}</span>
                    </div>

                    {/* Subject + Date */}
                    <div className="flex flex-col xs:flex-row xs:items-center gap-1 sm:gap-2 mt-1.5">
                      <p className="text-xs sm:text-sm text-gray-700 font-medium bg-blue-50 text-blue-700 px-2 py-1 rounded-full w-fit max-w-full truncate">
                        {m.subject || 'No subject'}
                      </p>
                      <p className="text- sm:text-xs text-gray-400">
                        {m.created_at? new Date(m.created_at).toLocaleString() : 'Just now'}
                      </p>
                    </div>

                    {/* Message - Responsive + Break words */}
                    <p className="text-xs sm:text-sm mt-3 bg-gray-50 group-hover:bg-white border border-transparent group-hover:border-gray-100 p-3 sm:p-4 rounded-xl leading-relaxed break-words whitespace-pre-wrap transition">
                      {m.message}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-row sm:flex-col gap-2 shrink-0 self-start sm:self-start">
                    <a href={`mailto:${m.email}?subject=Re: ${m.subject || ''}`} className="bg-gray-900 text-white hover:bg-black px-4 py-2 rounded-full text-xs font-medium transition text-center touch-manipulation active:scale-95">
                      Reply
                    </a>
                    <button onClick={()=>handleDelete(m.id)} className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-full text-xs font-bold transition touch-manipulation active:scale-95">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tip */}
      {messages.length > 0 && (
        <p className="text- text-gray-400 text-center mt-4">💡 Tip: Click Reply to open email client directly</p>
      )}
    </div>
  );
};

export default AdminMessages;