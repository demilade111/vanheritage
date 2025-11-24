import axios from "axios";

const apiBaseUrl =
  process?.env?.API_BASE_URL && process.env.API_BASE_URL.length
    ? process.env.API_BASE_URL
    : "/api";

const api = axios.create({
  baseURL: apiBaseUrl,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  getMe: () => api.get("/auth/me"),
};

export const heritageSiteAPI = {
  getAll: (params) => api.get("/heritage-sites", { params }),
  getOne: (id) => api.get(`/heritage-sites/${id}`),
  getPhoto: (id) => api.get(`/heritage-sites/${id}/photo`),
  getNeighbourhoods: () => api.get("/heritage-sites/filters/neighbourhoods"),
};

export const memoryAPI = {
  create: (data) => {
    const config =
      data instanceof FormData
        ? { headers: { "Content-Type": "multipart/form-data" } }
        : {};
    return api.post("/memories", data, config);
  },
  update: (id, data) => {
    const config =
      data instanceof FormData
        ? { headers: { "Content-Type": "multipart/form-data" } }
        : {};
    return api.put(`/memories/${id}`, data, config);
  },
  delete: (id) => api.delete(`/memories/${id}`),
  getMyMemories: () => api.get("/memories/my-memories"),
  getSiteMemories: (siteId) => api.get(`/memories/site/${siteId}`),
};

export const favoriteAPI = {
  toggle: (siteId) => api.post(`/favorites/${siteId}`),
  getUserFavorites: () => api.get("/favorites"),
  checkFavorite: (siteId) => api.get(`/favorites/${siteId}/check`),
  getCount: (siteId) => api.get(`/favorites/${siteId}/count`),
};

export default api;
