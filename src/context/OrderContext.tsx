import React, { createContext, useContext, useState, ReactNode } from "react";
import type { CartItem } from "./CartContext";

export interface OrderItem {
  id: string;
  items: CartItem[];
  totalAmount: number;
  orderDate: number;
  status: "completed" | "processing" | "pending";
}

interface OrderContextType {
  orders: OrderItem[];
  addOrder: (items: CartItem[], totalAmount: number) => void;
  getOrders: () => OrderItem[];
  clearOrders: () => void;
  getOrderById: (id: string) => OrderItem | undefined;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
};

interface OrderProviderProps {
  children: ReactNode;
}

export const OrderProvider: React.FC<OrderProviderProps> = ({ children }) => {
  const [orders, setOrders] = useState<OrderItem[]>([]);

  const addOrder = (items: CartItem[], totalAmount: number) => {
    const newOrder: OrderItem = {
      id: `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      items: [...items],
      totalAmount,
      orderDate: Date.now(),
      status: "completed",
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