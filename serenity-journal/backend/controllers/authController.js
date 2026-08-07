import User from "../models/User.js";
import Settings from "../models/Settings.js";
import generateToken from "../utils/generateToken.js";

// @desc  Register or Login a user via username
// @route POST /api/auth/register
export const registerUser = async (req, res, next) => {
  try {
    const { username } = req.body;

    if (!username || !username.trim()) {
      res.status(400);
      throw new Error("Please enter a username");
    }

    let user = await User.findOne({ username });
    
    // If user doesn't exist, register them
    if (!user) {
      user = await User.create({ username });
      // Create default settings for the new user
      await Settings.create({ user: user._id });
    }

    res.status(200).json({
      _id: user._id,
      name: user.username,
      username: user.username,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

// @desc  Login user (fallback, behaves identically to register)
// @route POST /api/auth/login
export const loginUser = async (req, res, next) => {
  try {
    const { username } = req.body;

    if (!username || !username.trim()) {
      res.status(400);
      throw new Error("Please enter a username");
    }

    let user = await User.findOne({ username });

    if (!user) {
      user = await User.create({ username });
      await Settings.create({ user: user._id });
    }

    res.status(200).json({
      _id: user._id,
      name: user.username,
      username: user.username,
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

// @desc  Get current logged-in user
// @route GET /api/auth/me
export const getMe = async (req, res) => {
  // Convert username to name field for compatibility on frontend
  const user = req.user.toObject ? req.user.toObject() : { ...req.user };
  user.name = user.username;
  res.json(user);
};

