import { gql } from "graphql-request";
import { graphqlClient } from "./client";

// STAC Search input type (must match backend)
export interface StacSearchInput {
	bbox?: number[];
	datetime?: string;
	limit?: number;
	collections?: string[];
}

// STAC response types
export interface ShapeAnalysis {
	type: string;
	area: number;
	perimeter: number;
	centroid: [number, number];
}

export interface BoundingBox {
	minLat: number;
	maxLat: number;
	minLng: number;
	maxLng: number;
}

export interface FeatureStatistics {
	pointCount: number;
	boundingBox: BoundingBox;
}

export interface ImageAsset {
	thumbnailUrl?: string;
	downloadUrl?: string;
}

export interface AnalysisResult {
	id: string;
	name: string;
	value: number;
	coordinates?: any;
	timestamp: number;
	imageData?: ImageAsset;
}

export interface TransformedData {
	shapeAnalysis: ShapeAnalysis;
	statistics: FeatureStatistics;
	results: AnalysisResult[];
}

export interface TransformedApiResponse {
	success: boolean;
	data?: TransformedData;
	message?: string;
	error?: string;
}

// GraphQL query for STAC search
export const STAC_SEARCH_QUERY = gql`
	query StacSearch($input: StacSearchInput!) {
		stacSearch(input: $input) {
			success
			data {
				shapeAnalysis {
					type
					area
					perimeter
					centroid
				}
				statistics {
					pointCount
					boundingBox {
						minLat
						maxLat
						minLng
						maxLng
					}
				}
				results {
					id
					name
					value
					coordinates
					timestamp
					imageData {
						thumbnailUrl
						downloadUrl
					}
				}
			}
			message
			error
		}
	}
`;

// Function to search STAC catalog via GraphQL
export const stacSearch = async (
	input: StacSearchInput
): Promise<TransformedApiResponse> => {
	try {
		const response = await graphqlClient.request<{
			stacSearch: TransformedApiResponse;
		}>(STAC_SEARCH_QUERY, { input });

		return response.stacSearch;
	} catch (error) {
		console.error("STAC GraphQL Error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
};
