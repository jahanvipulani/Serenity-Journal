import { useEffect, useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import AppLayout from "../components/AppLayout";
import api from "../utils/api";
import { getMood } from "../data/moods";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const RANGES = [
  { id: "week", label: "This week" },
  { id: "month", label: "This month" },
  { id: "year", label: "This year" },
];

const Analytics = () => {
  const [range, setRange] = useState("month");
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get(`/journals/analytics/summary?range=${range}`).then(({ data }) => setData(data));
  }, [range]);

  if (!data) {
    return (
      <AppLayout>
        <p className="opacity-60">Loading your mood analytics…</p>
      </AppLayout>
    );
  }

  const labels = Object.keys(data.distribution);
  const values = Object.values(data.distribution);
  const colors = labels.map((l) => getMood(l).color);

  const barData = {
    labels: labels.map((l) => getMood(l).label),
    datasets: [{ label: "Entries", data: values, backgroundColor: colors, borderRadius: 8 }],
  };

  const doughnutData = {
    labels: labels.map((l) => getMood(l).label),
    datasets: [{ data: values, backgroundColor: colors, borderWidth: 0 }],
  };

  const mostCommon = data.mostCommon ? getMood(data.mostCommon) : null;

  return (
    <AppLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="font-display text-3xl">Mood analytics</h1>
        <div className="flex gap-2">
          {RANGES.map((r) => (
            <button
              key={r.id}
              onClick={() => setRange(r.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                range === r.id ? "accent-bg text-white" : "glass-card"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-5 mb-6">
        <div className="glass-card p-6 text-center">
          <p className="text-3xl">{mostCommon?.emoji || "—"}</p>
          <p className="text-sm opacity-70 mt-1">Most common mood</p>
        </div>
        <div className="glass-card p-6 text-center">
          <p className="text-3xl font-display">{data.totalEntries}</p>
          <p className="text-sm opacity-70 mt-1">Entries in range</p>
        </div>
        <div className="glass-card p-6 text-center">
          <p className="text-3xl font-display">{data.currentStreak}</p>
          <p className="text-sm opacity-70 mt-1">Current streak (longest: {data.longestStreak})</p>
        </div>
      </div>

      {labels.length === 0 ? (
        <div className="glass-card p-10 text-center opacity-60">
          No entries yet for this range — write a journal entry to see your mood patterns.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          <div className="glass-card p-6">
            <h2 className="font-display text-lg mb-4">Mood distribution</h2>
            <Bar data={barData} options={{ plugins: { legend: { display: false } } }} />
          </div>
          <div className="glass-card p-6">
            <h2 className="font-display text-lg mb-4">Emotion breakdown</h2>
            <Doughnut data={doughnutData} />
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default Analytics;
