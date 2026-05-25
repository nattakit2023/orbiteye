import { useQuery } from "@tanstack/react-query";
import { graphqlClient } from "../client";
import type { ApiRequest } from "@/types/api";

// STAC Search input type (must match backend)
export interface StacSearchInput {
	bbox?: number[];
	intersects?: {
		type: string;
		coordinates?: number[][];
		center?: [number, number];
		radius?: number;
	};
	filter?: {
		op: string;
		args: unknown[];
	};
	datetime?: string;
	limit?: number;
	sortby?: string;
	offset?: number;
	cursor?: string;
	stacType?: string[]; // API type(s): "theos2", "sentinel", "landsat"
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
	coordinates?: number[];  // Flat array [lng, lat, ...] or [lng, lat, z, ...]
	timestamp?: string;        // ISO 8601 string
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
const STAC_SEARCH_QUERY = `
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

// STAC Search hook
export const useStacSearch = (input: StacSearchInput) => {
	return useQuery({
		queryKey: ["stac-search", input],
		queryFn: async () => {
			const response = await graphqlClient.request<{
				stacSearch: TransformedApiResponse;
			}>(STAC_SEARCH_QUERY, { input });

			return response.stacSearch;
		},
	});
};

// Direct search function (for programmatic usage without hook)
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

/**
 * Legacy analyzeShape function that converts ApiRequest to StacSearchInput
 * Kept for backward compatibility with existing code
 */
export const analyzeShape = async (
	requestData: ApiRequest,
): Promise<TransformedApiResponse> => {
	const input: StacSearchInput = {
		intersects: requestData.intersects as StacSearchInput["intersects"],
		filter: requestData.filter as StacSearchInput["filter"],
		datetime: requestData.datetime as string,
		limit: requestData.limit as number,
		sortby: requestData.sortby as string | undefined,
		offset: requestData.offset as number | undefined,
		stacType: requestData.stacType as string[] | undefined,
	};
	return stacSearch(input);
};
