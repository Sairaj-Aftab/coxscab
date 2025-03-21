import { PrismaClient } from "@prisma/client";
import createError from "../../utils/createError.js";
import { createSlug } from "../../utils/slug.js";
import crypto from "crypto";
import qr from "qrcode";
import { getObjectSignedUrl, uploadFile } from "../../utils/s3.js";
const prisma = new PrismaClient();

export const createDriver = async (req, res, next) => {
  try {
    const {
      name,
      nameBn,
      fatherName,
      motherName,
      picture,
      nidNo,
      nidDob,
      mobileNo,
      drivingLicenseNo,
      bloodGroup,
      educationalQualification,
      perVillage,
      perPo,
      perThana,
      perDistrict,
      currVillage,
      currHoldingNo,
      currWardNo,
      currThana,
      currDistrict,
      note,
      driverActivitiesId,
      driverStatusId,
      vehicleTypeId,
      vehicleId,
    } = req.body;

    let queryConditions = [];

    // Check if name and fatherName are provided and non-empty
    if (name && name.trim() !== "" && fatherName && fatherName.trim() !== "") {
      queryConditions.push({
        name,
        fatherName,
      });
    }

    // Check if nidNo is provided and non-empty
    if (nidNo && nidNo.trim() !== "") {
      queryConditions.push({
        nidNo,
      });
    }

    // Only run the query if there are valid conditions
    if (queryConditions.length > 0) {
      const existingDriver = await prisma.driver.findFirst({
        where: {
          OR: queryConditions,
        },
      });

      // If a driver exists, check the specific conflict and return an error
      if (existingDriver) {
        if (
          existingDriver.name === name &&
          existingDriver.fatherName === fatherName
        ) {
          return next(
            createError(
              400,
              "Driver with this name and father's name already exists!"
            )
          );
        }
        if (existingDriver.nidNo === nidNo) {
          return next(createError(400, "NID number already exists!"));
        }
      }
    }

    const driver = await prisma.driver.create({
      data: {
        name,
        nameBn,
        fatherName,
        motherName,
        picture,
        nidNo,
        nidDob: nidDob ? new Date(nidDob).toISOString() : null,
        mobileNo,
        drivingLicenseNo,
        bloodGroup,
        educationalQualification,
        permanentAddress: {
          village: perVillage,
          po: perPo,
          thana: perThana,
          district: perDistrict,
        },
        currentAddress: {
          village: currVillage,
          holdingNo: currHoldingNo,
          wardNo: currWardNo,
          thana: currThana,
          district: currDistrict,
        },
        note,
        driverActivitiesId: driverActivitiesId
          ? String(driverActivitiesId)
          : null,
        driverStatusId: driverStatusId ? String(driverStatusId) : null,
        vehicleTypeId: vehicleTypeId ? String(vehicleTypeId) : null,
        vehicleId: vehicleId ? String(vehicleId) : null,
      },
    });

    if (!driver) {
      return next(createError(400, "Please try again!"));
    }

    const qrCodeDataURL = await qr.toDataURL(
      `https://coxscab.com/driver/qrinfo/${driver.id}`,
      {
        width: 250,
        margin: 2,
      }
    );

    // Save the QR code data URL in the database
    const updatedDriverInfo = await prisma.driver.update({
      where: { id: driver.id },
      data: { qrCode: qrCodeDataURL },
      include: {
        driverActivities: true,
        driverStatus: true,
        vehicleType: true,
        vehicle: true,
      },
    });
    return res.status(200).json({
      driver: updatedDriverInfo,
      success: true,
      message: "Successfully created!",
    });
  } catch (error) {
    return next(error);
  }
};

export const getDrivers = async (req, res, next) => {
  const { typeId, search, page = 1, limit = 10 } = req.query;

  const filters = {
    ...(typeId && { vehicleType: { id: typeId } }),
    ...(search && {
      OR: [
        { coxscabId: { contains: search, mode: "insensitive" } },
        { name: { contains: search, mode: "insensitive" } },
        { nidNo: { contains: search, mode: "insensitive" } },
        { drivingLicenseNo: { contains: search, mode: "insensitive" } },
        {
          vehicle: {
            registrationNo: { contains: search, mode: "insensitive" },
          },
        },
      ],
    }),
  };

  try {
    const drivers = await prisma.driver.findMany({
      where: filters,
      orderBy: { coxscabId: "asc" },
      include: {
        vehicle: true,
        vehicleType: true,
        driverActivities: true,
        driverStatus: true,
      },
      skip: (page - 1) * limit, // For pagination
      take: parseInt(limit), // Limit results per page
    });

    const driverInfoWithUrls = await Promise.all(
      drivers.map(async (driver) => {
        if (driver.picture) {
          try {
            driver.pictureUrl = await getObjectSignedUrl(driver.picture);
          } catch (err) {
            driver.pictureUrl = null; // Set to null if URL generation fails
          }
        }
        return driver;
      })
    );

    // Count the total number of drivers matching the filters
    const totalDrivers = await prisma.driver.count({
      where: filters,
    });
    return res.status(200).json({
      drivers: driverInfoWithUrls,
      totalDrivers,
      success: true,
    });
  } catch (error) {
    return next(error);
  }
};

export const getDriver = async (req, res, next) => {
  try {
    const { id } = req.params;

    const driver = await prisma.driver.findUnique({
      where: { id },
      include: {
        vehicle: true,
        vehicleType: true,
        driverActivities: true,
        driverStatus: true,
      },
    });
    // Aggregate review stats
    const reviewStats = await prisma.review.aggregate({
      _count: true,
      _avg: {
        rating: true,
      },
      where: {
        driverId: String(id),
      },
    });

    // Extract the aggregated data
    const totalReviewCount = reviewStats._count;
    const averageRating = reviewStats._avg.rating;
    if (!driver) {
      return next(createError(400, "Driver not found!"));
    }
    if (driver.picture) {
      driver.pictureUrl = await getObjectSignedUrl(driver.picture);
    }

    return res
      .status(200)
      .json({ driver, totalReviewCount, averageRating, success: true });
  } catch (error) {
    return next(error);
  }
};

export const updateDriver = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      name,
      nameBn,
      fatherName,
      motherName,
      nidNo,
      nidDob,
      mobileNo,
      drivingLicenseNo,
      bloodGroup,
      educationalQualification,
      perVillage,
      perPo,
      perThana,
      perDistrict,
      currVillage,
      currHoldingNo,
      currWardNo,
      currThana,
      currDistrict,
      note,
      driverActivitiesId,
      driverStatusId,
      vehicleTypeId,
      vehicleId,
    } = req.body;

    let queryConditions = [];

    // Check if name and fatherName are provided and non-empty
    if (name && name.trim() !== "" && fatherName && fatherName.trim() !== "") {
      queryConditions.push({
        name,
        fatherName,
      });
    }

    // Check if nidNo is provided and non-empty
    if (nidNo && nidNo.trim() !== "") {
      queryConditions.push({
        nidNo,
      });
    }

    // Only run the query if there are valid conditions
    if (queryConditions.length > 0) {
      const existingDriver = await prisma.driver.findFirst({
        where: {
          id: {
            not: String(id), // This excludes the current driver being updated
          },
          OR: queryConditions,
        },
      });

      // If a driver exists, check the specific conflict and return an error
      if (existingDriver) {
        if (
          existingDriver.name === name &&
          existingDriver.fatherName === fatherName
        ) {
          return next(
            createError(
              400,
              "Driver with this name and father's name already exists!"
            )
          );
        }
        if (existingDriver.nidNo === nidNo) {
          return next(createError(400, "NID number already exists!"));
        }
      }
    }

    // Upload File
    let fileNameWithFolder;
    if (req.file) {
      fileNameWithFolder = `driver/${crypto.randomBytes(32).toString("hex")}-${
        req.file.originalname
      }`;

      const existImage = await prisma.driver.findFirst({
        where: { id: String(id) },
      });

      try {
        await uploadFile(req.file, fileNameWithFolder, existImage?.picture);
      } catch (error) {
        return next(error);
      }
    }

    // Update data
    let driver = await prisma.driver.update({
      where: { id: String(id) },
      data: {
        name,
        nameBn,
        fatherName,
        motherName,
        nidNo,
        nidDob: nidDob ? new Date(nidDob).toISOString() : null,
        mobileNo,
        drivingLicenseNo,
        bloodGroup,
        educationalQualification,
        ...(fileNameWithFolder && { picture: fileNameWithFolder }),
        permanentAddress: {
          village: perVillage,
          po: perPo,
          thana: perThana,
          district: perDistrict,
        },
        currentAddress: {
          village: currVillage,
          holdingNo: currHoldingNo,
          wardNo: currWardNo,
          thana: currThana,
          district: currDistrict,
        },
        note,
        driverActivitiesId: driverActivitiesId
          ? String(driverActivitiesId)
          : null,
        driverStatusId: driverStatusId ? String(driverStatusId) : null,
        vehicleTypeId: vehicleTypeId ? String(vehicleTypeId) : null,
        vehicleId: vehicleId ? String(vehicleId) : null,
      },
      include: {
        driverActivities: true,
        driverStatus: true,
        vehicleType: true,
        vehicle: true,
      },
    });

    if (!driver) {
      return next(createError(400, "Please try again!"));
    }

    if (driver.picture) {
      driver.pictureUrl = await getObjectSignedUrl(driver.picture);
    }

    return res.status(200).json({
      driver,
      success: true,
      message: "Successfully updated!",
    });
  } catch (error) {
    return next(error);
  }
};

// Find nearby drivers
export const findNearbyDrivers = async (req, res, next) => {
  try {
    const { latitude, longitude, radiusInKm } = req.query;

    // Ensure longitude and latitude are numbers
    const numericLatitude = parseFloat(latitude);
    const numericLongitude = parseFloat(longitude);

    if (isNaN(numericLatitude) || isNaN(numericLongitude)) {
      throw new Error("Invalid longitude or latitude. They must be numeric.");
    }

    const nearbyPlaces = await prisma.place.findRaw({
      filter: {
        location: {
          $nearSphere: {
            $geometry: {
              type: "Point",
              coordinates: [numericLongitude, numericLatitude], // Longitude and Latitude
            },
            $maxDistance: radiusInKm * 1000, // Radius in meters
          },
        },
        status: true, // Optional filter: Only active places
        trash: false, // Optional filter: Exclude trashed places
      },
      // options: {
      //   projection: { address: 1, location: 1 }, // Optional: Specify fields to return
      // },
    });
    console.log(nearbyPlaces?.length);

    console.log(nearbyPlaces);

    return res.status(200).json({
      nearbyPlaces,
      success: true,
      message: "Successfully found!",
    });
  } catch (error) {
    return next(error);
  }
};

// Delete
export const deleteDriver = async (req, res, next) => {
  try {
    const { id } = req.params;
    const driver = await prisma.driver.delete({
      where: { id },
    });
    if (!driver) {
      return next(createError(400, "Please try again!"));
    }
    return res
      .status(200)
      .json({ success: true, message: "Successfully deleted." });
  } catch (error) {
    return next(error);
  }
};
export const generateDriversFrom = async (req, res, next) => {
  try {
    const startId = 5751; // Start from 5001
    const endId = 6000; // End at 5010
    const drivers = [];

    // Generate drivers from 5001 to 5010
    for (let i = startId; i <= endId; i++) {
      const coxscabId = String(i).padStart(4, "0");

      drivers.push({
        coxscabId,
        name: `Name${i}`,
        nameBn: `নাম${i}`,
        nidDob: null,
        driverActivitiesId: null,
        driverStatusId: null,
        vehicleTypeId: null,
        vehicleId: null,
      });
    }

    // Insert the first batch of 100 drivers
    await prisma.driver.createMany({ data: drivers });

    // Retrieve the inserted drivers to generate QR codes
    const insertedDrivers = await prisma.driver.findMany({
      where: {
        coxscabId: {
          in: drivers.map((driver) => driver.coxscabId),
        },
      },
      select: { id: true, coxscabId: true },
      orderBy: { id: "asc" },
    });

    // Generate QR codes for the inserted drivers
    for (const driver of insertedDrivers) {
      const qrCodeDataURL = await qr.toDataURL(
        `https://coxscab.com/driver/qrinfo/${driver.id}`,
        {
          width: 250,
          margin: 2,
        }
      );

      // Update each driver with the QR code URL
      await prisma.driver.update({
        where: { id: driver.id },
        data: { qrCode: qrCodeDataURL },
      });
    }

    return res.status(200).json({
      success: true,
      message: `Success`,
    });
  } catch (error) {
    return next(error);
  }
};
