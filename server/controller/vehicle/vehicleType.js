import { PrismaClient } from "@prisma/client";
import createError from "../../utils/createError.js";
import { createSlug } from "../../utils/slug.js";
const prisma = new PrismaClient();

export const createVehicleType = async (req, res, next) => {
  try {
    const { name } = req.body;

    const existing = await prisma.vehicleType.findFirst({
      where: { name: name.toUpperCase() },
    });

    if (existing) {
      return next(createError(400, "Already exist!"));
    }

    const type = await prisma.vehicleType.create({
      data: {
        name: name.toUpperCase(),
        slug: createSlug(name),
      },
    });

    if (!type) {
      return next(createError(400, "Please try again!"));
    }
    return res
      .status(200)
      .json({ type, success: true, message: "Successfully created!" });
  } catch (error) {
    return next(error);
  }
};

export const getVehicleTypes = async (req, res, next) => {
  try {
    const types = await prisma.vehicleType.findMany();
    if (types.length < 1) {
      return next(createError(400, "Cannot find any!"));
    }
    return res.status(200).json({ types, success: true });
  } catch (error) {
    return next(error);
  }
};
