import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  HiX,
  HiMail,
  HiLockClosed,
  HiLogin,
  HiArrowRight,
} from "react-icons/hi";
import { GiGreekTemple } from "react-icons/gi";

const Login = ({ onClose, onSwitchToRegister }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(formData);

      if (result.success) {
        onClose();
      } else {
        setError(result.message || "Login failed. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 glass-dark flex items-center justify-center p-4 animate-fadeIn"
      style={{ zIndex: 9999 }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-md w-full shadow-2xl border-4 border-slate-200 animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 py-5 flex justify-between items-center rounded-t-3xl">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <GiGreekTemple className="text-3xl" />
            Login
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full w-10 h-10 flex items-center justify-center text-2xl leading-none transition-all duration-300 hover:rotate-90"
          >
            <HiX />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="bg-red-50 border-2 border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4 flex items-center gap-2">
              <HiX className="text-xl flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label
                htmlFor="login-email"
                className="block text-gray-700 text-sm font-semibold mb-2 flex items-center gap-2"
              >
                <HiMail className="text-lg text-purple-600" />
                Email
              </label>
              <input
                id="login-email"
                type="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  setError(""); // Clear error when user types
                }}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 bg-white"
                placeholder="your.email@example.com"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="block text-gray-700 text-sm font-semibold mb-2 flex items-center gap-2"
              >
                <HiLockClosed className="text-lg text-purple-600" />
                Password
              </label>
              <input
                id="login-password"
                type="password"
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  setError(""); // Clear error when user types
                }}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 bg-white"
                placeholder="Enter your password"
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:transform-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Logging in...
                </>
              ) : (
                <>
                  <HiLogin className="text-xl" />
                  Login
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t-2 border-slate-200">
            <p className="text-center text-gray-600 text-sm">
              Don't have an account?{" "}
              <button
                onClick={onSwitchToRegister}
                className="text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-1 mx-auto mt-2 transition-colors"
              >
                Register now
                <HiArrowRight className="text-lg" />
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
