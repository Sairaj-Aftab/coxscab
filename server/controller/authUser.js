import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import createError from "../utils/createError.js";
import { createRefreshToken, createToken } from "../utils/token.js";
import { sendSMStoPhone } from "../utils/sendSmsToPhone.js";
import generateOtp from "../utils/generateOtp.js";
const prisma = new PrismaClient();

/**
 *
 * User front customer and driver user Authentication
 */

export const sendLoginOtpToUser = async (req, res, next) => {
  try {
    const { phone } = req.body;
    const user = await prisma.user.findUnique({
      where: {
        phone,
      },
    });
    if (!user) {
      return next(createError(404, "User not found"));
    }
    const otp = generateOtp();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // OTP valid for 5 minutes

    const updatedUser = await prisma.user.update({
      where: {
        phone: user.phone,
      },
      data: {
        otp,
        otpExpiresAt,
      },
      select: {
        phone: true,
        otpExpiresAt: true,
      },
    });
    if (updatedUser) {
      await sendSMStoPhone(updatedUser.phone, `OTP is ${otp}`);
    }

    return res.status(200).json({
      user: updatedUser,
      message: "OTP has been sent",
      success: true,
    });
  } catch (error) {
    return next(error);
  }
};

// login user through phone number and otp
export const loginUser = async (req, res, next) => {
  try {
    const { phone, otp } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        phone,
      },
    });
    if (!user) {
      return next(createError(404, "User not found"));
    }

    if (!user.otp || new Date() > user.otpExpiresAt) {
      return next(createError(401, "OTP has expired."));
    }

    if (user.otp !== otp) {
      return next(createError(404, "Wrong OTP"));
    }

    // Update lastLoginDate and lastLoginIp
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        lastLoginTime: new Date(),
        lastLoginIp: req.ip,
        otp: null,
        otpExpiresAt: null,
        otpRetries: 0, // Reset retry attempts
      },
      include: {
        reviewsGiven: true,
        reviewsReceived: true,
        driver: true,
        ride: true,
      },
    });

    const token = createToken({ id: user.id }, "15m");
    const refreshToken = createRefreshToken({ id: user.id }, "50y");

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    // Set refresh token as a cookie
    res.cookie("user_refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV == "Development" ? false : true, // Secure in production
      sameSite: "none",
      path: "/",
      maxAge: 50 * 365 * 24 * 60 * 60 * 1000, // 50 years in milliseconds
    });

    return res.status(200).json({
      message: "Login successfully",
      user: updatedUser,
      accessToken: token,
      success: true,
    });
  } catch (error) {
    console.log(error);

    return next(error);
  }
};

export const logedInUser = async (req, res, next) => {
  try {
    if (!req.me) {
      return next(createError(404, "User not found"));
    }

    res.status(200).json(req.me);
  } catch (error) {
    return next(error);
  }
};
export const logOut = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.user.update({
      where: { id },
      data: {
        refreshToken: null,
      },
    });
    res.clearCookie("user_refresh_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "strict", // Protect against CSRF
    });
    res.status(200).json({ success: true });
  } catch (error) {
    return next(error);
  }
};
// Register user
export const registerUser = async (req, res, next) => {
  try {
    const { driverId, name, phone } = req.body;

    const otp = generateOtp();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // OTP valid for 5 minutes

    const user = await prisma.user.findUnique({
      where: {
        phone,
      },
    });
    if (user) {
      await sendSMStoPhone(user.phone, `OTP is ${otp}`);
      const updatedUser = await prisma.user.update({
        where: {
          phone: user.phone,
        },
        data: {
          firstName: name,
          otp,
          otpExpiresAt,
        },
        select: {
          phone: true,
          otpExpiresAt: true,
        },
      });
      return res
        .status(200)
        .json({ user: updatedUser, message: "User created successfully" });
    } else {
      const createUser = await prisma.user.create({
        data: {
          firstName: name,
          phone,
          otp,
          otpExpiresAt,
          driverId: driverId ? driverId : undefined,
        },
        select: {
          phone: true,
          otpExpiresAt: true,
        },
      });
      if (createUser) {
        await sendSMStoPhone(createUser.phone, `OTP is ${otp}`);
      }
      return res
        .status(200)
        .json({ user: createUser, message: "User created successfully" });
    }
  } catch (error) {
    return next(error);
  }
};

export const updateUserLocation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { locationData } = req.body;
    const user = await prisma.user.update({
      where: { id },
      data: {
        location: locationData,
      },
    });
    return res.status(200).json({ user, message: "User location updated" });
  } catch (error) {
    return next(error);
  }
};
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
      secure: process.env.NODE_ENV === "Development" ? false : true,
      sameSite: process.env.NODE_ENV === "Development" ? "lax" : "strict",
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
      .clearCookie("auth_token")
      .status(200)
      .json({ message: "Successfully log out" });
  } catch (error) {
    next(error);
  }
};
