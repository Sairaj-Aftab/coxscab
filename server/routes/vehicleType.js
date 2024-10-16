import express from "express";
import {
  createVehicleType,
  getVehicleTypes,
} from "../controller/vehicleType.js";

const router = express.Router();

router.post("/", createVehicleType);
router.get("/", getVehicleTypes);

export default router;
