import express from "express";
import {
  deleteUser,
  getAllUsers,
  logedInUser,
  login,
  logout,
  register,
  updateUser,
} from "../controller/authUser.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", getAllUsers);
router.post("/", register);
router.post("/login", login);
router.post("/logout", logout);
router.delete("/:id", deleteUser);
router.get("/me", verifyToken, logedInUser);
router.put("/:id", verifyToken, updateUser);

export default router;
