import React from "react";

interface SatelliteProps {
  onSelectItem?: (itemId: string) => void;
  selectedItems?: string[];
}

const Satellite: React.FC<SatelliteProps> = ({
  onSelectItem,
  selectedItems = [],
}) => {
  const satelliteData = [
    { id: "1", label: "THEOS", value: "Thai Earth Observation" },
    { id: "2", label: "Sentinel", value: "ESA Satellite" },
    { id: "3", label: "Landsat", value: "NASA Satellite" },
    { id: "4", label: "SPOT", value: "Airbus Satellite" },
  ];

  return (
    <div className="w-full">
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {satelliteData.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectItem?.(item.id)}
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: selectedItems.includes(item.id)
                ? "2px solid #1890ff"
                : "1px solid #d9d9d9",
              backgroundColor: selectedItems.includes(item.id)
                ? "rgba(24, 144, 255, 0.1)"
                : "transparent",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            <p
              style={{
                margin: "0 0 4px 0",
                fontWeight: 600,
                color: "#FFFFFF",
                fontSize: "14px",
              }}
            >
              {item.label}
            </p>
            <p style={{ margin: 0, color: "#999999", fontSize: "12px" }}>
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Satellite;
