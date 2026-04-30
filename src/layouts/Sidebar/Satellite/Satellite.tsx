import React from "react";
import SatelliteIcon from "@/assets/logo/SatelliteIcon.jsx";

interface SatelliteProps {
  onSelectItem?: (itemId: string) => void;
  selectedItems?: string[];
}

const Satellite: React.FC<SatelliteProps> = ({
  onSelectItem,
  selectedItems = [],
}) => {
  const satelliteData = [
    { id: "1", label: "THEOS 2", value: "Thai Earth Observation 2" },
    { id: "2", label: "Sentinel", value: "ESA Satellite" },
    { id: "3", label: "Landsat", value: "NASA Satellite" },
  ];

  return (
    <div className="w-full">
      <div
        style={{
          color: "#E0E0E0",
          fontSize: "14px",
          fontWeight: 600,
          marginBottom: "8px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <SatelliteIcon style={{ color: "#E0E0E0" }} />
        Satellite sources
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {satelliteData.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              console.log("Satellite clicked:", item.id);
              onSelectItem?.(item.id);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              flex: 1,
              padding: "12px 12px 12px 8px",
              borderRadius: "8px",
              border: selectedItems.includes(item.id)
                ? "2px solid #1890ff"
                : "1px solid #404d63",
              backgroundColor: selectedItems.includes(item.id)
                ? "rgba(24, 144, 255, 0.2)"
                : "rgba(255,255,255,0.05)",
              cursor: "pointer",
              transition: "all 0.2s ease",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "18px",
                height: "18px",
                borderRadius: "50%",
                border: selectedItems.includes(item.id)
                  ? "2px solid #1890ff"
                  : "2px solid #404d63",
                backgroundColor: selectedItems.includes(item.id)
                  ? "#1890ff"
                  : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "all 0.2s ease",
              }}
            >
              {selectedItems.includes(item.id) && (
                <div style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  backgroundColor: "#ffffff",
                }} />
              )}
            </div>
            <div style={{ flex: 1, textAlign: "left" }}>
              <p
                style={{
                  margin: "0 0 2px 0",
                  fontWeight: 600,
                  color: selectedItems.includes(item.id) ? "#1890ff" : "#E0E0E0",
                  fontSize: "13px",
                  pointerEvents: "none",
                }}
              >
                {item.label}
              </p>
              <p style={{ margin: 0, color: "#626972", fontSize: "10px", pointerEvents: "none" }}>
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Satellite;
