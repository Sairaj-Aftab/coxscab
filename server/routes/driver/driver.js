import express from "express";
import {
  createDriver,
  deleteDriver,
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

export default router;
