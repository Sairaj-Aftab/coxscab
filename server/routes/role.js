import express from "express";
import {
  createRole,
  deleteRole,
  getRole,
  updateRole,
  updateRoleStatus,
} from "../controller/role.js";

const router = express.Router();

router.post("/", createRole);
router.get("/", getRole);
router.delete("/:id", deleteRole);
router.put("/:id", updateRole);
router.put("/status/:id", updateRoleStatus);

export default router;
