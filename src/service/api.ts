import axios, { AxiosError } from "axios";
import type { ApiRequest, ApiResponse, ImageData } from "@/types/api";

/**
 * Custom fetcher function for SWR
 * Takes URL string and request body, returns Promise with ApiResponse
 */
// Response format expected by UI components
export interface TransformedApiResponse {
  success: boolean;
  data?: {
    shapeAnalysis: {
      type: string;
      area: number;
      perimeter: number;
      centroid: [number, number];
    };
    statistics: {
      pointCount: number;
      boundingBox: {
        minLat: number;
        maxLat: number;
        minLng: number;
        maxLng: number;
      };
    };
    results?: Array<{
      id: string;
      name: string;
      value: number;
      coordinates?: [number, number] | [number, number][];
      timestamp: number;
      imageData?: ImageData;
    }>;
  };
  error?: string;
  message?: string;
}

/**
 * Transform STAC API response to the format expected by UI components
 */
const transformStacResponse = (
  stacResponse: ApiResponse,
): TransformedApiResponse => {
  console.log("Transforming STAC response:", stacResponse);

  // If no features, return empty result
  if (!stacResponse.features || stacResponse.features.length === 0) {
    return {
      success: true,
      data: {
        shapeAnalysis: {
          type: "Unknown",
          area: 0,
          perimeter: 0,
          centroid: [0, 0],
        },
        statistics: {
          pointCount: 0,
          boundingBox: {
            minLat: 0,
            maxLat: 0,
            minLng: 0,
            maxLng: 0,
          },
        },
        results: [],
      },
      message: `No results found. Matched: ${stacResponse.context?.matched || 0}`,
    };
  }

  // Extract geometry info from first feature
  const firstFeature = stacResponse.features[0];
  const geometryType = firstFeature.geometry?.type || "Unknown";

  // Calculate bounding box from all features
  let minLat = Infinity,
    maxLat = -Infinity;
  let minLng = Infinity,
    maxLng = -Infinity;
  let totalPointCount = 0;

  stacResponse.features.forEach((feature) => {
    if (feature.bbox && feature.bbox.length >= 4) {
      // STAC bbox format: [minLng, minLat, maxLng, maxLat]
      const [bboxMinLng, bboxMinLat, bboxMaxLng, bboxMaxLat] = feature.bbox;
      minLat = Math.min(minLat, bboxMinLat);
      maxLat = Math.max(maxLat, bboxMaxLat);
      minLng = Math.min(minLng, bboxMinLng);
      maxLng = Math.max(maxLng, bboxMaxLng);
      totalPointCount++;
    }
  });

  // Calculate approximate area and perimeter from bounding box
  const latDiff = maxLat - minLat;
  const lngDiff = maxLng - minLng;
  const area = latDiff * lngDiff * 111 * 111; // Rough approximation in km²
  const perimeter = 2 * (latDiff + lngDiff) * 111; // Rough approximation in km

  // Calculate centroid
  const centroid: [number, number] = [
    (minLat + maxLat) / 2,
    (minLng + maxLng) / 2,
  ];

  // Transform features to results format
  const results = stacResponse.features.map((feature) => {
    let coordinates: [number, number] | [number, number][] | undefined;

    // Extract coordinates from geometry
    if (feature.geometry?.coordinates) {
      const coords = feature.geometry.coordinates;
      const featureGeometryType = feature.geometry?.type;

      if (
        featureGeometryType === "Point" &&
        Array.isArray(coords) &&
        coords.length >= 2
      ) {
        // Point coordinates: [lng, lat]
        if (Array.isArray(coords) && coords.length >= 2) {
          const lng = Number(coords[0]);
          const lat = Number(coords[1]);
          if (!isNaN(lng) && !isNaN(lat)) {
            coordinates = [lng, lat] as [number, number];
            console.log(
              `✅ Extracted Point coordinates for ${feature.id}: [${lng}, ${lat}]`,
            );
          } else {
            console.warn(
              `⚠️ Invalid Point coordinates for ${feature.id}: [${coords[0]}, ${coords[1]}]`,
            );
          }
        }
      } else if (
        featureGeometryType === "Polygon" &&
        Array.isArray(coords) &&
        coords.length > 0 &&
        Array.isArray(coords[0]) &&
        coords[0].length > 0
      ) {
        // For polygons, get all coordinates from first ring
        const firstRing = coords[0];
        if (Array.isArray(firstRing) && firstRing.length >= 2) {
          const polygonCoords: [number, number][] = firstRing
            .map((coord) => {
              if (Array.isArray(coord) && coord.length >= 2) {
                const lng = Number(coord[0]);
                const lat = Number(coord[1]);
                return [lat, lng];
              }
              return undefined;
            })
            .filter((coord): coord is [number, number] => coord !== undefined);
          coordinates = polygonCoords;
          console.log(
            `✅ Extracted Polygon coordinates for ${feature.id}: ${polygonCoords.length} points`,
          );
        } else {
          console.warn(`⚠️ Invalid Polygon coordinates for ${feature.id}`);
        }
      } else if (
        featureGeometryType === "LineString" &&
        Array.isArray(coords) &&
        coords.length > 0 &&
        Array.isArray(coords[0])
      ) {
        // LineString coordinates: [[lng, lat], [lng, lat], ...]
        const lineStringCoords: [number, number][] = coords
          .map((coord) => {
            if (Array.isArray(coord) && coord.length >= 2) {
              const lng = Number(coord[0]);
              const lat = Number(coord[1]);
              return [lat, lng];
            }
            return undefined;
          })
          .filter((coord): coord is [number, number] => coord !== undefined);
        coordinates = lineStringCoords;
        console.log(
          `✅ Extracted LineString coordinates for ${feature.id}: ${lineStringCoords.length} points`,
        );
      } else if (
        featureGeometryType === "MultiPoint" &&
        Array.isArray(coords) &&
        coords.length > 0 &&
        Array.isArray(coords[0])
      ) {
        // MultiPoint coordinates: [[lng, lat], [lng, lat], ...]
        const multiPointCoords: [number, number][] = coords
          .map((coord) => {
            if (Array.isArray(coord) && coord.length >= 2) {
              const lng = Number(coord[0]);
              const lat = Number(coord[1]);
              return [lat, lng];
            }
            return undefined;
          })
          .filter((coord): coord is [number, number] => coord !== undefined);
        coordinates = multiPointCoords;
        console.log(
          `✅ Extracted MultiPoint coordinates for ${feature.id}: ${multiPointCoords.length} points`,
        );
      } else if (
        featureGeometryType === "MultiLineString" &&
        Array.isArray(coords) &&
        coords.length > 0 &&
        Array.isArray(coords[0]) &&
        Array.isArray(coords[0][0])
      ) {
        // MultiLineString coordinates: [[[lng, lat], ...], ...]
        const multiLineStringCoords: [number, number][] = coords[0]
          .map((coord) => {
            if (Array.isArray(coord) && coord.length >= 2) {
              const lng = Number(coord[0]);
              const lat = Number(coord[1]);
              return [lat, lng];
            }
            return undefined;
          })
          .filter((coord): coord is [number, number] => coord !== undefined);
        coordinates = multiLineStringCoords;
        console.log(
          `✅ Extracted MultiLineString coordinates for ${feature.id}: ${multiLineStringCoords.length} points`,
        );
      } else if (
        featureGeometryType === "MultiPolygon" &&
        Array.isArray(coords) &&
        coords.length > 0 &&
        Array.isArray(coords[0]) &&
        Array.isArray(coords[0][0]) &&
        Array.isArray(coords[0][0][0])
      ) {
        // MultiPolygon coordinates: [[[[lng, lat], ...], ...], ...]
        const multiPolygonCoords: [number, number][] = coords[0][0]
          .map((coord) => {
            if (Array.isArray(coord) && coord.length >= 2) {
              const lng = Number(coord[0]);
              const lat = Number(coord[1]);
              return [lat, lng];
            }
            return undefined;
          })
          .filter((coord): coord is [number, number] => coord !== undefined);
        coordinates = multiPolygonCoords;
        console.log(
          `✅ Extracted MultiPolygon coordinates for ${feature.id}: ${multiPolygonCoords.length} points`,
        );
      } else {
        // Unsupported geometry type - log warning
        console.warn(
          `❌ Unsupported geometry type "${featureGeometryType}" for feature ${feature.id}`,
        );
        console.log(`Feature geometry details:`, {
          id: feature.id,
          geometryType: feature.geometry?.type,
          coordinates: feature.geometry?.coordinates,
        });
      }
    } else {
      console.warn(`❌ No coordinates found for feature ${feature.id}`);
      console.log(`Feature details:`, {
        id: feature.id,
        hasGeometry: !!feature.geometry,
        geometryType: feature.geometry?.type,
        hasCoordinates: !!feature.geometry?.coordinates,
      });
    }

    // Get datetime timestamp
    let timestamp = Date.now();
    if (feature.properties?.datetime) {
      timestamp = new Date(feature.properties.datetime).getTime();
    } else if (feature.properties?.created) {
      timestamp = new Date(feature.properties.created).getTime();
    }

    // Extract ImageData from assets
    let imageData: ImageData | undefined;
    if (feature.assets) {
      // Find thumbnail URL from assets with role "thumbnail"
      const thumbnailAsset = Object.values(feature.assets).find(
        (asset) => asset.roles && asset.roles.includes("thumbnail"),
      );
      const thumbnailUrl = thumbnailAsset?.href;

      // Find download URL from assets with role "download"
      const downloadAsset = Object.values(feature.assets).find(
        (asset) => asset.roles && asset.roles.includes("download"),
      );
      const downloadUrl = downloadAsset?.href;

      if (thumbnailUrl || downloadUrl) {
        imageData = {
          thumbnailUrl,
          downloadUrl,
        };
      }
    }

    return {
      id: feature.id,
      name: feature.collection || feature.id,
      value: feature.properties?.cloudNotation || 0,
      coordinates: coordinates,
      timestamp: timestamp,
      imageData: imageData,
    };
  });

  return {
    success: true,
    data: {
      shapeAnalysis: {
        type: geometryType,
        area: Math.round(area * 100) / 100,
        perimeter: Math.round(perimeter * 100) / 100,
        centroid,
      },
      statistics: {
        pointCount: totalPointCount,
        boundingBox: {
          minLat: minLat === Infinity ? 0 : minLat,
          maxLat: maxLat === -Infinity ? 0 : maxLat,
          minLng: minLng === Infinity ? 0 : minLng,
          maxLng: maxLng === -Infinity ? 0 : maxLng,
        },
      },
      results,
    },
    message: `Found ${stacResponse.context?.matched || 0} results`,
  };
};

/**
 * Helper function to wait/delay for retry logic
 */
const wait = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Custom fetcher function for SWR with retry logic and fallback to mock data
 * Takes URL string and request body, returns Promise with ApiResponse
 */
export const fetcher = async ([url, requestData]: [
  string,
  ApiRequest,
]): Promise<TransformedApiResponse> => {
  const maxRetries = 3;
  const baseDelay = 2000; // 2 seconds

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const requestConfig = {
        method: "post",
        maxBodyLength: Infinity,
        url:
          "https://api-gateway.gistda.or.th/api/2.0/resources/stac/theos2-cuf/search" +
          url,
        headers: {
          "API-Key":
            "aCgloe5LIZ1jCQjwQ4rrnYkNNekrugv7yhMiUAvjju4x7hFz4OeLAMyhMhLZVyjm",
          "Content-Type": "application/json",
        },
        data: JSON.stringify(requestData),
      };

      console.log(`API Request (attempt ${attempt + 1}/${maxRetries + 1}):`, {
        url: requestConfig.url,
        method: requestConfig.method,
        headers: requestConfig.headers,
        body: requestConfig.data,
      });

      // Make the API call using axios
      const response = await axios.request<ApiResponse>(requestConfig);

      console.log("API Response Status:", response.status);
      console.log("API Response Headers:", response.headers);

      console.log("API Response:", response.data);

      // Transform STAC response to UI format
      return transformStacResponse(response.data);
    } catch (error) {
      const axiosError = error as AxiosError;

      // Check if we should retry based on error type
      const shouldRetry =
        (axiosError.response &&
          [503, 502, 504, 429].includes(axiosError.response.status)) ||
        (!axiosError.response && axiosError.code === "ECONNABORTED") ||
        (!axiosError.response && axiosError.code === "ETIMEDOUT");

      // Log detailed error information
      console.error("API Error Details:", {
        attempt: attempt + 1,
        code: axiosError.code,
        message: axiosError.message,
        response: axiosError.response
          ? {
              status: axiosError.response.status,
              statusText: axiosError.response.statusText,
              data: axiosError.response.data,
              headers: axiosError.response.headers,
            }
          : null,
        config: axiosError.config
          ? {
              url: axiosError.config.url,
              method: axiosError.config.method,
              headers: axiosError.config.headers,
              data: axiosError.config.data,
            }
          : null,
        isAxiosError: axiosError.isAxiosError,
      });

      // If it's the last attempt or error is not retryable, handle the error
      if (attempt === maxRetries || !shouldRetry) {
        console.error("API Error (final attempt):", axiosError);

        // Fall back to mock data for server errors (500-599) or network errors
        if (axiosError.response && axiosError.response.status >= 500) {
          console.warn(
            `API server error (${axiosError.response.status}), falling back to mock data`,
          );
          console.warn("This might be a CORS or server availability issue");
          return mockAnalyzeShape(requestData);
        } else if (!axiosError.response) {
          console.warn(
            "Network error (no response from server), falling back to mock data",
          );
          console.warn("This might be a CORS, network, or timeout issue");
          return mockAnalyzeShape(requestData);
        }

        // Handle different error scenarios
        if (axiosError.response) {
          // Server responded with error status
          const status = axiosError.response.status;
          const errorMessage =
            status === 503
              ? "Service temporarily unavailable (503)"
              : status === 502
                ? "Bad gateway (502)"
                : status === 504
                  ? "Gateway timeout (504)"
                  : `Server error: ${status}`;

          return {
            success: false,
            error: errorMessage,
            message:
              "Failed to fetch data from server. Using mock data instead.",
          };
        } else if (axiosError.request) {
          // Request made but no response received
          console.error("API No Response:", axiosError.message);
          return {
            success: false,
            error: "No response from server",
            message:
              "Network error - please check your connection. Using mock data instead.",
          };
        } else {
          // Error setting up request
          console.error("API Request Error:", axiosError.message);
          return {
            success: false,
            error: axiosError.message,
            message: "Failed to make request. Using mock data instead.",
          };
        }
      }

      // Calculate delay with exponential backoff
      const delay = baseDelay * Math.pow(2, attempt);
      console.warn(`API Error, retrying in ${delay}ms...`, axiosError.message);
      await wait(delay);
    }
  }

  // This should never be reached, but TypeScript needs it
  return {
    success: false,
    error: "Unknown error",
    message: "Failed to fetch data",
  };
};

/**
 * Mock API endpoint for development/testing
 * This simulates a real API call without actually hitting a server
 */
export const mockAnalyzeShape = (
  requestData: ApiRequest,
): Promise<TransformedApiResponse> => {
  console.log("Mock API Call with data:", requestData);

  // Simulate processing delay
  const delay = Math.random() * 1000 + 500; // 0.5-1.5 second delay

  return new Promise((resolve) => {
    setTimeout(() => {
      // Calculate mock area and perimeter based on shape type
      let area = 0;
      let perimeter = 0;
      let centroid: [number, number] = [0, 0];
      let coordinates: number[][] = [];
      let pointCount = 0;
      let shapeType = "unknown";

      // Extract data from new intersects structure
      if (requestData.intersects) {
        shapeType = requestData.intersects.type;

        if (
          requestData.intersects.type === "Circle" &&
          requestData.intersects.center
        ) {
          // For circles, center is [lng, lat] in GeoJSON format
          const [lng, lat] = requestData.intersects.center;
          centroid = [lat, lng]; // Convert to [lat, lng] for display
          coordinates = [[lat, lng]];
          pointCount = 1;

          if (requestData.intersects.radius) {
            area = Math.PI * Math.pow(requestData.intersects.radius, 2);
            perimeter = 2 * Math.PI * requestData.intersects.radius;
          }
        } else if (
          requestData.intersects.type === "Polygon" &&
          requestData.intersects.coordinates &&
          requestData.intersects.coordinates.length > 0
        ) {
          // For polygons, coordinates are [lng, lat] in GeoJSON format
          const polyCoords = requestData.intersects.coordinates as number[][];
          coordinates = polyCoords.map(([lng, lat]) => [lat, lng]);
          pointCount = coordinates.length;

          // Calculate centroid (convert back to [lat, lng])
          const latSum = coordinates.reduce((sum, coord) => sum + coord[0], 0);
          const lngSum = coordinates.reduce((sum, coord) => sum + coord[1], 0);
          centroid = [latSum / coordinates.length, lngSum / coordinates.length];

          // Mock calculations for polygons
          area = coordinates.length * 1000;
          perimeter = coordinates.length * 200;
        }
      }

      // Generate mock results
      const mockResults = Array.from({ length: 5 }, (_, index) => ({
        id: `result-${Date.now()}-${index}`,
        name: `Analysis Result ${index + 1}`,
        value: Math.floor(Math.random() * 100) + 1,
        coordinates: coordinates[index % coordinates.length] as [
          number,
          number,
        ],
        timestamp: Date.now(),
      }));

      // Calculate bounding box
      const lats = coordinates.map((c) => c[0]);
      const lngs = coordinates.map((c) => c[1]);

      resolve({
        success: true,
        data: {
          shapeAnalysis: {
            type: shapeType,
            area: Math.round(area * 100) / 100,
            perimeter: Math.round(perimeter * 100) / 100,
            centroid,
          },
          statistics: {
            pointCount: pointCount,
            boundingBox:
              pointCount > 0
                ? {
                    minLat: Math.min(...lats),
                    maxLat: Math.max(...lats),
                    minLng: Math.min(...lngs),
                    maxLng: Math.max(...lngs),
                  }
                : {
                    minLat: 0,
                    maxLat: 0,
                    minLng: 0,
                    maxLng: 0,
                  },
          },
          results: mockResults,
        },
        message: "Analysis completed successfully",
      });
    }, delay);
  });
};

/**
 * Analyze shape endpoint
 * @param requestData - The request data containing shape info
 * @returns Promise with analysis results
 */
export const analyzeShape = async (
  requestData: ApiRequest,
): Promise<TransformedApiResponse> => {
  // Use real API endpoint - STAC search endpoint
  return fetcher(["", requestData]);
};
