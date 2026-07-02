import React, { useState, useEffect, ReactNode } from "react";
import { message } from "antd";
import {
  useCartByUserId,
  useCreateCart,
  useAddCartItem,
  useRemoveCartItem,
  useUpdateCartItem,
} from "@/service/graphql/hooks/useCart";
import { CartContext } from "./CartContextValue";
import type { CartItem } from "./CartContextValue";

interface CartProviderProps {
  children: ReactNode;
  userId?: string;
}

// Helper to get user ID from localStorage or create guest session
const getUserIdentifier = (): string => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const payload = token.split(".")[1];
      if (payload) {
        const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
        if (decoded.sub || decoded.userId || decoded.id) {
          return String(decoded.sub || decoded.userId || decoded.id);
        }
      }
    } catch {
      // Token decode failed, continue with guest
    }
  }

  const storedUserId = localStorage.getItem("userId");
  if (storedUserId) {
    return storedUserId;
  }

  let guestSessionId = localStorage.getItem("guestSessionId");
  if (!guestSessionId) {
    guestSessionId = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    localStorage.setItem("guestSessionId", guestSessionId);
  }

  return guestSessionId;
};

export const CartProvider: React.FC<CartProviderProps> = ({ children, userId: userIdProp }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  const effectiveUserId = userIdProp || getUserIdentifier();
  const isGuest = !userIdProp && effectiveUserId.startsWith("guest_");

  const { data: serverCart, isLoading: isLoadingCart } = useCartByUserId(effectiveUserId);
  const createCartMutation = useCreateCart();
  const addCartItemMutation = useAddCartItem();
  const removeCartItemMutation = useRemoveCartItem();
  const updateCartItemMutation = useUpdateCartItem();

  // Derived from serverCart - no state needed, eliminates cascading renders.
  const serverCartId = serverCart?.id?.toString() ?? null;

  // Effect intentionally re-syncs cartItems whenever the server query
  // delivers fresh data (e.g. after a mutation invalidates the query).
  useEffect(() => {
    if (!serverCart) return;

    if (serverCart.items && Array.isArray(serverCart.items)) {
      const mappedItems: CartItem[] = serverCart.items.map((item) => ({
        // For server items, use database id as local id for consistency
        id: item.id?.toString() ?? `${item.productName}`,
        serverId: item.id ?? undefined,
        name: item.productName ?? "Unknown Product",
        // GraphQL fields are Maybe<string> = string | null | undefined;
        // CartItem uses string | undefined, so coerce null -> undefined.
        satelliteName: item.satelliteName ?? undefined,
        date: Date.now(),
        cloud: 0,
        quality: "good",
        imageUrl: item.imageUrl ?? undefined,
        price: item.unitPrice ?? 0,
        quantity: item.quantity ?? 1,
      }));
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCartItems(mappedItems);
    }
  }, [serverCart]);

  const ensureCartId = async (): Promise<string> => {
    if (serverCartId) return serverCartId;

    if (effectiveUserId && !isGuest) {
      try {
        const newCart = await createCartMutation.mutateAsync({
          userId: effectiveUserId,
        });
        const newId = newCart.id?.toString() ?? "0";
        return newId;
      } catch (error) {
        console.error("Failed to create cart:", error);
        throw error;
      }
    }
    return "0";
  };

  const addToCart = async (item: Omit<CartItem, "id">) => {
    // Create unique id based on name and timestamp for local items
    const localId = `${item.name}-${item.date}`;
    const id = localId;

    if (cartItems.some((cartItem) => cartItem.id === id)) {
      message.info("Item already in cart");
      return;
    }

    const newItem: CartItem = { ...item, id, quantity: item.quantity || 1 };
    setCartItems((prev) => [...prev, newItem]);

    if (effectiveUserId && !isGuest) {
      try {
        setIsSyncing(true);
        const cartId = await ensureCartId();
        await addCartItemMutation.mutateAsync({
          cartId: parseInt(cartId, 10),
          productName: item.name,
          satelliteName: item.satelliteName,
          imageUrl: item.imageUrl,
          quantity: item.quantity || 1,
          unitPrice: item.price,
        });
        message.success("Item added to cart");
      } catch (error) {
        setCartItems((prev) => prev.filter((i) => i.id !== id));
        message.error("Failed to add item to cart");
        console.error("Add to cart failed:", error);
      } finally {
        setIsSyncing(false);
      }
    }
  };

  const removeFromCart = async (id: string) => {
    const itemToRemove = cartItems.find((item) => item.id === id);
    // Use serverId for database operations if available, otherwise skip backend call
    const dbItemId = itemToRemove?.serverId;

    if (effectiveUserId && !isGuest) {
      if (dbItemId) {
        try {
          setIsSyncing(true);
          const cartId = await ensureCartId();
          await removeCartItemMutation.mutateAsync({
            cartId: parseInt(cartId, 10),
            itemId: dbItemId,
          });
          // Only remove locally after backend succeeds
          setCartItems((prev) => prev.filter((item) => item.id !== id));
          message.success("Item removed from cart");
        } catch (error: unknown) {
          // If item not found in backend, still remove locally (item may have been already deleted)
          const messageText = error instanceof Error ? error.message : String(error);
          if (messageText.includes("not found") || messageText.includes("Cart item not found")) {
            setCartItems((prev) => prev.filter((item) => item.id !== id));
            message.success("Item removed from cart");
          } else {
            message.error("Failed to remove item from cart");
            console.error("Remove from cart failed:", error);
          }
        } finally {
          setIsSyncing(false);
        }
      } else if (itemToRemove) {
        // Item was locally added (no serverId), remove locally only
        setCartItems((prev) => prev.filter((item) => item.id !== id));
        message.success("Item removed from cart");
      }
    } else {
      // No backend, just remove locally
      setCartItems((prev) => prev.filter((item) => item.id !== id));
      message.success("Item removed from cart");
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const isInCart = (id: string) => {
    return cartItems.some((item) => item.id === id);
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity < 1) return;

    const previousItems = [...cartItems];
    const itemToUpdate = cartItems.find((item) => item.id === id);
    // Use serverId for database operations if available, otherwise use id
    const dbItemId = itemToUpdate?.serverId ?? (parseInt(id, 10) || 0);

    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );

    if (effectiveUserId && !isGuest) {
      try {
        setIsSyncing(true);
        const cartId = await ensureCartId();
        await updateCartItemMutation.mutateAsync({
          cartId: parseInt(cartId, 10),
          itemId: dbItemId,
          quantity,
        });
      } catch (error) {
        setCartItems(previousItems);
        message.error("Failed to update quantity");
        console.error("Update quantity failed:", error);
      } finally {
        setIsSyncing(false);
      }
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        serverCartId,
        addToCart,
        removeFromCart,
        clearCart,
        isInCart,
        updateQuantity,
        isLoading: isLoadingCart,
        isSyncing,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Re-export the type so existing `import type { CartItem } from "@/context/CartContext"`
// paths keep working without forcing every caller to update.
export type { CartItem } from "./CartContextValue";
