import { motion } from "framer-motion";
import { MOODS } from "../data/moods";

const MoodPicker = ({ value, onChange }) => (
  <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Select your mood">
    {MOODS.map((mood) => (
      <motion.button
        key={mood.id}
        type="button"
        role="radio"
        aria-checked={value === mood.id}
        onClick={() => onChange(mood.id)}
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.08 }}
        className={`flex flex-col items-center justify-center w-16 h-16 rounded-2xl border text-2xl transition-colors ${
          value === mood.id
            ? "border-[var(--accent)] bg-[var(--accent-soft)]"
            : "border-transparent bg-white/40 dark:bg-white/5"
        }`}
      >
        <span>{mood.emoji}</span>
        <span className="text-[10px] font-medium mt-0.5">{mood.label}</span>
      </motion.button>
    ))}
  </div>
);

export default MoodPicker;
