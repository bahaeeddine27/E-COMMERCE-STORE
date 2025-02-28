import { act, renderHook } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { useProductStore } from "./useProductStore";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

// Mock d'Axios et de react-hot-toast avec Vitest
vi.mock("../lib/axios");
vi.mock("react-hot-toast");

describe("useProductStore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Récupère tous les produits", async () => {
    const mockProducts = [
      { _id: "1", name: "Ebook React", price: 29.99 },
      { _id: "2", name: "Formation Node.js", price: 49.99 },
    ];
    axios.get.mockResolvedValueOnce({ data: { products: mockProducts } });
    const { result } = renderHook(() => useProductStore());
    await act(async () => {
      await result.current.fetchAllProducts();
    });
    expect(result.current.products).toEqual(mockProducts);
  });

  it("Crée un nouveau produit", async () => {
    const newProduct = { _id: "3", name: "Formation MERN", price: 59.99 };
    axios.post.mockResolvedValueOnce({ data: newProduct });
    const { result } = renderHook(() => useProductStore());
    await act(async () => {
      await result.current.createProduct(newProduct);
    });
    expect(result.current.products).toContainEqual(newProduct);
    expect(toast.success).toHaveBeenCalledWith("Produit créé avec succès !");
  });
});
