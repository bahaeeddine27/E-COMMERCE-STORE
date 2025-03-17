import { create } from 'zustand';
import axios from '../lib/axios.js';
import { toast } from 'react-toastify';

// Création du store Zustand pour la gestion de l'utilisateur
export const useUserStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null, // Récupérer l'utilisateur depuis localStorage
  loading: false,
  checkingAuth: false,

  // Fonction d'inscription d'un utilisateur
  signup: async ({ name, email, password, confirmPassword }) => {
    if (password !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }
    set({ loading: true });
    try {
      const res = await axios.post('/auth/signup', { name, email, password });
      const user = res.data;
      set({ user, loading: false });
      localStorage.setItem('user', JSON.stringify(user)); // Sauvegarder l'utilisateur
      toast.success('Compte créé avec succès !');
    } catch {
      set({ loading: false });
      toast.error("Une erreur s'est produite lors de l'inscription");
    }
  },

  // Fonction de connexion de l'utilisateur
  login: async (email, password) => {
    set({ loading: true });
    try {
      const res = await axios.post('/auth/login', { email, password });
      const user = res.data;
      set({ user, loading: false });
      localStorage.setItem('user', JSON.stringify(user)); // Sauvegarder l'utilisateur
      toast.success('Connexion réussie !');
    } catch {
      set({ loading: false });
      toast.error("Une erreur s'est produite lors de la connexion");
    }
  },

  // Vérifier l'authentification de l'utilisateur
  checkAuth: async () => {
    set({ checkingAuth: true });
    try {
      const response = await axios.get('/auth/profile');
      const user = response.data;
      set({ user, checkingAuth: false });
      localStorage.setItem('user', JSON.stringify(user)); // Sauvegarder l'utilisateur
    } catch {
      set({ checkingAuth: false, user: null });
      localStorage.removeItem('user'); // Nettoyer le localStorage si l'utilisateur n'est pas authentifié
    }
  },

  // Fonction de déconnexion de l'utilisateur
  logout: async () => {
    try {
      await axios.post('/auth/logout');
      set({ user: null });
      localStorage.removeItem('user'); // Supprimer l'utilisateur du localStorage
      toast.success('Déconnexion réussie !');
    } catch {
      toast.error("Une erreur s'est produite lors de la déconnexion");
    }
  },

  // Rafraîchir le token d'authentification
  refreshToken: async () => {
    // Prevent multiple simultaneous refresh attempts
    if (useUserStore.getState().checkingAuth) return;

    set({ checkingAuth: true });
    try {
      const response = await axios.post('/auth/refresh-token');
      set({ checkingAuth: false });
      return response.data;
    } catch {
      set({ user: null, checkingAuth: false });
      throw new Error('Erreur lors du rafraîchissement du token');
    }
  },
}));

// Axios interceptor pour le rafraîchissement du token
let refreshPromise = null;

// Intercepteur des réponses d'axios pour gérer les erreurs 401
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
