import express from "express";
import {
  createPackage,
  deletePackage,
  getAllPackages,
} from "../controller/package.js";

const router = express.Router();

router.post("/", createPackage);
router.get("/get-all", getAllPackages);
router.delete("/delete", deletePackage);

export default router;
