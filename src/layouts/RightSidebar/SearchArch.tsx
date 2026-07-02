import React, { useState } from "react";
import {
  CloseCircleOutlined,
  CloudOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  PlusOutlined,
  ExpandOutlined,
} from "@ant-design/icons";
import { Button, Card, Spin, Typography, Alert, Empty } from "antd";
import { TransformedApiResponse } from "@/service/graphql/hooks/useStac";
import { useCart } from "@/context/CartContextValue";

const { Text } = Typography;

interface SearchArchProps {
  apiResponse?: TransformedApiResponse | null;
  isLoading?: boolean;
  error?: Error | null;
  selectedSatellites?: string[];
  onResultHover?: (
    result: {
      id: string;
      name?: string;
      // Accept both 1D (point/bbox) and 2D (polygon) to match ArchiveResult.
      coordinates?: number[] | number[][];
      imageData?: {
        thumbnailUrl?: string;
        downloadUrl?: string;
      };
    } | null,
  ) => void;
  onResultClick?: (result: {
    id: string;
    name?: string;
    coordinates?: number[] | number[][];
    imageData?: {
      thumbnailUrl?: string;
      downloadUrl?: string;
    };
  }) => void;
}

const SearchArch: React.FC<SearchArchProps> = ({
  apiResponse,
  isLoading = false,
  error = null,
  selectedSatellites = [],
  onResultHover,
  onResultClick,
}) => {
  const [activeResultId, setActiveResultId] = useState<string | null>(null);
  const { addToCart, isInCart } = useCart();

  // Map satellite IDs to STAC type names
  const satelliteTypeMap: Record<string, string> = {
    "1": "THEOS 2",
    "2": "Sentinel",
    "3": "Landsat",
  };

  // Stable id format: CartContext builds the cart item id as
  // `${name}-${date}` where date is ms epoch. Compute it the same way here so
  // `isInCart()` matches items already in the cart.
  const itemDate = (timestamp?: string): number =>
    timestamp ? new Date(timestamp).getTime() : Date.now();

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          padding: "40px 20px",
        }}
      >
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
        description={
          apiResponse?.error || error.message || "Failed to fetch results"
        }
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
    <div
      className="rightsidebar-scroll"
      style={{ flex: "1 1 auto"}}
    >
      {/* Results Section */}
      {apiResponse.data.results && apiResponse.data.results.length > 0 && (
        <>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
              gap: "8px",
              marginBottom: "12px",
            }}
          >
            <Text style={{ color: "white", fontSize: "16px", fontWeight: 600 }}>
              Scene Found
            </Text>
            <Text
              type="secondary"
              style={{ fontSize: "12px", color: "#8b8b8b" }}
            >
              {apiResponse.data.results.length} scenes. Sorted by date
            </Text>
          </div>
          {apiResponse.data.results.map((result) => {
            const cartItemId = `${result.name}-${itemDate(result.timestamp)}`;
            const added = isInCart(cartItemId);
            return (
              <Card
                key={result.id}
                size="small"
                onMouseEnter={() => {
                  setActiveResultId(result.id);
                  onResultHover?.(result);
                }}
                onMouseLeave={() => {
                  setActiveResultId(null);
                  onResultHover?.(null);
                }}
                onClick={() => {
                  setActiveResultId(result.id);
                  onResultClick?.(result);
                }}
                style={{
                  backgroundColor: "#030415",
                  borderColor:
                    activeResultId === result.id ? "#1890ff" : "#30363d",
                  borderWidth: "1px",
                  marginBottom: "12px",
                  borderRadius: "8px",
                  transition: "all 0.2s ease",
                  overflow: "hidden",
                }}
                bodyStyle={{ padding: 0 }}
                hoverable
              >
                {/* Image Row: thumbnail left, details right */}
                <div style={{ display: "flex", gap: "12px", padding: "12px" }}>
                  {/* Thumbnail */}
                  <div
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "6px",
                      overflow: "hidden",
                      flexShrink: 0,
                      background: "#0d1117",
                      border: "1px solid #30363d",
                      position: "relative",
                      cursor: "pointer",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onResultClick?.(result);
                    }}
                  >
                    {result.imageData?.thumbnailUrl ? (
                      <>
                        <img
                          src={result.imageData.thumbnailUrl}
                          alt={result.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                        {/* Red hover overlay */}
                        <div
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: "rgba(255, 0, 0, 0.3)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            opacity: 0,
                            transition: "opacity 0.2s ease",
                          }}
                          className="thumbnail-overlay"
                          onMouseEnter={(e) => {
                            e.currentTarget.style.opacity = "1";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.opacity = "0";
                          }}
                        >
                          <ExpandOutlined
                            style={{
                              fontSize: "20px",
                              color: "#fff",
                            }}
                          />
                        </div>
                      </>
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <EnvironmentOutlined
                          style={{ fontSize: "24px", color: "#484f58" }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Text
                      style={{
                        fontSize: "13px",
                        color: "#0B5AFE",
                        display: "block",
                        marginBottom: "4px",
                      }}
                      ellipsis
                    >
                      {result.id}
                    </Text>
                    <Text
                      style={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#E0E0E0",
                      }}
                    >
                      {result.name.toUpperCase()}
                    </Text>
                    <div
                      style={{ display: "flex", gap: "12px", marginTop: "6px" }}
                    >
                      <Text
                        style={{
                          fontSize: "11px",
                          color: "#7d8590",
                          marginTop: "4px",
                          display: "block",
                        }}
                      >
                        <CalendarOutlined
                          style={{ color: "#7d8590", marginRight: "4px" }}
                        />
                        {result.timestamp
                          ? new Date(result.timestamp).toLocaleDateString(
                              "en-GB",
                              {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                              },
                            )
                          : "N/A"}
                      </Text>
                      <Text
                        style={{
                          fontSize: "11px",
                          color: "#2DBE09",
                          marginTop: "4px",
                          display: "block",
                        }}
                      >
                        <CloudOutlined style={{ marginRight: "4px" }} />
                        {typeof result.value === "number"
                          ? result.value.toFixed(1)
                          : result.value}
                        %
                      </Text>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div style={{ borderTop: "1px solid #30363d", height: "1px" }} />

                {/* Bottom: Price + Add to Cart */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 12px",
                  }}
                >
                  <Text
                    style={{
                      fontSize: "15px",
                      color: "#e6edf3",
                      fontWeight: 600,
                    }}
                  >
                    $49.99
                  </Text>
                  <Button
                    type="primary"
                    size="small"
                    icon={<PlusOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      // Determine satellite name from selected satellites
                      const satelliteName = selectedSatellites.length === 1
                        ? satelliteTypeMap[selectedSatellites[0]] || "THEOS 2"
                        : selectedSatellites.map(id => satelliteTypeMap[id] || "Unknown").join(" + ");
                      const cartItem = {
                        name: result.name,
                        satelliteName,
                        // result.timestamp is an ISO string from the STAC API;
                        // CartItem.date is a number (ms epoch), so convert it.
                        date: itemDate(result.timestamp),
                        cloud:
                          typeof result.value === "number" ? result.value : 0,
                        quality: "Excellent",
                        imageUrl: result.imageData?.thumbnailUrl,
                        price: 49.99,
                        quantity: 1,
                      };
                      addToCart(cartItem);
                    }}
                    disabled={added}
                    style={{
                      height: "28px",
                      fontSize: "12px",
                      borderRadius: "6px",
                      background: "#22253C",
                      borderColor: "#22253C",
                    }}
                  >
                    {added ? "Added" : "Add"}
                  </Button>
                </div>
              </Card>
            );
          })}
        </>
      )}
    </div>
  );
};

export default SearchArch;