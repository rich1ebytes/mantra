import * as userService from "../services/userService.js";
import { paginate } from "../utils/helpers.js";
import { ApiError } from "../utils/ApiError.js";

export async function getMe(req, res, next) {
  try {
    const user = await userService.getById(req.userId);
    if (!user) throw ApiError.notFound("User not found");
    res.json(user);
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const user = await userService.updateProfile(req.userId, req.body);
    res.json(user);
  } catch (err) {
    next(err);
  }
}

export async function updatePreferences(req, res, next) {
  try {
    const prefs = await userService.updatePreferences(req.userId, req.body);
    res.json(prefs);
  } catch (err) {
    next(err);
  }
}

export async function getReadingHistory(req, res, next) {
  try {
    const { skip, take } = paginate(req.query.page, req.query.limit);
    const history = await userService.getReadingHistory(req.userId, { skip, take });
    res.json(history);
  } catch (err) {
    next(err);
  }
}

export async function getPublicProfile(req, res, next) {
  try {
    const user = await userService.getByUsername(req.params.username);
    if (!user) throw ApiError.notFound("User not found");
    res.json(user);
  } catch (err) {
    next(err);
  }
}
