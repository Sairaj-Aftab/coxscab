import { PrismaClient } from "@prisma/client";
import createError from "../utils/createError.js";
const prisma = new PrismaClient();

export const createReview = async (req, res, next) => {
  try {
    const {
      type,
      rideId,
      reviewerId,
      revieweeId,
      driverId,
      rating,
      name,
      comment,
      reviewerPhone,
      aspects,
      ipAddress,
      coordinates,
    } = req.body;

    // Get the last entry and increment the serial number
    const lastEntry = await prisma.review.findFirst({
      orderBy: {
        reviewId: "desc", // Sorting by the serial number to get the last one
      },
      select: { reviewId: true },
    });

    // Set the new serial number (if there's no previous entry, start from 1)
    const newReviewId = lastEntry ? lastEntry.reviewId + 1 : 1;

    const review = await prisma.review.create({
      data: {
        reviewId: parseInt(newReviewId),
        type,
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
        ipAddress,
        ...(coordinates && {
          location: {
            type: "Point",
            coordinates: [coordinates.longitude, coordinates.latitude],
          },
        }),
      },
    });

    if (!review) {
      return next(createError(400, "Please try again!"));
    }

    const io = req.app.get("socketio");
    const toAdmin = io.of("/admin");
    toAdmin.emit("newReview", review);

    return res.status(200).json({ review, message: "Successfully created!" });
  } catch (error) {
    return next(error);
  }
};
// Get All reviews
export const getReviews = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const searchQuery = req.query.search;
    const status = req.query.status;
    const typeFilter = req.query.typeFilter;

    const filters = {
      ...(searchQuery || status || typeFilter
        ? {
            AND: [
              ...(status && status !== "ALL"
                ? [{ status: { equals: status } }]
                : []), // Match enum value if not "ALL"
              ...(typeFilter && typeFilter !== "ALL"
                ? [{ type: { equals: typeFilter } }]
                : []), // Match type if not "ALL"
              ...(searchQuery
                ? [
                    {
                      OR: [
                        {
                          comment: {
                            contains: searchQuery,
                            mode: "insensitive",
                          },
                        },
                        {
                          name: { contains: searchQuery, mode: "insensitive" },
                        },
                        {
                          reviewerPhone: {
                            contains: searchQuery,
                            mode: "insensitive",
                          },
                        },
                        {
                          driver: {
                            name: {
                              contains: searchQuery,
                              mode: "insensitive",
                            },
                          },
                        },
                        {
                          reviewer: {
                            firstName: {
                              contains: searchQuery,
                              mode: "insensitive",
                            },
                          },
                        },
                      ],
                    },
                  ]
                : []),
            ],
          }
        : {}),
    };

    const reviews = await prisma.review.findMany({
      skip: offset,
      take: limit,
      where: filters,
      orderBy: {
        id: "desc",
      },
      include: {
        driver: true,
        reviewee: true,
        reviewer: true,
        ride: true,
      },
    });

    const totalReviews = await prisma.review.count({
      where: filters,
    });
    return res.status(200).json({
      reviews,
      totalReviews,
      success: true,
      message: "Successfully created!",
    });
  } catch (error) {
    return next(error);
  }
};

// Update Status (PENDING, APPROVED, REJECTED)
export const updateReviewStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const review = await prisma.review.update({
      where: {
        id: String(id),
      },
      data: {
        status,
      },
    });

    if (!review) {
      return next(createError(400, "Please try again!"));
    }
    return res.status(200).json({ review, message: "Successfully updated" });
  } catch (error) {
    return next(error);
  }
};

// export const setReviewId = async (req, res, next) => {
//   try {
//     const reviews = await prisma.review.findMany({
//       orderBy: {
//         createdAt: "asc",
//       },
//       select: { id: true },
//     });

//     // Update each review one by one asynchronously
//     for (let i = 0; i < reviews.length; i++) {
//       await prisma.review.update({
//         where: { id: reviews[i].id },
//         data: { reviewId: i + 1 },
//       });
//     }

//     return res.status(200).json({ message: "Successfully updated" });
//   } catch (error) {
//     return next(error);
//   }
// };
