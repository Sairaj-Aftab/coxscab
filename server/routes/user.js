import express from "express";
import {
  getAllUsers,
  logedInUser,
  loginUser,
  logOut,
  registerAdminUser,
  registerDriverUser,
  registerUser,
  sendLoginOtpToUser,
  updateUserLocation,
  updateUserStatus,
} from "../controller/user.js";
import { refreshToken } from "../middleware/refreshToken.js";
import verifyUserToken from "../middleware/verifyUserToken.js";

const router = express.Router();

// User
router.post("/register-user", registerUser);
router.post("/register-driver-user", registerDriverUser);
router.post("/register-admin-user", registerAdminUser);
router.post("/login-user", loginUser);
router.post("/auth-refresh", refreshToken);
router.post("/send-otp", sendLoginOtpToUser);
router.get("/user", verifyUserToken, logedInUser);
router.post("/logout-user/:id", logOut);
router.patch("/user-location/:id", updateUserLocation);

// Get All users
router.get("/all-users", getAllUsers);
router.put("/status/:id", updateUserStatus);

export default router;
