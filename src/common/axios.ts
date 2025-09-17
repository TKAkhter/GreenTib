import axios from "axios";
import { getTokenFromCookie } from "./cookie";

export const axiosClient = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_API_URL}/api`, // Backend URL from environment variable
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use((config) => {
  const token = getTokenFromCookie();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
