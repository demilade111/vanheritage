import express from "express";
import {
  updateHeritageSite,
  enrichFromWikipedia,
} from "../controllers/adminController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.put("/heritage-sites/:id", updateHeritageSite);
router.post("/heritage-sites/enrich", enrichFromWikipedia);

export default router;
