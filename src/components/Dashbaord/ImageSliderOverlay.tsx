import React, { useState, useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

interface ImageSliderOverlayProps {
  bbox: [number, number, number, number]; // [minX, minY, maxX, maxY]
  onClose: () => void;
}

/**
 * ImageSliderOverlay
 *
 * Renders a draggable comparison slider on top of the image area on the map.
 *
 * Goals:
 *   1. The image crop region blocks all map interactions (no panning /
 *      zooming when the user clicks inside the bbox). This is implemented
 *      with `L.DomEvent.disable*Propagation` so Leaflet ignores events
 *      on the container, AND `map.dragging.disable()` while dragging.
 *   2. Dragging the slider gradually hides the image (via a clip-path on
 *      the underlying Leaflet image element) so the user can compare the
 *      satellite image with the basemap underneath.
 */
const ImageSliderOverlay: React.FC<ImageSliderOverlayProps> = ({
  bbox,
  onClose,
}) => {
  const [sliderPosition, setSliderPosition] = useState(100); // 100 = full image, 0 = only map
  const isDraggingRef = useRef(false);
  const [containerBounds, setContainerBounds] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderHandleRef = useRef<HTMLDivElement>(null);
  const map = useMap();
  const bboxRef = useRef(bbox);

  // Keep bbox ref updated so move/zoom handler reads the latest value
  useEffect(() => {
    bboxRef.current = bbox;
  }, [bbox]);

  // Recalculate container position whenever the map moves/zooms
  useEffect(() => {
    const updateBounds = () => {
      const currentBbox = bboxRef.current;
      if (!currentBbox) return;
      const [minX, minY, maxX, maxY] = currentBbox;
      const ne = map.latLngToContainerPoint([maxY, maxX]);
      const sw = map.latLngToContainerPoint([minY, minX]);

      setContainerBounds({
        left: sw.x,
        top: ne.y,
        width: ne.x - sw.x,
        height: sw.y - ne.y,
      });
    };

    updateBounds();
    map.on("move", updateBounds);
    map.on("zoom", updateBounds);
    map.on("resize", updateBounds);

    return () => {
      map.off("move", updateBounds);
      map.off("zoom", updateBounds);
      map.off("resize", updateBounds);
    };
  }, [map]);

  // Block Leaflet from handling events on the crop container and the slider
  // handle. This is the documented way to keep interactive UI on top of a
  // Leaflet map without dragging the map when the user clicks the UI.
  useEffect(() => {
    const containerElement = containerRef.current;
    const handleElement = sliderHandleRef.current;
    if (!containerElement) return;

    L.DomEvent.disableClickPropagation(containerElement);
    // L.DomEvent.disableDoubleClickPropagation(containerElement);
    L.DomEvent.disableScrollPropagation(containerElement);

    if (handleElement) {
      L.DomEvent.disableClickPropagation(handleElement);
      // L.DomEvent.disableDoubleClickPropagation(handleElement);
      L.DomEvent.disableScrollPropagation(handleElement);
    }
  }, [containerBounds]);

  // Notify ImageOverlayManager of the slider position so it can clip-path
  // the underlying image overlay accordingly.
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("sliderVisibilityChange", {
        detail: { visibility: sliderPosition },
      }),
    );
  }, [sliderPosition]);

  // Window-level pointer move/up handlers so dragging works even when the
  // cursor leaves the slider region.
  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      if (rect.width <= 0) return;
      const x = e.clientX - rect.left;
      const percentage = (x / rect.width) * 100;
      setSliderPosition(Math.max(0, Math.min(100, percentage)));
    };

    const onPointerUp = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      map.dragging.enable();
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
    };
  }, [map]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Stop the map from receiving this drag
    e.preventDefault();
    e.stopPropagation();
    isDraggingRef.current = true;
    map.dragging.disable();
    document.body.style.userSelect = "none";
    document.body.style.cursor = "ew-resize";
  };

  if (!containerBounds) return null;

  return (
    <div
      ref={containerRef}
      data-testid="image-slider-crop"
      style={{
        position: "absolute",
        left: containerBounds.left,
        top: containerBounds.top,
        width: containerBounds.width,
        height: containerBounds.height,
        zIndex: 1000,
        pointerEvents: "auto",
        touchAction: "none",
        userSelect: "none",
        boxSizing: "border-box",
        border: "2px solid rgba(24, 144, 255, 0.85)",
        boxShadow: "0 0 0 1px rgba(24, 144, 255, 0.25) inset",
      }}
    >
      {/* Slider Handle */}
      <div
        ref={sliderHandleRef}
        onPointerDown={handlePointerDown}
        style={{
          position: "absolute",
          top: 0,
          left: `${sliderPosition}%`,
          transform: "translateX(-50%)",
          width: "44px",
          height: "100%",
          cursor: "ew-resize",
          zIndex: 1002,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          touchAction: "none",
          userSelect: "none",
        }}
      >
        {/* Vertical line */}
        <div
          style={{
            position: "absolute",
            width: "4px",
            height: "100%",
            background: "#1890ff",
            boxShadow: "0 0 8px rgba(24, 144, 255, 0.7)",
            pointerEvents: "none",
          }}
        />
        {/* Handle circle */}
        <div
          style={{
            position: "relative",
            width: "44px",
            height: "44px",
            borderRadius: "50%",
            background: "#1890ff",
            border: "3px solid #fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.5)",
            pointerEvents: "none",
          }}
        >
          <div style={{ display: "flex", gap: "4px" }}>
            <div
              style={{
                width: "3px",
                height: "18px",
                background: "#fff",
                borderRadius: "1px",
              }}
            />
            <div
              style={{
                width: "3px",
                height: "18px",
                background: "#fff",
                borderRadius: "1px",
              }}
            />
          </div>
        </div>
      </div>

      {/* Percentage label */}
      <div
        style={{
          position: "absolute",
          bottom: "6px",
          left: `${sliderPosition}%`,
          transform: "translateX(-50%)",
          background: "rgba(0, 0, 0, 0.7)",
          padding: "2px 8px",
          borderRadius: "4px",
          fontSize: "11px",
          color: "#fff",
          zIndex: 1003,
          pointerEvents: "none",
          fontFamily: "'Cabin', sans-serif",
          whiteSpace: "nowrap",
        }}
      >
        {Math.round(sliderPosition)}%
      </div>

      {/* Close button */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClose();
        }}
        onPointerDown={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        aria-label="Close image overlay"
        style={{
          position: "absolute",
          top: "-14px",
          right: "-14px",
          width: "28px",
          height: "28px",
          borderRadius: "50%",
          background: "rgba(255, 0, 0, 0.9)",
          border: "2px solid #fff",
          color: "#fff",
          fontSize: "16px",
          fontWeight: "bold",
          cursor: "pointer",
          zIndex: 1004,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.5)",
          lineHeight: 1,
          padding: 0,
        }}
      >
        ×
      </button>
    </div>
  );
};

export default ImageSliderOverlay;
