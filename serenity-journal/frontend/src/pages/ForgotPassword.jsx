import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../utils/api";
import Enso from "../components/Enso";
import AnimatedBackground from "../components/AnimatedBackground";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const findQuestion = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/auth/forgot-password/question", { email });
      setQuestion(data.securityQuestion);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/auth/forgot-password/reset", {
        email,
        securityAnswer: answer,
        newPassword,
      });
      setMessage(data.message);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-6" data-theme="sakura">
      <AnimatedBackground />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card relative z-10 w-full max-w-sm p-8"
      >
        <div className="flex justify-center mb-3">
          <Enso size={44} />
        </div>
        <h1 className="font-display text-2xl text-center mb-6">Reset your password</h1>

        {error && (
          <p className="text-sm text-red-500 bg-red-500/10 rounded-lg px-3 py-2 mb-4">{error}</p>
        )}
        {message && (
          <p className="text-sm text-green-600 bg-green-500/10 rounded-lg px-3 py-2 mb-4">
            {message}
          </p>
        )}

        {step === 1 && (
          <form onSubmit={findQuestion}>
            <label className="block text-sm font-medium mb-1">Account email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mb-4 px-4 py-2 rounded-xl bg-white/60 dark:bg-white/10 outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
            <button
              type="submit"
              className="w-full accent-bg text-white py-2.5 rounded-full font-medium shadow-soft hover:opacity-90 transition"
            >
              Continue
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={resetPassword}>
            <p className="text-sm mb-4 opacity-80">{question}</p>
            <label className="block text-sm font-medium mb-1">Your answer</label>
            <input
              required
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full mb-4 px-4 py-2 rounded-xl bg-white/60 dark:bg-white/10 outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
            <label className="block text-sm font-medium mb-1">New password</label>
            <input
              type="password"
              required
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full mb-4 px-4 py-2 rounded-xl bg-white/60 dark:bg-white/10 outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
            <button
              type="submit"
              className="w-full accent-bg text-white py-2.5 rounded-full font-medium shadow-soft hover:opacity-90 transition"
            >
              Reset password
            </button>
          </form>
        )}

        <p className="text-sm text-center mt-5 opacity-75">
          <Link to="/login" className="accent-text font-medium hover:underline">
            Back to log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
