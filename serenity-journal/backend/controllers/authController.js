import User from "../models/User.js";
import Settings from "../models/Settings.js";
import generateToken from "../utils/generateToken.js";

// @desc  Register a new user
// @route POST /api/auth/register
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, securityQuestion, securityAnswer } = req.body;

    if (!name || !email || !password || !securityAnswer) {
      res.status(400);
      throw new Error("Please fill in all required fields");
    }

    const existing = await User.findOne({ email });
    if (existing) {
      res.status(400);
      throw new Error("An account with this email already exists");
    }

    const user = await User.create({
      name,
      email,
      password,
      securityQuestion,
      securityAnswer,
    });

    // Create default settings for the new user
    await Settings.create({ user: user._id });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

// @desc  Login user
// @route POST /api/auth/login
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      res.status(401);
      throw new Error("Invalid email or password");
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

// @desc  Get the security question for an email (step 1 of local password reset)
// @route POST /api/auth/forgot-password/question
export const getSecurityQuestion = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404);
      throw new Error("No account found with that email");
    }
    res.json({ securityQuestion: user.securityQuestion });
  } catch (error) {
    next(error);
  }
};

// @desc  Verify security answer and reset password (step 2, local, no email needed)
// @route POST /api/auth/forgot-password/reset
export const resetPassword = async (req, res, next) => {
  try {
    const { email, securityAnswer, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404);
      throw new Error("No account found with that email");
    }

    const isMatch = await user.matchSecurityAnswer(securityAnswer);
    if (!isMatch) {
      res.status(401);
      throw new Error("Security answer is incorrect");
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: "Password reset successful. You can now log in." });
  } catch (error) {
    next(error);
  }
};

// @desc  Get current logged-in user
// @route GET /api/auth/me
export const getMe = async (req, res) => {
  res.json(req.user);
};
