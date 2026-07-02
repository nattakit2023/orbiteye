import { createContext, useContext } from "react";

export interface CartItem {
  id: string;
  serverId?: number;
  name: string;
  satelliteName?: string;
  date: number;
  cloud: number;
  quality: string;
  imageUrl?: string;
  price: number;
  quantity: number;
}

export interface CartContextType {
  cartItems: CartItem[];
  serverCartId: string | null;
  addToCart: (item: Omit<CartItem, "id">) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  isInCart: (id: string) => boolean;
  updateQuantity: (id: string, quantity: number) => void;
  isLoading: boolean;
  isSyncing: boolean;
}

// Context object: allowed as a "constant export" by react-refresh.
export const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
