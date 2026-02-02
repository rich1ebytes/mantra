import prisma from "../config/prisma.js";
import { ApiError } from "../utils/ApiError.js";

export async function getAll(_req, res, next) {
  try {
    const origins = await prisma.origin.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    });
    res.json(origins);
  } catch (err) {
    next(err);
  }
}

export async function getById(req, res, next) {
  try {
    const origin = await prisma.origin.findUnique({
      where: { id: req.params.id },
    });
    if (!origin) throw ApiError.notFound("Origin not found");
    res.json(origin);
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const { name, code, flag, description } = req.body;
    const origin = await prisma.origin.create({
      data: { name, code, flag, description },
    });
    res.status(201).json(origin);
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const origin = await prisma.origin.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(origin);
  } catch (err) {
    next(err);
  }
}
