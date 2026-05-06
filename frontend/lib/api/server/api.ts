import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export const apiServer = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 10_000,
});
