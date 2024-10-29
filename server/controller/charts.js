import { PrismaClient } from "@prisma/client";
import createError from "../utils/createError.js"; // Adjust the path as necessary

const prisma = new PrismaClient();

export const getVehicleChart = async (req, res, next) => {
  try {
    // 1. Group by vehicleTypeId and count vehicles
    const vehicleTypeCounts = await prisma.vehicle.groupBy({
      by: ["vehicleTypeId"],
      _count: {
        id: true,
      },
    });

    // 2. Group by vehicleConditionId and count vehicles
    const vehicleConditionCounts = await prisma.vehicle.groupBy({
      by: ["vehicleConditionId"],
      _count: {
        id: true,
      },
    });

    // 3. Retrieve vehicle type names
    const vehicleTypes = await prisma.vehicleType.findMany({
      where: {
        id: { in: vehicleTypeCounts.map((item) => item.vehicleTypeId) },
      },
      select: { id: true, name: true },
    });

    // 4. Retrieve vehicle condition names, filtering out null and undefined
    const vehicleConditionIds = vehicleConditionCounts
      .map((item) => item.vehicleConditionId)
      .filter((id) => id !== null && id !== undefined); // Remove null and undefined values

    const vehicleConditions = await prisma.vehicleCondition.findMany({
      where: {
        id: {
          in: vehicleConditionIds, // Now this will not contain nulls or undefined
        },
      },
      select: { id: true, name: true },
    });

    // 5. Map type names with counts
    const typeData = vehicleTypes.map((type) => {
      const countData = vehicleTypeCounts.find(
        (item) => item.vehicleTypeId === type.id
      );
      return {
        type: type.name,
        count: countData?._count?.id || 0,
      };
    });

    // 6. Map condition names with counts and handle null or undefined cases
    const conditionData = vehicleConditions.map((condition) => {
      const countData = vehicleConditionCounts.find(
        (item) => item.vehicleConditionId === condition.id
      );
      return {
        condition: condition.name,
        count: countData?._count?.id || 0,
      };
    });

    // 7. Add "Other" category for vehicles without conditions
    const otherCount = vehicleConditionCounts.reduce((acc, item) => {
      if (
        item.vehicleConditionId === null ||
        item.vehicleConditionId === undefined
      ) {
        return acc + item._count.id; // Accumulate counts for null or undefined
      }
      return acc;
    }, 0);

    if (otherCount > 0) {
      conditionData.push({
        condition: "Unspecified", // Add the "Other" category
        count: otherCount,
      });
    }

    // 8. Send combined data in response
    return res.status(200).json({
      vehicleTypeCounts: typeData,
      vehicleConditionCounts: conditionData,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching vehicle chart data:", error); // Log error for monitoring
    return next(createError(500, "Internal Server Error"));
  }
};
