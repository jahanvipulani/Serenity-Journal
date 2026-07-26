import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true, trim: true },
    completed: { type: Boolean, default: false },
    date: { type: Date, default: Date.now }, // which day this goal belongs to
  },
  { timestamps: true }
);

export default mongoose.model("Todo", todoSchema);
