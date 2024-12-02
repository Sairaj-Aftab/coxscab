import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
const prisma = new PrismaClient();

const verifyUserToken = async (req, res, next) => {
  // const authHeader = req.headers.authorization || req.headers.Authorization;

  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, async (err, decode) => {
    if (err) {
      return res.status(400).json({ message: "Invalid Token" });
    }

    const me = await prisma.user.findUnique({
      where: {
        id: String(decode.id),
      },
      include: {
        driver: true,
        reviewsGiven: true,
        reviewsReceived: true,
        ride: true,
      },
    });
    req.me = me;
    next();
  });
};

export default verifyUserToken;
