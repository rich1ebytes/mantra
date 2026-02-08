import api from "./api";

export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  logout: () => api.post("/auth/logout"),
  getMe: () => api.get("/users/me"),
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }),
  resetPassword: (newPassword) => api.post("/auth/reset-password", { newPassword }),
};
