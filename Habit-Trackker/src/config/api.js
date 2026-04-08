const normalizeBaseUrl = (value) => value?.replace(/\/+$/, "");

const getDefaultApiBaseUrl = () => {
  if (typeof window === "undefined") {
    return "http://localhost:5000";
  }

  const { hostname } = window.location;

  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return "http://localhost:5000";
  }

  return "https://habit-tracker-ixsb.onrender.com";
};

export const API_BASE_URL = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL) || getDefaultApiBaseUrl();
