import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
	schema: "src/gql/schema.graphql",
	documents: [
		"src/**/*.{ts,tsx}",
		"!src/**/stac.ts",
	],
	generates: {
		"src/gql/": {
			preset: "client",
		},
		"src/gql/schema.graphql": {
			plugins: ["schema-ast"],
		},
	},
	ignoreNoDocuments: true,
	allowPartialOutputs: true,
};

export default config;