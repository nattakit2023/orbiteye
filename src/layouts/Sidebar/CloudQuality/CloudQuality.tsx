import React from "react";

interface CloudQualityProps {
  onSelectItem?: (itemId: string) => void;
  selectedItems?: string[];
}

const CloudQuality: React.FC<CloudQualityProps> = ({
  onSelectItem,
  selectedItems = [],
}) => {
  const cloudQualityData = [
    { id: "1", label: "Clear", value: "0-10%" },
    { id: "2", label: "Low", value: "10-30%" },
    { id: "3", label: "Medium", value: "30-50%" },
    { id: "4", label: "High", value: "50%+" },
  ];

  return (
    <div className="w-full">
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}
      >
        {cloudQualityData.map((item) => (
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

export default CloudQuality;
