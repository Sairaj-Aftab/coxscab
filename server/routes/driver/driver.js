import express from "express";
import {
  createDriver,
  deleteDriver,
  findNearbyDrivers,
  getDriver,
  getDrivers,
  updateDriver,
} from "../../controller/driver/driver.js";
import { upload } from "../../utils/multer.js";

const router = express.Router();

router.post("/", upload.single("picture"), createDriver);
router.get("/", getDrivers);
router.get("/getsingle/:id", getDriver);
router.put("/:id", upload.single("picture"), updateDriver);
router.delete("/delete/:id", deleteDriver);

router.get("/get-nearby", findNearbyDrivers);

export default router;
