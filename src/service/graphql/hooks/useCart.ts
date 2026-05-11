import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { graphqlClient } from "../client";
import type {
  Cart,
  CreateCartInput,
  AddCartItemInput,
  UpdateCartItemInput,
  RemoveCartItemInput,
  ConvertCartToOrderInput,
  ShippingAddressInput,
} from "@/gql/graphql";

// GraphQL Documents
const GET_CARTS = `
  query GetCarts($pagination: PaginationInput) {
    carts(pagination: $pagination) {
      id
      userId
      items {
        id
        productId
        productName
        quantity
        unitPrice
      }
      totalAmount
      status
      createdAt
      updatedAt
    }
  }
`;

const GET_CART = `
  query GetCart($id: String!) {
    cart(id: $id) {
      id
      userId
      items {
        id
        productId
        productName
        quantity
        unitPrice
      }
      totalAmount
      status
      createdAt
      updatedAt
    }
  }
`;

// Query to get cart by user ID (matches new_backend: cart(user_id: i32))
const GET_CART_BY_USER_ID = `
  query GetCartByUserId($userId: Int!) {
    cart(userId: $userId) {
      id
      userId
      items {
        id
        productId
        productName
        quantity
        unitPrice
      }
      totalAmount
      status
      createdAt
      updatedAt
    }
  }
`;

const CREATE_CART = `
  mutation CreateCart($input: CreateCartInput!) {
    createCart(input: $input) {
      id
      userId
      items {
        id
        productId
        productName
        quantity
        unitPrice
      }
      totalAmount
      status
      createdAt
      updatedAt
    }
  }
`;

const ADD_CART_ITEM = `
  mutation AddCartItem($input: AddCartItemInput!) {
    addCartItem(input: $input) {
      id
      userId
      items {
        id
        productId
        productName
        quantity
        unitPrice
      }
      totalAmount
      status
      createdAt
      updatedAt
    }
  }
`;

const UPDATE_CART_ITEM = `
  mutation UpdateCartItem($input: UpdateCartItemInput!) {
    updateCartItem(input: $input) {
      id
      userId
      items {
        id
        productId
        productName
        quantity
        unitPrice
      }
      totalAmount
      status
      createdAt
      updatedAt
    }
  }
`;

const REMOVE_CART_ITEM = `
  mutation RemoveCartItem($input: RemoveCartItemInput!) {
    removeCartItem(input: $input) {
      id
      userId
      items {
        id
        productId
        productName
        quantity
        unitPrice
      }
      totalAmount
      status
      createdAt
      updatedAt
    }
  }
`;

const CONVERT_CART_TO_ORDER = `
  mutation ConvertCartToOrder($input: ConvertCartToOrderInput!) {
    convertCartToOrder(input: $input) {
      id
      userId
      status
      totalAmount
      createdAt
      updatedAt
    }
  }
`;

// Query Hooks

/**
 * Get all carts with optional pagination
 */
export const useCarts = (pagination?: { limit?: number; offset?: number }) => {
  return useQuery({
    queryKey: ["carts", pagination],
    queryFn: async () => {
      const response = await graphqlClient.request(GET_CARTS, { pagination });
      return (response as { carts: Cart[] }).carts;
    },
  });
};

/**
 * Get a single cart by ID
 */
export const useCart = (id: string) => {
  return useQuery({
    queryKey: ["cart", id],
    queryFn: async () => {
      const response = await graphqlClient.request(GET_CART, { id });
      return (response as { cart: Cart | null }).cart;
    },
    enabled: !!id,
  });
};

/**
 * Get cart by user ID (matches new_backend cart query)
 */
export const useCartByUserId = (userId: string) => {
  return useQuery({
    queryKey: ["cartByUserId", userId],
    queryFn: async () => {
      // Parse userId to integer for the backend query
      const userIdInt = parseInt(userId, 10);
      if (isNaN(userIdInt)) {
        throw new Error("Invalid user ID");
      }
      const response = await graphqlClient.request(GET_CART_BY_USER_ID, { 
        userId: userIdInt 
      });
      // Note: backend returns { cart: Cart } not { cartByUserId: Cart }
      return (response as { cart: Cart | null }).cart;
    },
    enabled: !!userId && !isNaN(parseInt(userId, 10)),
  });
};

// Mutation Hooks

/**
 * Create a new cart
 */
export const useCreateCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateCartInput) => {
      const response = await graphqlClient.request(CREATE_CART, { input });
      return (response as { createCart: Cart }).createCart;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carts"] });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error) => {
      console.error("Create cart failed:", error);
    },
  });
};

/**
 * Add item to cart
 */
export const useAddCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: AddCartItemInput) => {
      const response = await graphqlClient.request(ADD_CART_ITEM, { input });
      return (response as { addCartItem: Cart }).addCartItem;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["carts"] });
      queryClient.invalidateQueries({ queryKey: ["cart", data.id] });
      queryClient.invalidateQueries({ queryKey: ["cartByUserId", data.userId] });
    },
    onError: (error) => {
      console.error("Add cart item failed:", error);
    },
  });
};

/**
 * Update cart item quantity
 */
export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateCartItemInput) => {
      const response = await graphqlClient.request(UPDATE_CART_ITEM, { input });
      return (response as { updateCartItem: Cart }).updateCartItem;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["carts"] });
      queryClient.invalidateQueries({ queryKey: ["cart", data.id] });
      queryClient.invalidateQueries({ queryKey: ["cartByUserId", data.userId] });
    },
    onError: (error) => {
      console.error("Update cart item failed:", error);
    },
  });
};

/**
 * Remove item from cart
 */
export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: RemoveCartItemInput) => {
      const response = await graphqlClient.request(REMOVE_CART_ITEM, { input });
      return (response as { removeCartItem: Cart }).removeCartItem;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["carts"] });
      queryClient.invalidateQueries({ queryKey: ["cart", data.id] });
      queryClient.invalidateQueries({ queryKey: ["cartByUserId", data.userId] });
    },
    onError: (error) => {
      console.error("Remove cart item failed:", error);
    },
  });
};

/**
 * Convert cart to order
 */
export const useConvertCartToOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: ConvertCartToOrderInput) => {
      const response = await graphqlClient.request(CONVERT_CART_TO_ORDER, { input });
      return (response as { convertCartToOrder: Cart }).convertCartToOrder;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carts"] });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cartByUserId"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error) => {
      console.error("Convert cart to order failed:", error);
    },
  });
};

/**
 * Build shipping address input object
 */
export const buildShippingAddress = (
  name: string,
  street: string,
  city: string,
  state: string,
  country: string,
  postalCode: string
): ShippingAddressInput => ({
  name,
  street,
  city,
  state,
  country,
  postalCode,
});