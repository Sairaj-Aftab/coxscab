import express from "express";
import {
  createVehicle,
  deleteVehicle,
  getVehicle,
  getVehicles,
  updateVehicle,
} from "../../controller/vehicle/vehicle.js";

const router = express.Router();

router.post("/", createVehicle);
router.get("/", getVehicles);
router.put("/:id", updateVehicle);
router.get("/getsingle/:id", getVehicle);
router.delete("/delete/:id", deleteVehicle);
// router.put("/:id", updateRole);
// router.put("/status/:id", updateRoleStatus);

export default router;
