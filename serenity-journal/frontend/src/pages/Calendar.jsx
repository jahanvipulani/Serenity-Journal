import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import AppLayout from "../components/AppLayout";
import api from "../utils/api";
import { getMood } from "../data/moods";

const Calendar = () => {
  const [cursor, setCursor] = useState(new Date());
  const [entries, setEntries] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    const from = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const to = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0, 23, 59, 59);
    api
      .get(`/journals?from=${from.toISOString()}&to=${to.toISOString()}`)
      .then(({ data }) => setEntries(data));
  }, [cursor]);

  const entriesByDay = useMemo(() => {
    const map = {};
    entries.forEach((e) => {
      const day = new Date(e.entryDate).getDate();
      if (!map[day]) map[day] = [];
      map[day].push(e);
    });
    return map;
  }, [entries]);

  const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
  const firstWeekday = new Date(cursor.getFullYear(), cursor.getMonth(), 1).getDay();
  const monthLabel = cursor.toLocaleDateString(undefined, { month: "long", year: "numeric" });

  const changeMonth = (delta) =>
    setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + delta, 1));

  const selectedEntries = selectedDay ? entriesByDay[selectedDay] || [] : [];

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl">{monthLabel}</h1>
        <div className="flex gap-2">
          <button onClick={() => changeMonth(-1)} className="glass-card p-2" aria-label="Previous month">
            <FiChevronLeft />
          </button>
          <button onClick={() => changeMonth(1)} className="glass-card p-2" aria-label="Next month">
            <FiChevronRight />
          </button>
        </div>
      </div>

      <div className="glass-card p-4 md:p-6">
        <div className="grid grid-cols-7 gap-2 text-center text-xs opacity-60 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: firstWeekday }).map((_, i) => (
            <div key={`pad-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
            const dayEntries = entriesByDay[day];
            const primaryMood = dayEntries?.[0] ? getMood(dayEntries[0].mood) : null;
            const isSelected = selectedDay === day;
            return (
              <button
                key={day}
                onClick={() => setSelectedDay(isSelected ? null : day)}
                className={`aspect-square rounded-xl flex flex-col items-center justify-center text-sm relative transition ${
                  isSelected ? "ring-2 ring-[var(--accent)]" : ""
                }`}
                style={{
                  background: primaryMood ? primaryMood.color + "33" : "transparent",
                }}
              >
                <span>{day}</span>
                {primaryMood && <span className="text-xs">{primaryMood.emoji}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {selectedDay && (
        <div className="glass-card p-5 mt-5">
          <h2 className="font-display text-lg mb-3">
            {monthLabel} {selectedDay}
          </h2>
          {selectedEntries.length === 0 ? (
            <p className="opacity-60 text-sm">No entries on this day.</p>
          ) : (
            <ul className="space-y-2">
              {selectedEntries.map((e) => (
                <li key={e._id}>
                  <Link
                    to={`/journal/${e._id}`}
                    className="flex items-center gap-2 hover:opacity-70"
                  >
                    <span>{getMood(e.mood).emoji}</span>
                    <span className="font-medium">{e.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </AppLayout>
  );
};

export default Calendar;
