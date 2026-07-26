import Settings from "../models/Settings.js";

// @desc  Get logged-in user's settings (creates defaults if missing)
// @route GET /api/settings
export const getSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne({ user: req.user._id });
    if (!settings) {
      settings = await Settings.create({ user: req.user._id });
    }
    res.json(settings);
  } catch (error) {
    next(error);
  }
};

// @desc  Update settings (theme, font, background, music, etc.)
// @route PUT /api/settings
export const updateSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne({ user: req.user._id });
    if (!settings) {
      settings = new Settings({ user: req.user._id });
    }

    Object.assign(settings, req.body);
    await settings.save();

    res.json(settings);
  } catch (error) {
    next(error);
  }
};
