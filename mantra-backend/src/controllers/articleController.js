import * as articleService from "../services/articleService.js";
import { paginate } from "../utils/helpers.js";
import { ApiError } from "../utils/ApiError.js";

export async function getAll(req, res, next) {
  try {
    const { skip, take } = paginate(req.query.page, req.query.limit);
    const { originId, categoryId } = req.query;
    const result = await articleService.getAll({ originId, categoryId, skip, take });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getTrending(req, res, next) {
  try {
    const limit = parseInt(req.query.limit, 10) || 10;
    const articles = await articleService.getTrending({ limit });
    res.json(articles);
  } catch (err) {
    next(err);
  }
}

export async function search(req, res, next) {
  try {
    const { q } = req.query;
    if (!q) throw ApiError.badRequest("Search query 'q' is required");

    const { skip, take } = paginate(req.query.page, req.query.limit);
    const result = await articleService.search(q, { skip, take });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getBySlug(req, res, next) {
  try {
    const article = await articleService.getBySlug(req.params.slug);
    if (!article) throw ApiError.notFound("Article not found");
    res.json(article);
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const article = await articleService.create(req.userId, req.body);
    res.status(201).json(article);
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    // Verify ownership
    const existing = await articleService.getById(req.params.id);
    if (!existing) throw ApiError.notFound("Article not found");
    if (existing.authorId !== req.userId) throw ApiError.forbidden("You can only edit your own articles");

    const article = await articleService.update(req.params.id, req.body);
    res.json(article);
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    const existing = await articleService.getById(req.params.id);
    if (!existing) throw ApiError.notFound("Article not found");
    if (existing.authorId !== req.userId) throw ApiError.forbidden("You can only delete your own articles");

    await articleService.remove(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

export async function updateStatus(req, res, next) {
  try {
    const { status } = req.body;
    if (!["PUBLISHED", "REJECTED", "ARCHIVED"].includes(status)) {
      throw ApiError.badRequest("Invalid status. Must be: PUBLISHED, REJECTED, or ARCHIVED");
    }

    const article = await articleService.updateStatus(req.params.id, status);
    res.json(article);
  } catch (err) {
    next(err);
  }
}

export async function getPending(req, res, next) {
  try {
    const { skip, take } = paginate(req.query.page, req.query.limit);
    const articles = await articleService.getPending({ skip, take });
    res.json(articles);
  } catch (err) {
    next(err);
  }
}
