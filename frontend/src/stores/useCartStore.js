import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

// Création du store Zustand pour gérer le panier
export const useCartStore = create((set, get) => ({
  cart: [], // Contient les éléments du panier
  coupon: null, // Contient le coupon appliqué
  total: 0, // Total après remise
  subtotal: 0, // Sous-total avant remise
  isCouponApplied: false, // Indique si un coupon a été appliqué

  // Récupération des coupons disponibles
  getMyCoupon: async () => {
    try {
      const response = await axios.get("/coupons"); // Appel de l'API pour récupérer les coupons
      set({ coupon: response.data }); // Mise à jour du coupon dans le store
    } catch (error) {
      console.error("Erreur lors de la récupération du coupon :", error);
    }
  },

  // Application d'un coupon au panier
  applyCoupon: async (code) => {
    try {
      const response = await axios.post("/coupons/validate", { code }); // Validation du coupon
      set({ coupon: response.data, isCouponApplied: true }); // Mise à jour de l'état
      get().calculateTotals(); // Recalcul des totaux avec le coupon
      toast.success("Coupon appliqué avec succès");
    } catch (error) {
      toast.error(error.response?.data?.message || "Échec de l'application du coupon");
    }
  },
 
  // Suppression d'un coupon appliqué
  removeCoupon: () => {
    set({ coupon: null, isCouponApplied: false }); // Réinitialise le coupon
    get().calculateTotals(); // Recalcul des totaux sans le coupon
    toast.success("Coupon supprimé");
  },

  // Récupération des éléments du panier depuis l'API
  getCartItems: async () => {
    try {
      const res = await axios.get("/cart"); // Appel pour récupérer les articles du panier
      set({ cart: res.data }); // Mise à jour du panier dans le store
      get().calculateTotals(); // Calcul des totaux après mise à jour
    } catch (error) {
      set({ cart: [] }); // Réinitialise le panier en cas d'erreur
      toast.error(error.response?.data?.message || "Une erreur s'est produite");
    }
  },

  // Vider le panier
  clearCart: async () => {
    set({ cart: [], coupon: null, total: 0, subtotal: 0 }); // Réinitialisation complète du panier
  },

  // Ajout d'un produit au panier
  addToCart: async (product) => {
    try {
      await axios.post("/cart", { productId: product._id }); // Ajout au panier via l'API
      toast.success("Produit ajouté au panier");

      // Mise à jour du panier localement
      set((prevState) => {
        const existingItem = prevState.cart.find((item) => item._id === product._id);
        const newCart = existingItem
          ? prevState.cart.map((item) =>
              item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
            )
          : [...prevState.cart, { ...product, quantity: 1 }];
        return { cart: newCart };
      });
      get().calculateTotals(); // Recalcul des totaux
    } catch (error) {
      toast.error(error.response?.data?.message || "Une erreur s'est produite");
    }
  },

  // Suppression d'un produit du panier
  removeFromCart: async (productId) => {
    await axios.delete(`/cart`, { data: { productId } }); // Suppression via l'API
    set((prevState) => ({ cart: prevState.cart.filter((item) => item._id !== productId) }));
    get().calculateTotals(); // Recalcul des totaux
  },

  // Mise à jour de la quantité d'un produit dans le panier
  updateQuantity: async (productId, quantity) => {
    if (quantity === 0) {
      get().removeFromCart(productId); // Suppression si la quantité est 0
      return;
    }

    await axios.put(`/cart/${productId}`, { quantity }); // Mise à jour via l'API
    set((prevState) => ({
      cart: prevState.cart.map((item) => (item._id === productId ? { ...item, quantity } : item)),
    }));
    get().calculateTotals(); // Recalcul des totaux
  },

  // Calcul des totaux (sous-total et total avec remise)
  calculateTotals: () => {
    const { cart, coupon } = get(); // Récupère le panier et le coupon depuis le store
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0); // Calcule le sous-total
    let total = subtotal;

    if (coupon) {
      const discount = subtotal * (coupon.discountPercentage / 100); // Calcule la remise
      total = subtotal - discount;
    }

    set({ subtotal, total }); // Mise à jour des totaux dans le store
  },
    
}));