import React, { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { handleGraphQLError } from "../service/graphql/client";

// Create a client instance
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			// Stale time: 5 minutes - data stays fresh for 5 minutes
			staleTime: 5 * 60 * 1000,
			// Cache time: 10 minutes - data stays in cache for 10 minutes after component unmounts
			gcTime: 10 * 60 * 1000,
			// Retry failed requests once
			retry: 1,
			// Don't retry on 4xx errors (client errors)
			retryOnMount: true,
			// Refetch on window focus for important data
			refetchOnWindowFocus: false,
			// Error handling
			throwOnError: false,
		},
		mutations: {
			// Global error handling for mutations
			onError: (error) => {
				console.error("Mutation error:", error);
				try {
					handleGraphQLError(error);
				} catch (handledError) {
					// Error was handled by handleGraphQLError
					console.error("Handled GraphQL error:", handledError);
				}
			},
			// Don't retry mutations by default
			retry: 0,
		},
	},
});

interface QueryProviderProps {
	children: ReactNode;
}

export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
	return (
		<QueryClientProvider client={queryClient}>
			{children}
		</QueryClientProvider>
	);
};

// Export the query client for use in custom hooks
export { queryClient };