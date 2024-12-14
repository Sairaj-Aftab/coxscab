import { PrismaClient } from "@prisma/client";
import createError from "../utils/createError.js";
const prisma = new PrismaClient();

export const createPackage = async (req, res, next) => {
  try {
    const { price, description, routes, vehicleTypeId, seat, status } =
      req.body;

    // Transform `routes` array to match the required structure
    const routeData = await Promise.all(
      routes.map(
        async ({
          id,
          address,
          address_bn,
          city,
          city_bn,
          area,
          area_bn,
          district,
          postcode,
          latitude,
          longitude,
        }) => {
          const endPointJson = {
            address,
            address_bn,
            city,
            city_bn,
            area,
            area_bn,
            district,
            postcode,
            latitude,
            longitude,
          };
          // Check for existing route by latitude and longitude
          const existingRoute = await prisma.route.findFirst({
            where: {
              endPoint: {
                equals: endPointJson,
              },
            },
          });

          if (existingRoute) {
            // Connect existing route
            return {
              route: {
                connect: { id: existingRoute.id },
              },
            };
          } else {
            // Create a new route
            return {
              route: {
                create: {
                  endPoint: endPointJson,
                },
              },
            };
          }
        }
      )
    );
    const packageItem = await prisma.package.create({
      data: {
        vehicleTypeId,
        price: parseFloat(price),
        description,
        seat,
        routes: { create: routeData },
        status,
      },
      include: {
        routes: { include: { route: true } },
      },
    });
    if (!packageItem) {
      return next(createError(400, "Please try again!"));
    }
    return res
      .status(200)
      .json({ packageItem, success: true, message: "Successfully created!" });
  } catch (error) {
    console.log(error);

    return next(error);
  }
};

// Get All Package
export const getAllPackages = async (req, res, next) => {
  try {
    // Retrieve all packages with related data
    const packages = await prisma.package.findMany({
      include: {
        routes: {
          include: {
            route: true, // Include route details
          },
        },
        vehicleType: true, // Include vehicle type details
      },
      orderBy: {
        createdAt: "desc", // Sort by creation date (newest first)
      },
    });
    const totalPackages = await prisma.package.count();
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
      include: { routes: true }, // Include associated routes
    });

    if (!existingPackage) {
      return next(createError(404, "Package not found."));
    }

    // Delete the package and associated routes
    await prisma.package.delete({
      where: { id },
    });

    return res.status(200).json({ message: "Package deleted successfully!" });
  } catch (error) {
    return next(error);
  }
};
