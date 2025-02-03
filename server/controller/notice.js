import { PrismaClient } from "@prisma/client";
import createError from "../utils/createError.js";
const prisma = new PrismaClient();

export const getNotices = async (req, res, next) => {
  try {
    const notices = await prisma.notice.findMany();
    return res.status(200).json({ notices });
  } catch (error) {
    return next(error);
  }
};

export const getNotice = async (req, res, next) => {
  try {
    const { user } = req.params;
    const notice = await prisma.notice.findFirst({
      where: { user },
    });
    return res.status(200).json({ notice });
  } catch (error) {
    return next(error);
  }
};

// Create Notice
export const createNotice = async (req, res, next) => {
  try {
    const { title, user } = req.body;
    const existing = await prisma.notice.findUnique({ where: { user } });
    if (existing) {
      return next(
        createError(400, `Notice already exists for ${existing.user}`)
      );
    }
    const notice = await prisma.notice.create({
      data: { title, user },
    });
    return res.status(200).json({ notice, message: "Successfully created!" });
  } catch (error) {
    return next(error);
  }
};

// Update Notice
export const updateNotice = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    const notice = await prisma.notice.update({
      where: { id: String(id) },
      data: { title },
    });
    return res.status(200).json({ notice, message: "Successfully updated!" });
  } catch (error) {
    return next(error);
  }
};
