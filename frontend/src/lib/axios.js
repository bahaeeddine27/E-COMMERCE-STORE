import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.mode === "development" ? "http://localhost:5000/api" : "/api",
    withCredentials: true,
});

// Ajouter un intercepteur pour inclure le jeton d'accès
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken"); // Récupérez le jeton d'accès depuis le stockage local
        if (token) {
            config.headers.Authorization = `Bearer ${token}`; // Ajoutez le jeton dans l'en-tête Authorization
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;