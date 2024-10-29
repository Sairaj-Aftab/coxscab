import { PrismaClient } from "@prisma/client";
import createError from "../../utils/createError.js";
import { createSlug } from "../../utils/slug.js";
const prisma = new PrismaClient();

export const createDriverStatus = async (req, res, next) => {
  try {
    const { name } = req.body;

    const existing = await prisma.driverStatus.findFirst({
      where: { name: name.toUpperCase() },
    });

    if (existing) {
      return next(createError(400, "Already exist!"));
    }

    const status = await prisma.driverStatus.create({
      data: {
        name: name.toUpperCase(),
        slug: createSlug(name),
      },
    });

    if (!status) {
      return next(createError(400, "Please try again!"));
    }
    return res
      .status(200)
      .json({ status, success: true, message: "Successfully created!" });
  } catch (error) {
    return next(error);
  }
};

export const getDriverStatus = async (req, res, next) => {
  try {
    const status = await prisma.driverStatus.findMany();
    if (status.length < 1) {
      return next(createError(400, "Cannot find any!"));
    }
    return res.status(200).json({ status, success: true });
  } catch (error) {
    return next(error);
  }
};
