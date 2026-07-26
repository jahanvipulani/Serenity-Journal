import Journal from "../models/Journal.js";
import User from "../models/User.js";
import { updateStreak } from "../utils/streak.js";

const countWords = (text = "") =>
  text.trim().length === 0 ? 0 : text.trim().split(/\s+/).length;

// @desc  Create a journal entry
// @route POST /api/journals
export const createJournal = async (req, res, next) => {
  try {
    const { title, body, mood, tags, entryDate } = req.body;

    const journal = await Journal.create({
      user: req.user._id,
      title: title || "Untitled entry",
      body: body || "",
      mood: mood || "neutral",
      tags: tags || [],
      wordCount: countWords(body),
      charCount: (body || "").length,
      entryDate: entryDate || new Date(),
    });

    // Update the user's writing streak
    const user = await User.findById(req.user._id);
    updateStreak(user, journal.entryDate);
    await user.save();

    res.status(201).json(journal);
  } catch (error) {
    next(error);
  }
};

// @desc  Get all journals for the logged-in user (supports search/filter)
// @route GET /api/journals?search=&mood=&favorite=&archived=&from=&to=
export const getJournals = async (req, res, next) => {
  try {
    const { search, mood, favorite, archived, from, to } = req.query;
    const query = { user: req.user._id };

    if (mood) query.mood = mood;
    if (favorite === "true") query.isFavorite = true;
    query.isArchived = archived === "true";

    if (from || to) {
      query.entryDate = {};
      if (from) query.entryDate.$gte = new Date(from);
      if (to) query.entryDate.$lte = new Date(to);
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { body: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }

    const journals = await Journal.find(query).sort({
      isPinned: -1,
      entryDate: -1,
    });

    res.json(journals);
  } catch (error) {
    next(error);
  }
};

// @desc  Get a single journal entry
// @route GET /api/journals/:id
export const getJournalById = async (req, res, next) => {
  try {
    const journal = await Journal.findOne({ _id: req.params.id, user: req.user._id });
    if (!journal) {
      res.status(404);
      throw new Error("Journal entry not found");
    }
    res.json(journal);
  } catch (error) {
    next(error);
  }
};

// @desc  Update a journal entry (also used for autosave)
// @route PUT /api/journals/:id
export const updateJournal = async (req, res, next) => {
  try {
    const journal = await Journal.findOne({ _id: req.params.id, user: req.user._id });
    if (!journal) {
      res.status(404);
      throw new Error("Journal entry not found");
    }

    const { title, body, mood, tags, isFavorite, isPinned, isArchived } = req.body;

    if (title !== undefined) journal.title = title;
    if (body !== undefined) {
      journal.body = body;
      journal.wordCount = countWords(body);
      journal.charCount = body.length;
    }
    if (mood !== undefined) journal.mood = mood;
    if (tags !== undefined) journal.tags = tags;
    if (isFavorite !== undefined) journal.isFavorite = isFavorite;
    if (isPinned !== undefined) journal.isPinned = isPinned;
    if (isArchived !== undefined) journal.isArchived = isArchived;

    const updated = await journal.save();
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// @desc  Delete a journal entry
// @route DELETE /api/journals/:id
export const deleteJournal = async (req, res, next) => {
  try {
    const journal = await Journal.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!journal) {
      res.status(404);
      throw new Error("Journal entry not found");
    }
    res.json({ message: "Journal entry deleted" });
  } catch (error) {
    next(error);
  }
};

// @desc  Mood analytics: distribution, most common mood, averages, streaks
// @route GET /api/journals/analytics/summary?range=week|month|year
export const getMoodAnalytics = async (req, res, next) => {
  try {
    const { range = "month" } = req.query;
    const now = new Date();
    const from = new Date(now);

    if (range === "week") from.setDate(now.getDate() - 7);
    else if (range === "year") from.setFullYear(now.getFullYear() - 1);
    else from.setMonth(now.getMonth() - 1);

    const journals = await Journal.find({
      user: req.user._id,
      entryDate: { $gte: from, $lte: now },
      isArchived: false,
    }).sort({ entryDate: 1 });

    const distribution = {};
    journals.forEach((j) => {
      distribution[j.mood] = (distribution[j.mood] || 0) + 1;
    });

    const mostCommon =
      Object.entries(distribution).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

    const timeline = journals.map((j) => ({
      date: j.entryDate,
      mood: j.mood,
    }));

    const user = await User.findById(req.user._id);

    res.json({
      distribution,
      mostCommon,
      totalEntries: journals.length,
      timeline,
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
    });
  } catch (error) {
    next(error);
  }
};
