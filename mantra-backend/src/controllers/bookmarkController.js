import * as bookmarkService from "../services/bookmarkService.js";
import { paginate } from "../utils/helpers.js";

export async function getUserBookmarks(req, res, next) {
  try {
    const { skip, take } = paginate(req.query.page, req.query.limit);
    const bookmarks = await bookmarkService.getUserBookmarks(req.userId, { skip, take });
    res.json(bookmarks);
  } catch (err) {
    next(err);
  }
}

export async function add(req, res, next) {
  try {
    const bookmark = await bookmarkService.add(req.userId, req.params.articleId);
    res.status(201).json(bookmark);
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    await bookmarkService.remove(req.userId, req.params.articleId);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

export async function isBookmarked(req, res, next) {
  try {
    const result = await bookmarkService.isBookmarked(req.userId, req.params.articleId);
    res.json({ bookmarked: result });
  } catch (err) {
    next(err);
  }
}
