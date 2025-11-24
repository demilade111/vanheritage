import express from "express";
import {
  getHeritageSites,
  getHeritageSite,
  getHeritageSitePhoto,
  getNeighbourhoods,
} from "../controllers/heritageSiteController.js";

const router = express.Router();

router.get("/", getHeritageSites);
router.get("/filters/neighbourhoods", getNeighbourhoods);
router.get("/:id/photo", getHeritageSitePhoto);
router.get("/:id", getHeritageSite);

export default router;
