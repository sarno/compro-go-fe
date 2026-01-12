import { defineStore } from "pinia";
import type { LoginResponse } from "./model/auth_model";

interface AuthState {
  token: string | null;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    token: null,
  }),
  actions: {
    // Login
    async login(credentials: { email: string; password: string }) {
      const config = useRuntimeConfig();
      try {
        const { data } = await $fetch<LoginResponse>(
          `${config.public.apiBase}/login`,
          {
            method: "POST",
            body: credentials,
          }
        );

        this.token = data.token;

        // Simpan token ke cookie
        const tokenCookie = useCookie("token"); // Cookie bernama 'token'
        tokenCookie.value = this.token;

        return data;
      } catch (error) {
        console.error("Login gagal:", error);
        throw error;
      }
    },

    // Logout
    logout() {
      this.token = null;
      const tokenCookie = useCookie("token");
      tokenCookie.value = null;
    },

    // Cek status login
    checkAuth() {
      const tokenCookie = useCookie("token");
      if (tokenCookie.value) {
        this.token = tokenCookie.value;
      }
    },
  },

  getters: {
    isAuthenticated: (state) => !!state.token,
  },
});
