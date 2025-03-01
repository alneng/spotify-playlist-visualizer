import axios, { AxiosError } from "axios";

const API_URL: string =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:9988";

const api = axios.create({
  baseURL: `${API_URL}/api`,
});

export type AxiosApiError = AxiosError<{ message: string }>;

export default api;
