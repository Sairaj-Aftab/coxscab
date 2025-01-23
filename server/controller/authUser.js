import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import createError from "../utils/createError.js";
import { createRefreshToken, createToken } from "../utils/token.js";
import { sendSMStoPhone } from "../utils/sendSmsToPhone.js";
const prisma = new PrismaClient();

/**
 *
 * User front customer and driver user Authentication
 */

/**
 *
 * Create Auth User for managing Dashboard
 */
export const registerUserAdminDashboad = async (req, res, next) => {
  try {
    const { userName, phone, password, roleId } = req.body;

    const existingUser = await prisma.authUser.findUnique({
      where: {
        userName,
      },
    });
    if (existingUser) {
      return next(createError(400, "User already exists"));
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.authUser.create({
      data: {
        userName,
        phone,
        password: hashedPassword,
        roleId: String(roleId),
      },
      include: {
        role: true,
      },
    });
    return res.status(200).json({ user, message: "User created successfully" });
  } catch (error) {
    return next(error);
  }
};

export const getAllAuthAdminDashboard = async (req, res, next) => {
  try {
    const users = await prisma.authUser.findMany({
      orderBy: { createdAt: "asc" },
      include: {
        role: true,
      },
    });
    if (users.length < 1) {
      return next(createError(400, "Cannot find any user!"));
    }
    return res.status(200).json({ users });
  } catch (error) {
    return next(error);
  }
};

export const updateAuthAdminDashboard = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userName, phone, password, roleId } = req.body;

    const existingUser = await prisma.authUser.findFirst({
      where: {
        userName,
        id: {
          not: String(id),
        },
      },
    });

    if (existingUser) {
      return next(createError(400, "User already exists"));
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.authUser.update({
      where: {
        id: String(id),
      },
      data: {
        userName,
        phone,
        password: hashedPassword,
        roleId: String(roleId),
      },
      include: {
        role: true,
      },
    });
    return res.status(200).json({ user, message: "Updated successfully" });
  } catch (error) {
    return next(error);
  }
};

export const deleteAuthAdminDashboard = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await prisma.authUser.delete({
      where: {
        id: String(id),
      },
    });
    return res.status(200).json({ user });
  } catch (error) {
    return next(error);
  }
};
/**
 *
 * Dashboard Admin Authentication
 */
export const loginAuthAdminDashboard = async (req, res, next) => {
  try {
    const { userName, password } = req.body;

    const user = await prisma.authUser.findUnique({
      where: {
        userName,
      },
    });
    if (!user) {
      return next(createError(404, "User not found"));
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return next(createError(400, "Wrong password"));
    }

    // Get the user's IP address, handling both IPv4 and IPv6
    const userIp =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    // Update lastLoginDate and lastLoginIp
    const updatedUser = await prisma.authUser.update({
      where: { id: user.id },
      data: {
        lastLoginTime: new Date(),
        lastLoginIp: userIp,
      },
      include: {
        role: {
          include: {
            permissions: true,
          },
        },
      },
    });

    const token = createToken({ id: user.id }, "1d");

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "Development", // Use secure cookies only in production
      sameSite: process.env.NODE_ENV !== "Development" ? "none" : "lax",
      domain:
        process.env.NODE_ENV !== "Development" ? ".coxscab.com" : undefined,
      path: "/",
    });

    return res.status(200).json({
      message: "Login successfully",
      user: updatedUser,
      success: true,
    });
  } catch (error) {
    return next(error);
  }
};

export const logedInAuthAdminDashboard = async (req, res, next) => {
  try {
    if (!req.me) {
      return next(createError(404, "User not found"));
    }

    res.status(200).json(req.me);
  } catch (error) {
    return next(error);
  }
};

export const logoutAuthAdminDashboard = async (req, res, next) => {
  try {
    res
      .clearCookie("auth_token", {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "Development", // Use secure cookies only in production
        sameSite: process.env.NODE_ENV !== "Development" ? "none" : "lax",
        domain:
          process.env.NODE_ENV !== "Development" ? ".coxscab.com" : undefined,
        path: "/",
      })
      .status(200)
      .json({ message: "Successfully log out" });
  } catch (error) {
    next(error);
  }
};
