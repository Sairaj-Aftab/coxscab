import express from "express";
import {
  createPackage,
  deletePackage,
  getAllPackages,
  updatePackage,
} from "../controller/package.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/", verifyToken, createPackage);
router.put("/update/:id", verifyToken, updatePackage);
router.get("/get-all", getAllPackages);
router.delete("/delete/:id", verifyToken, deletePackage);

export default router;
