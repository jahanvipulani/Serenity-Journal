import express from "express";
import {
  createJournal,
  getJournals,
  getJournalById,
  updateJournal,
  deleteJournal,
  getMoodAnalytics,
} from "../controllers/journalController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect); // every journal route requires authentication

router.route("/").get(getJournals).post(createJournal);
router.get("/analytics/summary", getMoodAnalytics);
router
  .route("/:id")
  .get(getJournalById)
  .put(updateJournal)
  .delete(deleteJournal);

export default router;
