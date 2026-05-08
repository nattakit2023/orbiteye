import React from "react";
import { EnvironmentOutlined, CalendarOutlined, CloseOutlined } from "@ant-design/icons";
import { Typography, Space } from "antd";

const { Text, Title } = Typography;

interface ResultData {
  id: string;
  name?: string;
  coordinates?: [number, number] | [number, number][];
  timestamp?: number;
  imageData?: {
    thumbnailUrl?: string;
    downloadUrl?: string;
  };
}

interface SelectedResultCardProps {
  result: ResultData | null;
  onClose?: () => void;
}

const SelectedResultCard: React.FC<SelectedResultCardProps> = ({ result, onClose }) => {
  if (!result) return null;

  // Format coordinates for display
  const formatCoords = () => {
    if (!result.coordinates || result.coordinates.length === 0) {
      return "No coordinates";
    }
    
    const isArray = Array.isArray(result.coordinates[0]);
    if (isArray) {
      // Polygon - show first 2 points
      const coords = result.coordinates as [number, number][];
      if (coords.length > 2) {
        return `${coords[0][0].toFixed(4)}, ${coords[0][1].toFixed(4)}...`;
      }
      return coords.map(c => `${c[0].toFixed(4)}, ${c[1].toFixed(4)}`).join(" | ");
    } else {
      // Single point
      const [lat, lng] = result.coordinates as [number, number];
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
  };

  // Format timestamp to date string
  const formatDate = (timestamp: number) => {
    if (!timestamp) return "Unknown date";
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div
      style={{
        backgroundColor: "#090b22",
        borderRadius: "8px",
        border: "1px solid #30363d",
        padding: "12px",
        marginTop: "8px",
      }}
    >
      {/* Header */}
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
            fontSize: "12px",
            color: "#0B5AFE",
            fontWeight: 500,
          }}
          ellipsis
        >
          {result.name}
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

      {/* Title/Type */}
      <Title
        level={5}
        style={{
          color: "#E0E0E0",
          margin: "0 0 8px 0",
          fontSize: "14px",
        }}
      >
        {result.name?.split("_")[0] || "THEOS2"}
      </Title>

      {/* Details */}
      <Space direction="vertical" size={4} style={{ width: "100%" }}>
        {/* Coordinates */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <EnvironmentOutlined style={{ color: "#7d8590", fontSize: "11px" }} />
          <Text
            style={{
              fontSize: "11px",
              color: "#8b8b8b",
              fontFamily: "monospace",
            }}
            ellipsis
          >
            {formatCoords()}
          </Text>
        </div>

        {/* Timestamp */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <CalendarOutlined style={{ color: "#7d8590", fontSize: "11px" }} />
          <Text style={{ fontSize: "11px", color: "#8b8b8b" }}>
            {result.timestamp ? formatDate(result.timestamp) : "Unknown date"}
          </Text>
        </div>
      </Space>

      {/* Thumbnail if available */}
      {result.imageData?.thumbnailUrl && (
        <div
          style={{
            marginTop: "8px",
            width: "100%",
            height: "60px",
            borderRadius: "4px",
            overflow: "hidden",
            backgroundColor: "#0d1117",
          }}
        >
          <img
            src={result.imageData.thumbnailUrl}
            alt="Result thumbnail"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default SelectedResultCard;
