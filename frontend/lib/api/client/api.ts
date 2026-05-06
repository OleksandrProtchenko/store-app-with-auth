import axios from "axios";
import { useAuthStore } from "../../store/authStore";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

const api = axios.create({ baseURL, withCredentials: true });

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original?._retry) {
      original._retry = true;
      try {
        await axios.post(
          `${baseURL}/auth/refresh`,
          {},
          { withCredentials: true },
        );
        return api(original);
      } catch {
        useAuthStore.getState().logout();
        if (typeof window !== "undefined") window.location.href = "/auth/login";
      }
    }

    return Promise.reject(error);
  },
);

export default api;
