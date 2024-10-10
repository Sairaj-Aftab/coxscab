import { PrismaClient } from "@prisma/client";
import createError from "../utils/createError.js";
import { createSlug } from "../utils/slug.js";
const prisma = new PrismaClient();

export const getRole = async (req, res, next) => {
  try {
    const roles = await prisma.role.findMany({
      include: {
        permissions: true,
      },
    });
    if (roles.length < 1) {
      return next(createError(400, "Cannot find any role!"));
    }
    return res.status(200).json({ roles });
  } catch (error) {
    return next(error);
  }
};

export const createRole = async (req, res, next) => {
  try {
    const { name, permissions } = req.body;
    const existingRole = await prisma.role.findUnique({
      where: {
        name,
      },
    });

    if (existingRole) {
      return next(createError(400, "Role already exists!"));
    }
    const role = await prisma.role.create({
      data: {
        name,
        slug: createSlug(name),
        permissions: {
          connect: permissions.map((id) => ({ id: id })),
        },
      },
      include: {
        permissions: true,
      },
    });
    return res
      .status(200)
      .json({ role, message: "Successfully created!", success: true });
  } catch (error) {
    return next(error);
  }
};

export const updateRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, permissions } = req.body;

    const existingRole = await prisma.role.findFirst({
      where: {
        name,
        id: {
          not: String(id),
        },
      },
    });
    if (existingRole) {
      return next(createError(400, "Role already exists!"));
    }

    const role = await prisma.role.update({
      where: {
        id: String(id),
      },
      data: {
        name,
        slug: createSlug(name),
        permissions: {
          set: permissions.map((id) => ({ id: id })),
        },
      },
      include: {
        permissions: true,
      },
    });
    return res
      .status(200)
      .json({ role, message: "Successfully updated!", success: true });
  } catch (error) {
    return next(error);
  }
};

export const deleteRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const role = await prisma.role.delete({
      where: {
        id: String(id),
      },
    });
    return res.status(200).json({ role });
  } catch (error) {
    return next(error);
  }
};

export const updateRoleStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const role = await prisma.role.update({
      where: {
        id: String(id),
      },
      data: {
        status: !status,
      },
      include: {
        permissions: true,
      },
    });
    return res.status(200).json({ role });
  } catch (error) {
    return next(error);
  }
};
