import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";

// Création du store Zustand pour gérer les produits
export const useProductStore = create((set) => ({
  // Déclaration des états du store
  products: [],
  selectedProduct: null,
  loading: false,

  // Setter pour les produits (met à jour l'état des produits)
  setProducts: (products) => set({ products }),

  // Création d'un produit
  createProduct: async (productData) => {
    set({ loading: true });
    try {
      const res = await axios.post("/products", productData); // Appel API pour créer un produit
      set((prevState) => ({
        products: [...prevState.products, res.data], // Ajoute le produit à la liste des produits
        loading: false,
      }));
      toast.success("Produit créé avec succès !");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Une erreur est survenue";
      toast.error(errorMessage);
      set({ loading: false });
    }
  },

  // Récupérer tous les produits
  fetchAllProducts: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("/products");
      set({ products: response.data.products, loading: false });
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Impossible de récupérer les produits.",
      );
      set({ loading: false });
    }
  },
  // Récupérer un produit par son ID et le définir comme selectedProduct
  fetchProductById: async (id) => {
    set({ loading: true });
    try {
      const response = await axios.get(`/products/${id}`);
      set({ selectedProduct: response.data, loading: false });
    } catch (error) {
      toast.error(error.response?.data?.error || "Produit introuvable.");
      set({ loading: false });
    }
  },
  // Récupérer les produits par catégorie
  fetchProductsByCategory: async (category) => {
    set({ loading: true });
    console.log(`Fetching products for category: ${category}`);
    try {
      const response = await axios.get(`/products/category/${category}`);
      console.log("API Response:", response.data);
      set({ products: response.data.products, loading: false });
    } catch (error) {
      console.error(
        "Error fetching products:",
        error.response?.data || error.message,
      );
      toast.error(
        error.response?.data?.error ||
          "Impossible de récupérer les produits par catégorie.",
      );
      set({ loading: false });
    }
  },

  // Suppression d'un produit
  deleteProduct: async (id) => {
    set({ loading: true });
    try {
      await axios.delete(`/products/${id}`);
      set((prevState) => ({
        products: prevState.products.filter((product) => product._id !== id),
        loading: false,
      }));
      toast.success("Produit supprimé avec succès !");
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Échec de la suppression du produit.",
      );
      set({ loading: false });
    }
  },

  // Mise à jour du prix d'un produit
  updateProductPrice: async (id, newPrice) => {
    set({ loading: true });
    try {
      const response = await axios.patch(`/products/${id}/price`, {
        price: newPrice,
      });
      set((prevState) => ({
        products: prevState.products.map((product) =>
          product._id === id
            ? { ...product, price: response.data.price }
            : product,
        ),
        loading: false,
      }));
      toast.success("Prix mis à jour avec succès !");
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Échec de la mise à jour du prix.",
      );
      set({ loading: false });
    }
  },

  // Mise à jour de l'état 'Featured' d'un produit
  toggleFeaturedProduct: async (id) => {
    set({ loading: true });
    try {
      const response = await axios.patch(`/products/${id}`);
      set((prevState) => ({
        products: prevState.products.map((product) =>
          product._id === id
            ? { ...product, isFeatured: response.data.isFeatured }
            : product,
        ),
        loading: false,
      }));
      toast.success("Produit mis à jour avec succès !");
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Échec de la mise à jour du produit.",
      );
      set({ loading: false });
    }
  },

  // Récupérer les produits en vedette
  fetchFeaturedProducts: async () => {
    set({ loading: true });
    try {
      const response = await axios.get("/products/featured");
      set({ products: response.data, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch products", loading: false });
      console.log("Error fetching featured products:", error);
    }
  },
}));
