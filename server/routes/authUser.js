import express from "express";
import {
  deleteAuthAdminDashboard,
  getAllAuthAdminDashboard,
  logedInAuthAdminDashboard,
  loginAuthAdminDashboard,
  logoutAuthAdminDashboard,
  registerUserAdminDashboad,
  updateAuthAdminDashboard,
} from "../controller/authUser.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", getAllAuthAdminDashboard);
router.post("/", registerUserAdminDashboad);
router.post("/login", loginAuthAdminDashboard);
router.get("/me", verifyToken, logedInAuthAdminDashboard);
router.post("/logout", logoutAuthAdminDashboard);
router.put("/:id", verifyToken, updateAuthAdminDashboard);
router.delete("/:id", deleteAuthAdminDashboard);

export default router;
