import express from "express";
import {
  createPermission,
  deletePermission,
  getPermission,
  updatePermissionStatus,
} from "../controller/permission.js";

const router = express.Router();

router.post("/", createPermission);
router.get("/", getPermission);
router.delete("/:id", deletePermission);
router.put("/status/:id", updatePermissionStatus);

export default router;
