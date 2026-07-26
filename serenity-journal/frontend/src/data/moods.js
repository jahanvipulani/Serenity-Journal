// Central source of truth for mood emojis/labels/colors used across
// the journal editor, calendar, and analytics charts.
export const MOODS = [
  { id: "happy", emoji: "😀", label: "Happy", color: "#F5C451" },
  { id: "calm", emoji: "😊", label: "Calm", color: "#8BC4A8" },
  { id: "loved", emoji: "🥰", label: "Loved", color: "#E8A0AC" },
  { id: "sad", emoji: "😔", label: "Sad", color: "#7C93C4" },
  { id: "angry", emoji: "😡", label: "Angry", color: "#D9695A" },
  { id: "tired", emoji: "😴", label: "Tired", color: "#9C8FB5" },
  { id: "anxious", emoji: "😰", label: "Anxious", color: "#C99A54" },
  { id: "relaxed", emoji: "😌", label: "Relaxed", color: "#7FB7A3" },
  { id: "excited", emoji: "🤩", label: "Excited", color: "#E8895A" },
  { id: "crying", emoji: "😭", label: "Crying", color: "#6E8FC7" },
  { id: "neutral", emoji: "😐", label: "Neutral", color: "#A6A6A0" },
  { id: "grateful", emoji: "😇", label: "Grateful", color: "#C7A6E8" },
];

export const getMood = (id) => MOODS.find((m) => m.id === id) || MOODS[10];
