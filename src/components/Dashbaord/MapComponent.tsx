import React, { useEffect, useRef, useState } from "react";
import { MapContainer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Card from "antd/es/card";
import Typography from "antd/es/typography";
import { calculatePolygonArea } from "../../utils/geometry";
import ImageSliderOverlay from "./ImageSliderOverlay";

// Fix default marker icon issue with react-leaflet
delete (L.Icon.Default.prototype as { _getIconUrl?: () => void })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Feature Layer Component - Renders API response features on map
interface FeatureLayerProps {
  results: any[];
  hoveredResult: any | null;
  clickedResult: any | null;
}

function FeatureLayer({
  results,
  hoveredResult,
  clickedResult,
}: FeatureLayerProps) {
  const map = useMap();
  const featureLayersRef = useRef<(L.Polygon | L.CircleMarker | L.ImageOverlay)[]>([]);
  const imageOverlayRef = useRef<L.ImageOverlay | null>(null);


  // Render features on map
  useEffect(() => {
    // Clear existing feature layers
    featureLayersRef.current.forEach((layer) => {
      map.removeLayer(layer);
    });
    featureLayersRef.current = [];

    // Clear image overlay if exists
    if (imageOverlayRef.current) {
      map.removeLayer(imageOverlayRef.current);
      imageOverlayRef.current = null;
    }

    // Determine which result(s) to render - only show when hovered or clicked
    const activeResult = clickedResult || hoveredResult;
    let resultsToRender = [] as any[];

    if (activeResult) {
      // Show only the hovered/clicked feature
      resultsToRender = [activeResult];
    } else {
      // Hide all features when nothing is active
      resultsToRender = [];
    }

    // Render selected results
    resultsToRender.forEach((result) => {
      if (!result.coordinates) return;


      // Hover takes precedence over click
      const isHovered = hoveredResult?.id === result.id;
      const isClicked = clickedResult?.id === result.id && !isHovered;

      // Check if coordinates is an array (polygon/linestring), bbox, or single point
      const isCoordinateArray = Array.isArray(result.coordinates[0]);


      if (isCoordinateArray) {
        // Polygon/LineString - render as polygon
        const polygon = L.polygon(result.coordinates as [number, number][], {
          fillColor: isHovered
            ? "rgba(255, 77, 79, 0.3)"
            : "rgba(24, 144, 255, 0.2)",
          color: isHovered ? "#ff4d4f" : "#1890ff",
          weight: isHovered ? 3 : 2,
          opacity: 1,
          fillOpacity: isHovered ? 0.4 : 0.2,
        }).addTo(map);

        featureLayersRef.current.push(polygon);
      } else if (result.coordinates.length === 4) {
        // Bbox [minX, minY, maxX, maxY] - render as rectangle
        // minX=minLng, minY=minLat, maxX=maxLng, maxY=maxLat
        const [minX, minY, maxX, maxY] = result.coordinates as [number, number, number, number];
        const bboxCoords: [number, number][] = [
          [minY, minX], // bottom-left [lat, lng]
          [minY, maxX], // bottom-right
          [maxY, maxX], // top-right
          [maxY, minX], // top-left
          [minY, minX], // close polygon
        ];

        // If clicked (not just hovered) and has image, show image overlay
        if (isClicked && result.imageData?.thumbnailUrl) {
          const imageOverlay = L.imageOverlay(result.imageData.thumbnailUrl, [[minY, minX], [maxY, maxX]], {
            opacity: 0.9,
            interactive: true,
          }).addTo(map);
          imageOverlayRef.current = imageOverlay;
          featureLayersRef.current.push(imageOverlay);
        }

        // Show bbox rectangle outline
        const bboxPolygon = L.polygon(bboxCoords, {
          fillColor: isHovered
            ? "rgba(255, 77, 79, 0.3)"
            : "rgba(24, 144, 255, 0.2)",
          color: isHovered ? "#ff4d4f" : "#1890ff",
          weight: isHovered ? 3 : 2,
          opacity: 1,
          fillOpacity: isHovered ? 0.4 : 0.2,
        }).addTo(map);


        featureLayersRef.current.push(bboxPolygon);
      } else {
        // Single point - render as circle marker
        const [lat, lng] = result.coordinates as [number, number];
        const marker = L.circleMarker([lat, lng], {
          radius: 8,
          color: isHovered ? "#ff4d4f" : isClicked ? "#cc0000" : "#0050b3",
          weight: isHovered ? 3 : 2,
          opacity: 1,
          fillOpacity: isHovered ? 0.6 : 0.4,
        }).addTo(map);

        featureLayersRef.current.push(marker);
      }
    });

    return () => {
      // Cleanup on unmount or when result changes
      featureLayersRef.current.forEach((layer) => {
        map.removeLayer(layer);
      });
      featureLayersRef.current = [];
      if (imageOverlayRef.current) {
        map.removeLayer(imageOverlayRef.current);
        imageOverlayRef.current = null;
      }
    };
  }, [results, hoveredResult, clickedResult, map]);

  return null; // This component renders to map directly
}

// Feature Coordinates Display Component - Shows coordinates in bottom-center popup
interface FeatureCoordinatesDisplayProps {
  hoveredResult: any | null;
  clickedResult: any | null;
}

function FeatureCoordinatesDisplay({
  hoveredResult,
  clickedResult,
}: FeatureCoordinatesDisplayProps) {
  const activeResult = clickedResult || hoveredResult;

  if (
    !activeResult ||
    !activeResult.coordinates ||
    activeResult.coordinates.length === 0
  ) {
    return null;
  }

  // Check if coordinates is an array (polygon), bbox, or single point
  const isCoordinateArray = Array.isArray(activeResult.coordinates[0]);

  // Format coordinates like drawn shapes
  let coordsStr = "";
  if (isCoordinateArray) {
    // Polygon - array of [lat, lng] pairs
    coordsStr = (activeResult.coordinates as [number, number][])
      .map(
        (coord: [number, number]) =>
          `${coord[0].toFixed(4)},${coord[1].toFixed(4)}`,
      )
      .join(" | ");
  } else if (activeResult.coordinates.length === 4) {
    // Bbox [minX, minY, maxX, maxY] - show as bounding box
    const [minX, minY, maxX, maxY] = activeResult.coordinates as [number, number, number, number];
    coordsStr = `Bbox: ${minY.toFixed(4)},${minX.toFixed(4)} → ${maxY.toFixed(4)},${maxX.toFixed(4)}`;
  } else {
    // Single point
    const [lat, lng] = activeResult.coordinates as [number, number];
    coordsStr = `${lat.toFixed(6)},${lng.toFixed(6)}`;
  }

  const displayCoords =
    coordsStr.length > 40 ? coordsStr.substring(0, 40) + "..." : coordsStr;

  return (
    <div
      style={{
        position: "absolute",
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1000,
        backgroundColor: "rgba(255, 77, 79, 0.95)",
        backdropFilter: "blur(10px)",
        border: "1px solid #ff4d4f",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(255, 77, 79, 0.3)",
        padding: "12px 16px",
        display: "flex",
        gap: "12px",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <div
        style={{
          fontSize: "12px",
          color: "#ffffff",
          fontWeight: 600,
          marginBottom: "4px",
        }}
      >
        {activeResult.name}
      </div>
      <div
        style={{
          padding: "8px 12px",
          backgroundColor: "rgba(13, 20, 25, 0.8)",
          borderRadius: "4px",
          fontSize: "11px",
          color: "#ff4d4f",
          border: "2px solid #ff4d4f",
          maxWidth: "300px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          fontFamily: "monospace",
        }}
      >
        {displayCoords}
      </div>
    </div>
  );
}

// Drawing Handler Component
interface DrawingHandlerProps {
  drawingMode: "circle" | "polygon" | "rectangle" | null;
}

function DrawingHandler({ drawingMode }: DrawingHandlerProps) {
  const map = useMap();
  const isDrawingRef = useRef(false);
  const pointsRef = useRef<[number, number][]>([]);
  const shapeRef = useRef<
    L.Circle | L.Polygon | L.Rectangle | L.CircleMarker | null
  >(null);
  const tempPolylineRef = useRef<L.Polyline | null>(null);
  const shapeCompletedRef = useRef(false); // Track if shape was completed
  const vertexMarkersRef = useRef<L.CircleMarker[]>([]); // Track polygon vertex markers
  const tempCircleRef = useRef<L.Circle | null>(null); // Track temporary circle during drawing
  const tempRectangleRef = useRef<L.Rectangle | null>(null); // Track temporary rectangle during drawing
  const firstPointMarkerRef = useRef<L.CircleMarker | null>(null); // Track marker for first point indicator

  useEffect(() => {
    if (!drawingMode) {
      // Only clear if we're in the middle of drawing, not after completion
      if (isDrawingRef.current) {
        isDrawingRef.current = false;
        pointsRef.current = [];
        // Only remove shapes that weren't completed
        if (shapeRef.current && !shapeCompletedRef.current) {
          map.removeLayer(shapeRef.current);
          shapeRef.current = null;
        }
        // Remove temporary polyline
        if (tempPolylineRef.current) {
          map.removeLayer(tempPolylineRef.current);
          tempPolylineRef.current = null;
        }
        // Remove vertex markers if polygon drawing was interrupted
        vertexMarkersRef.current.forEach((marker) => {
          map.removeLayer(marker);
        });
        vertexMarkersRef.current = [];
        // Remove first point indicator
        if (firstPointMarkerRef.current) {
          map.removeLayer(firstPointMarkerRef.current);
          firstPointMarkerRef.current = null;
        }
      }
      map.dragging.enable();
      map.off("click");
      map.off("mousemove");
      map.off("dblclick");
      return;
    }

    isDrawingRef.current = true;
    pointsRef.current = [];
    shapeCompletedRef.current = false; // Reset completion flag when starting new drawing
    vertexMarkersRef.current = []; // Reset vertex markers

    const handleMapClick = (e: L.LeafletMouseEvent) => {
      const point: [number, number] = [e.latlng.lat, e.latlng.lng];
      pointsRef.current.push(point);

      if (drawingMode === "circle") {
        // Circle: first click is center, second click defines radius
        if (pointsRef.current.length === 1) {
          // Draw temporary center marker
          if (shapeRef.current && !shapeCompletedRef.current)
            map.removeLayer(shapeRef.current);
          shapeRef.current = L.circleMarker(point, {
            radius: 5,
            fillColor: "#1890ff",
            color: "#0050b3",
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8,
          }).addTo(map);
        } else if (pointsRef.current.length === 2) {
          // Calculate radius
          const radius = map.distance(
            pointsRef.current[0],
            pointsRef.current[1],
          );

          // Remove temporary preview circle
          if (tempCircleRef.current) {
            map.removeLayer(tempCircleRef.current);
            tempCircleRef.current = null;
          }

          if (shapeRef.current && !shapeCompletedRef.current)
            map.removeLayer(shapeRef.current);
          shapeRef.current = L.circle(pointsRef.current[0], {
            radius: radius,
            fillColor: "#1890ff",
            color: "#0050b3",
            weight: 2,
            opacity: 1,
            fillOpacity: 0.3,
          }).addTo(map);

          // Calculate area for circle
          const circleArea = Math.PI * Math.pow(radius, 2);

          // Mark shape as completed so it won't be removed in cleanup
          shapeCompletedRef.current = true;

          // Dispatch completed event
          window.dispatchEvent(
            new CustomEvent("shapeCompleted", {
              detail: {
                type: "circle",
                coordinates: pointsRef.current,
                radius: radius,
                area: circleArea,
                timestamp: Date.now(),
              },
            }),
          );
          // Clear drawing info
          window.dispatchEvent(
            new CustomEvent("drawingInfo", {
              detail: {
                type: null,
                metrics: null,
              },
            }),
          );
          isDrawingRef.current = false;
          pointsRef.current = [];
          map.dragging.enable();
          map.off("click");
          map.off("mousemove");
        }
      } else if (drawingMode === "rectangle") {
        // Rectangle: first and second click define corners
        if (pointsRef.current.length === 1) {
          // Show temporary marker
          if (shapeRef.current && !shapeCompletedRef.current)
            map.removeLayer(shapeRef.current);
          shapeRef.current = L.circleMarker(point, {
            radius: 4,
            fillColor: "#1890ff",
            color: "#0050b3",
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8,
          }).addTo(map);
        } else if (pointsRef.current.length === 2) {
          // Remove temporary preview rectangle
          if (tempRectangleRef.current) {
            map.removeLayer(tempRectangleRef.current);
            tempRectangleRef.current = null;
          }

          // Create rectangle from two points
          const bounds = L.latLngBounds(pointsRef.current);
          if (shapeRef.current && !shapeCompletedRef.current)
            map.removeLayer(shapeRef.current);
          shapeRef.current = L.rectangle(bounds, {
            fillColor: "#1890ff",
            color: "#0050b3",
            weight: 2,
            opacity: 1,
            fillOpacity: 0.3,
          }).addTo(map);

          // Mark shape as completed so it won't be removed in cleanup
          shapeCompletedRef.current = true;

          // Get all four corners
          const ne = bounds.getNorthEast();
          const sw = bounds.getSouthWest();
          const nw = L.latLng(ne.lat, sw.lng);
          const se = L.latLng(sw.lat, ne.lng);

          // Calculate rectangle area
          const width = map.distance(L.latLng(ne.lat, sw.lng), L.latLng(ne.lat, ne.lng));
          const height = map.distance(L.latLng(ne.lat, ne.lng), L.latLng(sw.lat, ne.lng));
          const rectangleArea = width * height;

          // Dispatch completed event
          window.dispatchEvent(
            new CustomEvent("shapeCompleted", {
              detail: {
                type: "rectangle",
                coordinates: [
                  [sw.lat, sw.lng],
                  [nw.lat, nw.lng],
                  [ne.lat, ne.lng],
                  [se.lat, se.lng],
                ],
                area: rectangleArea,
                timestamp: Date.now(),
              },
            }),
          );
          // Clear drawing info
          window.dispatchEvent(
            new CustomEvent("drawingInfo", {
              detail: {
                type: null,
                metrics: null,
              },
            }),
          );
          isDrawingRef.current = false;
          pointsRef.current = [];
          map.dragging.enable();
          map.off("click");
          map.off("mousemove");
        }
      } else if (drawingMode === "polygon") {
        // Polygon: multiple clicks to create vertices
        // Check if clicking near the first point to close the polygon
        if (pointsRef.current.length >= 3) {
          const firstPoint = pointsRef.current[0];
          const firstPointPixel = map.latLngToContainerPoint(
            L.latLng(firstPoint[0], firstPoint[1]),
          );
          const clickPointPixel = map.latLngToContainerPoint(
            L.latLng(point[0], point[1]),
          );
          const distanceToFirst = firstPointPixel.distanceTo(clickPointPixel);

          // If within 30 pixels of first point, close the polygon
          if (distanceToFirst < 30) {
            // Remove temporary polyline
            if (tempPolylineRef.current) {
              map.removeLayer(tempPolylineRef.current);
            }

            // Remove all vertex markers
            vertexMarkersRef.current.forEach((marker) => {
              map.removeLayer(marker);
            });
            vertexMarkersRef.current = [];

            // Remove first point indicator
            if (firstPointMarkerRef.current) {
              map.removeLayer(firstPointMarkerRef.current);
              firstPointMarkerRef.current = null;
            }

            // Create final polygon
            if (shapeRef.current && !shapeCompletedRef.current)
              map.removeLayer(shapeRef.current);
            shapeRef.current = L.polygon(pointsRef.current, {
              fillColor: "#1890ff",
              color: "#0050b3",
              weight: 2,
              opacity: 1,
              fillOpacity: 0.3,
            }).addTo(map);

            // Mark shape as completed
            shapeCompletedRef.current = true;

            // Calculate polygon area
            const polygonArea = calculatePolygonArea(pointsRef.current);

            // Dispatch completed event
            window.dispatchEvent(
              new CustomEvent("shapeCompleted", {
                detail: {
                  type: "polygon",
                  coordinates: pointsRef.current,
                  area: polygonArea,
                  timestamp: Date.now(),
                },
              }),
            );

            // Clear drawing info
            window.dispatchEvent(
              new CustomEvent("drawingInfo", {
                detail: {
                  type: null,
                  metrics: null,
                },
              }),
            );

            isDrawingRef.current = false;
            pointsRef.current = [];
            map.dragging.enable();
            map.off("click");
            map.off("mousemove");
            map.off("dblclick");
            return;
          }
        }

        // Add point normally
        if (tempPolylineRef.current) {
          map.removeLayer(tempPolylineRef.current);
        }

        if (pointsRef.current.length > 0) {
          // Draw temporary polyline
          tempPolylineRef.current = L.polyline(pointsRef.current, {
            color: "#1890ff",
            weight: 2,
            opacity: 0.8,
          }).addTo(map);
        }

        // Draw vertex marker and track it
        const vertexMarker = L.circleMarker(point, {
          radius: 4,
          fillColor: "#1890ff",
          color: "#0050b3",
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8,
        }).addTo(map);
        vertexMarkersRef.current.push(vertexMarker);

        // Add special marker for first point when we have at least 2 points
        if (pointsRef.current.length === 1 && drawingMode === "polygon") {
          const firstPoint = pointsRef.current[0];
          firstPointMarkerRef.current = L.circleMarker(firstPoint, {
            radius: 15,
            fillColor: "#52c41a",
            color: "#237804",
            weight: 3,
            opacity: 1,
            fillOpacity: 0.5,
          }).addTo(map);
        }
      }
    };

    const handleMouseMove = (e: L.LeafletMouseEvent) => {
      if (drawingMode === "circle" && pointsRef.current.length === 1) {
        // Show real-time circle preview
        const radius = map.distance(pointsRef.current[0], e.latlng);
        const area = Math.PI * Math.pow(radius, 2);

        if (tempCircleRef.current) {
          map.removeLayer(tempCircleRef.current);
        }
        tempCircleRef.current = L.circle(pointsRef.current[0], {
          radius: radius,
          fillColor: "#1890ff",
          color: "#0050b3",
          weight: 2,
          opacity: 0.8,
          fillOpacity: 0.2,
          dashArray: "5, 5",
        }).addTo(map);

        // Dispatch drawing info event
        window.dispatchEvent(
          new CustomEvent("drawingInfo", {
            detail: {
              type: "circle",
              metrics: {
                radius: Math.round(radius),
                area: Math.round(area),
              },
            },
          }),
        );
      } else if (
        drawingMode === "rectangle" &&
        pointsRef.current.length === 1
      ) {
        // Show real-time rectangle preview
        const bounds = L.latLngBounds([pointsRef.current[0], e.latlng]);
        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();
        const width = map.distance(
          L.latLng(sw.lat, sw.lng),
          L.latLng(sw.lat, ne.lng),
        );
        const height = map.distance(
          L.latLng(sw.lat, sw.lng),
          L.latLng(ne.lat, sw.lng),
        );
        const area = width * height;
        const perimeter = 2 * (width + height);

        if (tempRectangleRef.current) {
          map.removeLayer(tempRectangleRef.current);
        }
        tempRectangleRef.current = L.rectangle(bounds, {
          fillColor: "#1890ff",
          color: "#0050b3",
          weight: 2,
          opacity: 0.8,
          fillOpacity: 0.2,
          dashArray: "5, 5",
        }).addTo(map);

        // Dispatch drawing info event
        window.dispatchEvent(
          new CustomEvent("drawingInfo", {
            detail: {
              type: "rectangle",
              metrics: {
                width: Math.round(width),
                height: Math.round(height),
                area: Math.round(area),
                perimeter: Math.round(perimeter),
              },
            },
          }),
        );
      } else if (drawingMode === "polygon" && pointsRef.current.length > 0) {
        // Check if cursor is near the first point to show snap indicator
        const cursorPoint: [number, number] = [e.latlng.lat, e.latlng.lng];
        let previewPoints = [...pointsRef.current, cursorPoint];

        if (pointsRef.current.length >= 2) {
          const firstPoint = pointsRef.current[0];
          const firstPointPixel = map.latLngToContainerPoint(
            L.latLng(firstPoint[0], firstPoint[1]),
          );
          const cursorPointPixel = map.latLngToContainerPoint(
            L.latLng(cursorPoint[0], cursorPoint[1]),
          );
          const distanceToFirst = firstPointPixel.distanceTo(cursorPointPixel);

          // If within snap distance, snap to first point and change indicator
          if (distanceToFirst < 30) {
            previewPoints = [...pointsRef.current, firstPoint];

            // Change first point indicator color to indicate snap
            if (firstPointMarkerRef.current) {
              firstPointMarkerRef.current.setStyle({
                radius: 20,
                fillColor: "#ff4d4f",
                color: "#cf1322",
                weight: 3,
              });
            }
          } else {
            // Reset first point indicator when not snapping
            if (firstPointMarkerRef.current) {
              firstPointMarkerRef.current.setStyle({
                radius: 15,
                fillColor: "#52c41a",
                color: "#237804",
                weight: 3,
              });
            }
          }
        }

        // Show preview line to cursor
        // Calculate real-time polygon metrics
        let perimeter = 0;
        for (let i = 0; i < previewPoints.length - 1; i++) {
          perimeter += map.distance(
            L.latLng(previewPoints[i][0], previewPoints[i][1]),
            L.latLng(previewPoints[i + 1][0], previewPoints[i + 1][1]),
          );
        }
        const area = calculatePolygonArea(previewPoints);

        if (tempPolylineRef.current) {
          map.removeLayer(tempPolylineRef.current);
        }
        tempPolylineRef.current = L.polyline(
          previewPoints.map((p) => L.latLng(p[0], p[1])),
          {
            color: "#1890ff",
            weight: 2,
            opacity: 0.5,
            dashArray: "5, 5",
          },
        ).addTo(map);

        // Dispatch drawing info event
        window.dispatchEvent(
          new CustomEvent("drawingInfo", {
            detail: {
              type: "polygon",
              metrics: {
                points: previewPoints.length,
                perimeter: Math.round(perimeter),
                area: Math.round(area),
              },
            },
          }),
        );
      }
    };

    const handleDoubleClick = () => {
      if (drawingMode === "polygon" && pointsRef.current.length >= 3) {
        // Finish polygon
        if (tempPolylineRef.current) {
          map.removeLayer(tempPolylineRef.current);
        }

        if (shapeRef.current && !shapeCompletedRef.current)
          map.removeLayer(shapeRef.current);
        shapeRef.current = L.polygon(pointsRef.current, {
          fillColor: "#1890ff",
          color: "#0050b3",
          weight: 2,
          opacity: 1,
          fillOpacity: 0.3,
        }).addTo(map);

        // Remove all vertex markers
        vertexMarkersRef.current.forEach((marker) => {
          map.removeLayer(marker);
        });
        vertexMarkersRef.current = [];

        // Remove first point indicator
        if (firstPointMarkerRef.current) {
          map.removeLayer(firstPointMarkerRef.current);
          firstPointMarkerRef.current = null;
        }

        // Mark shape as completed so it won't be removed in cleanup
        shapeCompletedRef.current = true;

        // Calculate polygon area
        const polygonArea = calculatePolygonArea(pointsRef.current);

        // Dispatch completed event
        window.dispatchEvent(
          new CustomEvent("shapeCompleted", {
            detail: {
              type: "polygon",
              coordinates: pointsRef.current,
              area: polygonArea,
              timestamp: Date.now(),
            },
          }),
        );
        // Clear drawing info
        window.dispatchEvent(
          new CustomEvent("drawingInfo", {
            detail: {
              type: null,
              metrics: null,
            },
          }),
        );
        isDrawingRef.current = false;
        pointsRef.current = [];
        map.dragging.enable();
        map.off("click");
        map.off("mousemove");
        map.off("dblclick");
      }
    };

    map.on("click", handleMapClick);
    map.on("mousemove", handleMouseMove);
    map.on("dblclick", handleDoubleClick);

    return () => {
      map.off("click", handleMapClick);
      map.off("mousemove", handleMouseMove);
      map.off("dblclick", handleDoubleClick);
      // Only remove shape if it wasn't completed
      if (shapeRef.current && !shapeCompletedRef.current) {
        map.removeLayer(shapeRef.current);
        shapeRef.current = null;
      }
      if (tempPolylineRef.current) {
        map.removeLayer(tempPolylineRef.current);
        tempPolylineRef.current = null;
      }
      // Remove vertex markers
      vertexMarkersRef.current.forEach((marker) => {
        map.removeLayer(marker);
      });
      vertexMarkersRef.current = [];
      map.dragging.enable();
    };
  }, [drawingMode, map]);

  // Listen for clearDrawings event to remove shapes from map
  useEffect(() => {
    const handleClearDrawings = () => {
      console.log("DrawingHandler: clearDrawings event received");
      console.log("DrawingHandler: shapeRef.current =", shapeRef.current);
      console.log(
        "DrawingHandler: tempPolylineRef.current =",
        tempPolylineRef.current,
      );
      console.log(
        "DrawingHandler: vertexMarkersRef.current =",
        vertexMarkersRef.current,
      );

      // Remove the completed shape (circle, rectangle, or polygon)
      if (shapeRef.current) {
        console.log("DrawingHandler: Removing shape from map");
        map.removeLayer(shapeRef.current);
        shapeRef.current = null;
        console.log("DrawingHandler: Shape removed");
      } else {
        console.log("DrawingHandler: No shape to remove");
      }

      // Remove temporary polyline
      if (tempPolylineRef.current) {
        console.log("DrawingHandler: Removing temp polyline from map");
        map.removeLayer(tempPolylineRef.current);
        tempPolylineRef.current = null;
        console.log("DrawingHandler: Temp polyline removed");
      }

      // Remove all vertex markers (important for polygons!)
      if (vertexMarkersRef.current.length > 0) {
        console.log("DrawingHandler: Removing vertex markers from map");
        vertexMarkersRef.current.forEach((marker) => {
          map.removeLayer(marker);
        });
        vertexMarkersRef.current = [];
        console.log("DrawingHandler: Vertex markers removed");
      }

      // Reset drawing state
      pointsRef.current = [];
      isDrawingRef.current = false;
      shapeCompletedRef.current = false; // Reset completion flag

      // Re-enable map interactions
      map.dragging.enable();
      console.log("DrawingHandler: Clear completed");
    };

    window.addEventListener("clearDrawings", handleClearDrawings);
    return () =>
      window.removeEventListener("clearDrawings", handleClearDrawings);
  }, [map]);

  return null;
}

// Drawing Info Panel Component
interface DrawingMetrics {
  radius?: number;
  area?: number;
  width?: number;
  height?: number;
  perimeter?: number;
  points?: number;
}

interface DrawingInfoPanelProps {
  drawingMode: "circle" | "polygon" | "rectangle" | null;
  metrics: DrawingMetrics | null;
}

const DrawingInfoPanel: React.FC<DrawingInfoPanelProps> = ({
  drawingMode,
  metrics,
}) => {
  const { Text } = Typography;

  if (!drawingMode || !metrics) return null;

  return (
    <Card
      size="small"
      style={{
        position: "absolute",
        top: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1000,
        backgroundColor: "rgba(15, 20, 25, 0.95)",
        borderColor: "#293653",
        minWidth: "280px",
        backdropFilter: "blur(8px)",
      }}
      bodyStyle={{ padding: "12px 16px" }}
    >
      <div style={{ marginBottom: "8px" }}>
        <Text strong style={{ color: "#ffffff", fontSize: "14px" }}>
          {drawingMode === "circle" && "Drawing Circle"}
          {drawingMode === "rectangle" && "Drawing Rectangle"}
          {drawingMode === "polygon" && "Drawing Polygon"}
        </Text>
      </div>

      {drawingMode === "circle" && metrics.radius !== undefined && (
        <>
          <div style={{ marginBottom: "6px" }}>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              Radius:
            </Text>
            <Text
              style={{ marginLeft: "8px", fontSize: "14px", color: "#ffffff" }}
            >
              {metrics.radius.toLocaleString()} m
            </Text>
          </div>
          {metrics.area !== undefined && (
            <div>
              <Text type="secondary" style={{ fontSize: "12px" }}>
                Area:
              </Text>
              <Text
                style={{
                  marginLeft: "8px",
                  fontSize: "14px",
                  color: "#ffffff",
                }}
              >
                {metrics.area.toLocaleString()} m²
              </Text>
            </div>
          )}
        </>
      )}

      {drawingMode === "rectangle" && metrics.width !== undefined && (
        <>
          <div style={{ marginBottom: "6px" }}>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              Width:
            </Text>
            <Text
              style={{ marginLeft: "8px", fontSize: "14px", color: "#ffffff" }}
            >
              {metrics.width.toLocaleString()} m
            </Text>
          </div>
          {metrics.height !== undefined && (
            <div style={{ marginBottom: "6px" }}>
              <Text type="secondary" style={{ fontSize: "12px" }}>
                Height:
              </Text>
              <Text
                style={{
                  marginLeft: "8px",
                  fontSize: "14px",
                  color: "#ffffff",
                }}
              >
                {metrics.height.toLocaleString()} m
              </Text>
            </div>
          )}
          {metrics.area !== undefined && (
            <div style={{ marginBottom: "6px" }}>
              <Text type="secondary" style={{ fontSize: "12px" }}>
                Area:
              </Text>
              <Text
                style={{
                  marginLeft: "8px",
                  fontSize: "14px",
                  color: "#ffffff",
                }}
              >
                {metrics.area.toLocaleString()} m²
              </Text>
            </div>
          )}
          {metrics.perimeter !== undefined && (
            <div>
              <Text type="secondary" style={{ fontSize: "12px" }}>
                Perimeter:
              </Text>
              <Text
                style={{
                  marginLeft: "8px",
                  fontSize: "14px",
                  color: "#ffffff",
                }}
              >
                {metrics.perimeter.toLocaleString()} m
              </Text>
            </div>
          )}
        </>
      )}

      {drawingMode === "polygon" && metrics.points !== undefined && (
        <>
          <div style={{ marginBottom: "6px" }}>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              Points:
            </Text>
            <Text
              style={{ marginLeft: "8px", fontSize: "14px", color: "#ffffff" }}
            >
              {metrics.points}
            </Text>
          </div>
          {metrics.perimeter !== undefined && (
            <div style={{ marginBottom: "6px" }}>
              <Text type="secondary" style={{ fontSize: "12px" }}>
                Perimeter:
              </Text>
              <Text
                style={{
                  marginLeft: "8px",
                  fontSize: "14px",
                  color: "#ffffff",
                }}
              >
                {metrics.perimeter.toLocaleString()} m
              </Text>
            </div>
          )}
          {metrics.area !== undefined && (
            <div>
              <Text type="secondary" style={{ fontSize: "12px" }}>
                Area:
              </Text>
              <Text
                style={{
                  marginLeft: "8px",
                  fontSize: "14px",
                  color: "#ffffff",
                }}
              >
                {metrics.area.toLocaleString()} m²
              </Text>
            </div>
          )}
        </>
      )}
    </Card>
  );
};

// Main Map Component
// Feature Zoom Handler Component - Zooms to clicked feature
interface FeatureZoomHandlerProps {
  clickedResult?: any | null;
}

function FeatureZoomHandler({ clickedResult }: FeatureZoomHandlerProps) {
  const map = useMap();
  console.log(clickedResult);
  useEffect(() => {
    if (clickedResult?.coordinates) {
      const coords = clickedResult.coordinates;

      // Check if coordinates is a single point, bbox, or array of points
      if (Array.isArray(coords)) {
        // Check if it's a point [lat, lng] or polygon/line [[lat, lng], ...]
        if (Array.isArray(coords[0])) {
          // Array of points - use fitBounds for polygons, lines, etc.
          const bounds = L.latLngBounds(coords as [number, number][]);
          map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
        } else if (coords.length === 4) {
          // Bbox [minX, minY, maxX, maxY] - use fitBounds
          const [minX, minY, maxX, maxY] = coords;
          const bounds = L.latLngBounds([[minY, minX], [maxY, maxX]]);
          map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
        } else {
          // Single point - use setView
          map.setView(coords as [number, number], 14);
        }
      }
    }
  }, [clickedResult, map]);

  return null;
}

// TileLayer control using Leaflet's L.tileLayer()
const TileLayerControl: React.FC<{
  activeLayer: string;
}> = ({ activeLayer }) => {
  const map = useMap();
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  useEffect(() => {
    // Define tile layers
    const tileLayers = {
      Satellite: L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        { attribution: "Tiles &copy; Esri", maxZoom: 19 }
      ),
      Streets: L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        { attribution: "&copy; OpenStreetMap contributors", maxZoom: 19 }
      ),
      Terrain: L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
        { attribution: "Tiles &copy; Esri", maxZoom: 16 }
      ),
    };

    // Add initial layer
    tileLayerRef.current = tileLayers[activeLayer as keyof typeof tileLayers];
    tileLayerRef.current.addTo(map);

    // Update layer when activeLayer changes
    const interval = setInterval(() => {
      if (tileLayerRef.current) {
        const currentLayerName = Object.keys(tileLayers).find(
          (key) => tileLayers[key as keyof typeof tileLayers] === tileLayerRef.current
        );
        if (currentLayerName !== activeLayer) {
          tileLayerRef.current.remove();
          tileLayerRef.current = tileLayers[activeLayer as keyof typeof tileLayers];
          tileLayerRef.current.addTo(map);
        }
      }
    }, 100);

    return () => {
      clearInterval(interval);
      if (tileLayerRef.current) {
        tileLayerRef.current.remove();
      }
    };
  }, [map, activeLayer]);

  return null;
};

// Combined control - Base Layer, Zoom In, Zoom Out, Fullscreen - all in one column
const BaseLayerControl: React.FC<{
  activeLayer: string;
  onLayerChange: (layer: string) => void;
  rightSidebarCollapsed?: boolean;
}> = ({ activeLayer, onLayerChange, rightSidebarCollapsed = true }) => {
  const map = useMap();
  const [isOpen, setIsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    const container = map.getContainer();
    if (!document.fullscreenElement) {
      container.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const containerStyle: React.CSSProperties = {
    position: "absolute",
    bottom: "10px",
    right: rightSidebarCollapsed ? "10px" : "420px",
    zIndex: 1001,
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  };
  const mergedBarStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    background: "#030415",
    borderRadius: "4px",
    boxShadow: "0 1px 5px rgba(0,0,0,0.4)",
    overflow: "hidden",
  };

  const btnStyle: React.CSSProperties = {
    width: "34px",
    height: "34px",
    border: "none",
    background: "#030415",
    color: "#E0E0E0",
    cursor: "pointer",
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const dividerStyle: React.CSSProperties = {
    width: "1px",
    background: "#E0E0E0",
  };

  const dropdownStyle: React.CSSProperties = {
      position: "absolute",
      bottom: "0",
      right: "100%",
      background: "#030415",
      borderRadius: "4px",
      boxShadow: "0 1px 5px rgba(0,0,0,0.4)",
      minWidth: "100px",
      overflow: "hidden",
      marginLeft: "4px",
    };

  const baseLayerBtnStyle: React.CSSProperties = {
    ...btnStyle,
    background: "#030415",
    borderRadius: "4px",
    boxShadow: "0 1px 5px rgba(0,0,0,0.4)",
  };

  return (
    <div className="leaflet-control" style={containerStyle}>
      <div style={{ position: "relative" }}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          title="Map Layers"
          style={baseLayerBtnStyle}
        >
          🗺️
        </button>
        {isOpen && (
                  <div ref={dropdownRef} style={dropdownStyle}>
            {["Satellite", "Streets", "Terrain"].map((layerName) => (
              <div
                key={layerName}
                onClick={() => {
                  onLayerChange(layerName);
                  setIsOpen(false);
                }}
                style={{
                  padding: "8px 12px",
                  cursor: "pointer",
                  background: activeLayer === layerName ? "#1a1a2e" : "#030415",
                  color: "#E0E0E0",
                  fontWeight: activeLayer === layerName ? "600" : "400",
                  fontSize: "13px",
                }}
                onMouseEnter={(e) => {
                  if (activeLayer !== layerName) {
                    e.currentTarget.style.background = "#1a1a2e";
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeLayer !== layerName) {
                    e.currentTarget.style.background = "#030415";
                  }
                }}
              >
                {layerName}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Merged bar: Zoom + Divider + Zoom - Divider + Fullscreen */}
      <div style={mergedBarStyle}>
        <button
          onClick={() => map.zoomIn()}
          title="Zoom In"
          style={btnStyle}
        >
          +
        </button>
        <div style={dividerStyle} />
        <button
          onClick={() => map.zoomOut()}
          title="Zoom Out"
          style={btnStyle}
        >
          −
        </button>
        <div style={dividerStyle} />
        <button
          onClick={toggleFullscreen}
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          style={btnStyle}
        >
          {isFullscreen ? "⊠" : "⛶"}
        </button>
      </div>
    </div>
  );
};

interface MapComponentProps {
  drawingMode: "circle" | "polygon" | "rectangle" | null;
  markers: [number, number][];
  hoveredResult?: any | null;
  clickedResult?: any | null;
  apiResponse?: any;
  rightSidebarCollapsed?: boolean;
}

export const MapComponent: React.FC<MapComponentProps> = ({
  drawingMode,
  hoveredResult,
  clickedResult,
  apiResponse,
  rightSidebarCollapsed = true,
}) => {
  const [drawingMetrics, setDrawingMetrics] = useState<DrawingMetrics | null>(
    null,
  );
  const [activeLayer, setActiveLayer] = useState<string>("Satellite");

  // Listen for drawing info events
  useEffect(() => {
    const handleDrawingInfo = (event: Event) => {
      const customEvent = event as CustomEvent<{
        type: "circle" | "polygon" | "rectangle" | null;
        metrics: DrawingMetrics | null;
      }>;
      setDrawingMetrics(customEvent.detail.metrics);
    };

    window.addEventListener("drawingInfo", handleDrawingInfo);
    return () => window.removeEventListener("drawingInfo", handleDrawingInfo);
  }, []);

  return (
    <MapContainer
      center={[13.406105629697434, 100.91933242591432]}
      zoom={7}
      scrollWheelZoom={true}
      attributionControl={false}
      zoomControl={false}
      style={{ width: "100%", height: "100%" }}
    >
      {/* TileLayer using Leaflet */}
                  <TileLayerControl activeLayer={activeLayer} />

                  {/* Combined Base Layer + Zoom + Fullscreen Control */}
<BaseLayerControl activeLayer={activeLayer} onLayerChange={setActiveLayer} rightSidebarCollapsed={rightSidebarCollapsed} />

      {/* API Results Layer - Show all features */}
      {apiResponse?.data?.results && apiResponse.data.results.length > 0 && (
        <FeatureLayer
          results={apiResponse.data.results}
          hoveredResult={hoveredResult}
          clickedResult={clickedResult}
        />
      )}

      {/* Feature Coordinates Display - Bottom Center Popup */}
      <FeatureCoordinatesDisplay
        hoveredResult={hoveredResult}
        clickedResult={clickedResult}
      />

      {/* Drawing Info Panel */}
      <DrawingInfoPanel drawingMode={drawingMode} metrics={drawingMetrics} />

      {/* Drawing Handler */}
      <DrawingHandler drawingMode={drawingMode} />

      {/* Feature Zoom Handler - Zooms to clicked feature */}
      <FeatureZoomHandler clickedResult={clickedResult} />

      {/* Image Slider Overlay - Slider on image to reveal/hide parts */}
      {clickedResult?.imageData?.thumbnailUrl && clickedResult?.bbox && (
        <ImageSliderOverlay
          imageUrl={clickedResult.imageData.thumbnailUrl}
          bbox={clickedResult.bbox}
          onClose={() => window.dispatchEvent(new CustomEvent("clearClickedResult"))}
        />
      )}


      {/* Render all markers */}
      {/*{markers.map((position, idx) => (
        <Marker key={idx} position={position}>
          <Popup>
            Location {idx + 1}
            <br />
            Lat: {position[0]}
            <br />
            Lng: {position[1]}
          </Popup>
        </Marker>
      ))}*/}

      {/* Fit all bounds automatically */}
      {/*<FitBounds markers={markers} />*/}
    </MapContainer>
  );
};

export default MapComponent;
