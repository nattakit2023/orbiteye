import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { graphqlClient } from "../client";
import type {
  User,
  CreateUserInput,
  UpdateUserInput,
  PaginationInput,
} from "@/gql/graphql";

// Get all users
export const useUsers = (pagination?: PaginationInput) => {
  return useQuery({
    queryKey: ["users", pagination],
    queryFn: async () => {
      const response = await graphqlClient.request(`
        query GetUsers($pagination: PaginationInput) {
          users(pagination: $pagination) {
            id
            email
            fullName
            displayName
            role
            isAdmin
            isManager
            createdAt
            updatedAt
          }
        }
      `, { pagination });
      return (response as { users: User[] }).users;
    },
  });
};

// Get user by ID
export const useUser = (id: string) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const response = await graphqlClient.request(`
        query GetUser($id: String!) {
          user(id: $id) {
            id
            email
            fullName
            displayName
            role
            isAdmin
            isManager
            createdAt
            updatedAt
          }
        }
      `, { id });
      return (response as { user: User | null }).user;
    },
    enabled: !!id,
  });
};

// Get current user (me)
export const useMe = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const response = await graphqlClient.request(`
        query GetMe {
          me {
            id
            email
            fullName
            displayName
            role
            isAdmin
            isManager
            createdAt
            updatedAt
          }
        }
      `);
      return (response as { me: User | null }).me;
    },
  });
};

// Get user by email
export const useUserByEmail = (email: string) => {
  return useQuery({
    queryKey: ["userByEmail", email],
    queryFn: async () => {
      const response = await graphqlClient.request(`
        query GetUserByEmail($email: String!) {
          userByEmail(email: $email) {
            id
            email
            fullName
            displayName
            role
            isAdmin
            isManager
            createdAt
            updatedAt
          }
        }
      `, { email });
      return (response as { userByEmail: User | null }).userByEmail;
    },
    enabled: !!email,
  });
};

// Check if email is available
export const useIsEmailAvailable = (email: string) => {
  return useQuery({
    queryKey: ["isEmailAvailable", email],
    queryFn: async () => {
      const response = await graphqlClient.request(`
        query IsEmailAvailable($email: String!) {
          isEmailAvailable(email: $email)
        }
      `, { email });
      return (response as { isEmailAvailable: boolean }).isEmailAvailable;
    },
    enabled: !!email,
  });
};

// Create user mutation
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateUserInput) => {
      const response = await graphqlClient.request(`
        mutation CreateUser($input: CreateUserInput!) {
          createUser(input: $input) {
            id
            email
            fullName
            displayName
            role
            isAdmin
            isManager
            createdAt
            updatedAt
          }
        }
      `, { input });
      return (response as { createUser: User }).createUser;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

// Update user mutation
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: UpdateUserInput }) => {
      const response = await graphqlClient.request(`
        mutation UpdateUser($id: String!, $input: UpdateUserInput!) {
          updateUser(id: $id, input: $input) {
            id
            email
            fullName
            displayName
            role
            isAdmin
            isManager
            createdAt
            updatedAt
          }
        }
      `, { id, input });
      return (response as { updateUser: User }).updateUser;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
};

// Delete user mutation
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await graphqlClient.request(`
        mutation DeleteUser($id: String!) {
          deleteUser(id: $id)
        }
      `, { id });
      return (response as { deleteUser: boolean }).deleteUser;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};