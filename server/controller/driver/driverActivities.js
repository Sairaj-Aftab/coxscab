import { PrismaClient } from "@prisma/client";
import createError from "../../utils/createError.js";
import { createSlug } from "../../utils/slug.js";
const prisma = new PrismaClient();

export const createDriverActivities = async (req, res, next) => {
  try {
    const { name } = req.body;

    const existing = await prisma.driverActivities.findFirst({
      where: { name: name.toUpperCase() },
    });

    if (existing) {
      return next(createError(400, "Already exist!"));
    }

    const activities = await prisma.driverActivities.create({
      data: {
        name: name.toUpperCase(),
        slug: createSlug(name),
      },
    });

    if (!activities) {
      return next(createError(400, "Please try again!"));
    }
    return res
      .status(200)
      .json({ activities, success: true, message: "Successfully created!" });
  } catch (error) {
    return next(error);
  }
};

export const getDriverActivities = async (req, res, next) => {
  try {
    const activities = await prisma.driverActivities.findMany();
    if (activities.length < 1) {
      return next(createError(400, "Cannot find any!"));
    }
    return res.status(200).json({ activities, success: true });
  } catch (error) {
    return next(error);
  }
};
