import { PrismaClient } from "@prisma/client";
import createError from "../../utils/createError.js";
import { createSlug } from "../../utils/slug.js";
import qr from "qrcode";
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
        vehicleTypeId: String(vehicleTypeId),
        vehicleId: vehicleId ? String(vehicleId) : null,
      },
    });

    if (!driver) {
      return next(createError(400, "Please try again!"));
    }

    const qrCodeDataURL = await qr.toDataURL(
      `https://coxscab.com/driver/qrinfo/${name}/${driver.id}/${vehicleTypeId}`,
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
        { name: { contains: search, mode: "insensitive" } },
        { nidNo: { contains: search, mode: "insensitive" } },
        { fatherName: { contains: search, mode: "insensitive" } },
      ],
    }),
  };

  try {
    const drivers = await prisma.driver.findMany({
      where: filters,
      include: {
        vehicle: true,
        vehicleType: true,
        driverActivities: true,
        driverStatus: true,
      },
      skip: (page - 1) * limit, // For pagination
      take: parseInt(limit), // Limit results per page
    });
    // Count the total number of drivers matching the filters
    const totalDrivers = await prisma.driver.count({
      where: filters,
    });
    return res.status(200).json({
      drivers,
      totalDrivers,
      success: true,
    });
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

    const driver = await prisma.driver.update({
      where: { id: String(id) },
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
        vehicleTypeId: String(vehicleTypeId),
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

    return res.status(200).json({
      driver,
      success: true,
      message: "Successfully updated!",
    });
  } catch (error) {
    console.log(error);

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