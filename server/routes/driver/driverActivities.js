import express from "express";
import {
  createDriverActivities,
  getDriverActivities,
} from "../../controller/driver/driverActivities.js";

const router = express.Router();

router.post("/", createDriverActivities);
router.get("/", getDriverActivities);

export default router;
