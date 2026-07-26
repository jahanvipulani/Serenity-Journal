import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import Enso from "../components/Enso";
import AnimatedBackground from "../components/AnimatedBackground";

const Register = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    securityQuestion: "What is your favorite place?",
    securityAnswer: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const res = await register(form);
    if (res.success) navigate("/dashboard");
    else setError(res.message);
  };

  const field = (key, label, type = "text") => (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type={type}
        required
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        className="w-full px-4 py-2 rounded-xl bg-white/60 dark:bg-white/10 outline-none focus:ring-2 focus:ring-[var(--accent)]"
      />
    </div>
  );

  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 py-10" data-theme="sakura">
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
        <h1 className="font-display text-2xl text-center mb-6">Begin your journal</h1>

        {error && (
          <p className="text-sm text-red-500 bg-red-500/10 rounded-lg px-3 py-2 mb-4">
            {error}
          </p>
        )}

        {field("name", "Name")}
        {field("email", "Email", "email")}
        {field("password", "Password (min 6 characters)", "password")}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Security question</label>
          <select
            value={form.securityQuestion}
            onChange={(e) => setForm({ ...form, securityQuestion: e.target.value })}
            className="w-full px-4 py-2 rounded-xl bg-white/60 dark:bg-white/10 outline-none focus:ring-2 focus:ring-[var(--accent)]"
          >
            <option>What is your favorite place?</option>
            <option>What was your first pet's name?</option>
            <option>What is your mother's maiden name?</option>
            <option>What was the name of your first school?</option>
          </select>
        </div>
        {field("securityAnswer", "Your answer (used to reset your password later)")}

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 accent-bg text-white py-2.5 rounded-full font-medium shadow-soft hover:opacity-90 transition disabled:opacity-60"
        >
          {loading ? "Creating account…" : "Create account"}
        </button>

        <p className="text-sm text-center mt-5 opacity-75">
          Already journaling with us?{" "}
          <Link to="/login" className="accent-text font-medium hover:underline">
            Log in
          </Link>
        </p>
      </motion.form>
    </div>
  );
};

export default Register;
