import express from "express";
import { getDriverChart, getVehicleChart } from "../controller/charts.js";

const router = express.Router();

router.get("/vehicle", getVehicleChart);
router.get("/driver", getDriverChart);

export default router;
