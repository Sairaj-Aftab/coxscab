import express from "express";
import {
  getVisitorStats,
  updateVisitorCount,
} from "../controller/visitorCount.js";

const router = express.Router();

router.post("/", updateVisitorCount);
router.get("/", getVisitorStats);

// router.delete("/delete/:id", deleteSchedule);

export default router;
