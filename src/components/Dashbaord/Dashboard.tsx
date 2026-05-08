import React, { useState, useEffect, lazy, Suspense } from "react";
import { Spin } from "antd";
import { useOutletContext } from "react-router-dom";
import "@/styles/dashboard.css";

// Lazy load the map component
const MapComponent = lazy(() => import("./MapComponent"));

interface OutletContext {
  hoveredResult?: any | null;
  clickedResult?: any | null;
  apiResponse?: any;
  rightSidebarCollapsed?: boolean;
}

const Dashboard: React.FC = () => {
  const { hoveredResult, clickedResult, apiResponse, rightSidebarCollapsed } =
    useOutletContext<OutletContext>();
  const [drawingMode, setDrawingMode] = useState<
    "circle" | "polygon" | "rectangle" | null
  >(null);

  // Sample marker data - replace with your actual data
  const markers: [number, number][] = [];

  useEffect(() => {
    const handleStartDrawing = (event: Event) => {
      const customEvent = event as CustomEvent;
      setDrawingMode(customEvent.detail.shapeType);
    };

    const handleClearDrawings = () => {
      setDrawingMode(null);
    };

    const handleShapeCompleted = () => {
      setDrawingMode(null);
    };

    window.addEventListener("startDrawing", handleStartDrawing);
    window.addEventListener("clearDrawings", handleClearDrawings);
    window.addEventListener("shapeCompleted", handleShapeCompleted);

    return () => {
      window.removeEventListener("startDrawing", handleStartDrawing);
      window.removeEventListener("clearDrawings", handleClearDrawings);
      window.removeEventListener("shapeCompleted", handleShapeCompleted);
    };
  }, []);


  return (
    <>
      {/* Lazy loaded MapComponent with Suspense fallback */}
      <Suspense
        fallback={
          <Spin
            size="large"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        }
      >
        <MapComponent
          drawingMode={drawingMode}
          markers={markers}
          hoveredResult={hoveredResult}
          clickedResult={clickedResult}
          apiResponse={apiResponse}
          rightSidebarCollapsed={rightSidebarCollapsed}
        />
      </Suspense>
      {/*{drawnShapes.length > 0 && (
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 999,
            backgroundColor: "rgba(41, 54, 83, 0.95)",
            backdropFilter: "blur(10px)",
            border: "1px solid #404d63",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
            padding: "12px 16px",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "12px",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            {drawnShapes.map((shape, idx) => {
              const coordsStr = shape.coordinates
                .map((coord) => `${coord[0].toFixed(6)},${coord[1].toFixed(6)}`)
                .join(" | ");
              // const displayCoords =
              //   coordsStr.length > 40
              //     ? coordsStr.substring(0, 40) + "..."
              //     : coordsStr;
              const isCopied = copiedShapeId === shape.id;

              return (
                <div
                  key={shape.id}
                  title="Click to copy coordinates"
                  onClick={() => handleCopyCoordinates(shape)}
                  style={{
                    padding: "8px 12px",
                    backgroundColor: isCopied
                      ? "rgba(82, 196, 26, 0.3)"
                      : "rgba(31, 41, 55, 0.8)",
                    borderRadius: "4px",
                    fontSize: "11px",
                    color: "#FFFFFF",
                    border: isCopied
                      ? "2px solid #52c41a"
                      : "1px solid #374151",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    maxWidth: "200px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                  onMouseEnter={(e) => {
                    if (!isCopied) {
                      e.currentTarget.style.backgroundColor =
                        "rgba(41, 54, 83, 1)";
                      e.currentTarget.style.borderColor = "#1890ff";
                    } else {
                      e.currentTarget.style.backgroundColor =
                        "rgba(82, 196, 26, 0.4)";
                      e.currentTarget.style.borderColor = "#52c41a";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isCopied) {
                      e.currentTarget.style.backgroundColor =
                        "rgba(31, 41, 55, 0.8)";
                      e.currentTarget.style.borderColor = "#374151";
                    } else {
                      e.currentTarget.style.backgroundColor =
                        "rgba(82, 196, 26, 0.3)";
                      e.currentTarget.style.borderColor = "#52c41a";
                    }
                  }}
                >
                  <CopyOutlined
                    style={{
                      fontSize: "12px",
                      color: isCopied ? "#52c41a" : "#999",
                    }}
                  />
                  <span style={{ fontWeight: 600, marginRight: "4px" }}>
                    {idx + 1}. {shape.type.toUpperCase()}:
                  </span>
                  <span>{coordsStr}</span>
                </div>
              );
            })}
            <button
              onClick={() => setDrawnShapes([])}
              style={{
                background: "none",
                border: "none",
                color: "#999999",
                cursor: "pointer",
                fontSize: "14px",
                padding: "0 4px",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#FF6B6B")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#999999")}
            >
              ✕
            </button>
          </div>
        </div>
      )}*/}
    </>
  );
};

export default Dashboard;
