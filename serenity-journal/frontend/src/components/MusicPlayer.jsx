import { useState, useRef, useEffect } from "react";
import { FiPlay, FiPause, FiSkipForward, FiSkipBack, FiVolume2, FiVolumeX } from "react-icons/fi";
import { useSettings } from "../context/SettingsContext";
import { TRACK_LIST, playSound, stopSound, setVolume } from "../utils/soundEngine";

const MusicPlayer = () => {
  const { settings, updateSettings } = useSettings();
  const [isPlaying, setIsPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const prevVolume = useRef(settings.musicVolume);

  const trackIndex = TRACK_LIST.findIndex((t) => t.id === settings.musicTrack);
  const currentTrack = TRACK_LIST[trackIndex] || TRACK_LIST[0];

  useEffect(() => {
    return () => stopSound(); // clean up audio nodes on unmount
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      stopSound();
      setIsPlaying(false);
    } else if (settings.musicTrack !== "none") {
      playSound(settings.musicTrack, muted ? 0 : settings.musicVolume);
      setIsPlaying(true);
    }
  };

  const changeTrack = (dir) => {
    const nextIndex =
      (trackIndex + dir + TRACK_LIST.length) % TRACK_LIST.length;
    const next = TRACK_LIST[nextIndex];
    updateSettings({ musicTrack: next.id });
    if (isPlaying) {
      if (next.id === "none") {
        stopSound();
        setIsPlaying(false);
      } else {
        playSound(next.id, muted ? 0 : settings.musicVolume);
      }
    }
  };

  const handleVolume = (e) => {
    const vol = parseFloat(e.target.value);
    updateSettings({ musicVolume: vol });
    if (!muted) setVolume(vol);
  };

  const toggleMute = () => {
    if (muted) {
      setVolume(settings.musicVolume);
      setMuted(false);
    } else {
      setVolume(0);
      setMuted(true);
    }
  };

  return (
    <div className="glass-card flex items-center gap-3 px-4 py-2">
      <button
        onClick={() => changeTrack(-1)}
        aria-label="Previous track"
        className="p-2 rounded-full hover:bg-black/5"
      >
        <FiSkipBack />
      </button>
      <button
        onClick={togglePlay}
        aria-label={isPlaying ? "Pause" : "Play"}
        className="p-2 rounded-full accent-bg text-white shadow-soft"
      >
        {isPlaying ? <FiPause /> : <FiPlay />}
      </button>
      <button
        onClick={() => changeTrack(1)}
        aria-label="Next track"
        className="p-2 rounded-full hover:bg-black/5"
      >
        <FiSkipForward />
      </button>

      <span className="text-sm font-medium min-w-[110px]">{currentTrack.label}</span>

      <button onClick={toggleMute} aria-label={muted ? "Unmute" : "Mute"} className="p-1">
        {muted ? <FiVolumeX /> : <FiVolume2 />}
      </button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={muted ? 0 : settings.musicVolume}
        onChange={handleVolume}
        aria-label="Volume"
        className="w-20 accent-[var(--accent)]"
      />
    </div>
  );
};

export default MusicPlayer;
