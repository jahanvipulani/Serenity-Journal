import AppLayout from "../components/AppLayout";
import MusicPlayer from "../components/MusicPlayer";
import { useSettings } from "../context/SettingsContext";

const THEMES = [
  { id: "sakura", label: "🌸 Sakura" },
  { id: "ocean", label: "🌊 Ocean" },
  { id: "forest", label: "🌲 Forest" },
  { id: "sunset", label: "🌅 Sunset" },
  { id: "midnight", label: "🌙 Midnight" },
  { id: "cloud", label: "☁️ Cloud" },
  { id: "nature", label: "🍃 Nature" },
  { id: "lavender", label: "🪻 Lavender" },
  { id: "daisy", label: "🌼 Daisy" },
];

const BACKGROUNDS = [
  { id: "sakura", label: "Cherry blossoms" },
  { id: "rain", label: "Rain" },
  { id: "snow", label: "Snow" },
  { id: "stars", label: "Night sky / stars" },
  { id: "ocean", label: "Ocean waves" },
  { id: "aurora", label: "Aurora" },
  { id: "blobs", label: "Minimal abstract blobs" },
];

const FONTS = [
  "Poppins",
  "Nunito",
  "Quicksand",
  "Cormorant Garamond",
  "Playfair Display",
  "Lora",
  "Merriweather",
  "Dancing Script",
  "Pacifico",
  "Inter",
];

const Section = ({ title, children }) => (
  <div className="glass-card p-6 mb-5">
    <h2 className="font-display text-lg mb-4">{title}</h2>
    {children}
  </div>
);

const Settings = () => {
  const { settings, updateSettings } = useSettings();

  return (
    <AppLayout>
      <h1 className="font-display text-3xl mb-6">Settings</h1>

      <Section title="Theme">
        <div className="flex flex-wrap gap-2">
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => updateSettings({ theme: t.id })}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                settings.theme === t.id ? "accent-bg text-white" : "bg-white/40 dark:bg-white/10"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </Section>

      <Section title="Mode">
        <div className="flex gap-2">
          {["light", "dark", "auto"].map((m) => (
            <button
              key={m}
              onClick={() => updateSettings({ mode: m })}
              className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition ${
                settings.mode === m ? "accent-bg text-white" : "bg-white/40 dark:bg-white/10"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </Section>

      <Section title="Font">
        <div className="flex flex-wrap gap-2">
          {FONTS.map((f) => (
            <button
              key={f}
              onClick={() => updateSettings({ font: f })}
              style={{ fontFamily: `'${f}', sans-serif` }}
              className={`px-4 py-2 rounded-full text-sm transition ${
                settings.font === f ? "accent-bg text-white" : "bg-white/40 dark:bg-white/10"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="mt-4">
          <label className="text-sm font-medium block mb-1">
            Font size: {settings.fontSize}px
          </label>
          <input
            type="range"
            min="14"
            max="20"
            value={settings.fontSize}
            onChange={(e) => updateSettings({ fontSize: Number(e.target.value) })}
            className="w-full accent-[var(--accent)]"
          />
        </div>
      </Section>

      <Section title="Background scenery">
        <div className="flex flex-wrap gap-2">
          {BACKGROUNDS.map((b) => (
            <button
              key={b.id}
              onClick={() => updateSettings({ background: b.id })}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                settings.background === b.id ? "accent-bg text-white" : "bg-white/40 dark:bg-white/10"
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>
        <div className="mt-4">
          <label className="text-sm font-medium block mb-1">Animation intensity</label>
          <div className="flex gap-2">
            {["off", "subtle", "normal", "playful"].map((level) => (
              <button
                key={level}
                onClick={() => updateSettings({ animationIntensity: level })}
                className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition ${
                  settings.animationIntensity === level
                    ? "accent-bg text-white"
                    : "bg-white/40 dark:bg-white/10"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      </Section>

      <Section title="Ambient music">
        <MusicPlayer />
      </Section>

      <Section title="Card transparency">
        <input
          type="range"
          min="0.3"
          max="1"
          step="0.05"
          value={settings.cardTransparency}
          onChange={(e) => updateSettings({ cardTransparency: Number(e.target.value) })}
          className="w-full accent-[var(--accent)]"
        />
      </Section>
    </AppLayout>
  );
};

export default Settings;
