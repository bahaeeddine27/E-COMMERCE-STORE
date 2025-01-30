import { create } from "zustand";
import axios from "../lib/axios.js";
import { toast } from "react-toastify";

export const useUserStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")) || null, // Récupérer l'utilisateur depuis localStorage
  loading: false,
  checkingAuth: false,

  signup: async ({ name, email, password, confirmPassword }) => {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    set({ loading: true });
    try {
      const res = await axios.post("/auth/signup", { name, email, password });
      const user = res.data;
      set({ user, loading: false });
      localStorage.setItem("user", JSON.stringify(user)); // Sauvegarder l'utilisateur
      toast.success("Account created successfully!");
    } catch (error) {
      set({ loading: false });
      toast.error(error?.response?.data?.message || "An error occurred during signup");
    }
  },

  login: async (email, password) => {
    set({ loading: true });
    try {
      const res = await axios.post("/auth/login", { email, password });
      const user = res.data;
      set({ user, loading: false });
      localStorage.setItem("user", JSON.stringify(user)); // Sauvegarder l'utilisateur
      toast.success("Login successful!");
    } catch (error) {
      set({ loading: false });
      toast.error(error?.response?.data?.message || "An error occurred during login");
    }
  },

  checkAuth: async () => {
    set({ checkingAuth: true });
    try {
      const response = await axios.get("/auth/profile");
      const user = response.data;
      set({ user, checkingAuth: false });
      localStorage.setItem("user", JSON.stringify(user)); // Sauvegarder l'utilisateur
    } catch (error) {
      set({ checkingAuth: false, user: null });
      localStorage.removeItem("user"); // Nettoyer le localStorage si l'utilisateur n'est pas authentifié
    }
  },

  logout: async () => {
    try {
      await axios.post("/auth/logout");
      set({ user: null });
      localStorage.removeItem("user"); // Supprimer l'utilisateur du localStorage
      toast.success("Logged out successfully!");
    } catch (error) {
      toast.error("An error occurred during logout");
    }
  },
  refreshToken: async () => {
		// Prevent multiple simultaneous refresh attempts
		if (get().checkingAuth) return;

		set({ checkingAuth: true });
		try {
			const response = await axios.post("/auth/refresh-token");
			set({ checkingAuth: false });
			return response.data;
		} catch (error) {
			set({ user: null, checkingAuth: false });
			throw error;
		}
	},
}));

// Axios interceptor for token refresh
let refreshPromise = null;

axios.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				// If a refresh is already in progress, wait for it to complete
				if (refreshPromise) {
					await refreshPromise;
					return axios(originalRequest);
				}

				// Start a new refresh process
				refreshPromise = useUserStore.getState().refreshToken();
				await refreshPromise;
				refreshPromise = null;

				return axios(originalRequest);
			} catch (refreshError) {
				// If refresh fails, redirect to login or handle as needed
				useUserStore.getState().logout();
				return Promise.reject(refreshError);
			}
		}
		return Promise.reject(error);
	}
);