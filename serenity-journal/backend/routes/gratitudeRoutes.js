import express from "express";
import {
  getGratitudeHistory,
  createGratitude,
  deleteGratitude,
} from "../controllers/gratitudeController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.route("/").get(getGratitudeHistory).post(createGratitude);
router.route("/:id").delete(deleteGratitude);

export default router;
