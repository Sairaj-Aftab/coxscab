import { PrismaClient } from "@prisma/client";
import createError from "../utils/createError.js";
const prisma = new PrismaClient();

export const createGarage = async (req, res, next) => {
  try {
    const {
      ownerName,
      mobileNo,
      managerName,
      managerMobileNo,
      address1,
      address2,
      numberOfVehicles,
      note,
      vehicleIds, // Array of vehicle IDs to link to this garage
    } = req.body;

    // Prepare vehicle connection data
    const vehiclesToConnect = vehicleIds?.map((id) => ({ id })) || [];

    // Create the garage entry in the database
    const garage = await prisma.garage.create({
      data: {
        ownerName,
        mobileNo,
        managerName,
        managerMobileNo,
        garageAddress: {
          address1,
          address2,
        },
        numberOfVehicles,
        note,
        vehicles: {
          connect: vehiclesToConnect,
        },
      },
      include: {
        vehicles: true,
      },
    });

    if (!garage) {
      return next(createError(404, "Please try again!"));
    }

    // Respond with the newly created garage
    return res.status(200).json({ garage, success: true });
  } catch (error) {
    return next(error);
  }
};

// Get Garages
export const getGarages = async (req, res, next) => {
  const { search, page = 1, limit = 10 } = req.query;

  const filters = {
    ...(search && {
      OR: [{ ownerName: { contains: search, mode: "insensitive" } }],
    }),
  };
  try {
    const garages = await prisma.garage.findMany({
      where: filters,
      skip: (page - 1) * limit, // For pagination
      take: parseInt(limit), // Limit results per page
      include: {
        vehicles: true,
        _count: {
          select: {
            vehicles: true,
          },
        },
      },
    });

    const totalGarage = await prisma.garage.count({
      where: filters,
    });

    // Respond with the newly created garage
    return res.status(200).json({ garages, totalGarage, success: true });
  } catch (error) {
    return next(error);
  }
};

// Delete Garage
export const deleteGarage = async (req, res, next) => {
  const { id } = req.params;

  try {
    // Check if the garage exists
    const garage = await prisma.garage.findUnique({
      where: { id },
    });

    if (!garage) {
      return res
        .status(404)
        .json({ message: "Garage not found", success: false });
    }

    // Delete the garage
    await prisma.garage.delete({
      where: { id },
    });

    return res
      .status(200)
      .json({ message: "Deleted successfully", success: true });
  } catch (error) {
    return next(error);
  }
};
