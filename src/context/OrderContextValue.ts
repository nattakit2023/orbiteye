import { createContext, useContext } from "react";
import type { CartItem } from "./CartContextValue";

export interface OrderItem {
  id: string;
  items: CartItem[];
  totalAmount: number;
  orderDate: number;
  status: "completed" | "processing" | "pending" | "cancelled";
}

export interface OrderContextType {
  orders: OrderItem[];
  addOrder: (items: CartItem[], totalAmount: number) => void;
  getOrders: () => OrderItem[];
  clearOrders: () => void;
  getOrderById: (id: string) => OrderItem | undefined;
}

// Context object: allowed as a "constant export" by react-refresh.
export const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
};
