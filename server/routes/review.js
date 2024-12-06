import express from "express";
import {
  createReview,
  getReviews,
  updateReviewStatus,
} from "../controller/review.js";

const router = express.Router();

router.post("/", createReview);
router.get("/all", getReviews);
router.put("/status/:id", updateReviewStatus);

export default router;
