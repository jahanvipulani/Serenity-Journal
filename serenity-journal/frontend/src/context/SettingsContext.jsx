import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../utils/api";
import { useAuth } from "./AuthContext";

const SettingsContext = createContext(null);

const DEFAULTS = {
  theme: "sakura",
  mode: "light",
  font: "Nunito",
  fontSize: 16,
  accentColor: "#E8A0AC",
  background: "sakura",
  musicTrack: "none",
  musicVolume: 0.5,
  animationIntensity: "normal",
  cardTransparency: 0.8,
};

const FONT_STACKS = {
  Poppins: "'Poppins', sans-serif",
  Nunito: "'Nunito', sans-serif",
  Quicksand: "'Quicksand', sans-serif",
  "Cormorant Garamond": "'Cormorant Garamond', serif",
  "Playfair Display": "'Playfair Display', serif",
  Lora: "'Lora', serif",
  Merriweather: "'Merriweather', serif",
  "Dancing Script": "'Dancing Script', cursive",
  Pacifico: "'Pacifico', cursive",
  Inter: "'Inter', sans-serif",
};

export const SettingsProvider = ({ children }) => {
  const { user } = useAuth();
  const [settings, setSettings] = useState(() => {
    const stored = localStorage.getItem("sj_settings");
    return stored ? JSON.parse(stored) : DEFAULTS;
  });

  // Apply settings to the DOM whenever they change
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", settings.theme);
    root.classList.toggle("dark", resolveMode(settings.mode) === "dark");
    root.style.setProperty("--font-body", FONT_STACKS[settings.font] || FONT_STACKS.Nunito);
    root.style.setProperty("--font-size-base", `${settings.fontSize}px`);
    root.style.setProperty("--card-alpha-pct", `${Math.round(settings.cardTransparency * 100)}%`);
    localStorage.setItem("sj_settings", JSON.stringify(settings));
  }, [settings]);

  // Pull settings from the backend once logged in
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const { data } = await api.get("/settings");
        setSettings((prev) => ({ ...prev, ...data }));
      } catch {
        // fall back silently to local/default settings
      }
    })();
  }, [user]);

  const updateSettings = useCallback(
    async (patch) => {
      setSettings((prev) => ({ ...prev, ...patch }));
      if (user) {
        try {
          await api.put("/settings", patch);
        } catch {
          // best-effort sync; local state already updated
        }
      }
    },
    [user]
  );

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, FONT_STACKS }}>
      {children}
    </SettingsContext.Provider>
  );
};

function resolveMode(mode) {
  if (mode === "auto") {
    const hour = new Date().getHours();
    return hour >= 19 || hour < 6 ? "dark" : "light";
  }
  return mode;
}

export const useSettings = () => useContext(SettingsContext);
