import { Link } from "react-router-dom";
import { FiStar, FiTrash2 } from "react-icons/fi";
import { motion } from "framer-motion";
import { getMood } from "../data/moods";

const JournalCard = ({ entry, onToggleFavorite, onDelete }) => {
  const mood = getMood(entry.mood);
  const preview = entry.body?.slice(0, 120) || "";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-5 flex flex-col gap-2"
    >
      <div className="flex items-start justify-between gap-2">
        <Link to={`/journal/${entry._id}`} className="flex-1">
          <p className="font-display text-lg leading-tight">{entry.title}</p>
          <p className="text-xs opacity-60">
            {new Date(entry.entryDate).toLocaleDateString(undefined, {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </p>
        </Link>
        <span className="text-xl" title={mood.label}>
          {mood.emoji}
        </span>
      </div>

      <p className="text-sm opacity-70 line-clamp-3">{preview}</p>

      {entry.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {entry.tags.map((t) => (
            <span
              key={t}
              className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--accent-soft)]"
            >
              #{t}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mt-1">
        <span className="text-xs opacity-50">{entry.wordCount} words</span>
        <div className="flex gap-2">
          <button
            onClick={() => onToggleFavorite(entry)}
            aria-label="Toggle favorite"
            className={entry.isFavorite ? "text-yellow-500" : "opacity-40 hover:opacity-80"}
          >
            <FiStar fill={entry.isFavorite ? "currentColor" : "none"} />
          </button>
          <button
            onClick={() => onDelete(entry)}
            aria-label="Delete entry"
            className="opacity-40 hover:text-red-500 hover:opacity-100"
          >
            <FiTrash2 />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default JournalCard;
