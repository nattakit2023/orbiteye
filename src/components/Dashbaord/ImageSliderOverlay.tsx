import React, { useState, useRef, useEffect } from "react";
import L from "leaflet";

interface ImageSliderOverlayProps {
  imageUrl: string;
  bbox: [number, number, number, number]; // [minX, minY, maxX, maxY]
  onClose: () => void;
}

const ImageSliderOverlay: React.FC<ImageSliderOverlayProps> = ({
  imageUrl,
  bbox,
  onClose,
}) => {
  const [sliderPosition, setSliderPosition] = useState(50); // percentage 0-100
  const [isDragging, setIsDragging] = useState(false);
  const [containerBounds, setContainerBounds] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  // Get map instance and calculate image position on screen
  useEffect(() => {
    // Find the Leaflet map container
    const mapContainer = document.querySelector('.leaflet-container') as HTMLElement | null;
    if (mapContainer) {
      // @ts-expect-error - Leaflet internal
      mapRef.current = L.DomUtil.get(mapContainer)?.['_leaflet_map'];
    }


    // Calculate position based on bbox and map bounds
    const updateBounds = () => {
      if (!mapRef.current && mapContainer) {
        // @ts-expect-error - Leaflet internal
        mapRef.current = L.DomUtil.get(mapContainer)?.['_leaflet_map'];
      }

      if (mapRef.current && bbox) {
        const [minX, minY, maxX, maxY] = bbox;
        const ne = mapRef.current.latLngToContainerPoint([maxY, maxX]);
        const sw = mapRef.current.latLngToContainerPoint([minY, minX]);
        const containerRect = mapContainer?.getBoundingClientRect();


        if (containerRect) {
          setContainerBounds({
            left: sw.x,
            top: ne.y,
            width: ne.x - sw.x,
            height: sw.y - ne.y,
          });
        }
      }
    };

    updateBounds();
    // Update on map move
    if (mapRef.current) {
      mapRef.current.on('move', updateBounds);
      mapRef.current.on('zoom', updateBounds);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.off('move', updateBounds);
        mapRef.current.off('zoom', updateBounds);
      }
    };
  }, [bbox]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    e.stopPropagation();

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!containerRef.current) return;
    e.stopPropagation();

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
  }, []);

  if (!containerBounds) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        left: containerBounds.left,
        top: containerBounds.top,
        width: containerBounds.width,
        height: containerBounds.height,
        zIndex: 1000,
        overflow: "hidden",
        pointerEvents: "none", // Let map events pass through
      }}
    >
      {/* Image Layer - clipped by slider position */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: `${sliderPosition}%`,
          height: "100%",
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        <img
          src={imageUrl}
          alt="Overlay"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: `${100 / (sliderPosition / 100)}%`,
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>

      {/* Slider Handle */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: `${sliderPosition}%`,
          transform: "translateX(-50%)",
          width: "4px",
          height: "100%",
          background: "#1890ff",
          cursor: "ew-resize",
          zIndex: 10,
          pointerEvents: "auto", // Only handle events on slider
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
      >
        {/* Handle Circle */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            background: "#1890ff",
            border: "3px solid #fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
          }}
        >
          <div style={{ display: "flex", gap: "2px" }}>
            <div style={{ width: "2px", height: "10px", background: "#fff", borderRadius: "1px" }} />
            <div style={{ width: "2px", height: "10px", background: "#fff", borderRadius: "1px" }} />
          </div>
        </div>
      </div>

      {/* Close Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        style={{
          position: "absolute",
          top: "4px",
          right: "4px",
          background: "rgba(0,0,0,0.6)",
          border: "none",
          borderRadius: "50%",
          width: "24px",
          height: "24px",
          color: "#fff",
          cursor: "pointer",
          fontSize: "14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 11,
          pointerEvents: "auto",
        }}
      >
        ×
      </button>

      {/* Percentage Label */}
      <div
        style={{
          position: "absolute",
          bottom: "4px",
          left: `${sliderPosition}%`,
          transform: "translateX(-50%)",
          background: "rgba(0,0,0,0.7)",
          padding: "2px 6px",
          borderRadius: "4px",
          fontSize: "10px",
          color: "#fff",
          zIndex: 11,
        }}
      >
        {Math.round(sliderPosition)}%
      </div>
    </div>
  );
};

export default ImageSliderOverlay;
