import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { graphqlClient } from "../client";
import type {
  Order,
  CreateOrderInput,
  UpdateOrderInput,
  OrderPaginationInput,
  OrderStatus,
} from "@/gql/graphql";

// Query documents
const ORDERS_QUERY = `
  query Orders($pagination: OrderPaginationInput) {
    orders(pagination: $pagination) {
      id
      userId
      status
      totalAmount
      createdAt
      updatedAt
      notes
      items {
        id
        productId
        productName
        quantity
        unitPrice
        subtotal
      }
      shippingAddress {
        street
        city
        state
        country
        postalCode
      }
    }
  }
`;

const ORDER_QUERY = `
  query Order($id: String!) {
    order(id: $id) {
      id
      userId
      status
      totalAmount
      createdAt
      updatedAt
      notes
      items {
        id
        productId
        productName
        quantity
        unitPrice
        subtotal
      }
      shippingAddress {
        street
        city
        state
        country
        postalCode
      }
    }
  }
`;

const ORDERS_BY_STATUS_QUERY = `
  query OrdersByStatus($status: OrderStatus!, $pagination: OrderPaginationInput) {
    ordersByStatus(status: $status, pagination: $pagination) {
      id
      userId
      status
      totalAmount
      createdAt
      updatedAt
      notes
      items {
        id
        productId
        productName
        quantity
        unitPrice
        subtotal
      }
    }
  }
`;

const ORDERS_BY_USER_QUERY = `
  query OrdersByUserId($userId: String!, $pagination: OrderPaginationInput) {
    ordersByUserId(userId: $userId, pagination: $pagination) {
      id
      userId
      status
      totalAmount
      createdAt
      updatedAt
      notes
      items {
        id
        productId
        productName
        quantity
        unitPrice
        subtotal
      }
    }
  }
`;

const RECENT_ORDERS_QUERY = `
  query RecentOrders($limit: Int) {
    recentOrders(limit: $limit) {
      id
      userId
      status
      totalAmount
      createdAt
      updatedAt
      notes
      items {
        id
        productId
        productName
        quantity
        unitPrice
        subtotal
      }
    }
  }
`;

const ORDER_STATISTICS_QUERY = `
  query OrderStatistics($status: OrderStatus) {
    orderStatistics(status: $status) {
      totalOrders
      pendingOrders
      processingOrders
      shippedOrders
      deliveredOrders
      cancelledOrders
      totalRevenue
    }
  }
`;

// Mutation documents
const CREATE_ORDER_MUTATION = `
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      id
      userId
      status
      totalAmount
      createdAt
      updatedAt
      notes
      items {
        id
        productId
        productName
        quantity
        unitPrice
        subtotal
      }
      shippingAddress {
        street
        city
        state
        country
        postalCode
      }
    }
  }
`;

const UPDATE_ORDER_MUTATION = `
  mutation UpdateOrder($id: String!, $input: UpdateOrderInput!) {
    updateOrder(id: $id, input: $input) {
      id
      userId
      status
      totalAmount
      createdAt
      updatedAt
      notes
      items {
        id
        productId
        productName
        quantity
        unitPrice
        subtotal
      }
    }
  }
`;

const CANCEL_ORDER_MUTATION = `
  mutation CancelOrder($id: String!) {
    cancelOrder(id: $id) {
      id
      userId
      status
      totalAmount
      createdAt
      updatedAt
      notes
    }
  }
`;

const CONVERT_CART_TO_ORDER_MUTATION = `
  mutation ConvertCartToOrder($input: ConvertCartToOrderInput!) {
    convertCartToOrder(input: $input) {
      success
      orderId
      message
    }
  }
`;

// Hook to get all orders with pagination
export const useOrders = (pagination?: OrderPaginationInput) => {
  return useQuery({
    queryKey: ["orders", pagination],
    queryFn: async () => {
      const response = await graphqlClient.request(ORDERS_QUERY, { pagination });
      return (response as { orders: Order[] }).orders;
    },
  });
};

// Hook to get a single order by ID
export const useOrder = (id: string) => {
  return useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      const response = await graphqlClient.request(ORDER_QUERY, { id });
      return (response as { order: Order | null }).order;
    },
    enabled: !!id,
  });
};

// Hook to get orders by status
export const useOrdersByStatus = (status: OrderStatus, pagination?: OrderPaginationInput) => {
  return useQuery({
    queryKey: ["ordersByStatus", status, pagination],
    queryFn: async () => {
      const response = await graphqlClient.request(ORDERS_BY_STATUS_QUERY, { status, pagination });
      return (response as { ordersByStatus: Order[] }).ordersByStatus;
    },
  });
};

// Hook to get orders by user ID
export const useOrdersByUser = (userId: string, pagination?: OrderPaginationInput) => {
  return useQuery({
    queryKey: ["ordersByUser", userId, pagination],
    queryFn: async () => {
      const response = await graphqlClient.request(ORDERS_BY_USER_QUERY, { userId, pagination });
      return (response as { ordersByUserId: Order[] }).ordersByUserId;
    },
    enabled: !!userId,
  });
};

// Hook to get recent orders
export const useRecentOrders = (limit?: number) => {
  return useQuery({
    queryKey: ["recentOrders", limit],
    queryFn: async () => {
      const response = await graphqlClient.request(RECENT_ORDERS_QUERY, { limit });
      return (response as { recentOrders: Order[] }).recentOrders;
    },
  });
};

// Hook to get order statistics
export const useOrderStatistics = (status?: OrderStatus) => {
  return useQuery({
    queryKey: ["orderStatistics", status],
    queryFn: async () => {
      const response = await graphqlClient.request(ORDER_STATISTICS_QUERY, { status });
      return (response as { orderStatistics: { totalOrders: number; pendingOrders: number; processingOrders: number; shippedOrders: number; deliveredOrders: number; cancelledOrders: number; totalRevenue: number } }).orderStatistics;
    },
  });
};

// Hook to create an order
export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateOrderInput) => {
      const response = await graphqlClient.request(CREATE_ORDER_MUTATION, { input });
      return (response as { createOrder: Order }).createOrder;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["orderStatistics"] });
      queryClient.invalidateQueries({ queryKey: ["recentOrders"] });
    },
  });
};

// Hook to update an order
export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: UpdateOrderInput }) => {
      const response = await graphqlClient.request(UPDATE_ORDER_MUTATION, { id, input });
      return (response as { updateOrder: Order }).updateOrder;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["orderStatistics"] });
    },
  });
};

// Hook to cancel an order
export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await graphqlClient.request(CANCEL_ORDER_MUTATION, { id });
      return (response as { cancelOrder: Order }).cancelOrder;
    },
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", id] });
      queryClient.invalidateQueries({ queryKey: ["orderStatistics"] });
      queryClient.invalidateQueries({ queryKey: ["recentOrders"] });
    },
  });
};

// Hook to convert cart to order
export const useConvertCartToOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { cartId: number; shippingAddress?: string; billingAddress?: string }) => {
      const response = await graphqlClient.request(CONVERT_CART_TO_ORDER_MUTATION, { input });
      return (response as { convertCartToOrder: { success: boolean; orderId?: string; message?: string } }).convertCartToOrder;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["orderStatistics"] });
      queryClient.invalidateQueries({ queryKey: ["recentOrders"] });
    },
  });
};