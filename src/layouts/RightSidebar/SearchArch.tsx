import React, { useState } from "react";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  CloudOutlined,
  ThunderboltOutlined,
  EnvironmentOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import { Button, Card, Image, Spin, Typography, Alert, Empty, Flex } from "antd";
import { TransformedApiResponse } from "@/service/graphql/hooks/useStac";
import { useCart } from "@/context/CartContext";

const { Text } = Typography;

interface SearchArchProps {
  apiResponse?: TransformedApiResponse | null;
  isLoading?: boolean;
  error?: Error | null;
  onResultHover?: (result: {
    id: string;
    coordinates?: [number, number] | [number, number][];
  } | null) => void;
  onResultClick?: (result: {
    id: string;
    coordinates?: [number, number] | [number, number][];
  }) => void;
}

const SearchArch: React.FC<SearchArchProps> = ({
  apiResponse,
  isLoading = false,
  error = null,
  onResultHover,
  onResultClick,
}) => {
  const [activeResultId, setActiveResultId] = useState<string | null>(null);
  const { addToCart, isInCart } = useCart();

  if (isLoading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", padding: "40px 20px" }}>
        <Spin size="large" />
        <Text style={{ marginTop: "16px", fontSize: "14px", color: "#FFFFFF" }}>
          Searching archive...
        </Text>
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error"
        description={apiResponse?.error || error.message || "Failed to fetch results"}
        type="error"
        icon={<CloseCircleOutlined />}
        showIcon
        style={{ marginBottom: "16px" }}
      />
    );
  }

  if (!apiResponse) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description={
          <Text style={{ color: "#FFFFFF" }}>
            Draw a shape and click "Show Result" to see analysis
          </Text>
        }
      />
    );
  }

  if (!apiResponse.success || !apiResponse.data) {
    return (
      <Alert
        message="No Results"
        description={apiResponse.message || "No data available"}
        type="warning"
        showIcon
        style={{ marginBottom: "16px" }}
      />
    );
  }

  return (
    <div className="rightsidebar-scroll" style={{ flex: "1 1 auto", overflow: "auto" }}>
      {/* Shape Analysis Section */}
      <Card
        size="small"
        title={<span style={{ color: "white", fontSize: "14px" }}>Shape Analysis</span>}
        style={{ backgroundColor: "#030415", borderColor: "#293653", marginBottom: "16px" }}
        headStyle={{ borderBottom: "1px solid #293653" }}
        bodyStyle={{ padding: "12px" }}
      >
        <div style={{ marginBottom: "8px" }}>
          <Text style={{ fontSize: "12px", color: "#1890ff" }}>Type:</Text>
          <Text style={{ marginLeft: "8px", fontSize: "14px", color: "white", fontWeight: 500 }}>
            {apiResponse.data.shapeAnalysis.type.toUpperCase()}
          </Text>
        </div>
        <div style={{ marginBottom: "8px" }}>
          <Text style={{ fontSize: "12px", color: "#1890ff" }}>Area:</Text>
          <Text style={{ marginLeft: "8px", fontSize: "14px", color: "white" }}>
            {apiResponse.data.shapeAnalysis.area.toLocaleString()} m²
          </Text>
        </div>
        <div style={{ marginBottom: "8px" }}>
          <Text style={{ fontSize: "12px", color: "#1890ff" }}>Perimeter:</Text>
          <Text style={{ marginLeft: "8px", fontSize: "14px", color: "white" }}>
            {apiResponse.data.shapeAnalysis.perimeter.toLocaleString()} m
          </Text>
        </div>
        <div>
          <Text style={{ fontSize: "12px", color: "#1890ff" }}>Centroid:</Text>
          <Text style={{ marginLeft: "8px", fontSize: "14px", color: "white" }}>
            {apiResponse.data.shapeAnalysis.centroid[0].toFixed(6)}, {apiResponse.data.shapeAnalysis.centroid[1].toFixed(6)}
          </Text>
        </div>
      </Card>

      {/* Statistics Section */}
      <Card
        size="small"
        title={<span style={{ color: "white", fontSize: "14px" }}>Statistics</span>}
        style={{ backgroundColor: "#030415", borderColor: "#293653", marginBottom: "16px" }}
        headStyle={{ borderBottom: "1px solid #293653" }}
        bodyStyle={{ padding: "12px" }}
      >
        <div style={{ marginBottom: "8px" }}>
          <Text style={{ fontSize: "12px", color: "#1890ff" }}>Point Count:</Text>
          <Text style={{ marginLeft: "8px", fontSize: "14px", color: "white" }}>
            {apiResponse.data.statistics.pointCount}
          </Text>
        </div>
        <div>
          <Text style={{ fontSize: "12px", color: "#1890ff" }}>Bounding Box:</Text>
          <div style={{ marginLeft: "16px", fontSize: "13px", color: "#b0b0b0" }}>
            <div>Min: {apiResponse.data.statistics.boundingBox.minLat.toFixed(6)}, {apiResponse.data.statistics.boundingBox.minLng.toFixed(6)}</div>
            <div>Max: {apiResponse.data.statistics.boundingBox.maxLat.toFixed(6)}, {apiResponse.data.statistics.boundingBox.maxLng.toFixed(6)}</div>
          </div>
        </div>
      </Card>

      {/* Results Section */}
      {apiResponse.data.results && apiResponse.data.results.length > 0 && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <CheckCircleOutlined style={{ color: "#52c41a" }} />
            <Text style={{ color: "white", fontSize: "16px", fontWeight: 600 }}>
              Analysis Results
            </Text>
            <Text type="secondary" style={{ fontSize: "12px", marginLeft: "auto", color: "#1890ff" }}>
              {apiResponse.data.results.length} items
            </Text>
          </div>
          {apiResponse.data.results.map((result) => (
            <Card
              key={result.id}
              size="small"
              onMouseEnter={() => { setActiveResultId(result.id); onResultHover?.(result); }}
              onMouseLeave={() => { setActiveResultId(null); onResultHover?.(null); }}
              onClick={() => { setActiveResultId(result.id); onResultClick?.(result); }}
              style={{
                backgroundColor: "#030415",
                borderColor: activeResultId === result.id ? "#ff4d4f" : "#293653",
                borderWidth: activeResultId === result.id ? "2px" : "1px",
                marginBottom: "12px",
                borderRadius: "8px",
                transition: "all 0.2s ease",
              }}
              bodyStyle={{ padding: "18px" }}
              hoverable
            >
              {/* Image Preview */}
              <div style={{ position: "relative", width: "100%", height: "180px", marginBottom: "12px", borderRadius: "8px", overflow: "hidden", background: "#030415", border: "1px solid #293653" }}>
                {result.imageData?.thumbnailUrl ? (
                  <Image src={result.imageData.thumbnailUrl} alt={result.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} preview={false} />
                ) : (
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "8px" }}>
                    <EnvironmentOutlined style={{ fontSize: "32px", color: "#1890ff", opacity: 0.6 }} />
                    <Text style={{ color: "#b0b0b0", fontSize: "12px" }}>No image available</Text>
                  </div>
                )}
                <div style={{ position: "absolute", top: "12px", left: "12px", backgroundColor: "rgba(0, 0, 0, 0.6)", backdropFilter: "blur(10px)", padding: "6px 10px", borderRadius: "4px" }}>
                  <Text style={{ fontSize: "11px", color: "#ffffff", fontWeight: 600 }}>{result.id.slice(-8)}</Text>
                </div>
                {result.timestamp && (
                  <div style={{ position: "absolute", bottom: "12px", left: "12px", backgroundColor: "rgba(0, 0, 0, 0.6)", backdropFilter: "blur(10px)", padding: "4px 8px", borderRadius: "4px" }}>
                    <Text style={{ fontSize: "10px", color: "#ffffff" }}>{new Date(result.timestamp).toLocaleDateString()}</Text>
                  </div>
                )}
              </div>

              {/* Cloud Coverage */}
              <div style={{ backgroundColor: "#030415", padding: "12px", borderRadius: "8px", marginBottom: "10px", border: "1px solid #293653" }}>
                <Flex justify="space-between" align="middle" style={{ marginBottom: "6px" }}>
                  <Flex gap="6" align="middle">
                    <CloudOutlined style={{ color: "#1890ff", fontSize: "12px" }} />
                    <Text style={{ fontSize: "11px", color: "#b0b0b0", fontWeight: 500 }}>Cloud Coverage</Text>
                  </Flex>
                  <Text style={{ fontSize: "13px", color: "#1890ff", fontWeight: 600 }}>
                    {typeof result.value === "number" ? result.value.toFixed(1) : result.value}%
                  </Text>
                </Flex>
                <div style={{ width: "100%", height: "6px", backgroundColor: "#293653", borderRadius: "3px", overflow: "hidden" }}>
                  <div style={{ width: `${Math.min(typeof result.value === "number" ? result.value : 0, 100)}%`, height: "100%", background: "linear-gradient(90deg, #52c41a 0%, #1890ff 50%, #ff4d4f 100%)", borderRadius: "3px" }} />
                </div>
              </div>

              {/* Quality */}
              <div style={{ backgroundColor: "#030415", padding: "12px", borderRadius: "8px", marginBottom: "10px", border: "1px solid #293653" }}>
                <Flex justify="space-between" align="middle" style={{ marginBottom: "6px" }}>
                  <Flex gap="6" align="middle">
                    <ThunderboltOutlined style={{ color: "#52c41a", fontSize: "12px" }} />
                    <Text style={{ fontSize: "11px", color: "#b0b0b0", fontWeight: 500 }}>Image Quality</Text>
                  </Flex>
                  <Text style={{ fontSize: "13px", color: "#52c41a", fontWeight: 600 }}>Excellent</Text>
                </Flex>
              </div>

              {/* Coordinates */}
              {result.coordinates && result.coordinates[0] !== undefined && result.coordinates[1] !== undefined && (
                <div style={{ padding: "10px 16px", borderRadius: "4px", marginBottom: "10px", border: "1px solid #293653" }}>
                  <Text style={{ fontSize: "10px", color: "#b0b0b0", display: "block", marginBottom: "6px" }}>Location</Text>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    <div>
                      <Text style={{ fontSize: "9px", color: "#b0b0b0", display: "block" }}>Latitude</Text>
                      <Text style={{ fontSize: "11px", color: "white", fontFamily: "monospace" }}>
                        {Array.isArray(result.coordinates) && result.coordinates.length > 0
                          ? (result.coordinates[0] as [number, number])[0].toFixed(6)
                          : typeof result.coordinates[0] === "number" ? (result.coordinates[0] as number).toFixed(6) : "N/A"}
                      </Text>
                    </div>
                    <div>
                      <Text style={{ fontSize: "9px", color: "#b0b0b0", display: "block" }}>Longitude</Text>
                      <Text style={{ fontSize: "11px", color: "white", fontFamily: "monospace" }}>
                        {Array.isArray(result.coordinates) && result.coordinates.length > 0
                          ? (result.coordinates[0] as [number, number])[1].toFixed(6)
                          : typeof result.coordinates[1] === "number" ? (result.coordinates[1] as number).toFixed(6) : "N/A"}
                      </Text>
                    </div>
                  </div>
                </div>
              )}

              {/* Add to Cart Button */}
              <Button
                type="primary"
                icon={<ShoppingOutlined />}
                onClick={() => {
                  const cartItem = {
                    name: result.name,
                    date: result.timestamp,
                    cloud: typeof result.value === "number" ? result.value : 0,
                    quality: "Excellent",
                    imageUrl: result.imageData?.thumbnailUrl,
                    price: 49.99,
                    quantity: 1,
                  };
                  addToCart(cartItem);
                }}
                disabled={isInCart(`${result.name}-${result.timestamp}`)}
                style={{
                  width: "100%",
                  marginTop: "12px",
                  height: "36px",
                  fontWeight: 500,
                  borderRadius: "6px",
                  background: isInCart(`${result.name}-${result.timestamp}`) ? "#52c41a" : undefined,
                  borderColor: isInCart(`${result.name}-${result.timestamp}`) ? "#52c41a" : undefined,
                }}
              >
                {isInCart(`${result.name}-${result.timestamp}`) ? "Added to Cart" : "Add to Cart"}
              </Button>
            </Card>
          ))}
        </>
      )}
    </div>
  );
};

export default SearchArch;
