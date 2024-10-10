import { PrismaClient } from "@prisma/client";
import createError from "../utils/createError.js";

const prisma = new PrismaClient();

function getStartOfDay(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
}

function getStartOfMonth(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0);
}

function getStartOfYear(date = new Date()) {
  return new Date(date.getFullYear(), 0, 1, 0, 0, 0);
}

export const updateVisitorCount = async (req, res, next) => {
  try {
    const now = new Date();
    const today = getStartOfDay(now);

    // Check for an existing entry for today
    let visitorCount = await prisma.visitorCount.findFirst({
      where: { date: today },
    });

    if (visitorCount) {
      // Increment the daily, monthly, yearly, and total count
      visitorCount = await prisma.visitorCount.update({
        where: { id: visitorCount.id },
        data: {
          dailyCount: { increment: 1 },
          monthlyCount: { increment: 1 },
          yearlyCount: { increment: 1 },
          totalCount: { increment: 1 },
        },
      });
    } else {
      // If it's the first visit today, create a new entry
      visitorCount = await prisma.visitorCount.create({
        data: {
          date: today,
          dailyCount: 1,
          monthlyCount: 1,
          yearlyCount: 1,
          totalCount: 1,
        },
      });
    }

    return res.status(200).json({ visitorCount });
  } catch (error) {
    next(createError(500, "Failed to update visitor count", error));
  }
};

export const getVisitorStats = async (req, res, next) => {
  try {
    const now = new Date();
    const today = getStartOfDay(now);
    const thisMonth = getStartOfMonth(now);
    const thisYear = getStartOfYear(now);

    // Aggregate the data for total, daily, monthly, and yearly visitors
    const [dailyVisitors, monthlyVisitors, yearlyVisitors, totalVisitors] =
      await Promise.all([
        prisma.visitorCount.aggregate({
          where: { date: today },
          _sum: { dailyCount: true },
        }),
        prisma.visitorCount.aggregate({
          where: { date: { gte: thisMonth } },
          _sum: { monthlyCount: true },
        }),
        prisma.visitorCount.aggregate({
          where: { date: { gte: thisYear } },
          _sum: { yearlyCount: true },
        }),
        prisma.visitorCount.aggregate({
          _sum: { totalCount: true },
        }),
      ]);

    return res.status(200).json({
      daily: dailyVisitors._sum.dailyCount || 0,
      monthly: monthlyVisitors._sum.monthlyCount || 0,
      yearly: yearlyVisitors._sum.yearlyCount || 0,
      total: totalVisitors._sum.totalCount || 0,
    });
  } catch (error) {
    next(createError(500, "Failed to fetch visitor stats", error));
  }
};
