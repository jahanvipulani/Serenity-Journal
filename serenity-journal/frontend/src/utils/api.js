import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://serenity-journal.onrender.com",
});

// Attach the JWT (if present) to every outgoing request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("sj_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// If the token has expired/is invalid, log the user out client-side
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("sj_token");
      localStorage.removeItem("sj_user");
    }
    return Promise.reject(error);
  }
);

export default api;
