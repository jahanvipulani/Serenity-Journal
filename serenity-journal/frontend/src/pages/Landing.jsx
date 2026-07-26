import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Enso from "../components/Enso";
import AnimatedBackground from "../components/AnimatedBackground";

const Landing = () => (
  <div className="relative min-h-screen flex items-center justify-center px-6" data-theme="sakura">
    <AnimatedBackground />
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="glass-card relative z-10 max-w-lg w-full text-center p-10"
    >
      <div className="flex justify-center mb-4">
        <Enso size={64} />
      </div>
      <h1 className="font-display text-4xl mb-2">Serenity Journal</h1>
      <p className="opacity-75 mb-8">
        A quiet place to write, breathe, and notice how you feel — one calm
        day at a time.
      </p>
      <div className="flex gap-3 justify-center">
        <Link
          to="/register"
          className="accent-bg text-white px-6 py-2.5 rounded-full font-medium shadow-soft hover:opacity-90 transition"
        >
          Begin journaling
        </Link>
        <Link
          to="/login"
          className="px-6 py-2.5 rounded-full font-medium border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent-soft)] transition"
        >
          Log in
        </Link>
      </div>
    </motion.div>
  </div>
);

export default Landing;
