import express from "express";
import {
  createMemory,
  updateMemory,
  deleteMemory,
  getUserMemories,
  getSiteMemories,
} from "../controllers/memoryController.js";
import { protect } from "../middleware/auth.js";
import { upload } from "../config/cloudinary.js";

const router = express.Router();

router.post("/", protect, upload.single("image"), createMemory);
router.get("/my-memories", protect, getUserMemories);
router.get("/site/:siteId", getSiteMemories);
router.put("/:id", protect, upload.single("image"), updateMemory);
router.delete("/:id", protect, deleteMemory);

export default router;
