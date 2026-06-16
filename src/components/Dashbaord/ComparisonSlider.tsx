import React, { useState, useRef, useEffect } from "react";

interface ComparisonSliderProps {
  imageUrl: string;
  bbox: [number, number, number, number]; // [minX, minY, maxX, maxY]
  onClose: () => void;
}

const ComparisonSlider: React.FC<ComparisonSliderProps> = ({ imageUrl, bbox, onClose }) => {
  const [sliderPosition, setSliderPosition] = useState(50); // percentage 0-100
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!containerRef.current) return;
    
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

  // Calculate aspect ratio from bbox
  const [minX, minY, maxX, maxY] = bbox;
  const width = maxX - minX;
  const height = maxY - minY;
  const aspectRatio = height > 0 ? width / height : 1.5;

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 1001,
        background: "#030415",
        borderRadius: "12px",
        border: "2px solid #1890ff",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.5)",
        overflow: "hidden",
        width: aspectRatio >= 1 ? `${Math.min(600, 80 * aspectRatio)}px` : `${Math.min(400, 80 / aspectRatio)}px`,
        height: aspectRatio >= 1 ? `${Math.min(400, 80 / aspectRatio)}px` : `${Math.min(600, 80 * aspectRatio)}px`,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 12px",
          borderBottom: "1px solid #30363d",
          background: "#0d1117",
        }}
      >
        <span style={{ color: "#e6edf3", fontSize: "12px", fontWeight: 600 }}>
          Compare Image
        </span>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "#7d8590",
              fontSize: "18px",
              cursor: "pointer",
              padding: "2px 6px",
            }}
          >
            ×
          </button>
        </div>
      </div>
      
      {/* Comparison Container */}
      <div
        ref={containerRef}
        style={{
          position: "relative",
          width: "100%",
          height: "calc(100% - 40px)",
          overflow: "hidden",
          cursor: "ew-resize",
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
      >
        {/* Map Layer (Background - always visible) */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "#1a1a2e",
          }}
        />
        
        {/* Image Layer (Left side - revealed by slider) */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: `${sliderPosition}%`,
            height: "100%",
            overflow: "hidden",
          }}
        >
          <img
            src={imageUrl}
            alt="Comparison"
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
          }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
        >
          {/* Handle Circle */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: "#1890ff",
              border: "3px solid #fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
            }}
          >
            <div style={{ display: "flex", gap: "2px" }}>
              <div style={{ width: "2px", height: "12px", background: "#fff", borderRadius: "1px" }} />
              <div style={{ width: "2px", height: "12px", background: "#fff", borderRadius: "1px" }} />
            </div>
          </div>
        </div>
        
        {/* Labels */}
        <div
          style={{
            position: "absolute",
            bottom: "8px",
            left: "8px",
            background: "rgba(0,0,0,0.7)",
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: "10px",
            color: "#fff",
          }}
        >
          MAP
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "8px",
            right: "8px",
            background: "rgba(0,0,0,0.7)",
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: "10px",
            color: "#fff",
          }}
        >
          IMAGE
        </div>
      </div>
    </div>
  );
};

export default ComparisonSlider;
