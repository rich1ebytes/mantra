import prisma from "../config/prisma.js";
import { ApiError } from "../utils/ApiError.js";

export async function getAll(_req, res, next) {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });
    res.json(categories);
  } catch (err) {
    next(err);
  }
}

export async function getBySlug(req, res, next) {
  try {
    const category = await prisma.category.findUnique({
      where: { slug: req.params.slug },
    });
    if (!category) throw ApiError.notFound("Category not found");
    res.json(category);
  } catch (err) {
    next(err);
  }
}
