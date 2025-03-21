import { PrismaClient } from "@prisma/client";
import createError from "../../utils/createError.js";
import { createSlug } from "../../utils/slug.js";
import qr from "qrcode";
const prisma = new PrismaClient();

export const getVehicles = async (req, res, next) => {
  const { typeId, search, page = 1, limit = 10 } = req.query;

  const filters = {
    ...(typeId && { vehicleType: { id: typeId } }),
    ...(search && {
      OR: [
        { registrationNo: { contains: search, mode: "insensitive" } },
        { engineChassisNo: { contains: search, mode: "insensitive" } },
        { ownerName: { contains: search, mode: "insensitive" } },
      ],
    }),
  };
  try {
    const vehicles = await prisma.vehicle.findMany({
      where: filters,
      include: {
        vehicleType: true,
        vehicleCondition: true,
        drivers: true,
        garage: true,
      },
      skip: (page - 1) * limit, // For pagination
      take: parseInt(limit), // Limit results per page
    });
    // Count the total number of drivers matching the filters
    const totalVehicles = await prisma.vehicle.count({
      where: filters,
    });
    return res.status(200).json({ vehicles, totalVehicles, success: true });
  } catch (error) {
    return next(error);
  }
};

// Create vehicle
export const createVehicle = async (req, res, next) => {
  try {
    const {
      vehicleTypeId,
      vehicleConditionId,
      registrationNo,
      fcExpire,
      engineChassisNo,
      ownerName,
      ownerMobileNo,
      ownerNidNo,
      ownerNidDob,
      fatherName,
      village,
      holdingNo,
      wardNo,
      thana,
      district,
      vehicleImage,
      followUpByAuthority,
      garageId,
      driverIds,
    } = req.body;

    const existing = await prisma.vehicle.findFirst({
      where: {
        AND: [{ vehicleTypeId }, { registrationNo }],
      },
    });

    if (existing) {
      return next(createError(400, "Vehicle already exist!"));
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        vehicleType: {
          connect: { id: String(vehicleTypeId) },
        },
        vehicleCondition: vehicleConditionId
          ? {
              connect: {
                id: String(vehicleConditionId),
              },
            }
          : undefined,
        registrationNo,
        engineChassisNo,
        fcExpire: fcExpire ? new Date(fcExpire).toISOString() : null,
        ownerName,
        ownerMobileNo,
        ownerNidNo,
        ownerNidDob: ownerNidDob ? new Date(ownerNidDob).toISOString() : null,
        fatherName,
        ownerAddress: {
          village,
          holdingNo,
          wardNo,
          thana,
          district,
        },
        followUpByAuthority,
        garage: garageId
          ? {
              connect: {
                id: garageId,
              },
            }
          : undefined,
        drivers:
          driverIds && driverIds.length > 0
            ? {
                connect: driverIds.map((id) => ({ id })),
              }
            : undefined, // Skip if no drivers
      },
    });

    if (!vehicle) {
      return next(createError(400, "Please try again!"));
    }

    const qrCodeDataURL = await qr.toDataURL(
      `https://coxscab.com/vehicle/qrinfo/${vehicle.id}/${registrationNo}`,
      {
        width: 250,
        margin: 2,
      }
    );

    // Save the QR code data URL in the database
    const updatedVehicleInfo = await prisma.vehicle.update({
      where: { id: vehicle.id },
      data: { qrCode: qrCodeDataURL },
      include: {
        vehicleType: true,
        vehicleCondition: true,
        garage: true,
        drivers: true,
      },
    });

    return res.status(200).json({
      vehicle: updatedVehicleInfo,
      success: true,
      message: "Successfully created.",
    });
  } catch (error) {
    return next(error);
  }
};

// Update vehicle
export const updateVehicle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      vehicleTypeId,
      vehicleConditionId,
      registrationNo,
      fcExpire,
      engineChassisNo,
      ownerName,
      ownerMobileNo,
      ownerNidNo,
      ownerNidDob,
      fatherName,
      village,
      holdingNo,
      wardNo,
      thana,
      district,
      vehicleImage,
      followUpByAuthority,
      garageId,
      driverIds,
    } = req.body;

    let queryConditions = [];

    // Check if name and fatherName are provided and non-empty
    if (
      vehicleTypeId !== "" &&
      registrationNo &&
      registrationNo.trim() !== ""
    ) {
      queryConditions.push({
        vehicleTypeId,
        registrationNo,
      });
    }

    // Only run the query if there are valid conditions
    if (queryConditions.length > 0) {
      const existingVehicle = await prisma.vehicle.findFirst({
        where: {
          id: {
            not: String(id), // This excludes the current vehicle being updated
          },
          OR: queryConditions,
        },
      });

      // If a vehicle exists, check the specific conflict and return an error
      if (existingVehicle) {
        return next(createError(400, "Vehicle already exist!"));
      }
    }

    const vehicle = await prisma.vehicle.update({
      where: { id: String(id) },
      data: {
        vehicleTypeId: String(vehicleTypeId),
        vehicleConditionId: vehicleConditionId
          ? String(vehicleConditionId)
          : null,
        registrationNo,
        fcExpire: fcExpire ? new Date(fcExpire).toISOString() : null,
        engineChassisNo,
        ownerName,
        ownerMobileNo,
        ownerNidNo,
        ownerNidDob: ownerNidDob ? new Date(ownerNidDob).toISOString() : null,
        fatherName,
        ownerAddress: {
          village,
          holdingNo,
          wardNo,
          thana,
          district,
        },
        followUpByAuthority,
        garageId: garageId ? String(garageId) : null, // Foreign key to Garage (optional)
        drivers:
          driverIds && driverIds.length > 0
            ? {
                set: driverIds.map((id) => ({ id })),
              }
            : { set: [] },
      },
      include: {
        vehicleType: true,
        vehicleCondition: true,
        garage: true,
        drivers: true,
      },
    });

    if (!vehicle) {
      return next(createError(400, "Please try again!"));
    }

    return res.status(200).json({
      vehicle,
      success: true,
      message: "Successfully updated!",
    });
  } catch (error) {
    return next(error);
  }
};

// Get single vehicle by ID
export const getVehicle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const vehicle = await prisma.vehicle.findFirst({
      where: { id: String(id) },
      include: {
        vehicleType: true,
        vehicleCondition: true,
        drivers: true,
        garage: true,
      },
    });
    if (!vehicle) {
      return next(createError(400, "Cannot find any vehicle!"));
    }
    return res.status(200).json({ vehicle });
  } catch (error) {
    return next(error);
  }
};

// Delete
export const deleteVehicle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const vehicle = await prisma.vehicle.delete({
      where: { id },
    });
    if (!vehicle) {
      return next(createError(400, "Please try again!"));
    }
    return res
      .status(200)
      .json({ success: true, message: "Successfully deleted." });
  } catch (error) {
    return next(error);
  }
};

export const generateVehicles = async (req, res, next) => {
  try {
    const totalVehicles = 1000; // Total vehicles to generate
    const batchSize = 1000; // Number of vehicles to process in each batch
    const vehicles = [];

    // Loop to generate vehicles
    for (let i = 2000; i < 2000 + batchSize; i++) {
      const registrationNo = `TL${String(i + 1).padStart(4, "0")}`;

      vehicles.push({
        registrationNo,
        vehicleTypeId: "6717b076cff8a7c02b72284d",
        ownerNidDob: null,
      });
    }

    // Insert the generated vehicles in a batch
    await prisma.vehicle.createMany({ data: vehicles });

    // Retrieve the inserted vehicles for QR code generation
    const insertedVehicles = await prisma.vehicle.findMany({
      where: {
        registrationNo: {
          in: vehicles.map((vehicle) => vehicle.registrationNo),
        },
      },
      select: { id: true, registrationNo: true },
      orderBy: { id: "asc" },
    });

    // Generate and update each vehicle with a QR code
    for (const vehicle of insertedVehicles) {
      const qrCodeDataURL = await qr.toDataURL(
        `https://coxscab.com/vehicle/qrinfo/${vehicle.id}/${vehicle.registrationNo}`,
        {
          width: 250,
          margin: 2,
        }
      );

      // Update each vehicle with its QR code
      await prisma.vehicle.update({
        where: { id: vehicle.id },
        data: { qrCode: qrCodeDataURL },
      });
    }

    return res.status(200).json({
      success: true,
      message: "Vehicles successfully created and QR codes generated.",
    });
  } catch (error) {
    return next(error);
  }
};
