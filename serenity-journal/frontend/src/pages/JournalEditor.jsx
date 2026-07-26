import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiStar, FiSave, FiTrash2 } from "react-icons/fi";
import { BsPinAngle, BsPinAngleFill } from "react-icons/bs";
import AppLayout from "../components/AppLayout";
import MoodPicker from "../components/MoodPicker";
import api from "../utils/api";

const isNew = (id) => id === "new";

const JournalEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entry, setEntry] = useState({
    title: "",
    body: "",
    mood: "neutral",
    tags: [],
    isFavorite: false,
    isPinned: false,
  });
  const [tagInput, setTagInput] = useState("");
  const [status, setStatus] = useState(""); // "Saving…" / "Saved"
  const saveTimeout = useRef(null);
  const entryId = useRef(id);

  useEffect(() => {
    if (!isNew(id)) {
      api.get(`/journals/${id}`).then(({ data }) => setEntry(data));
    }
  }, [id]);

  const wordCount = entry.body?.trim() ? entry.body.trim().split(/\s+/).length : 0;
  const charCount = entry.body?.length || 0;

  const persist = useCallback(async (payload) => {
    setStatus("Saving…");
    if (isNew(entryId.current)) {
      const { data } = await api.post("/journals", payload);
      entryId.current = data._id;
      navigate(`/journal/${data._id}`, { replace: true });
    } else {
      await api.put(`/journals/${entryId.current}`, payload);
    }
    setStatus("Saved");
  }, [navigate]);

  // Debounced autosave whenever title/body/mood/tags change
  const scheduleSave = (nextEntry) => {
    setEntry(nextEntry);
    clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      persist({
        title: nextEntry.title,
        body: nextEntry.body,
        mood: nextEntry.mood,
        tags: nextEntry.tags,
      });
    }, 800);
  };

  const addTag = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      scheduleSave({ ...entry, tags: [...new Set([...entry.tags, tagInput.trim()])] });
      setTagInput("");
    }
  };

  const removeTag = (tag) =>
    scheduleSave({ ...entry, tags: entry.tags.filter((t) => t !== tag) });

  const toggleFlag = async (key) => {
    const updated = { ...entry, [key]: !entry[key] };
    setEntry(updated);
    if (!isNew(entryId.current)) {
      await api.put(`/journals/${entryId.current}`, { [key]: updated[key] });
    }
  };

  const handleDelete = async () => {
    if (isNew(entryId.current)) return navigate("/journal");
    if (!confirm("Delete this entry? This can't be undone.")) return;
    await api.delete(`/journals/${entryId.current}`);
    navigate("/journal");
  };

  return (
    <AppLayout>
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-6 md:p-8 max-w-3xl mx-auto"
      >
        <div className="flex items-center justify-between mb-4">
          <input
            value={entry.title}
            onChange={(e) => scheduleSave({ ...entry, title: e.target.value })}
            placeholder="Entry title"
            className="font-display text-2xl bg-transparent outline-none flex-1"
          />
          <div className="flex items-center gap-3 text-lg">
            <button onClick={() => toggleFlag("isPinned")} aria-label="Pin entry">
              {entry.isPinned ? <BsPinAngleFill className="accent-text" /> : <BsPinAngle className="opacity-50" />}
            </button>
            <button onClick={() => toggleFlag("isFavorite")} aria-label="Favorite entry">
              <FiStar
                className={entry.isFavorite ? "text-yellow-500" : "opacity-50"}
                fill={entry.isFavorite ? "currentColor" : "none"}
              />
            </button>
          </div>
        </div>

        <MoodPicker value={entry.mood} onChange={(mood) => scheduleSave({ ...entry, mood })} />

        <textarea
          value={entry.body}
          onChange={(e) => scheduleSave({ ...entry, body: e.target.value })}
          placeholder="What's on your mind today?"
          rows={12}
          className="w-full mt-5 bg-white/40 dark:bg-white/5 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-[var(--accent)] resize-none leading-relaxed"
        />

        <div className="flex flex-wrap gap-2 mt-3">
          {entry.tags.map((tag) => (
            <button
              key={tag}
              onClick={() => removeTag(tag)}
              className="text-xs px-3 py-1 rounded-full bg-[var(--accent-soft)] hover:opacity-70"
              title="Remove tag"
            >
              #{tag} ×
            </button>
          ))}
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={addTag}
            placeholder="Add emotion tag + Enter"
            className="text-xs px-3 py-1 rounded-full bg-white/40 dark:bg-white/5 outline-none"
          />
        </div>

        <div className="flex items-center justify-between mt-6 text-sm opacity-60">
          <span>
            {wordCount} words · {charCount} characters
          </span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <FiSave /> {status}
            </span>
            <button
              onClick={handleDelete}
              className="flex items-center gap-1 text-red-500 hover:opacity-80"
            >
              <FiTrash2 /> Delete
            </button>
          </div>
        </div>
      </motion.div>
    </AppLayout>
  );
};

export default JournalEditor;
