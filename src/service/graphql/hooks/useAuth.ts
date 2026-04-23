import { useMutation, useQueryClient } from "@tanstack/react-query";
import { graphqlClient } from "../client";
import type {
  AuthResponse,
  LoginInput,
  CreateUserInput,
} from "@/gql/graphql";

// GraphQL Documents as raw strings
const GOOGLE_LOGIN_MUTATION = `
  mutation GoogleLogin($input: GoogleLoginInput!) {
    googleLogin(input: $input) {
      token
      refreshToken
      expiresIn
      tokenType
      user {
        id
        email
        fullName
        displayName
        role
        isAdmin
        isManager
      }
    }
  }
`;

// GraphQL Documents as raw strings
const LOGIN_MUTATION = `
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      refreshToken
      expiresIn
      tokenType
      user {
        id
        email
        fullName
        displayName
        role
        isAdmin
        isManager
      }
    }
  }
`;

const REGISTER_MUTATION = `
  mutation Register($input: CreateUserInput!) {
    register(input: $input) {
      token
      refreshToken
      expiresIn
      tokenType
      user {
        id
        email
        fullName
        displayName
        role
        isAdmin
        isManager
      }
    }
  }
`;

const REFRESH_TOKEN_MUTATION = `
  mutation RefreshToken($refreshToken: String!) {
    refreshToken(refreshToken: $refreshToken) {
      token
      refreshToken
      expiresIn
      tokenType
      user {
        id
        email
        fullName
        displayName
        role
        isAdmin
        isManager
      }
    }
  }
`;

const LOGOUT_MUTATION = `
  mutation Logout {
    logout
  }
`;

// Type for Google login mutation response
interface GoogleLoginResponse {
  googleLogin?: AuthResponse;
}

// Type for login mutation response
interface LoginResponse {
  login?: AuthResponse;
}

// Type for register mutation response
interface RegisterResponse {
  register?: AuthResponse;
}

// Type for refresh token mutation response
interface RefreshTokenResponse {
  refreshToken?: AuthResponse;
}

// Type for logout mutation response
interface LogoutResponse {
  logout: boolean;
}

// Google Login hook
export const useGoogleLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: { google_id: string; email: string; first_name: string }) => {
      return await graphqlClient.request<GoogleLoginResponse>(GOOGLE_LOGIN_MUTATION, {
        input: {
          google_id: variables.google_id,
          email: variables.email,
          first_name: variables.first_name,
        },
      });
    },
    onSuccess: (data) => {
      if (data.googleLogin?.token) {
        // Store the JWT token
        localStorage.setItem("token", data.googleLogin.token);

        // Store user info
        if (data.googleLogin.user) {
          localStorage.setItem(
            "user",
            JSON.stringify(data.googleLogin.user)
          );
        }

        // Invalidate all queries to refresh with authenticated state
        queryClient.invalidateQueries();
      }
    },
    onError: (error) => {
      console.error("Google login failed:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  });
};

// Login hook
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: { email: string; password: string }) => {
      return await graphqlClient.request<LoginResponse>(LOGIN_MUTATION, {
        input: {
          email: variables.email,
          password: variables.password,
        } as LoginInput,
      });
    },
    onSuccess: (data) => {
      if (data.login?.token) {
        // Store the JWT token
        localStorage.setItem("token", data.login.token);

        // Store user info
        if (data.login.user) {
          localStorage.setItem(
            "user",
            JSON.stringify(data.login.user)
          );
        }

        // Invalidate all queries to refresh with authenticated state
        queryClient.invalidateQueries();
      }
    },
    onError: (error) => {
      console.error("Login failed:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  });
};

// Register hook
export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: {
      email: string;
      password: string;
      fullName: string;
    }) => {
      return await graphqlClient.request<RegisterResponse>(REGISTER_MUTATION, {
        input: {
          email: variables.email,
          password: variables.password,
          fullName: variables.fullName,
        } as CreateUserInput,
      });
    },
    onSuccess: (data) => {
      if (data.register?.token) {
        // Store the JWT token
        localStorage.setItem("token", data.register.token);

        // Store user info
        if (data.register.user) {
          localStorage.setItem(
            "user",
            JSON.stringify(data.register.user)
          );
        }

        // Invalidate all queries
        queryClient.invalidateQueries();
      }
    },
    onError: (error) => {
      console.error("Registration failed:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  });
};

// Refresh token hook
export const useRefreshToken = () => {
  return useMutation({
    mutationFn: async (refreshToken: string) => {
      return await graphqlClient.request<RefreshTokenResponse>(REFRESH_TOKEN_MUTATION, {
        refreshToken,
      });
    },
    onSuccess: (data) => {
      if (data.refreshToken?.token) {
        localStorage.setItem("token", data.refreshToken.token);
        if (data.refreshToken.user) {
          localStorage.setItem(
            "user",
            JSON.stringify(data.refreshToken.user)
          );
        }
      }
    },
    onError: (error) => {
      console.error("Token refresh failed:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  });
};

// Logout hook
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return await graphqlClient.request<LogoutResponse>(LOGOUT_MUTATION);
    },
    onSuccess: () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      queryClient.clear();
    },
    onError: () => {
      // Still clear local storage even if server logout fails
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      queryClient.clear();
    },
  });
};