import axios, { AxiosError } from "axios";
import type { ApiRequest, ApiResponse } from "@/types/api";

// API Base URL - Change this to your actual API endpoint
const API_BASE_URL =
  "https://api-gateway.gistda.or.th/api/2.0/resources/stac/theos2-cuf/search";

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
      coordinates?: [number, number];
      timestamp: number;
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
    let coordinates: [number, number] | undefined;

    // Extract coordinates from geometry
    if (feature.geometry?.coordinates) {
      const coords = feature.geometry.coordinates;
      if (
        geometryType === "Point" &&
        Array.isArray(coords) &&
        coords.length >= 2
      ) {
        // Point coordinates: [lng, lat]
        coordinates = [
          coords[0] as unknown as number,
          coords[1] as unknown as number,
        ] as [number, number];
      } else if (
        geometryType === "Polygon" &&
        Array.isArray(coords) &&
        coords.length > 0 &&
        Array.isArray(coords[0]) &&
        coords[0].length > 0
      ) {
        // For polygons, get first coordinate from first ring
        const firstRing = coords[0];
        if (Array.isArray(firstRing) && firstRing.length >= 2) {
          coordinates = [
            firstRing[0] as unknown as number,
            firstRing[1] as unknown as number,
          ] as [number, number];
        }
      }
    }

    // Get datetime timestamp
    let timestamp = Date.now();
    if (feature.properties?.datetime) {
      timestamp = new Date(feature.properties.datetime).getTime();
    } else if (feature.properties?.created) {
      timestamp = new Date(feature.properties.created).getTime();
    }

    return {
      id: feature.id,
      name: feature.collection || feature.id,
      value: feature.properties?.cloudNotation || 0,
      coordinates: coordinates,
      timestamp: timestamp,
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


    let data = JSON.stringify({
      intersects: {
        type: "Polygon",
        coordinates: [
          [
            [102.45590015508692, 16.089334833780047],
            [103.51641932064055, 16.089334833780047],
            [103.51641932064055, 17.00068389749823],
            [102.45590015508692, 17.00068389749823],
            [102.45590015508692, 16.089334833780047],
          ],
        ],
      },
      datetime: "../2026-02-01T00:00:00.000Z",
      filter: {
        op: "and",
        args: [
          {
            op: "<=",
            args: [
              {
                property: "cloudNotation",
              },
              100,
            ],
          },
          {
            op: "<",
            args: [
              {
                property: "globalIncidence",
              },
              50,
            ],
          },
        ],
      },
      sortby: "-id",
      offset: 0,
      limit: 100,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://api-gateway.gistda.or.th/api/2.0/resources/stac/theos2-cuf/search",
      headers: {
        "API-Key":
          "aCgloe5LIZ1jCQjwQ4rrnYkNNekrugv7yhMiUAvjju4x7hFz4OeLAMyhMhLZVyjm",
        "Content-Type": "application/json",
      },
      data: data,
    };
    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const requestConfig = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://api-gateway.gistda.or.th/api/2.0/resources/stac/theos2-cuf/search",
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

      // // Check if we should retry based on error type
      // const shouldRetry =
      //   (axiosError.response && [503, 502, 504, 429].includes(axiosError.response.status)) ||
      //   (!axiosError.response && axiosError.code === "ECONNABORTED") ||
      //   (!axiosError.response && axiosError.code === "ETIMEDOUT");

      // // Log detailed error information
      // console.error("API Error Details:", {
      //   attempt: attempt + 1,
      //   code: axiosError.code,
      //   message: axiosError.message,
      //   response: axiosError.response ? {
      //     status: axiosError.response.status,
      //     statusText: axiosError.response.statusText,
      //     data: axiosError.response.data,
      //     headers: axiosError.response.headers,
      //   } : null,
      //   config: axiosError.config ? {
      //     url: axiosError.config.url,
      //     method: axiosError.config.method,
      //     headers: axiosError.config.headers,
      //     data: axiosError.config.data,
      //   } : null,
      //   isAxiosError: axiosError.isAxiosError,
      // });

      // // If it's the last attempt or error is not retryable, handle the error
      // if (attempt === maxRetries || !shouldRetry) {
      //   console.error("API Error (final attempt):", axiosError);

      //   // Fall back to mock data for server errors (500-599) or network errors
      //   if (axiosError.response && axiosError.response.status >= 500) {
      //     console.warn(`API server error (${axiosError.response.status}), falling back to mock data`);
      //     console.warn("This might be a CORS or server availability issue");
      //     return mockAnalyzeShape(requestData);
      //   } else if (!axiosError.response) {
      //     console.warn("Network error (no response from server), falling back to mock data");
      //     console.warn("This might be a CORS, network, or timeout issue");
      //     return mockAnalyzeShape(requestData);
      //   }

      //   // Handle different error scenarios
      //   if (axiosError.response) {
      //     // Server responded with error status
      //     const status = axiosError.response.status;
      //     const errorMessage = status === 503
      //       ? "Service temporarily unavailable (503)"
      //       : status === 502
      //       ? "Bad gateway (502)"
      //       : status === 504
      //       ? "Gateway timeout (504)"
      //       : `Server error: ${status}`;

      //     return {
      //       success: false,
      //       error: errorMessage,
      //       message: "Failed to fetch data from server. Using mock data instead.",
      //     };
      //   } else if (axiosError.request) {
      //     // Request made but no response received
      //     console.error("API No Response:", axiosError.message);
      //     return {
      //       success: false,
      //       error: "No response from server",
      //       message: "Network error - please check your connection. Using mock data instead.",
      //     };
      //   } else {
      //     // Error setting up request
      //     console.error("API Request Error:", axiosError.message);
      //     return {
      //       success: false,
      //       error: axiosError.message,
      //       message: "Failed to make request. Using mock data instead.",
      //     };
      //   }
      // }

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
