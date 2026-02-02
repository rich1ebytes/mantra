import api from "./api";

export const articleAPI = {
  getAll: (params) => api.get("/articles", { params }),
  getTrending: (limit = 10) => api.get("/articles/trending", { params: { limit } }),
  search: (q, params) => api.get("/articles/search", { params: { q, ...params } }),
  getBySlug: (slug) => api.get(`/articles/${slug}`),
  create: (data) => api.post("/articles", data),
  update: (id, data) => api.patch(`/articles/${id}`, data),
  remove: (id) => api.delete(`/articles/${id}`),
};

export const originAPI = {
  getAll: () => api.get("/origins"),
};

export const categoryAPI = {
  getAll: () => api.get("/categories"),
};

export const bookmarkAPI = {
  getAll: (params) => api.get("/bookmarks", { params }),
  add: (articleId) => api.post(`/bookmarks/${articleId}`),
  remove: (articleId) => api.delete(`/bookmarks/${articleId}`),
  check: (articleId) => api.get(`/bookmarks/check/${articleId}`),
};
