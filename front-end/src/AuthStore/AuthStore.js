// src/AuthStore/AuthStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { axiosInstance } from "../config/axios";
import { toast } from "react-toastify";

export const AuthStore = create(
  persist(
    (set) => ({
      authUser: null,
      token: null,
      isLogging: false,
      isLoggingOut: false,
      isCheckingAuth: false,

      signup: async (formData, navigate) => {
        set({ isLogging: true });
        try {
          const { data } = await axiosInstance.post("/user/signup", formData);
          set({ authUser: data.user, token: data.token });
          localStorage.setItem("token", data.token);
          toast.success("Account created");
          navigate("/");
        } catch (err) {
          toast.error(err.response?.data?.message || "Signup error");
        } finally {
          set({ isLogging: false });
        }
      },

      login: async (formData, navigate) => {
        set({ isLogging: true });
        try {
          const { data } = await axiosInstance.post("/user/login", formData);
          set({ authUser: data.user, token: data.token });
          localStorage.setItem("token", data.token);
          toast.success("Logged in");
          navigate("/");
        } catch (err) {
          toast.error(err.response?.data?.message || "Login error");
        } finally {
          set({ isLogging: false });
        }
      },

      logout: (navigate) => {
        set({ authUser: null, token: null });
        localStorage.removeItem("token");
        toast.success("Logged out");
        navigate("/login");
      },

      checkAuth: async () => {
    try {
      set({ isCheckingAuth: true });
      const token = localStorage.getItem("token");
      
      if (!token) {
        set({ isCheckingAuth: false, authUser: null, token: null });
        return;
      }

      // Verify token with backend
      const { data } = await axiosInstance.get("/user/check");
      set({ authUser: data.user, token, isCheckingAuth: false });
    } catch (error) {
      console.error("Auth check failed:", error);
      localStorage.removeItem("token");
      set({ authUser: null, token: null, isCheckingAuth: false });
    }
  },

    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ authUser: state.authUser, token: state.token })
    }
  )
);
