import { PrismaClient } from "@prisma/client";
import createError from "../utils/createError.js";
const prisma = new PrismaClient();

export const createReview = async (req, res, next) => {
  try {
    const {
      rideId,
      reviewerId,
      revieweeId,
      driverId,
      rating,
      name,
      comment,
      reviewerPhone,
      aspects,
    } = req.body;

    const review = await prisma.review.create({
      data: {
        rideId,
        reviewerId,
        revieweeId,
        driverId,
        rating: Number(rating),
        name,
        comment,
        reviewerPhone,
        aspects,
        isAnonymous: reviewerId ? false : true,
      },
    });

    if (!review) {
      return next(createError(400, "Please try again!"));
    }

    return res.status(200).json({ review, message: "Successfully created!" });
  } catch (error) {
    console.log(error);

    return next(error);
  }
};
