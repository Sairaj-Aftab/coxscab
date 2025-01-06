import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { createToken } from "../utils/token.js";
const prisma = new PrismaClient();
// Refresh Token
export const refreshToken = async (req, res) => {
  const userRefreshToken =
    req.cookies.user_refresh_token || req.headers.authorization?.split(" ")[1];

  if (!userRefreshToken)
    return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(
      userRefreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: { refreshToken: true },
    });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found." });
    }

    // Check if the refresh token is valid
    const isValidToken = user?.refreshToken?.find(
      (token) => token.token === userRefreshToken
    );

    if (!isValidToken) {
      res.clearCookie("user_refresh_token", {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "Development", // Use secure cookies only in production
        sameSite: process.env.NODE_ENV !== "Development" ? "none" : "lax",
        domain:
          process.env.NODE_ENV !== "Development" ? ".coxscab.com" : undefined,
        path: "/",
      });
      return res
        .status(401)
        .json({ success: false, message: "Invalid or expired refresh token." });
    }

    const newAccessToken = createToken({ id: user.id });
    return res.status(200).json({
      success: true,
      message: "Access token refreshed successfully.",
      accessToken: newAccessToken,
    });
  } catch (error) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
};
