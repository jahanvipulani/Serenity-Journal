import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import AppLayout from "../components/AppLayout";

const PATTERNS = {
  "4-4-4": { inhale: 4, hold: 4, exhale: 4, label: "Box breathing (4-4-4)" },
  "4-7-8": { inhale: 4, hold: 7, exhale: 8, label: "Relaxing breath (4-7-8)" },
};

const Breathing = () => {
  const [patternKey, setPatternKey] = useState("4-4-4");
  const [phase, setPhase] = useState("inhale");
  const [secondsLeft, setSecondsLeft] = useState(PATTERNS[patternKey].inhale);
  const [running, setRunning] = useState(false);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const SESSION_LENGTH = 5 * 60; // 5 minute timer, as requested

  const pattern = PATTERNS[patternKey];

  useEffect(() => {
    if (!running) return;
    if (sessionSeconds >= SESSION_LENGTH) {
      setRunning(false);
      return;
    }

    const tick = setInterval(() => {
      setSessionSeconds((s) => s + 1);
      setSecondsLeft((s) => {
        if (s > 1) return s - 1;
        // current phase just finished - advance to the next one
        setPhase((p) => {
          if (p === "inhale") return pattern.hold > 0 ? "hold" : "exhale";
          if (p === "hold") return "exhale";
          return "inhale";
        });
        return 1; // will be overwritten by the phase-change effect below
      });
    }, 1000);
    return () => clearInterval(tick);
  }, [running, sessionSeconds, pattern]);

  // Whenever the phase changes, reset the countdown to that phase's duration
  useEffect(() => {
    if (phase === "inhale") setSecondsLeft(pattern.inhale);
    if (phase === "hold") setSecondsLeft(pattern.hold);
    if (phase === "exhale") setSecondsLeft(pattern.exhale);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const start = () => {
    setPhase("inhale");
    setSessionSeconds(0);
    setRunning(true);
  };
  const stop = () => setRunning(false);

  const scale = phase === "inhale" ? 1.4 : phase === "exhale" ? 0.8 : 1.2;
  const duration = pattern[phase] || 4;

  const minutesLeft = Math.floor((SESSION_LENGTH - sessionSeconds) / 60);
  const secsLeft = (SESSION_LENGTH - sessionSeconds) % 60;

  return (
    <AppLayout>
      <h1 className="font-display text-3xl mb-6">Breathe</h1>

      <div className="glass-card p-8 flex flex-col items-center">
        <div className="flex gap-2 mb-8">
          {Object.entries(PATTERNS).map(([key, p]) => (
            <button
              key={key}
              onClick={() => {
                setPatternKey(key);
                setRunning(false);
                setPhase("inhale");
                setSessionSeconds(0);
              }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                patternKey === key ? "accent-bg text-white" : "bg-white/40 dark:bg-white/10"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="relative flex items-center justify-center h-64 w-64 mb-8">
          <motion.div
            animate={{ scale }}
            transition={{ duration, ease: "easeInOut" }}
            className="absolute h-40 w-40 rounded-full"
            style={{ background: "var(--accent-soft)" }}
          />
          <motion.div
            animate={{ scale }}
            transition={{ duration, ease: "easeInOut" }}
            className="absolute h-28 w-28 rounded-full accent-bg opacity-70"
          />
          <span className="relative z-10 text-lg font-medium capitalize">
            {running ? phase : "Ready"}
          </span>
        </div>

        {running && (
          <p className="text-sm opacity-70 mb-4">
            {minutesLeft}:{secsLeft.toString().padStart(2, "0")} remaining
          </p>
        )}

        <button
          onClick={running ? stop : start}
          className="accent-bg text-white px-8 py-2.5 rounded-full font-medium shadow-soft hover:opacity-90 transition"
        >
          {running ? "Stop" : "Start 5-minute session"}
        </button>
      </div>
    </AppLayout>
  );
};

export default Breathing;
