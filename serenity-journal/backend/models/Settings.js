import mongoose from "mongoose";

// Stores each user's personalization preferences so they persist across
// devices/sessions (theme, font, background, music, etc.)
const settingsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    theme: { type: String, default: "sakura" },
    mode: { type: String, enum: ["light", "dark", "auto"], default: "light" },
    font: { type: String, default: "Nunito" },
    fontSize: { type: Number, default: 16 },
    accentColor: { type: String, default: "#E8A0AC" },
    background: { type: String, default: "sakura" },
    musicTrack: { type: String, default: "none" },
    musicVolume: { type: Number, default: 0.5 },
    animationIntensity: {
      type: String,
      enum: ["off", "subtle", "normal", "playful"],
      default: "normal",
    },
    cardTransparency: { type: Number, default: 0.8 },
  },
  { timestamps: true }
);

export default mongoose.model("Settings", settingsSchema);
