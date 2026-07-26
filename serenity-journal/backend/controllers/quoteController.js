import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const quotes = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../data/quotes.json"), "utf-8")
);
const affirmations = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../data/affirmations.json"), "utf-8")
);

// Deterministic "quote of the day" - same quote all day, changes daily,
// falls back to this local list if the free ZenQuotes API is unreachable.
const pickOfTheDay = (list) => {
  const dayNumber = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  return list[dayNumber % list.length];
};

// @desc  Get quote of the day (tries free ZenQuotes API first, falls back to local)
// @route GET /api/quotes/today
export const getQuoteOfTheDay = async (req, res) => {
  try {
    const response = await fetch("https://zenquotes.io/api/today", {
      signal: AbortSignal.timeout(3000),
    });
    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && data[0]?.q) {
        return res.json({ text: data[0].q, author: data[0].a, source: "zenquotes" });
      }
    }
    throw new Error("ZenQuotes unavailable");
  } catch (error) {
    const fallback = pickOfTheDay(quotes);
    res.json({ ...fallback, source: "local" });
  }
};

// @desc  Get a random affirmation
// @route GET /api/quotes/affirmation
export const getAffirmation = async (req, res) => {
  const random = affirmations[Math.floor(Math.random() * affirmations.length)];
  res.json({ text: random });
};
