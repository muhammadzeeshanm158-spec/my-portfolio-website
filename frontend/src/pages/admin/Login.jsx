import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function validate() {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required!";
    } else if (!email.includes("@") || !email.includes(".")) {
      newErrors.email = "Valid email required!";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required!";
    } else if (password.length < 6) {
      newErrors.password = "Min 6 characters!";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleLogin(e) {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/admins/login",
        {
          email: email.trim(),
          password: password,
        }
      );

      if (res.data.success) {
        localStorage.setItem("isAdmin", "true");
        localStorage.setItem("token", res.data.token);

        setEmail("");
        setPassword("");
        setErrors({});

        // ✅ FIX: /admin ki jagah secret panel pe bhejo
        navigate("/zp-secret-2026");
      }
    } catch (err) {
      setErrors({
        general:
          err.response?.data?.message ||
          "Invalid email or password!",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-6 sm:py-8">
      <div className="bg-white rounded-3xl p-6 sm:p-9 w-full max-w-md shadow-2xl">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">

            {/* Logo */}
            <div className="w-14 h-14 shrink-0 bg-black text-white rounded-xl flex items-center justify-center font-black text-xl">
              MZ
            </div>

            {/* Single-line heading */}
            {/* <h1 className="text-2xl sm:text-3xl font-black text-black whitespace-nowrap">
              Admin Login
            </h1> */}

          </div>

          <p className="text-sm text-gray-500 mt-4">
            Only Zeeshan can login
          </p>
        </div>

        {/* General Error */}
        {errors.general && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-sm p-3 rounded-xl mb-5 text-center">
            {errors.general}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} autoComplete="off" className="space-y-5">

          {/* Email */}
          <div>
            <label className="text-sm font-semibold text-slate-900 mb-2 block">
              Email
            </label>

            <input
              type="email"
              name="admin-login-email"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:border-black"
            />

            {errors.email && (
              <p className="text-xs text-red-500 mt-2">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-semibold text-slate-900 mb-2 block">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="admin-login-password"
                autoComplete="new-password"
                value={password}
                autoCapitalize="off"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3.5 pr-12 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:border-black"
              />

              {/* Show / Hide Password */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
              </button>
            </div>

            {errors.password && (
              <p className="text-xs text-red-500 mt-2">
                {errors.password}
              </p>
            )}
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3.5 rounded-xl font-bold text-sm hover:bg-zinc-900 active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login to Dashboard"}
          </button>
        </form>

        {/* Back to Website */}
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-xs font-medium text-gray-400 hover:text-black"
          >
            Back to Website
          </Link>
        </div>

      </div>
    </div>
  );
};

export default AdminLogin;