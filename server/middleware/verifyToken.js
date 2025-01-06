import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
const prisma = new PrismaClient();

// This is for Admin Dashboard
const verifyToken = async (req, res, next) => {
  const auth_token =
    req.cookies.auth_token || req.headers.authorization?.split(" ")[1];

  if (!auth_token) {
    return res.status(400).json({ message: "Unauthorized" });
  }

  jwt.verify(auth_token, process.env.JWT_SECRET, async (err, decode) => {
    if (err) {
      return res.status(400).json({ message: "Invalid Token" });
    }

    const me = await prisma.authUser.findUnique({
      where: {
        id: String(decode.id),
      },
      include: {
        role: {
          include: {
            permissions: true,
          },
        },
      },
    });
    req.me = me;
    next();
  });
};

export default verifyToken;
