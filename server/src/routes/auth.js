import express from "express";
import { register, login, getMe } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import {
  validate,
  registerRules,
  loginRules,
} from "../middleware/validators.js";

const router = express.Router();

router.post("/register", validate(registerRules), register);
router.post("/login", validate(loginRules), login);
router.get("/me", protect, getMe);

export default router;
