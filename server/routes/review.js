import express from "express";
import { createReview } from "../controller/review.js";

const router = express.Router();

router.post("/", createReview);

export default router;
