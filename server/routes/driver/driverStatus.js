import express from "express";
import {
  createDriverStatus,
  getDriverStatus,
} from "../../controller/driver/driverStatus.js";

const router = express.Router();

router.post("/", createDriverStatus);
router.get("/", getDriverStatus);

export default router;
