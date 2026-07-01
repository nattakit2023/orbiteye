import React, { useState, ReactNode } from "react";
import { OrderContext } from "./OrderContextValue";
import type { OrderItem } from "./OrderContextValue";

interface OrderProviderProps {
  children: ReactNode;
}

export const OrderProvider: React.FC<OrderProviderProps> = ({ children }) => {
  const [orders, setOrders] = useState<OrderItem[]>([]);

  const addOrder = (items: OrderItem["items"], totalAmount: number) => {
    const newOrder: OrderItem = {
      id: `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      items: [...items],
      totalAmount,
      orderDate: Date.now(),
      status: "pending",
    };

    setOrders((prev) => [newOrder, ...prev]);
  };

  const getOrders = () => {
    return orders;
  };

  const clearOrders = () => {
    setOrders([]);
  };

  const getOrderById = (id: string) => {
    return orders.find((order) => order.id === id);
  };

  return (
    <OrderContext.Provider
      value={{ orders, addOrder, getOrders, clearOrders, getOrderById }}
    >
      {children}
    </OrderContext.Provider>
  );
};

// Re-export the OrderItem type so existing
// `import type { OrderItem } from "@/context/OrderContext"` paths keep working.
export type { OrderItem } from "./OrderContextValue";
