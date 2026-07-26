import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { FiPlus, FiSearch } from "react-icons/fi";
import AppLayout from "../components/AppLayout";
import JournalCard from "../components/JournalCard";
import api from "../utils/api";
import { MOODS } from "../data/moods";

const Journal = () => {
  const [entries, setEntries] = useState([]);
  const [search, setSearch] = useState("");
  const [moodFilter, setMoodFilter] = useState("");
  const [favoriteOnly, setFavoriteOnly] = useState(false);

  const fetchEntries = useCallback(async () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (moodFilter) params.set("mood", moodFilter);
    if (favoriteOnly) params.set("favorite", "true");
    const { data } = await api.get(`/journals?${params.toString()}`);
    setEntries(data);
  }, [search, moodFilter, favoriteOnly]);

  useEffect(() => {
    const t = setTimeout(fetchEntries, 250); // debounce search typing
    return () => clearTimeout(t);
  }, [fetchEntries]);

  const toggleFavorite = async (entry) => {
    const { data } = await api.put(`/journals/${entry._id}`, {
      isFavorite: !entry.isFavorite,
    });
    setEntries((prev) => prev.map((e) => (e._id === data._id ? data : e)));
  };

  const deleteEntry = async (entry) => {
    if (!confirm(`Delete "${entry.title}"? This can't be undone.`)) return;
    await api.delete(`/journals/${entry._id}`);
    setEntries((prev) => prev.filter((e) => e._id !== entry._id));
  };

  return (
    <AppLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="font-display text-3xl">Your journal</h1>
        <Link
          to="/journal/new"
          className="accent-bg text-white px-5 py-2.5 rounded-full font-medium shadow-soft hover:opacity-90 transition flex items-center gap-2 w-fit"
        >
          <FiPlus /> New entry
        </Link>
      </div>

      <div className="glass-card p-4 mb-6 flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 flex-1 bg-white/50 dark:bg-white/10 rounded-xl px-3">
          <FiSearch className="opacity-50" />
          <input
            placeholder="Search by title, keyword, or tag…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent py-2 outline-none w-full text-sm"
          />
        </div>
        <select
          value={moodFilter}
          onChange={(e) => setMoodFilter(e.target.value)}
          className="bg-white/50 dark:bg-white/10 rounded-xl px-3 py-2 text-sm outline-none"
        >
          <option value="">All moods</option>
          {MOODS.map((m) => (
            <option key={m.id} value={m.id}>
              {m.emoji} {m.label}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-sm px-3 py-2">
          <input
            type="checkbox"
            checked={favoriteOnly}
            onChange={(e) => setFavoriteOnly(e.target.checked)}
          />
          Favorites only
        </label>
      </div>

      {entries.length === 0 ? (
        <p className="opacity-60 text-center py-12">
          Nothing here yet. Try a different search, or write a new entry.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {entries.map((entry) => (
            <JournalCard
              key={entry._id}
              entry={entry}
              onToggleFavorite={toggleFavorite}
              onDelete={deleteEntry}
            />
          ))}
        </div>
      )}
    </AppLayout>
  );
};

export default Journal;
