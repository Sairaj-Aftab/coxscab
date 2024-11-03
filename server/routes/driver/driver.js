import express from "express";
import {
  createDriver,
  deleteDriver,
  generateDriversFrom,
  getDriver,
  getDrivers,
  updateDriver,
} from "../../controller/driver/driver.js";

const router = express.Router();

router.post("/", createDriver);
router.get("/", getDrivers);
router.get("/getsingle/:id", getDriver);
router.put("/:id", updateDriver);
router.delete("/delete/:id", deleteDriver);

// router.post("/generate", generateDrivers);
router.post("/generate", generateDriversFrom);

export default router;
