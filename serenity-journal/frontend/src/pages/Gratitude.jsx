import { useEffect, useState } from "react";
import { FiHeart, FiTrash2 } from "react-icons/fi";
import AppLayout from "../components/AppLayout";
import api from "../utils/api";

const Gratitude = () => {
  const [history, setHistory] = useState([]);
  const [items, setItems] = useState(["", "", ""]);

  useEffect(() => {
    api.get("/gratitude").then(({ data }) => setHistory(data));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    const filled = items.filter((i) => i.trim());
    if (!filled.length) return;
    const { data } = await api.post("/gratitude", { items: filled });
    setHistory((prev) => [data, ...prev]);
    setItems(["", "", ""]);
  };

  const remove = async (entry) => {
    await api.delete(`/gratitude/${entry._id}`);
    setHistory((prev) => prev.filter((e) => e._id !== entry._id));
  };

  return (
    <AppLayout>
      <h1 className="font-display text-3xl mb-2 flex items-center gap-2">
        <FiHeart className="accent-text" /> Gratitude
      </h1>
      <p className="opacity-60 mb-6 text-sm">Three things you're grateful for today.</p>

      <form onSubmit={submit} className="glass-card p-6 mb-6 space-y-3">
        {items.map((val, i) => (
          <input
            key={i}
            value={val}
            onChange={(e) => {
              const next = [...items];
              next[i] = e.target.value;
              setItems(next);
            }}
            placeholder={`Gratitude ${i + 1}`}
            className="w-full bg-white/40 dark:bg-white/10 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-[var(--accent)]"
          />
        ))}
        <button className="accent-bg text-white px-6 py-2.5 rounded-full font-medium shadow-soft hover:opacity-90 transition">
          Save
        </button>
      </form>

      <div className="space-y-3">
        {history.map((entry) => (
          <div key={entry._id} className="glass-card p-4 flex items-start justify-between gap-3">
            <div>
              <p className="text-xs opacity-60 mb-1">
                {new Date(entry.date).toLocaleDateString()}
              </p>
              <ul className="list-disc list-inside text-sm space-y-0.5">
                {entry.items.map((it, idx) => (
                  <li key={idx}>{it}</li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => remove(entry)}
              className="opacity-40 hover:text-red-500 hover:opacity-100"
            >
              <FiTrash2 />
            </button>
          </div>
        ))}
        {history.length === 0 && (
          <p className="opacity-60 text-sm text-center py-6">
            Nothing recorded yet — start with one small thing.
          </p>
        )}
      </div>
    </AppLayout>
  );
};

export default Gratitude;
