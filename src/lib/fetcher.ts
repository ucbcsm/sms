import axios from "axios";
import { useSessionStore } from "../store";

const BASE_URL = process.env.NEXT_PUBLIC_DJANGO_API_BASE_URL;
const AUTH_URL = process.env.NEXT_PUBLIC_DJANGO_AUTH_API_URL;

export const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = useSessionStore.getState().accessToken;
    console.log("Attaching token to request:", token);
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authApi = axios.create({
  baseURL: AUTH_URL,
});

authApi.interceptors.request.use(
  (config) => {
    const token = useSessionStore.getState().accessToken;

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
