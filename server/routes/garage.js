import express from "express";
import {
  createGarage,
  deleteGarage,
  getGarages,
} from "../controller/garage.js";

const router = express.Router();

router.post("/", createGarage);
router.get("/", getGarages);
router.get("/delete/:id", deleteGarage);

export default router;
