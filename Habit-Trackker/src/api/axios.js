import axios from "axios";
import { enqueueRequest } from "../utils/syncQueue";
import { API_BASE_URL } from "../config/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && token !== "undefined") {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Detect network errors or timeouts (offline scenario)
    if (!error.response || error.code === "ECONNABORTED") {
      const isStateChanging = ["post", "put", "patch", "delete"].includes(
        originalRequest.method?.toLowerCase()
      );

      if (isStateChanging) {
        console.warn(`[Offline] Queueing ${originalRequest.method} request to ${originalRequest.url}`);
        await enqueueRequest({
          method: originalRequest.method,
          url: originalRequest.url,
          data: originalRequest.data,
          headers: originalRequest.headers,
        });
        
        // Return a mock success so the UI doesn't crash, 
        // with a flag indicating it was queued.
        return Promise.resolve({ data: { _offline: true }, status: 202 });
      }
    }

    return Promise.reject(error);
  }
);

export default api;
