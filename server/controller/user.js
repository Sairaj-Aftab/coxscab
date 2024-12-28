import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import createError from "../utils/createError.js";
import { createRefreshToken, createToken } from "../utils/token.js";
import { sendSMStoPhone } from "../utils/sendSmsToPhone.js";
import generateOtp from "../utils/generateOtp.js";
const prisma = new PrismaClient();

export const sendLoginOtpToUser = async (req, res, next) => {
  try {
    const { role, phone } = req.body;
    const user = await prisma.user.findFirst({
      where: {
        phone,
        role,
      },
    });
    if (!user) {
      return next(createError(404, "User not found"));
    }
    const otp = generateOtp();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // OTP valid for 5 minutes

    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
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
    const { role, phone, otp, device, ipAddress, location, platform } =
      req.body;

    const user = await prisma.user.findFirst({
      where: {
        phone,
        role,
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
        lastLoginLocation: location,
        lastLoginDevice: device,
        lastLoginTime: new Date(),
        lastLoginIp: ipAddress,
        onlineTime: new Date(),
        onlineStatus: true,
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

    await prisma.userRefreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        device,
        ipAddress,
        expiresAt: new Date(Date.now() + 50 * 365 * 24 * 60 * 60 * 1000), // 50 years in milliseconds
      },
    });

    // Set refresh token as a cookie
    if (platform === "web") {
      res.cookie("user_refresh_token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "Development", // Use secure cookies only in production
        sameSite: process.env.NODE_ENV !== "Development" ? "none" : "lax",
        domain:
          process.env.NODE_ENV !== "Development" ? ".coxscab.com" : undefined,
        path: "/",
        maxAge: 50 * 365 * 24 * 60 * 60 * 1000, // 50 years in milliseconds
      });
    }

    return res.status(200).json({
      message: "Login successfully",
      user: updatedUser,
      accessToken: token,
      refreshToken: platform !== "web" ? refreshToken : undefined,
      success: true,
    });
  } catch (error) {
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
    const { platform, ipAddress, device, location } = req.body;

    const userRefreshToken =
      req.cookies.user_refresh_token ||
      req.headers.authorization?.split(" ")[1];

    if (!userRefreshToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    await prisma.userRefreshToken.deleteMany({
      where: { token: userRefreshToken },
    });
    await prisma.user.update({
      where: { id },
      data: {
        otp: null,
        otpExpiresAt: null,
        lastLogoutTime: new Date(),
        lastLogoutIp: ipAddress,
        lastLogoutDevice: device,
        lastLogoutLocation: location, // Expected format: { latitude: 23.8103, longitude: 90.4125 }
      },
    });
    if (platform === "web") {
      res.clearCookie("user_refresh_token", {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "Development", // Use secure cookies only in production
        sameSite: process.env.NODE_ENV !== "Development" ? "none" : "lax",
        domain:
          process.env.NODE_ENV !== "Development" ? ".coxscab.com" : undefined,
        path: "/",
      });
    }
    res.status(200).json({ message: "Logged out successfully", success: true });
  } catch (error) {
    return next(error);
  }
};
// Register public user
export const registerUser = async (req, res, next) => {
  try {
    const { driverId, role, name, phone, device, ipAddress, location } =
      req.body;

    const otp = generateOtp();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // OTP valid for 5 minutes

    const user = await prisma.user.findFirst({
      where: {
        phone,
        role,
      },
    });

    if (user) {
      await sendSMStoPhone(user.phone, `OTP is ${otp}`);
      const updatedUser = await prisma.user.update({
        where: {
          id: user.id,
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
      return res.status(200).json({
        user: updatedUser,
        success: true,
        message: "User created successfully",
      });
    } else {
      const createUser = await prisma.user.create({
        data: {
          firstName: name,
          phone,
          otp,
          registerDevice: device,
          registeredLocation: location,
          registerIp: ipAddress,
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
      return res.status(200).json({
        user: createUser,
        success: true,
        message: "User created successfully",
      });
    }
  } catch (error) {
    return next(error);
  }
};
// Register driver user account for providing services to riders
export const registerDriverUser = async (req, res, next) => {
  try {
    const { coxscabId, phone } = req.body;
    console.log(req.body);

    const otp = generateOtp();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // OTP valid for 5 minutes

    const coxscabDriverId = await prisma.driver.findUnique({
      where: {
        coxscabId,
      },
    });
    const driverPhone = await prisma.driver.findFirst({
      where: {
        mobileNo: phone,
      },
    });

    if (!coxscabDriverId) {
      return next(createError(400, "Wrong CoxsCab ID"));
    }
    if (!driverPhone) {
      return next(createError(400, "Cannot be found phone number"));
    }

    const driver = await prisma.driver.findFirst({
      where: {
        coxscabId,
        mobileNo: phone,
      },
    });
    if (!driver) {
      return next(createError(400, "Please contact to help center"));
    }

    const user = await prisma.user.findFirst({
      where: {
        phone,
        role: "DRIVER",
      },
    });
    if (user) {
      const updatedUser = await prisma.user.update({
        where: {
          phone: user.phone,
        },
        data: {
          firstName: driver.name,
          role: "DRIVER",
          otp,
          otpExpiresAt,
          driverId: driver.id,
        },
        select: {
          phone: true,
          otpExpiresAt: true,
        },
      });
      if (updatedUser) {
        await sendSMStoPhone(updatedUser.phone, `OTP is ${otp}`);
      }
      return res
        .status(200)
        .json({ user: updatedUser, message: "User created successfully" });
    }

    const createUser = await prisma.user.create({
      data: {
        firstName: driver.name,
        phone: driver.mobileNo,
        role: "DRIVER",
        otp,
        otpExpiresAt,
        driverId: driver.id,
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

// Get all users
export const getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const searchQuery = req.query.search;
    const role = req.query.role;
    const status = req.query.status;

    const filters = {
      ...(searchQuery || status || role
        ? {
            AND: [
              ...(status && status !== "ALL"
                ? [{ status: { equals: status } }]
                : []), // Match enum value if not "ALL"
              ...(role && role !== "ALL" ? [{ role: { equals: role } }] : []), // Match type if not "ALL"
              ...(searchQuery
                ? [
                    {
                      OR: [
                        {
                          firstName: {
                            contains: searchQuery,
                            mode: "insensitive",
                          },
                        },
                        {
                          phone: { contains: searchQuery, mode: "insensitive" },
                        },
                      ],
                    },
                  ]
                : []),
            ],
          }
        : {}),
    };

    const users = await prisma.user.findMany({
      skip: offset,
      take: limit,
      where: filters,
      orderBy: {
        createdAt: "desc",
      },
    });
    const totalUsers = await prisma.user.count({
      where: filters,
    });
    return res.status(200).json({ users, totalUsers, success: true });
  } catch (error) {
    return next(error);
  }
};

export const updateUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const user = await prisma.user.update({
      where: {
        id: String(id),
      },
      data: {
        status,
      },
    });

    if (!user) {
      return next(createError(400, "Please try again!"));
    }
    return res
      .status(200)
      .json({ user, success: true, message: "Successfully updated" });
  } catch (error) {
    return next(error);
  }
};
