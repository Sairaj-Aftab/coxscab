import express from "express";
import {
  createVehicleCondition,
  getVehicleConditions,
} from "../../controller/vehicle/vehicleCondition.js";

const router = express.Router();

router.post("/", createVehicleCondition);
router.get("/", getVehicleConditions);

export default router;
