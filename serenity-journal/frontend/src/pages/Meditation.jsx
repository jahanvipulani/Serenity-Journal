import { useState, useEffect, useRef } from "react";
import AppLayout from "../components/AppLayout";
import Enso from "../components/Enso";

const DURATIONS = [5, 10, 15, 20, 30];

// Plays a soft bell tone using the Web Audio API when the session ends
const playBell = () => {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.value = 528;
  gain.gain.setValueAtTime(0.4, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 3);
};

const Meditation = () => {
  const [minutes, setMinutes] = useState(10);
  const [secondsLeft, setSecondsLeft] = useState(minutes * 60);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(intervalRef.current);
          setRunning(false);
          setDone(true);
          playBell();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const selectDuration = (m) => {
    setMinutes(m);
    setSecondsLeft(m * 60);
    setDone(false);
    setRunning(false);
  };

  const toggle = () => {
    if (secondsLeft === 0) selectDuration(minutes);
    setDone(false);
    setRunning((r) => !r);
  };

  const mm = Math.floor(secondsLeft / 60);
  const ss = secondsLeft % 60;
  const progress = 1 - secondsLeft / (minutes * 60);

  return (
    <AppLayout>
      <h1 className="font-display text-3xl mb-6">Meditate</h1>

      <div className="glass-card p-8 flex flex-col items-center">
        <div className="flex gap-2 mb-8 flex-wrap justify-center">
          {DURATIONS.map((m) => (
            <button
              key={m}
              onClick={() => selectDuration(m)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                minutes === m ? "accent-bg text-white" : "bg-white/40 dark:bg-white/10"
              }`}
            >
              {m} min
            </button>
          ))}
        </div>

        <div className="relative flex items-center justify-center h-56 w-56 mb-8">
          <svg viewBox="0 0 120 120" className="absolute h-full w-full -rotate-90">
            <circle cx="60" cy="60" r="52" fill="none" stroke="var(--accent-soft)" strokeWidth="6" />
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 52}
              strokeDashoffset={2 * Math.PI * 52 * (1 - progress)}
              style={{ transition: "stroke-dashoffset 1s linear" }}
            />
          </svg>
          <div className="relative z-10 text-center">
            {done ? (
              <Enso size={48} className="mx-auto" />
            ) : (
              <span className="text-3xl font-display">
                {mm}:{ss.toString().padStart(2, "0")}
              </span>
            )}
          </div>
        </div>

        {done && <p className="opacity-70 mb-4 text-sm">Session complete. Well done.</p>}

        <button
          onClick={toggle}
          className="accent-bg text-white px-8 py-2.5 rounded-full font-medium shadow-soft hover:opacity-90 transition"
        >
          {running ? "Pause" : secondsLeft === 0 || done ? "Restart" : "Start"}
        </button>
      </div>
    </AppLayout>
  );
};

export default Meditation;
