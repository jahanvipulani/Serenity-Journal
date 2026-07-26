import Gratitude from "../models/Gratitude.js";

export const getGratitudeHistory = async (req, res, next) => {
  try {
    const entries = await Gratitude.find({ user: req.user._id }).sort({ date: -1 });
    res.json(entries);
  } catch (error) {
    next(error);
  }
};

export const createGratitude = async (req, res, next) => {
  try {
    const { items, date } = req.body;
    if (!items || !items.length) {
      res.status(400);
      throw new Error("Please provide at least one thing you're grateful for");
    }
    const entry = await Gratitude.create({
      user: req.user._id,
      items: items.filter(Boolean).slice(0, 3),
      date: date || new Date(),
    });
    res.status(201).json(entry);
  } catch (error) {
    next(error);
  }
};

export const deleteGratitude = async (req, res, next) => {
  try {
    const entry = await Gratitude.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!entry) {
      res.status(404);
      throw new Error("Entry not found");
    }
    res.json({ message: "Entry deleted" });
  } catch (error) {
    next(error);
  }
};
