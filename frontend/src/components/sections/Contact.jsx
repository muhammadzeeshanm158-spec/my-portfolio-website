import React, { useState } from "react";
import {
  FaPaperPlane,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";
// ❌ api hata diya — Ab MySQL me save nahi hoga — Sirf Gmail pe jayega!
import toast, { Toaster } from "react-hot-toast";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // ✅ STATIC — Sirf Gmail pe jayega — Web3Forms — Bina backend ke!
      const web3FormData = new FormData();
      web3FormData.append("access_key", "9aaea4ec-bfaf-4393-9edc-496fd876a2a2");
      web3FormData.append("name", formData.name);
      web3FormData.append("email", formData.email);
      web3FormData.append(
        "subject",
        `🚀 New Lead: ${formData.name} - ${formData.subject}`,
      );
      web3FormData.append("message", formData.message);
      web3FormData.append("from_name", "Portfolio Website");
      web3FormData.append("to_email", "muhammadzeeshanm158@gmail.com"); // ✅ Tumhari Gmail

      const web3Res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: web3FormData,
      });
      const web3Result = await web3Res.json();
      console.log("Web3Forms Result:", web3Result);

      if (!web3Result.success) throw new Error("Web3Forms failed");

      toast.success("Message sent successfully!");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      toast.error("Failed to send message — Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact"
      className="py-12 sm:py-16 lg:py-20 bg-gray-50 w-full overflow-hidden"
    >
      <Toaster position="top-right" />
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading - Responsive */}
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text- sm:text-4xl font-extrabold text-gray-900">
            Contact Me
          </h2>
          <p className="text-gray-500 mt-2 text-sm sm:text-base max-w-xl mx-auto px-2">
            Have a question or want to work together? Send me a message
          </p>
          <div className="w-16 sm:w-20 h-1 bg-gray-900 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-12 max-w-6xl mx-auto">
          {/* LEFT: Contact Info - Full width on mobile */}
          <div className="flex-1 w-full">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 border border-gray-100 shadow-sm h-full">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                Let's Talk
              </h3>
              <p className="text-gray-500 mt-3 text-sm leading-relaxed">
                Have a project in mind? Fill out the form and I'll get back to
                you within 24 hours.
              </p>

              <div className="mt-6 sm:mt-8 space-y-5 sm:space-y-6">
                <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-900 text-white rounded-full flex items-center justify-center shrink-0">
                    <FaEnvelope className="text-sm" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text- sm:text-xs text-gray-500 uppercase tracking-wide">
                      Email
                    </p>
                    <p className="font-bold text-gray-900 text-sm sm:text-base break-all">
                      muhammadzeeshanm158@gmail.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-900 text-white rounded-full flex items-center justify-center shrink-0">
                    <FaMapMarkerAlt className="text-sm" />
                  </div>
                  <div>
                    <p className="text- sm:text-xs text-gray-500 uppercase tracking-wide">
                      Location
                    </p>
                    <p className="font-bold text-gray-900 text-sm sm:text-base">
                      Karachi, Pakistan
                    </p>
                  </div>
                </div>

                <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-900 text-white rounded-full flex items-center justify-center shrink-0">
                    <FaPhone className="text-sm" />
                  </div>
                  <div>
                    <p className="text- sm:text-xs text-gray-500 uppercase tracking-wide">
                      Phone
                    </p>
                    <p className="font-bold text-gray-900 text-sm sm:text-base">
                      +92 3232105875
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 sm:mt-10 bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-5">
                <p className="text-sm font-bold text-gray-900">Response Time</p>
                <p className="text-xs sm:text- text-gray-500 mt-1 leading-relaxed">
                  Usually within 24 hours. Your message goes directly to my Gmail.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: Contact Form */}
          <div className="flex-1 w-full">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 border border-gray-100 shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                <div>
                  <label className="text-xs sm:text-sm font-medium text-gray-700">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter Your Name"
                    className="w-full mt-1.5 sm:mt-2 px-4 py-3 sm:py-3 rounded-xl border border-gray-200 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 focus:outline-none text-sm transition"
                  />
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-medium text-gray-700">
                    Your Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter Your Email Address"
                    className="w-full mt-1.5 sm:mt-2 px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 focus:outline-none text-sm transition"
                  />
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-medium text-gray-700">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Project Inquiry"
                    className="w-full mt-1.5 sm:mt-2 px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 focus:outline-none text-sm transition"
                  />
                </div>

                <div>
                  <label className="text-xs sm:text-sm font-medium text-gray-700">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    placeholder="Write your message here..."
                    className="w-full mt-1.5 sm:mt-2 px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 focus:outline-none text-sm resize-none transition"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gray-900 text-white py-3.5 rounded-full font-medium flex items-center justify-center gap-2 hover:bg-black active:scale-[0.98] transition-all disabled:opacity-50 text-sm sm:text-base touch-manipulation"
                >
                  <FaPaperPlane size={14} />{" "}
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;