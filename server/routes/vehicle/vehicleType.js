import express from "express";
import {
  createVehicleType,
  getVehicleTypes,
} from "../../controller/vehicle/vehicleType.js";

const router = express.Router();

router.post("/", createVehicleType);
router.get("/", getVehicleTypes);

export default router;
