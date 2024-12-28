import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

// Create Token
export const createToken = (payload, exp = null) => {
  const options = exp ? { expiresIn: exp } : {};
  const token = jwt.sign(payload, process.env.JWT_SECRET, options);

  return token;
};

export const createRefreshToken = (payload, exp = null) => {
  const options = exp ? { expiresIn: exp } : {};
  const token = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, options);

  return token;
};

// JWT Verify
export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
export const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};
