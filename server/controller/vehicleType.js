import { PrismaClient } from "@prisma/client";
import createError from "../utils/createError.js";
import { createSlug } from "../utils/slug.js";
const prisma = new PrismaClient();

export const createVehicleType = async (req, res, next) => {
  try {
    const { name } = req.body;

    const existing = await prisma.vehicleType.findFirst({ where: { name } });

    if (existing) {
      return next(createError(400, "Already exist!"));
    }

    const vehicle = await prisma.vehicleType.create({
      data: {
        name,
        slug: createSlug(name),
      },
    });

    if (!vehicle) {
      return next(createError(400, "Please try again!"));
    }
    return res.status(200).json({ vehicle, message: "Successfully created!" });
  } catch (error) {
    return next(error);
  }
};

export const getVehicleTypes = async (req, res, next) => {
  try {
    const vehicles = await prisma.vehicleType.findMany();
    if (vehicles.length < 1) {
      return next(createError(400, "Cannot find any!"));
    }
    return res.status(200).json({ vehicles });
  } catch (error) {
    return next(error);
  }
};
