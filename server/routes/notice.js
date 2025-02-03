import express from "express";
import {
  createNotice,
  getNotice,
  getNotices,
  updateNotice,
} from "../controller/notice.js";

const router = express.Router();

router.post("/", createNotice);
router.get("/", getNotices);
router.get("/:user", getNotice);
router.put("/update/:id", updateNotice);

export default router;
