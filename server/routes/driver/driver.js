import express from "express";
import {
  createDriver,
  deleteDriver,
  getDrivers,
  updateDriver,
} from "../../controller/driver/driver.js";

const router = express.Router();

router.post("/", createDriver);
router.get("/", getDrivers);
router.put("/:id", updateDriver);
router.delete("/delete/:id", deleteDriver);

export default router;
