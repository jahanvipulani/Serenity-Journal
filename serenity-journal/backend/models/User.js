import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 6 },

    // Local "forgot password" flow - a security question instead of email sending
    // (keeps everything free/local, no email service required)
    securityQuestion: { type: String, default: "What is your favorite place?" },
    securityAnswer: { type: String, required: true },

    // Streak tracking
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastEntryDate: { type: Date, default: null },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Hash security answer before saving (case-insensitive, trimmed)
userSchema.pre("save", async function (next) {
  if (!this.isModified("securityAnswer")) return next();
  const salt = await bcrypt.genSalt(10);
  this.securityAnswer = await bcrypt.hash(
    this.securityAnswer.trim().toLowerCase(),
    salt
  );
  next();
});

userSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};

userSchema.methods.matchSecurityAnswer = async function (entered) {
  return bcrypt.compare(entered.trim().toLowerCase(), this.securityAnswer);
};

export default mongoose.model("User", userSchema);
