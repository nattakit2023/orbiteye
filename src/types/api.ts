export interface STACSearchRequest {
	stacType?: string[]; // API type(s): "theos2", "sentinel", "landsat"
	intersects?: {
		type: string;
		coordinates?: number[][];
		center?: [number, number];
		radius?: number;
	};
	datetime?: string;
	limit?: number;
}

export interface STACSearchResponse {
  type: string;
  features: STACFeature[];
  context?: {
    matched?: number;
    returned?: number;
  };
}

export interface STACFeature {
  id: string;
  type: string;
  collection?: string;
  geometry?: {
    type: string;
    coordinates: unknown;
  };
  bbox?: [number, number, number, number];
  properties?: {
    datetime?: string;
    created?: string;
    cloud_cover?: number;
    cloudNotation?: number;
    [key: string]: unknown;
  };
  assets?: Record<string, STACAsset>;
}

export interface STACAsset {
  href?: string;
  roles?: string[];
  title?: string;
  description?: string;
}

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
  coordinates?: [number, number] | [number, number][];
  timestamp: number;
  imageData?: ImageAsset;
}

export interface TransformedApiResponse {
  success: boolean;
  data?: {
    shapeAnalysis: ShapeAnalysis;
    statistics: FeatureStatistics;
    results?: AnalysisResult[];
  };
  error?: string;
  message?: string;
}

export interface ApiRequest {
  [key: string]: unknown;
}

export interface ImageData {
  thumbnailUrl?: string;
  downloadUrl?: string;
  [key: string]: unknown;
}

export interface ApiResponse {
  success: boolean;
  data?: {
    features?: Array<{
      id?: string;
      type?: string;
      geometry?: {
        type?: string;
        coordinates?: unknown;
      };
      properties?: {
        [key: string]: unknown;
      };
    }>;
    [key: string]: unknown;
  };
  error?: string;
  message?: string;
}