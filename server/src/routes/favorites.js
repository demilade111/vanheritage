import express from "express";
import {
  toggleFavorite,
  getUserFavorites,
  checkFavorite,
  getFavoriteCount,
} from "../controllers/favoriteController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, getUserFavorites);
router.post("/:siteId", protect, toggleFavorite);
router.get("/:siteId/check", protect, checkFavorite);
router.get("/:siteId/count", getFavoriteCount);

export default router;

