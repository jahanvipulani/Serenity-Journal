import { useState, useEffect } from "react";
import api from "../utils/api";

const QuoteCard = () => {
  const [quote, setQuote] = useState(null);

  useEffect(() => {
    api
      .get("/quotes/today")
      .then(({ data }) => setQuote(data))
      .catch(() => setQuote({ text: "Breathe. You're doing better than you think.", author: "Serenity Journal" }));
  }, []);

  if (!quote) return null;

  return (
    <div className="glass-card p-6">
      <p className="font-display text-xl italic leading-snug">"{quote.text}"</p>
      <p className="text-sm opacity-60 mt-2">— {quote.author}</p>
    </div>
  );
};

export default QuoteCard;
