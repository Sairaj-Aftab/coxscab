import express from "express";
import { getVehicleChart } from "../controller/charts.js";

const router = express.Router();

router.get("/", getVehicleChart);

export default router;
