import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import Enso from "../components/Enso";
import AnimatedBackground from "../components/AnimatedBackground";

const Register = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError("Please enter a username.");
      return;
    }
    setError("");
    const res = await register({ username });
    if (res.success) navigate("/dashboard");
    else setError(res.message);
  };

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
        <h1 className="font-display text-2xl text-center mb-1">Enter your journal</h1>
        <p className="text-sm opacity-70 text-center mb-6">
          Enter a unique username to access your existing journal or start a new one.
        </p>

        {error && (
          <p className="text-sm text-red-500 bg-red-500/10 rounded-lg px-3 py-2 mb-4">
            {error}
          </p>
        )}

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1.5 opacity-80">Username</label>
          <input
            type="text"
            required
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="e.g. serenity_writer"
            className="w-full px-4 py-3 rounded-xl bg-white/60 dark:bg-white/10 outline-none focus:ring-2 focus:ring-[var(--accent)] text-center font-medium placeholder-black/30 dark:placeholder-white/30"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full accent-bg text-white py-3 rounded-full font-medium shadow-soft hover:opacity-90 transition disabled:opacity-60 text-base"
        >
          {loading ? "Accessing journal…" : "Enter Journal"}
        </button>
      </motion.form>
    </div>
  );
};

export default Register;

