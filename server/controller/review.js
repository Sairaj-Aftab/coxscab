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
    } = req.body;

    const review = await prisma.review.create({
      data: {
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
      },
    });

    if (!review) {
      return next(createError(400, "Please try again!"));
    }

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
