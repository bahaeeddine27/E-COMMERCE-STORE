import { act, renderHook } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { useCartStore } from "./useCartStore";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

vi.mock("../lib/axios");
vi.mock("react-hot-toast");

describe("useCartStore", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Ajoute un produit au panier", async () => {
    const { result } = renderHook(() => useCartStore());
    await act(async () => {
      await result.current.addToCart({
        _id: "1",
        name: "Ebook",
        price: 20,
        quantity: 1,
      });
    });
    expect(result.current.cart).toHaveLength(1);
    expect(result.current.cart[0].name).toBe("Ebook");
    expect(toast.success).toHaveBeenCalledWith("Produit ajouté au panier");
  });

  it("Applique un coupon avec succès", async () => {
    axios.post.mockResolvedValueOnce({
      data: { code: "PROMOCOUPON", discountPercentage: 10 }
    });
    const { result } = renderHook(() => useCartStore());
    await act(async () => {
      await result.current.applyCoupon("PROMOCOUPON");
    });
    expect(result.current.coupon.code).toBe("PROMOCOUPON");
    expect(result.current.isCouponApplied).toBe(true);
    expect(toast.success).toHaveBeenCalledWith("Coupon appliqué avec succès");
  });

  it("Supprime un produit du panier", async () => {
    const { result } = renderHook(() => useCartStore());
    await act(async () => {
      await result.current.addToCart({
        _id: "1",
        name: "Ebook",
        price: 20,
        quantity: 1,
      });
      await result.current.removeFromCart("1");
    });
    expect(result.current.cart).toHaveLength(0);
  });
});
