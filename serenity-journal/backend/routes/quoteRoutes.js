import express from "express";
import { getQuoteOfTheDay, getAffirmation } from "../controllers/quoteController.js";

const router = express.Router();

router.get("/today", getQuoteOfTheDay);
router.get("/affirmation", getAffirmation);

export default router;
