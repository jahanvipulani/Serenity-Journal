import express from "express";
import {
  registerUser,
  loginUser,
  getSecurityQuestion,
  resetPassword,
  getMe,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password/question", getSecurityQuestion);
router.post("/forgot-password/reset", resetPassword);
router.get("/me", protect, getMe);

export default router;
