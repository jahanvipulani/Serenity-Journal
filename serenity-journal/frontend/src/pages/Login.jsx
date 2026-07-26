import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import Enso from "../components/Enso";
import AnimatedBackground from "../components/AnimatedBackground";

const Login = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const res = await login(form);
    if (res.success) navigate("/dashboard");
    else setError(res.message);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-6" data-theme="sakura">
      <AnimatedBackground />
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card relative z-10 w-full max-w-sm p-8"
      >
        <div className="flex justify-center mb-3">
          <Enso size={44} />
        </div>
        <h1 className="font-display text-2xl text-center mb-6">Welcome back</h1>

        {error && (
          <p className="text-sm text-red-500 bg-red-500/10 rounded-lg px-3 py-2 mb-4">
            {error}
          </p>
        )}

        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full mb-4 px-4 py-2 rounded-xl bg-white/60 dark:bg-white/10 outline-none focus:ring-2 focus:ring-[var(--accent)]"
        />

        <label className="block text-sm font-medium mb-1">Password</label>
        <input
          type="password"
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full mb-2 px-4 py-2 rounded-xl bg-white/60 dark:bg-white/10 outline-none focus:ring-2 focus:ring-[var(--accent)]"
        />
        <Link to="/forgot-password" className="text-xs accent-text hover:underline">
          Forgot password?
        </Link>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-5 accent-bg text-white py-2.5 rounded-full font-medium shadow-soft hover:opacity-90 transition disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Log in"}
        </button>

        <p className="text-sm text-center mt-5 opacity-75">
          New here?{" "}
          <Link to="/register" className="accent-text font-medium hover:underline">
            Create an account
          </Link>
        </p>
      </motion.form>
    </div>
  );
};

export default Login;
