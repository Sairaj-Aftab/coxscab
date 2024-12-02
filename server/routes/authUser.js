import express from "express";
import {
  deleteAuthAdminDashboard,
  getAllAuthAdminDashboard,
  logedInAuthAdminDashboard,
  logedInUser,
  loginAuthAdminDashboard,
  loginUser,
  logOut,
  logoutAuthAdminDashboard,
  registerUser,
  registerUserAdminDashboad,
  sendLoginOtpToUser,
  updateAuthAdminDashboard,
  updateUserLocation,
} from "../controller/authUser.js";
import verifyToken from "../middleware/verifyToken.js";
import verifyUserToken from "../middleware/verifyUserToken.js";
import { refreshToken } from "../middleware/refreshToken.js";

const router = express.Router();

router.get("/", getAllAuthAdminDashboard);
router.post("/", registerUserAdminDashboad);
router.post("/login", loginAuthAdminDashboard);
router.get("/me", verifyToken, logedInAuthAdminDashboard);
router.post("/logout", logoutAuthAdminDashboard);
router.put("/:id", verifyToken, updateAuthAdminDashboard);
router.delete("/:id", deleteAuthAdminDashboard);

// User
router.post("/register-user", registerUser);
router.post("/login-user", loginUser);
router.post("/auth-refresh", refreshToken);
router.post("/send-otp", sendLoginOtpToUser);
router.get("/user", verifyUserToken, logedInUser);
router.post("/logout-user/:id", logOut);
router.patch("/user-location/:id", updateUserLocation);

export default router;
