import api from "./api";

interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

interface Login {
  email: string;
  password: string;
}

interface Register {
  name: string;
  email: string;
  password: string;
}

interface AuthResponse {
  userId: string;
}

interface RefreshResponse {
  ok: boolean;
}

export const login = async (loginData: Login): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>("/auth/login", loginData);
  return data;
};

export const register = async (
  registerData: Register,
): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>("/auth/register", registerData);
  return data;
};

export const refreshToken = async (): Promise<RefreshResponse> => {
  const { data } = await api.post<RefreshResponse>("/auth/refresh");
  return data;
};

export const getMe = async (): Promise<User> => {
  const { data } = await api.get<User>("/auth/me");
  return data;
};
