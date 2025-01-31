import api from "@/lib/api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/lib/constants";
import { jwtDecode } from "jwt-decode";
import { create } from "zustand";

export const useAuthStore = create((set, get) => ({
  isAuthorized: null,
  setIsAuthorized: (isAuthorized) => set({ isAuthorized }),
  userInfo: {},
  setUserInfo: (userInfo) => set({ userInfo }),

  decodeUserInfo: () => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN);
    if (accessToken) {
      const decode = jwtDecode(accessToken);
      get().setUserInfo(decode);
    }
    return null;
  },

  refreshToken: async () => {
    const rToken = localStorage.getItem(REFRESH_TOKEN);
    if (!rToken) {
      console.log("No refresh token found. Redirecting...");
      return false;
    }

    try {
      const response = await api.post("/account/refresh-token", {
        refreshToken: rToken,
      });

      if (response.status === 200) {
        const newAccessToken = response.data.accessToken;
        localStorage.setItem(ACCESS_TOKEN, newAccessToken);
      }
    } catch (error) {
      console.log("Refresh token request failed:", error);
    }
    return false;
  },
}));
