import express from "express";
import {
  getHeritageSites,
  getHeritageSite,
  getHeritageSitePhoto,
  getNeighbourhoods,
} from "../controllers/heritageSiteController.js";
import { validate, heritageIdParamRules } from "../middleware/validators.js";

const router = express.Router();

router.get("/", getHeritageSites);
router.get("/filters/neighbourhoods", getNeighbourhoods);
router.get("/:id/photo", validate(heritageIdParamRules), getHeritageSitePhoto);
router.get("/:id", validate(heritageIdParamRules), getHeritageSite);

export default router;
