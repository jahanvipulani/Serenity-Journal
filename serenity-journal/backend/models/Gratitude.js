import mongoose from "mongoose";

const gratitudeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: {
      type: [String],
      validate: {
        validator: (arr) => arr.length > 0 && arr.length <= 3,
        message: "Provide between 1 and 3 gratitude items",
      },
    },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Gratitude", gratitudeSchema);
