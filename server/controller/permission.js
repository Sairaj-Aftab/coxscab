import { PrismaClient } from "@prisma/client";
import createError from "../utils/createError.js";
import { createSlug } from "../utils/slug.js";
const prisma = new PrismaClient();

export const getPermission = async (req, res, next) => {
  try {
    const permissions = await prisma.permission.findMany();

    return res.status(200).json({ permissions });
  } catch (error) {
    return next(error);
  }
};

export const createPermission = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name) {
      return next(createError(400, "The field is required!"));
    }
    const existingPermission = await prisma.permission.findFirst({
      where: {
        name: name.toUpperCase(),
      },
    });

    if (existingPermission) {
      return next(createError(400, "Permission already exists!"));
    }
    const permission = await prisma.permission.create({
      data: {
        name: name.toUpperCase(),
        slug: createSlug(name),
      },
    });
    if (!permission) {
      return next(createError(400, "Please try again!"));
    }
    return res
      .status(200)
      .json({ permission, message: "Successfully created!" });
  } catch (error) {
    console.log(error);

    return next(error);
  }
};

export const deletePermission = async (req, res, next) => {
  try {
    const { id } = req.params;
    const permission = await prisma.permission.delete({
      where: {
        id: String(id),
      },
    });
    return res.status(200).json({ permission });
  } catch (error) {
    return next(error);
  }
};

export const updatePermissionStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const permission = await prisma.permission.update({
      where: {
        id: String(id),
      },
      data: {
        status: !status,
      },
    });

    res.status(200).json({ permission, message: "Successfully updated" });
  } catch (error) {
    next(error);
  }
};

// const url = "https://obtcoxsbazar.com"; // The URL to embed in the QR code
//     const text =
//       "🌟 Welcome to Cox's Bazar Online Bus Terminal! 🌟\n\n" +
//       "🚌 Book your tickets, check schedules, and start your journey today!\n"; // The text to include in the QR code

//     // Combine the URL and text into a single string
//     const combinedData = `${text}\n${url}`; // Use newline to separate text and URL

//     // Generate the QR code as a Data URL
//     const qrCodeDataURL = await QRCode.toDataURL(combinedData, {
//       width: 1000, // High resolution width
//       margin: 2,
//     });

//     console.log(qrCodeDataURL); // Log the generated QR code data URL
//     return res.status(200).json({ qrCodeDataURL });
