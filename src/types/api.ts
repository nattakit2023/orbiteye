// API Request Types
// Geometry Types
export interface GeoJSONGeometry {
  type: "Point" | "LineString" | "Polygon" | "MultiPoint" | "MultiLineString" | "MultiPolygon";
  coordinates: number[][] | number[][][] | number[][][][];
}

export interface IntersectsGeometry {
  type: "Polygon" | "Circle";
  coordinates?: number[][] | number[][][];
  center?: number[];
  radius?: number;
}

// Filter Types
export interface PropertyReference {
  property: string;
}

export interface FilterOperation {
  op: "and" | "or" | "=" | "!=" | "<" | "<=" | ">" | ">=";
  args: Array<FilterOperation | PropertyReference | number | string>;
}

// API Request Types
export interface ApiRequest {
  intersects: IntersectsGeometry;
  datetime?: string;
  filter?: FilterOperation;
  sortby?: string;
  offset?: number;
  limit?: number;
}

//This Request Type
// {
//     "intersects": {
//         "type": "Polygon",
//         "coordinates": [
//             [
//                 [
//                     102.45590015508692,
//                     16.089334833780047
//                 ],
//                 [
//                     103.51641932064055,
//                     16.089334833780047
//                 ],
//                 [
//                     103.51641932064055,
//                     17.00068389749823
//                 ],
//                 [
//                     102.45590015508692,
//                     17.00068389749823
//                 ],
//                 [
//                     102.45590015508692,
//                     16.089334833780047
//                 ]
//             ]
//         ]
//     },
//     "datetime": "2024-01-01T00:00:00.000Z/..",
//     "filter": {
//         "op": "and",
//         "args": [
//             {
//                 "op": "<=",
//                 "args": [
//                     {
//                         "property": "cloudNotation"
//                     },
//                     100
//                 ]
//             },
//             {
//                 "op": "<",
//                 "args": [
//                     {
//                         "property": "globalIncidence"
//                     },
//                     50
//                 ]
//             }
//         ]
//     },
//     "sortby": "-id",
//     "offset": 0,
//     "limit": 100
// }


// API Response Types - STAC Format
export interface ApiResponse {
  type: "FeatureCollection";
  context: ResponseContext;
  features: Feature[];
  links: Link[];
}

export interface ResponseContext {
  limit: number;
  matched: number;
  page: number;
  returned: number;
}

export interface Feature {
  type: "Feature";
  id: string;
  collection: string;
  geometry: GeoJSONGeometry;
  bbox: number[];
  properties: FeatureProperties;
  assets: Record<string, Asset>;
  links: Link[];
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  parents: string[];
  stac: string;
  stac_version: string;
}

export interface FeatureProperties {
  alongTrackIncidence?: number;
  cloudNotation?: number;
  cloudReliabilityIndex?: number;
  colSize?: number;
  created?: string;
  datetime?: string;
  globalIncidence?: number;
  maximumShift?: number;
  orientation?: number;
  orthoTrackIncidence?: number;
  psiX?: number;
  psiXy?: number;
  psiY?: number;
  qualityNotation?: number;
  rotate?: boolean;
  rowSize?: number;
  sceneId?: string;
  sunAzimuth?: number;
  sunElevation?: number;
  utcAcquisitionRangeEnd?: string;
  utcAcquisitionRangeStart?: string;
  utcTime?: string;
  [key: string]: unknown;
}

export interface Asset {
  href: string;
  type: string;
  roles: string[];
  title: string;
}

export interface Link {
  href: string;
  rel: string;
  type?: string;
}

// SWR Fetcher Types
export type FetcherArgs = [string, ApiRequest];

// Result Item for Right Sidebar Display
export interface ResultItem {
  id: string;
  collection: string;
  datetime?: string;
  properties: FeatureProperties;
  bbox: number[];
  geometry: GeoJSONGeometry;
  assets: Record<string, Asset>;
}

// This Response
// {
//     "context": {
//         "limit": 100,
//         "matched": 135,
//         "page": 1,
//         "returned": 100
//     },
//     "features": [
//   {
//     "assets": {
//       "S3:directory": {
//         "href": "https://api-gateway.gistda.or.th/api/2.0/resources/stac/theos2-cuf/collections/SC_T2V_202510210329531_VXB_E103N17_001128/items/SC_T2V_202510210329531_VXB_E103N17_001128/download?api_key=aCgloe5LIZ1jCQjwQ4rrnYkNNekrugv7yhMiUAvjju4x7hFz4OeLAMyhMhLZVyjm&asset=S3:directory",
//         "roles": [
//           "download"
//         ],
//         "title": "SC_T2V_202510210329531_VXB_E103N17_001128",
//         "type": "application/zip"
//       },
//       "download": {
//         "href": "https://api-gateway.gistda.or.th/api/2.0/resources/b8f7ad0cc0fd7a9f0afb4a7e7c15d0b216adb139b61ca22aaebe952b98fc3e5b?api_key=aCgloe5LIZ1jCQjwQ4rrnYkNNekrugv7yhMiUAvjju4x7hFz4OeLAMyhMhLZVyjm",
//         "roles": [
//           "download"
//         ],
//         "title": "Download data",
//         "type": "application/zip"
//       },
//       "thumbnail": {
//         "href": "https://api-gateway.gistda.or.th/api/2.0/resources/b8f7ad0cc0fd7a9f0afb4a7e7c15d0b216adb139b61ca22aaebe952b98fc3e5b?api_key=aCgloe5LIZ1jCQjwQ4rrnYkNNekrugv7yhMiUAvjju4x7hFz4OeLAMyhMhLZVyjm",
//         "roles": [
//           "thumbnail"
//         ],
//         "title": "Thumbnail",
//         "type": "image/jpeg"
//       }
//     },
//     "bbox": [
//       103.363365,
//       16.518476,
//       103.481638,
//       16.626039
//     ],
//     "collection": "SC_T2V_202510210329531_VXB_E103N17_001128",
//     "created_at": "2025-10-21T18:00:40.746Z",
//     "created_by": "62fe8bd5afc1d2d764d061b2",
//     "geometry": {
//       "coordinates": [
//         [
//           [
//             103.382242,
//             16.626039
//           ],
//           [
//             103.481638,
//             16.604664
//           ],
//           [
//             103.462773,
//             16.518476
//           ],
//           [
//             103.363365,
//             16.539782
//           ],
//           [
//             103.382242,
//             16.626039
//           ]
//         ]
//       ],
//       "type": "Polygon"
//     },
//     "id": "SC_T2V_202510210329531_VXB_E103N17_001128",
//     "links": [
//       {
//         "href": "https://api-gateway.gistda.or.th/api/2.0/resources/stac/theos2-cuf/collections/SC_T2V_202510210329531_VXB_E103N17_001128/items/SC_T2V_202510210329531_VXB_E103N17_001128?api_key=aCgloe5LIZ1jCQjwQ4rrnYkNNekrugv7yhMiUAvjju4x7hFz4OeLAMyhMhLZVyjm",
//         "rel": "self",
//         "type": "application/geo+json"
//       },
//       {
//         "href": "https://api-gateway.gistda.or.th/api/2.0/resources/stac/theos2-cuf?api_key=aCgloe5LIZ1jCQjwQ4rrnYkNNekrugv7yhMiUAvjju4x7hFz4OeLAMyhMhLZVyjm",
//         "rel": "root",
//         "type": "application/json"
//       },
//       {
//         "href": "https://api-gateway.gistda.or.th/api/2.0/resources/stac/theos2-cuf/collections/SC_T2V_202510210329531_VXB_E103N17_001128?api_key=aCgloe5LIZ1jCQjwQ4rrnYkNNekrugv7yhMiUAvjju4x7hFz4OeLAMyhMhLZVyjm",
//         "rel": "parent",
//         "type": "application/json"
//       },
//       {
//         "href": "https://api-gateway.gistda.or.th/api/2.0/resources/stac/theos2-cuf/collections/SC_T2V_202510210329531_VXB_E103N17_001128?api_key=aCgloe5LIZ1jCQjwQ4rrnYkNNekrugv7yhMiUAvjju4x7hFz4OeLAMyhMhLZVyjm",
//         "rel": "collection",
//         "type": "application/json"
//       }
//     ],
//     "parents": [],
//     "properties": {
//       "alongTrackIncidence": 15.39,
//       "cloudNotation": 1,
//       "cloudReliabilityIndex": 18.5,
//       "colSize": 17,
//       "created": "2025-10-21T18:00:40:598173Z",
//       "datetime": "2025-10-21T03:29:53Z",
//       "globalIncidence": 15.58,
//       "maximumShift": -1,
//       "orientation": 191.95,
//       "orthoTrackIncidence": 2.68,
//       "psiX": -2.27,
//       "psiXy": 14.06,
//       "psiY": -13.89,
//       "qualityNotation": 2.15,
//       "rotate": false,
//       "rowSize": 17.28,
//       "sceneId": "SC_T2V_202510210329531_VXB_E103N17_001128",
//       "sunAzimuth": 141.72,
//       "sunElevation": 56.54,
//       "utcAcquisitionRangeEnd": "2025-10-21T03:29:54.639Z",
//       "utcAcquisitionRangeStart": "2025-10-21T03:29:53.052Z",
//       "utcTime": "2025-10-21T03:29:53.846Z"
//     },
//     "stac": "THEOS2_CUF",
//     "stac_version": "1.0.0",
//     "type": "Feature",
//     "updated_at": "2025-10-21T18:00:40.746Z",
//     "updated_by": "62fe8bd5afc1d2d764d061b2"
//   },
//   "links": [
//     {
//       "href": "https://api-gateway.gistda.or.th/api/2.0/resources/stac/theos2-cuf/search?api_key=aCgloe5LIZ1jCQjwQ4rrnYkNNekrugv7yhMiUAvjju4x7hFz4OeLAMyhMhLZVyjm",
//       "rel": "self",
//       "type": "application/json"
//     },
//     {
//       "href": "https://api-gateway.gistda.or.th/api/2.0/resources/stac/theos2-cuf?api_key=aCgloe5LIZ1jCQjwQ4rrnYkNNekrugv7yhMiUAvjju4x7hFz4OeLAMyhMhLZVyjm",
//       "rel": "root",
//       "type": "application/json"
//     },
//     {
//       "href": "https://api-gateway.gistda.or.th/api/2.0/resources/stac/theos2-cuf/search?api_key=aCgloe5LIZ1jCQjwQ4rrnYkNNekrugv7yhMiUAvjju4x7hFz4OeLAMyhMhLZVyjm&limit=100&offset=100",
//       "rel": "next"
//     }
//   ],
//   "type": "FeatureCollection"
//             }
