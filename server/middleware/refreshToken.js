import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { createToken } from "../utils/token.js";
const prisma = new PrismaClient();
// Refresh Token
export const refreshToken = async (req, res) => {
  const userRefreshToken = req.cookies.user_refresh_token;

  if (!userRefreshToken)
    return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(
      userRefreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user || user.refreshToken !== userRefreshToken)
      return res.status(403).json({ message: "Forbidden" });

    const newAccessToken = createToken({ id: user.id });
    return res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }
};
