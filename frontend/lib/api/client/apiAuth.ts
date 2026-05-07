import { AuthResponse, Login, RefreshResponse, Register, User } from "@/types";
import axios from "axios";
import api from "./api";

type ApiErrorPayload = {
  message?: string;
};

function getApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError<ApiErrorPayload>(error)) {
    return error.response?.data?.message || fallback;
  }
  return fallback;
}

export const login = async (loginData: Login): Promise<AuthResponse> => {
  try {
    const { data } = await api.post<AuthResponse>("/auth/login", loginData);
    return data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Login failed"));
  }
};

export const register = async (
  registerData: Register,
): Promise<AuthResponse> => {
  try {
    const { data } = await api.post<AuthResponse>(
      "/auth/register",
      registerData,
    );
    return data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Registration failed"));
  }
};

export const refreshToken = async (): Promise<RefreshResponse> => {
  try {
    const { data } = await api.post<RefreshResponse>("/auth/refresh");
    return data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Token refresh failed"));
  }
};

export const getMe = async (): Promise<User> => {
  try {
    const { data } = await api.get<User>("/auth/me");
    return data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Failed to fetch user"));
  }
};
