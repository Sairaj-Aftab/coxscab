import { PrismaClient } from "@prisma/client";
import createError from "../utils/createError.js";
const prisma = new PrismaClient();

export const createPackage = async (req, res, next) => {
  try {
    const {
      price,
      description,
      endAddress,
      category,
      duration,
      extraCharge,
      startPlaces, // array
      endPlaces, // array
      vehicleTypeId,
      seat,
      status,
    } = req.body;
    // Validate required fields
    if (!price || !endPlaces || !vehicleTypeId) {
      return next(createError(400, "Missing required fields!"));
    }

    // Process Start Places
    const startPlaceIds = [];
    if (startPlaces) {
      for (const startPlace of startPlaces) {
        const startPlaceData = {
          mapId: startPlace.id,
          address: startPlace.address,
          address_bn: startPlace?.address_bn,
          city: startPlace?.city,
          city_bn: startPlace?.city_bn,
          area: startPlace?.area,
          area_bn: startPlace?.area_bn,
          district: startPlace?.district,
          postcode: String(startPlace?.postcode),
          location: {
            type: "Point",
            coordinates: [
              parseFloat(startPlace.longitude),
              parseFloat(startPlace.latitude),
            ],
          },
          status: true,
          trash: false,
        };

        let startingPlace = await prisma.place.findFirst({
          where: { mapId: startPlaceData.mapId },
        });
        if (!startingPlace) {
          startingPlace = await prisma.place.create({ data: startPlaceData });
        }
        startPlaceIds.push(startingPlace.id);
      }
    }
    // Process End Places
    const endPlaceIds = [];
    for (const endPlace of endPlaces) {
      const endPlaceData = {
        mapId: endPlace.id,
        address: endPlace.address,
        address_bn: endPlace?.address_bn,
        city: endPlace?.city,
        city_bn: endPlace?.city_bn,
        area: endPlace?.area,
        area_bn: endPlace?.area_bn,
        district: endPlace?.district,
        postcode: String(endPlace?.postcode),
        location: {
          type: "Point",
          coordinates: [
            parseFloat(endPlace.longitude),
            parseFloat(endPlace.latitude),
          ],
        },
        status: true,
        trash: false,
      };

      let endingPlace = await prisma.place.findFirst({
        where: { mapId: endPlaceData.mapId },
      });
      if (!endingPlace) {
        endingPlace = await prisma.place.create({ data: endPlaceData });
      }
      endPlaceIds.push(endingPlace.id);
    }
    const packageItem = await prisma.package.create({
      data: {
        vehicleTypeId,
        price: parseFloat(price),
        endAddress,
        category,
        duration,
        extraCharge: {
          price: parseFloat(extraCharge.price),
          duration: 1000 * 60 * 15, // for 15 mins
        },
        description,
        seat,
        status,
        ...(startPlaceIds.length > 0 && {
          startPoints: { connect: startPlaceIds.map((id) => ({ id })) },
        }),
        endPoint: { connect: endPlaceIds.map((id) => ({ id })) },
      },
      include: {
        startPoint: true,
        endPoint: true,
        vehicleType: true,
      },
    });
    if (!packageItem) {
      return next(createError(400, "Please try again!"));
    }

    return res.status(200).json({
      package: packageItem,
      success: true,
      message: "Successfully created!",
    });
  } catch (error) {
    return next(error);
  }
};

// update package
export const updatePackage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      price,
      description,
      endAddress,
      category,
      duration,
      extraCharge,
      startPlaces,
      endPlaces,
      vehicleTypeId,
      seat,
      status,
    } = req.body;

    // Validate required fields
    if (!price || !endPlaces || !vehicleTypeId) {
      return next(createError(400, "Missing required fields!"));
    }
    // Process Start Places
    const startPlaceIds = [];
    if (startPlaces) {
      for (const startPlace of startPlaces) {
        const startPlaceData = {
          mapId: startPlace.id,
          address: startPlace.address,
          address_bn: startPlace?.address_bn,
          city: startPlace?.city,
          city_bn: startPlace?.city_bn,
          area: startPlace?.area,
          area_bn: startPlace?.area_bn,
          district: startPlace?.district,
          postcode: String(startPlace?.postcode),
          location: {
            type: "Point",
            coordinates: [
              parseFloat(startPlace.longitude),
              parseFloat(startPlace.latitude),
            ],
          },
          status: true,
          trash: false,
        };

        let startingPlace = await prisma.place.findFirst({
          where: { mapId: startPlaceData.mapId },
        });
        if (!startingPlace) {
          startingPlace = await prisma.place.create({ data: startPlaceData });
        }
        startPlaceIds.push(startingPlace.id);
      }
    }
    // Process End Places
    const endPlaceIds = [];
    for (const endPlace of endPlaces) {
      const endPlaceData = {
        mapId: endPlace.id,
        address: endPlace.address,
        address_bn: endPlace?.address_bn,
        city: endPlace?.city,
        city_bn: endPlace?.city_bn,
        area: endPlace?.area,
        area_bn: endPlace?.area_bn,
        district: endPlace?.district,
        postcode: String(endPlace?.postcode),
        location: {
          type: "Point",
          coordinates: [
            parseFloat(endPlace.longitude),
            parseFloat(endPlace.latitude),
          ],
        },
        status: true,
        trash: false,
      };

      let endingPlace = await prisma.place.findFirst({
        where: { mapId: endPlaceData.mapId },
      });
      if (!endingPlace) {
        endingPlace = await prisma.place.create({ data: endPlaceData });
      }
      endPlaceIds.push(endingPlace.id);
    }

    const updatedPackage = await prisma.package.update({
      where: { id },
      data: {
        vehicleTypeId,
        price: parseFloat(price),
        endAddress,
        category,
        duration,
        extraCharge: {
          price: parseFloat(extraCharge.price),
          duration: 1000 * 60 * 15, // for 15 mins
        },
        description,
        seat,
        status,
        ...(startPlaceIds.length > 0 && {
          startPoints: { set: startPlaceIds.map((id) => ({ id })) },
        }),
        endPoint: { set: endPlaceIds.map((id) => ({ id })) },
      },
      include: {
        startPoint: true,
        endPoint: true,
        vehicleType: true,
      },
    });
    if (!updatedPackage) {
      return next(createError(400, "Please try again!"));
    }
    return res.status(200).json({
      package: updatedPackage,
      success: true,
      message: "Successfully updated!",
    });
  } catch (error) {
    return next(error);
  }
};

// Get All Package
export const getAllPackages = async (req, res, next) => {
  const { typeId, search, page = 1, limit = 10 } = req.query;

  const filters = {
    ...(typeId && { vehicleType: { id: typeId } }),
    ...(search && {
      OR: [
        { price: { contains: search, mode: "insensitive" } },
        { seat: { contains: search, mode: "insensitive" } },
        {
          endPoint: {
            some: {
              address: { contains: search, mode: "insensitive" },
              address_bn: { contains: search, mode: "insensitive" },
            },
          },
        },
      ],
    }),
  };
  try {
    // Retrieve all packages with related data
    const packages = await prisma.package.findMany({
      where: filters,
      include: {
        startPoint: true,
        endPoint: true,
        vehicleType: true, // Include vehicle type details
      },
      orderBy: {
        createdAt: "desc", // Sort by creation date (newest first)
      },
      skip: (page - 1) * limit, // For pagination
      take: parseInt(limit), // Limit results per page
    });

    const totalPackages = await prisma.package.count({
      where: filters,
    });
    return res.status(200).json({ packages, totalPackages, success: true });
  } catch (error) {
    return next(error);
  }
};
// Get All Package by Vehicle Type
export const getAllPackagesByVehicleTypeAndPlace = async (req, res, next) => {
  try {
    const { vehicleTypeId } = req.params;
    const { latitude, longitude } = req.body;

    // Retrieve all packages with related data
    const packages = await prisma.package.findMany({
      where: {
        OR: [
          {
            vehicleTypeId,
          },
          {
            routes: {
              some: {},
            },
          },
        ],
      },
      include: {
        routes: {
          include: {
            package: true,
            route: true,
          },
        },

        vehicleType: true, // Include vehicle type details
      },
      orderBy: {
        createdAt: "desc", // Sort by creation date (newest first)
      },
    });
    const totalPackages = await prisma.package.count({
      where: {
        vehicleTypeId,
      },
    });
    return res.status(200).json({ packages, totalPackages, success: true });
  } catch (error) {
    return next(error);
  }
};

// Delete Package
export const deletePackage = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if the package exists
    const existingPackage = await prisma.package.findUnique({
      where: { id },
    });

    if (!existingPackage) {
      return next(createError(404, "Package not found."));
    }

    // Delete the package and associated routes
    const deletedPackage = await prisma.package.delete({
      where: { id },
    });

    return res.status(200).json({
      package: deletedPackage,
      message: "Package deleted successfully!",
    });
  } catch (error) {
    return next(error);
  }
};
