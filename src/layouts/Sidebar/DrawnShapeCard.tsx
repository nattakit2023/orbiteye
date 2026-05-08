import React from "react";
import { CloseOutlined } from "@ant-design/icons";
import { Typography } from "antd";

const { Text } = Typography;

interface DrawnShapeData {
  type: "circle" | "polygon" | "rectangle";
  coordinates: Array<[number, number]>;
  radius?: number;
  area?: number;
}

interface DrawnShapeCardProps {
  shape: DrawnShapeData | null;
  onClose?: () => void;
}

const DrawnShapeCard: React.FC<DrawnShapeCardProps> = ({ shape, onClose }) => {
  if (!shape) return null;

  // Get shape type label
  const getShapeLabel = () => {
    switch (shape.type) {
      case "circle":
        return "Circle";
      case "rectangle":
        return "Rectangle";
      case "polygon":
        return "Polygon";
      default:
        return "Shape";
    }
  };

  // Format area for display
  const formatArea = () => {
    if (shape.area === undefined || shape.area === null) {
      return "N/A";
    }

    if (shape.area >= 1000000) {
      return `${(shape.area / 1000000).toFixed(2)} km²`;
    } else if (shape.area >= 10000) {
      return `${(shape.area / 10000).toFixed(2)} ha`;
    } else {
      return `${shape.area.toLocaleString()} m²`;
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#090b22",
        borderRadius: "8px",
        border: "1px solid #30363d",
        overflow: "hidden",
      }}
    >
      {/* Content wrapper */}
      <div style={{ display: "flex" }}>
        {/* Vertical blue line - height matches content */}
        <div
          style={{
            width: "3px",
            backgroundColor: "#0B5AFE",
            marginRight: "12px",
          }}
        />

        {/* Content */}
        <div style={{ padding: "12px 12px 12px 0", flex: 1 }}>
          {/* Header - Title with close button */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "8px",
            }}
          >
            <Text
              style={{
                fontSize: "13px",
                color: "#E0E0E0",
                fontWeight: 600,
              }}
            >
              {getShapeLabel()}
            </Text>
            {onClose && (
              <CloseOutlined
                onClick={onClose}
                style={{
                  fontSize: "12px",
                  color: "#7d8590",
                  cursor: "pointer",
                }}
              />
            )}
          </div>

          {/* Area info */}
          <div style={{ marginBottom: "0" }}>
            <Text style={{ fontSize: "11px", color: "#7d8590" }}>Size:</Text>
            <Text
              style={{ fontSize: "11px", color: "#E0E0E0", marginLeft: "4px" }}
            >
              {formatArea()}
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrawnShapeCard;
