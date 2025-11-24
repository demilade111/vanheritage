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
import {
  validate,
  createMemoryRules,
  updateMemoryRules,
  memoryIdParamRules,
  siteIdParamRules,
} from "../middleware/validators.js";

const router = express.Router();

router.post(
  "/",
  protect,
  upload.single("image"),
  validate(createMemoryRules),
  createMemory
);
router.get("/my-memories", protect, getUserMemories);
router.get("/site/:siteId", validate(siteIdParamRules), getSiteMemories);
router.put(
  "/:id",
  protect,
  upload.single("image"),
  validate(updateMemoryRules),
  updateMemory
);
router.delete("/:id", protect, validate(memoryIdParamRules), deleteMemory);

export default router;
