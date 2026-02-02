import { useQuery } from "@tanstack/react-query";
import { articleAPI, originAPI, categoryAPI, bookmarkAPI } from "../services/articleService";

export function useArticles(params = {}) {
  return useQuery({
    queryKey: ["articles", params],
    queryFn: () => articleAPI.getAll(params).then((r) => r.data),
  });
}

export function useTrending(limit = 10) {
  return useQuery({
    queryKey: ["trending", limit],
    queryFn: () => articleAPI.getTrending(limit).then((r) => r.data),
  });
}

export function useArticle(slug) {
  return useQuery({
    queryKey: ["article", slug],
    queryFn: () => articleAPI.getBySlug(slug).then((r) => r.data),
    enabled: !!slug,
  });
}

export function useSearch(query, params = {}) {
  return useQuery({
    queryKey: ["search", query, params],
    queryFn: () => articleAPI.search(query, params).then((r) => r.data),
    enabled: !!query,
  });
}

export function useOrigins() {
  return useQuery({
    queryKey: ["origins"],
    queryFn: () => originAPI.getAll().then((r) => r.data),
    staleTime: 1000 * 60 * 10,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryAPI.getAll().then((r) => r.data),
    staleTime: 1000 * 60 * 10,
  });
}

export function useBookmarks(params = {}) {
  return useQuery({
    queryKey: ["bookmarks", params],
    queryFn: () => bookmarkAPI.getAll(params).then((r) => r.data),
  });
}
