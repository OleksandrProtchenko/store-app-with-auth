import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  userId: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  setTokens: (data: {
    userId: string;
    accessToken: string;
    refreshToken: string;
  }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      userId: null,
      accessToken: null,
      refreshToken: null,
      setTokens: (data) => set(data),
      logout: () =>
        set({ userId: null, accessToken: null, refreshToken: null }),
    }),
    { name: "auth-storage" },
  ),
);
