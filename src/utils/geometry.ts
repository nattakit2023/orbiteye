/**
 * Geometry utility functions for map-related calculations
 */

/**
 * Calculates the area of a polygon using the Shoelace formula
 * @param points - Array of [latitude, longitude] coordinate pairs
 * @returns Area in square meters
 */
export const calculatePolygonArea = (points: number[][]): number => {
  if (points.length < 3) return 0;

  // Calculate average latitude for conversion
  const avgLat = points.reduce((sum, point) => sum + point[0], 0) / points.length;
  const latRad = (avgLat * Math.PI) / 180;

  // Conversion factors at the average latitude
  const latToMeters = 111111; // meters per degree of latitude (approximate)
  const lngToMeters = 111111 * Math.cos(latRad); // meters per degree of longitude (varies by latitude)

  // Apply Shoelace formula (in degrees)
  let areaDegrees2 = 0;
  const n = points.length;

  for (let i = 0; i < n; i++) {
    const currentPoint = points[i];
    const nextPoint = points[(i + 1) % n];
    
    areaDegrees2 += currentPoint[1] * nextPoint[0];
    areaDegrees2 -= nextPoint[1] * currentPoint[0];
  }

  areaDegrees2 = Math.abs(areaDegrees2) / 2;

  // Convert to square meters
  const areaMeters2 = areaDegrees2 * latToMeters * lngToMeters;

  return areaMeters2;
};

/**
 * Calculates the perimeter of a polygon
 * @param points - Array of [latitude, longitude] coordinate pairs
 * @returns Perimeter in meters (using Haversine formula approximation)
 */
export const calculatePolygonPerimeter = (points: number[][]): number => {
  if (points.length < 2) return 0;

  let perimeter = 0;
  const n = points.length;

  for (let i = 0; i < n; i++) {
    const currentPoint = points[i];
    const nextPoint = points[(i + 1) % n];
    perimeter += calculateDistance(currentPoint, nextPoint);
  }

  return perimeter;
};

/**
 * Calculates the distance between two points using the Haversine formula
 * @param point1 - First point [latitude, longitude]
 * @param point2 - Second point [latitude, longitude]
 * @returns Distance in meters
 */
export const calculateDistance = (
  point1: number[],
  point2: number[]
): number => {
  const R = 6371000; // Earth's radius in meters
  const lat1Rad = (point1[0] * Math.PI) / 180;
  const lat2Rad = (point2[0] * Math.PI) / 180;
  const deltaLatRad = ((point2[0] - point1[0]) * Math.PI) / 180;
  const deltaLngRad = ((point2[1] - point1[1]) * Math.PI) / 180;

  const a =
    Math.sin(deltaLatRad / 2) * Math.sin(deltaLatRad / 2) +
    Math.cos(lat1Rad) *
      Math.cos(lat2Rad) *
      Math.sin(deltaLngRad / 2) *
      Math.sin(deltaLngRad / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

/**
 * Calculates the centroid of a polygon
 * @param points - Array of [latitude, longitude] coordinate pairs
 * @returns Centroid point [latitude, longitude]
 */
export const calculateCentroid = (points: number[][]): number[] => {
  if (points.length === 0) return [0, 0];
  if (points.length === 1) return points[0];

  const sumLat = points.reduce((sum, point) => sum + point[0], 0);
  const sumLng = points.reduce((sum, point) => sum + point[1], 0);

  return [sumLat / points.length, sumLng / points.length];
};

/**
 * Calculates the bounding box of a polygon or set of points
 * @param points - Array of [latitude, longitude] coordinate pairs
 * @returns Bounding box with min and max coordinates
 */
export const calculateBoundingBox = (points: number[][]) => {
  if (points.length === 0) {
    return {
      minLat: 0,
      maxLat: 0,
      minLng: 0,
      maxLng: 0,
    };
  }

  const lats = points.map((p) => p[0]);
  const lngs = points.map((p) => p[1]);

  return {
    minLat: Math.min(...lats),
    maxLat: Math.max(...lats),
    minLng: Math.min(...lngs),
    maxLng: Math.max(...lngs),
  };
};

/**
 * Converts degrees to radians
 * @param degrees - Angle in degrees
 * @returns Angle in radians
 */
export const degreesToRadians = (degrees: number): number => {
  return (degrees * Math.PI) / 180;
};

/**
 * Converts radians to degrees
 * @param radians - Angle in radians
 * @returns Angle in degrees
 */
export const radiansToDegrees = (radians: number): number => {
  return (radians * 180) / Math.PI;
};

/**
 * Formats a number with appropriate units
 * @param value - Numeric value
 * @param units - Units string (e.g., 'm', 'm²', 'km')
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted string with units
 */
export const formatWithUnits = (
  value: number,
  units: string,
  decimals: number = 2
): string => {
  return `${value.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  })} ${units}`;
};