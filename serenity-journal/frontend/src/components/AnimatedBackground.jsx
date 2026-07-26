import { useMemo } from "react";
import { useSettings } from "../context/SettingsContext";

// Generates a fixed, full-screen, click-through animated scenery layer.
// Every scenery is built from lightweight CSS animations only — no
// images, no external assets, so it works offline and loads instantly.
const particles = (count) =>
  Array.from({ length: count }, (_, i) => i);

const AnimatedBackground = () => {
  const { settings } = useSettings();
  const intensity = settings.animationIntensity;
  const scenery = settings.background;

  const count = useMemo(() => {
    if (intensity === "off") return 0;
    if (intensity === "subtle") return 10;
    if (intensity === "playful") return 34;
    return 20;
  }, [intensity]);

  if (intensity === "off") return null;

  const renderScenery = () => {
    switch (scenery) {
      case "sakura":
        return particles(count).map((i) => (
          <span
            key={i}
            className="absolute top-[-5%] rounded-full opacity-70"
            style={{
              left: `${(i * 37) % 100}%`,
              width: 10,
              height: 10,
              background: "var(--accent-soft)",
              animation: `petalFall ${8 + (i % 6)}s linear ${i * 0.4}s infinite`,
            }}
          />
        ));
      case "rain":
        return particles(count).map((i) => (
          <span
            key={i}
            className="absolute top-[-10%] w-[2px] rounded-full opacity-40"
            style={{
              left: `${(i * 29) % 100}%`,
              height: 60,
              background: "var(--accent)",
              animation: `rainFall ${1 + (i % 3) * 0.3}s linear ${i * 0.15}s infinite`,
            }}
          />
        ));
      case "snow":
        return particles(count).map((i) => (
          <span
            key={i}
            className="absolute top-[-5%] rounded-full bg-white opacity-80"
            style={{
              left: `${(i * 31) % 100}%`,
              width: 6,
              height: 6,
              animation: `snowFall ${10 + (i % 5)}s linear ${i * 0.5}s infinite`,
            }}
          />
        ));
      case "stars":
        return particles(count).map((i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              left: `${(i * 53) % 100}%`,
              top: `${(i * 17) % 90}%`,
              width: 2 + (i % 3),
              height: 2 + (i % 3),
              animation: `twinkle ${2 + (i % 4)}s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ));
      case "ocean":
        return (
          <>
            {particles(3).map((i) => (
              <span
                key={i}
                className="absolute bottom-0 left-[-20%] w-[140%] rounded-t-full opacity-20"
                style={{
                  height: 120 + i * 40,
                  background: "var(--accent)",
                  animation: `waveDrift ${10 + i * 3}s ease-in-out infinite`,
                }}
              />
            ))}
          </>
        );
      case "aurora":
        return (
          <span
            className="absolute inset-0 opacity-30"
            style={{
              background:
                "linear-gradient(120deg, var(--accent) 0%, transparent 40%, var(--accent-soft) 60%, transparent 100%)",
              animation: "auroraShift 12s ease-in-out infinite",
            }}
          />
        );
      case "blobs":
      default:
        return particles(3).map((i) => (
          <span
            key={i}
            className="absolute rounded-full blur-3xl opacity-30"
            style={{
              left: `${20 + i * 25}%`,
              top: `${10 + i * 20}%`,
              width: 260,
              height: 260,
              background: "var(--accent-soft)",
              animation: `blobFloat ${14 + i * 4}s ease-in-out infinite`,
            }}
          />
        ));
    }
  };

  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none z-0"
      aria-hidden="true"
    >
      {renderScenery()}
      <style>{`
        @keyframes petalFall { to { transform: translate(-40px, 110vh) rotate(220deg); } }
        @keyframes rainFall { to { transform: translateY(110vh); } }
        @keyframes snowFall { to { transform: translate(20px, 110vh); } }
        @keyframes twinkle { 0%,100% { opacity: 0.2; } 50% { opacity: 1; } }
        @keyframes waveDrift { 0%,100% { transform: translateX(0); } 50% { transform: translateX(4%); } }
        @keyframes auroraShift { 0%,100% { transform: translateX(0) skewX(0deg); } 50% { transform: translateX(6%) skewX(-4deg); } }
        @keyframes blobFloat { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(20px,-30px) scale(1.08); } }
      `}</style>
    </div>
  );
};

export default AnimatedBackground;
