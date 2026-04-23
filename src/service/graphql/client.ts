import { GraphQLClient } from "graphql-request";

// GraphQL endpoint from environment or default to localhost
const endpoint = import.meta.env.VITE_API_URL
	? `${import.meta.env.VITE_API_URL}/graphql`
	: "http://localhost:4321/graphql";

// Create GraphQL client with dynamic auth headers
export const graphqlClient = new GraphQLClient(endpoint, {
	mode: "cors",
	requestMiddleware: (request) => {
		// Dynamically add auth token from localStorage for each request
		const token = localStorage.getItem("token");
		return {
			...request,
			headers: {
				...request.headers,
				"Content-Type": "application/json",
				...(token ? { Authorization: `Bearer ${token}` } : {}),
			},
		};
	},
});

// Health check function to verify GraphQL endpoint connectivity
export const healthCheck = async (): Promise<boolean> => {
	try {
		const query = `
      query {
        __schema {
          queryType {
            name
          }
        }
      }
    `;
		await graphqlClient.request(query);
		return true;
	} catch (error) {
		console.error("GraphQL health check failed:", error);
		return false;
	}
};

// Error handler for GraphQL responses
export const handleGraphQLError = (error: any) => {
	console.error("GraphQL Error:", error);

	// Check for authentication errors
	if (
		error?.response?.errors?.some(
			(e: any) => e.extensions?.code === "UNAUTHENTICATED",
		)
	) {
		// Clear invalid tokens and redirect to login
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		window.location.href = "/login";
		return;
	}

	// Check for network errors
	if (error?.response?.status >= 500) {
		throw new Error("Server error occurred. Please try again later.");
	}

	// Return the original error for component-level handling
	throw error;
};
