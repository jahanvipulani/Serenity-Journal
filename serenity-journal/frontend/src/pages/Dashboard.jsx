import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiZap } from "react-icons/fi";
import AppLayout from "../components/AppLayout";
import QuoteCard from "../components/QuoteCard";
import Enso from "../components/Enso";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { getMood } from "../data/moods";

const Dashboard = () => {
  const { user } = useAuth();
  const [recent, setRecent] = useState([]);
  const [streak, setStreak] = useState({ currentStreak: 0, longestStreak: 0 });

  useEffect(() => {
    api.get("/journals").then(({ data }) => setRecent(data.slice(0, 3)));
    api.get("/journals/analytics/summary?range=week").then(({ data }) =>
      setStreak({ currentStreak: data.currentStreak, longestStreak: data.longestStreak })
    );
  }, []);

  const today = new Date();
  const dateStr = today.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  const timeStr = today.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  const todaysMood = recent[0] && isToday(recent[0].entryDate) ? getMood(recent[0].mood) : null;

  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
        <h1 className="font-display text-3xl mb-1">
          Welcome back, {user?.name?.split(" ")[0]}
        </h1>
        <p className="opacity-70">
          {dateStr} · {timeStr}
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-5 mb-6">
        <div className="glass-card p-6 flex flex-col items-center justify-center text-center">
          <Enso size={36} />
          <p className="text-3xl font-display mt-2">{streak.currentStreak}</p>
          <p className="text-sm opacity-70">day streak</p>
          <p className="text-xs opacity-50 mt-1">Longest: {streak.longestStreak} days</p>
        </div>

        <div className="glass-card p-6 flex flex-col items-center justify-center text-center">
          <p className="text-sm opacity-70 mb-1">Today's mood</p>
          {todaysMood ? (
            <>
              <span className="text-4xl">{todaysMood.emoji}</span>
              <p className="text-sm mt-1">{todaysMood.label}</p>
            </>
          ) : (
            <Link
              to="/journal"
              className="text-sm accent-text font-medium hover:underline flex items-center gap-1 mt-2"
            >
              <FiZap /> Log how you feel
            </Link>
          )}
        </div>

        <QuoteCard />
      </div>

      <div className="glass-card p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-display text-xl">Recent entries</h2>
          <Link to="/journal" className="text-sm accent-text hover:underline">
            View all
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="opacity-60 text-sm">
            No entries yet. Your first page is waiting for you.
          </p>
        ) : (
          <ul className="space-y-3">
            {recent.map((j) => {
              const mood = getMood(j.mood);
              return (
                <li key={j._id} className="flex items-center gap-3">
                  <span className="text-xl">{mood.emoji}</span>
                  <div className="flex-1">
                    <p className="font-medium">{j.title}</p>
                    <p className="text-xs opacity-60">
                      {new Date(j.entryDate).toLocaleDateString()}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </AppLayout>
  );
};

function isToday(date) {
  const d = new Date(date);
  const now = new Date();
  return d.toDateString() === now.toDateString();
}

export default Dashboard;
