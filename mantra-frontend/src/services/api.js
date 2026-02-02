import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach auth token to every request
api.interceptors.request.use((config) => {
  const session = JSON.parse(localStorage.getItem("mantra_session") || "null");
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});

// Handle 401 — try refresh, else force logout
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const session = JSON.parse(localStorage.getItem("mantra_session") || "null");
        if (session?.refresh_token) {
          const { data } = await axios.post(`${API_URL}/auth/refresh`, {
            refresh_token: session.refresh_token,
          });
          localStorage.setItem("mantra_session", JSON.stringify(data.session));
          original.headers.Authorization = `Bearer ${data.session.access_token}`;
          return api(original);
        }
      } catch {
        localStorage.removeItem("mantra_session");
        localStorage.removeItem("mantra_user");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
