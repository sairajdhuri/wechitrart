"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CartItem } from "@/types";

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeFromCart: (posterId: string, size: string) => void;
  updateQuantity: (posterId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  totalItemsCount: number;
  subtotal: number;
  shippingCost: number;
  totalAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "wechitrart_cart_v2";

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Load cart from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        setCart(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load cart from localStorage", e);
    }
    setMounted(true);
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error("Failed to persist cart to localStorage", e);
    }
  }, [cart, mounted]);

  const addToCart = (item: Omit<CartItem, "quantity">, quantity: number = 1) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (ci) => ci.posterId === item.posterId && ci.size === item.size
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prev, { ...item, quantity }];
      }
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (posterId: string, size: string) => {
    setCart((prev) =>
      prev.filter((item) => !(item.posterId === posterId && item.size === size))
    );
  };

  const updateQuantity = (posterId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(posterId, size);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.posterId === posterId && item.size === size
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce(
    (acc, item) => acc + item.unitPrice * item.quantity,
    0
  );
  // Free shipping on all orders
  const shippingCost = 0;
  const totalAmount = subtotal + shippingCost;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        totalItemsCount,
        subtotal,
        shippingCost,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
