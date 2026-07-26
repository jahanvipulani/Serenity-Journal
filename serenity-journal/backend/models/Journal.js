import mongoose from "mongoose";

const journalSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, trim: true, default: "Untitled entry" },
    body: { type: String, default: "" },

    // Mood is a single primary emotion for the entry (drives analytics/calendar color)
    mood: {
      type: String,
      enum: [
        "happy",
        "calm",
        "loved",
        "sad",
        "angry",
        "tired",
        "anxious",
        "relaxed",
        "excited",
        "crying",
        "neutral",
        "grateful",
      ],
      default: "neutral",
    },

    // Additional free-form emotion tags e.g. ["hopeful", "nostalgic"]
    tags: [{ type: String, trim: true }],

    wordCount: { type: Number, default: 0 },
    charCount: { type: Number, default: 0 },

    isFavorite: { type: Boolean, default: false },
    isPinned: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false },

    // The calendar day this entry belongs to (separate from createdAt so
    // edits don't change which day the entry appears on)
    entryDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

journalSchema.index({ user: 1, entryDate: -1 });
journalSchema.index({ user: 1, title: "text", body: "text" });

export default mongoose.model("Journal", journalSchema);
