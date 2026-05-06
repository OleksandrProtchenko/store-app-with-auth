export interface Login {
  email: string;
  password: string;
}

export interface Register {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  userId: string;
}

export interface RefreshResponse {
  ok: boolean;
}
