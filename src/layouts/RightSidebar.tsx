import React, { useState, useMemo } from "react";
import Col from "antd/es/col";
import Flex from "antd/es/flex";
import Layout from "antd/es/layout";
import Row from "antd/es/row";
import Button from "antd/es/button";
import Card from "antd/es/card";
import Image from "antd/es/image";
import Spin from "antd/es/spin";
import Typography from "antd/es/typography";
import Alert from "antd/es/alert";
import Empty from "antd/es/empty";
import {
  RightOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CloudOutlined,
  ThunderboltOutlined,
  CalendarOutlined,
  InfoCircleOutlined,
  EnvironmentOutlined,
  ShoppingOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import "@/styles/sidebar.css";
import type { TransformedApiResponse } from "@/service/api";
import { useCart } from "@/context/CartContext";

const { Text } = Typography;

const { Sider } = Layout;

interface RightSidebarProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
  apiResponse?: TransformedApiResponse | null;
  isLoading?: boolean;
  error?: Error | null;
  onResultHover?: (
    result: {
      id: string;
      coordinates?: [number, number] | [number, number][];
    } | null,
  ) => void;
  onResultClick?: (result: {
    id: string;
    coordinates?: [number, number] | [number, number][];
  }) => void;
}

const RightSidebar: React.FC<RightSidebarProps> = ({
  collapsed,
  onCollapse,
  apiResponse,
  isLoading = false,
  error = null,
  onResultHover,
  onResultClick,
}) => {
  // State for tracking hovered/clicked result
  const [activeResultId, setActiveResultId] = useState<string | null>(null);

  // Cart context for adding items to cart
  const { addToCart, isInCart } = useCart();

  // Generate deterministic gradient positions from result ID to avoid re-renders
  const getGradientPositions = useMemo(
    () => (resultId: string) => {
      // Simple hash function to generate deterministic positions
      let hash = 0;
      for (let i = 0; i < resultId.length; i++) {
        hash = (hash << 5) - hash + resultId.charCodeAt(i);
        hash = hash & 0xffffffff;
      }
      const x = hash % 100;
      const y = (hash >> 8) % 100;
      return { x, y };
    },
    [],
  );

  // // Debug incoming data
  // console.log("RightSidebar props:", {
  //   collapsed,
  //   apiResponse,
  //   isLoading,
  //   error,
  // });

  return (
    <>
      <style>{`
        .rightsidebar-scroll::-webkit-scrollbar {
          width: 6px;
        }

        .rightsidebar-scroll::-webkit-scrollbar-track {
          background: #22253C;
          border-radius: 3px;
        }

        .rightsidebar-scroll::-webkit-scrollbar-thumb {
          background: #293653;
          border-radius: 3px;
          transition: background 0.2s ease;
        }

        .rightsidebar-scroll::-webkit-scrollbar-thumb:hover {
          background: #1890ff;
        }

        .rightsidebar-scroll::-webkit-scrollbar-thumb:active {
          background: #1077e8;
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .card-hover-overlay:hover {
          opacity: 1 !important;
        }
      `}</style>

      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={onCollapse}
        breakpoint="lg"
        collapsedWidth="0"
        width={300}
        theme="dark"
        className="dark"
        style={{
          padding: "0",
          height: "calc(100vh - 80px)",
          color: "white",
          background: "#03041590",
        }}
      >
        {/* Content Wrapper with padding */}
        <div
          style={{
            padding: collapsed ? "0" : "20px 20px 15px 20px",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            opacity: collapsed ? 0 : 1,
            transition: "padding 0.5s ease-in-out, opacity 0.5s ease-in-out",
          }}
        >
          {/* Top Section - Header */}
          <div style={{ flex: "0 0 auto" }}>
            <Flex vertical gap={10}>
              <Row
                justify="center"
                align="middle"
                style={{ position: "relative", alignItems: "start" }}
              >
                <Col span={18}>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "white",
                    }}
                  >
                    Scene found
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: "500",
                      color: "#9EA5B0",
                    }}
                  >
                    Scene found
                  </div>
                </Col>
                <Col
                  span={6}
                  style={{ justifyContent: "end", display: "flex" }}
                >
                  <Button
                    type="text"
                    icon={
                      <CloseOutlined
                        style={{ color: "white", fontSize: "16px" }}
                      />
                    }
                    onClick={() => onCollapse(true)}
                    style={{
                      padding: "4px 8px",
                      color: "white",
                      left: "0",
                    }}
                    title="Close Sidebar"
                  />
                </Col>
              </Row>
            </Flex>
          </div>

          {/* Middle Section - Content */}
          <div
            className="rightsidebar-scroll"
            style={{ flex: "1 1 auto", overflow: "auto", marginTop: "16px" }}
          >
            {isLoading ? (
              // Loading State
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
                <Text
                  style={{
                    marginTop: "16px",
                    fontSize: "14px",
                    color: "#FFFFFF",
                  }}
                >
                  Analyzing shape...
                </Text>
              </div>
            ) : error ? (
              // Error State
              <Alert
                message="Error"
                description={
                  apiResponse?.error ||
                  error.message ||
                  "Failed to fetch results"
                }
                type="error"
                icon={<CloseCircleOutlined />}
                showIcon
                style={{ marginBottom: "16px" }}
              />
            ) : !apiResponse ? (
              // Initial State - No data yet
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <Text style={{ color: "#FFFFFF" }}>
                    Draw a shape and click "Show Result" to see analysis
                  </Text>
                }
              />
            ) : apiResponse.success && apiResponse.data ? (
              // Success State - Display Results
              <>
                {/* Shape Analysis Section */}
                <Card
                  size="small"
                  title={
                    <span style={{ color: "white", fontSize: "14px" }}>
                      Shape Analysis
                    </span>
                  }
                  style={{
                    backgroundColor: "#030415",
                    borderColor: "#293653",
                    marginBottom: "16px",
                  }}
                  headStyle={{ borderBottom: "1px solid #293653" }}
                  bodyStyle={{ padding: "12px" }}
                >
                  <div style={{ marginBottom: "8px" }}>
                    <Text style={{ fontSize: "12px", color: "#1890ff" }}>
                      Type:
                    </Text>
                    <Text
                      style={{
                        marginLeft: "8px",
                        fontSize: "14px",
                        color: "white",
                        fontWeight: 500,
                      }}
                    >
                      {apiResponse.data.shapeAnalysis.type.toUpperCase()}
                    </Text>
                  </div>
                  <div style={{ marginBottom: "8px" }}>
                    <Text style={{ fontSize: "12px", color: "#1890ff" }}>
                      Area:
                    </Text>
                    <Text
                      style={{
                        marginLeft: "8px",
                        fontSize: "14px",
                        color: "white",
                      }}
                    >
                      {apiResponse.data.shapeAnalysis.area.toLocaleString()} m²
                    </Text>
                  </div>
                  <div style={{ marginBottom: "8px" }}>
                    <Text style={{ fontSize: "12px", color: "#1890ff" }}>
                      Perimeter:
                    </Text>
                    <Text
                      style={{
                        marginLeft: "8px",
                        fontSize: "14px",
                        color: "white",
                      }}
                    >
                      {apiResponse.data.shapeAnalysis.perimeter.toLocaleString()}{" "}
                      m
                    </Text>
                  </div>
                  <div>
                    <Text style={{ fontSize: "12px", color: "#1890ff" }}>
                      Centroid:
                    </Text>
                    <Text
                      style={{
                        marginLeft: "8px",
                        fontSize: "14px",
                        color: "white",
                      }}
                    >
                      {apiResponse.data.shapeAnalysis.centroid[0].toFixed(6)},{" "}
                      {apiResponse.data.shapeAnalysis.centroid[1].toFixed(6)}
                    </Text>
                  </div>
                </Card>

                {/* Statistics Section */}
                <Card
                  size="small"
                  title={
                    <span style={{ color: "white", fontSize: "14px" }}>
                      Statistics
                    </span>
                  }
                  style={{
                    backgroundColor: "#030415",
                    borderColor: "#293653",
                    marginBottom: "16px",
                  }}
                  headStyle={{ borderBottom: "1px solid #293653" }}
                  bodyStyle={{ padding: "12px" }}
                >
                  <div style={{ marginBottom: "8px" }}>
                    <Text style={{ fontSize: "12px", color: "#1890ff" }}>
                      Point Count:
                    </Text>
                    <Text
                      style={{
                        marginLeft: "8px",
                        fontSize: "14px",
                        color: "white",
                      }}
                    >
                      {apiResponse.data.statistics.pointCount}
                    </Text>
                  </div>
                  <div>
                    <Text style={{ fontSize: "12px", color: "#1890ff" }}>
                      Bounding Box:
                    </Text>
                  </div>
                  <div
                    style={{
                      marginLeft: "16px",
                      fontSize: "13px",
                      color: "#b0b0b0",
                    }}
                  >
                    <div>
                      Min:{" "}
                      {apiResponse.data.statistics.boundingBox.minLat.toFixed(
                        6,
                      )}
                      ,{" "}
                      {apiResponse.data.statistics.boundingBox.minLng.toFixed(
                        6,
                      )}
                    </div>
                    <div>
                      Max:{" "}
                      {apiResponse.data.statistics.boundingBox.maxLat.toFixed(
                        6,
                      )}
                      ,{" "}
                      {apiResponse.data.statistics.boundingBox.maxLng.toFixed(
                        6,
                      )}
                    </div>
                  </div>
                </Card>

                {/* Results Section */}
                {apiResponse.data.results &&
                  apiResponse.data.results.length > 0 && (
                    <>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          marginBottom: "12px",
                        }}
                      >
                        <CheckCircleOutlined style={{ color: "#52c41a" }} />
                        <Text
                          style={{
                            color: "white",
                            fontSize: "16px",
                            fontWeight: 600,
                          }}
                        >
                          Analysis Results
                        </Text>
                        <Text
                          type="secondary"
                          style={{
                            fontSize: "12px",
                            marginLeft: "auto",
                            color: "#1890ff",
                          }}
                        >
                          {apiResponse.data.results.length} items
                        </Text>
                      </div>
                      {apiResponse.data.results.map((result) => (
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
                            backgroundColor:
                              activeResultId === result.id
                                ? "#030415"
                                : "#030415",
                            borderColor:
                              activeResultId === result.id
                                ? "#ff4d4f"
                                : "#293653",
                            borderWidth:
                              activeResultId === result.id ? "2px" : "1px",
                            marginBottom: "12px",
                            borderRadius: "8px",
                            transition: "all 0.2s ease",
                          }}
                          bodyStyle={{ padding: "18px" }}
                          hoverable
                        >
                          {/* Image Preview Section */}
                          <div
                            style={{
                              position: "relative",
                              width: "100%",
                              height: "180px",
                              marginBottom: "12px",
                              borderRadius: "8px",
                              overflow: "hidden",
                              background: "#030415",
                              border: "1px solid #293653",
                            }}
                          >
                            {/* Actual Thumbnail Image */}
                            {result.imageData?.thumbnailUrl ? (
                              <Image
                                src={result.imageData.thumbnailUrl}
                                alt={result.name}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                                preview={false}
                              />
                            ) : (
                              /* Fallback Pattern Background when no image */
                              <>
                                <div
                                  style={{
                                    position: "absolute",
                                    inset: 0,
                                    backgroundImage: `radial-gradient(circle at ${getGradientPositions(result.id).x}% ${getGradientPositions(result.id).y}%, rgba(24, 144, 255, 0.1) 0%, transparent 50%)`,
                                  }}
                                />

                                {/* Grid Pattern Overlay */}
                                <div
                                  style={{
                                    position: "absolute",
                                    inset: 0,
                                    backgroundImage:
                                      "linear-gradient(rgba(41, 54, 83, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(41, 54, 83, 0.1) 1px, transparent 1px)",
                                    backgroundSize: "20px 20px",
                                  }}
                                />

                                {/* Center Text */}
                                <div
                                  style={{
                                    position: "absolute",
                                    inset: 0,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexDirection: "column",
                                    gap: "8px",
                                  }}
                                >
                                  <EnvironmentOutlined
                                    style={{
                                      fontSize: "32px",
                                      color: "#1890ff",
                                      opacity: 0.6,
                                    }}
                                  />
                                  <Text
                                    style={{
                                      color: "#b0b0b0",
                                      fontSize: "12px",
                                    }}
                                  >
                                    No image available
                                  </Text>
                                </div>
                              </>
                            )}

                            {/* Content Overlay - Shows ID on top of image */}
                            <div
                              style={{
                                position: "absolute",
                                top: "12px",
                                left: "12px",
                                backgroundColor: "rgba(0, 0, 0, 0.6)",
                                backdropFilter: "blur(10px)",
                                padding: "6px 10px",
                                borderRadius: "4px",
                                border: "1px solid rgba(255, 255, 255, 0.1)",
                              }}
                            >
                              <Text
                                style={{
                                  fontSize: "11px",
                                  color: "#ffffff",
                                  fontWeight: 600,
                                  textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                                }}
                              >
                                {result.id.slice(-8)}
                              </Text>
                            </div>

                            {/* Timestamp Badge */}
                            {result.timestamp && (
                              <div
                                style={{
                                  position: "absolute",
                                  bottom: "12px",
                                  left: "12px",
                                  display: "inline-block",
                                  backgroundColor: "rgba(0, 0, 0, 0.6)",
                                  backdropFilter: "blur(10px)",
                                  padding: "4px 8px",
                                  borderRadius: "4px",
                                  border: "1px solid rgba(255, 255, 255, 0.1)",
                                }}
                              >
                                <CalendarOutlined
                                  style={{
                                    color: "#1890ff",
                                    marginRight: "4px",
                                    fontSize: "11px",
                                  }}
                                />
                                <Text
                                  style={{
                                    fontSize: "10px",
                                    color: "#ffffff",
                                    fontWeight: 500,
                                  }}
                                >
                                  {new Date(
                                    result.timestamp,
                                  ).toLocaleDateString()}
                                </Text>
                              </div>
                            )}

                            {/* Hover Overlay Effect */}
                            <div
                              style={{
                                position: "absolute",
                                inset: 0,
                                background:
                                  "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)",
                                opacity: 0,
                                transition: "opacity 0.3s ease",
                                pointerEvents: "none",
                              }}
                              className="card-hover-overlay"
                            />
                          </div>

                          {/* Cloud Coverage Section */}
                          <div
                            style={{
                              backgroundColor: "#030415",
                              padding: "12px",
                              borderRadius: "8px",
                              marginBottom: "10px",
                              border: "1px solid #293653",
                            }}
                          >
                            <Flex
                              justify="space-between"
                              align="middle"
                              style={{ marginBottom: "6px" }}
                            >
                              <Flex gap="6" align="middle">
                                <CloudOutlined
                                  style={{ color: "#1890ff", fontSize: "12px" }}
                                />
                                <Text
                                  style={{
                                    fontSize: "11px",
                                    color: "#b0b0b0",
                                    fontWeight: 500,
                                  }}
                                >
                                  Cloud Coverage
                                </Text>
                              </Flex>
                              <Text
                                style={{
                                  fontSize: "13px",
                                  color: "#1890ff",
                                  fontWeight: 600,
                                }}
                              >
                                {typeof result.value === "number"
                                  ? result.value.toFixed(1)
                                  : result.value}
                                %
                              </Text>
                            </Flex>

                            {/* Cloud Progress Bar */}
                            <div
                              style={{
                                width: "100%",
                                height: "6px",
                                backgroundColor: "#293653",
                                borderRadius: "3px",
                                overflow: "hidden",
                                position: "relative",
                              }}
                            >
                              <div
                                style={{
                                  width: `${Math.min(typeof result.value === "number" ? result.value : 0, 100)}%`,
                                  height: "100%",
                                  background:
                                    "linear-gradient(90deg, #52c41a 0%, #1890ff 50%, #ff4d4f 100%)",
                                  borderRadius: "3px",
                                  transition: "width 0.5s ease",
                                  position: "relative",
                                }}
                              >
                                {/* Glow Effect */}
                                <div
                                  style={{
                                    position: "absolute",
                                    inset: 0,
                                    background:
                                      "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)",
                                    animation: "shimmer 2s infinite",
                                  }}
                                />
                              </div>
                            </div>

                            <Flex
                              justify="space-between"
                              style={{ marginTop: "6px" }}
                            >
                              <Text
                                style={{ fontSize: "9px", color: "#52c41a" }}
                              >
                                Clear
                              </Text>
                              <Text
                                style={{ fontSize: "9px", color: "#ff4d4f" }}
                              >
                                Cloudy
                              </Text>
                            </Flex>
                          </div>

                          {/* Quality Section */}
                          <div
                            style={{
                              backgroundColor: "#030415",
                              padding: "12px",
                              borderRadius: "8px",
                              marginBottom: "10px",
                              border: "1px solid #293653",
                            }}
                          >
                            <Flex
                              justify="space-between"
                              align="middle"
                              style={{ marginBottom: "6px" }}
                            >
                              <Flex gap="6" align="middle">
                                <ThunderboltOutlined
                                  style={{ color: "#52c41a", fontSize: "12px" }}
                                />
                                <Text
                                  style={{
                                    fontSize: "11px",
                                    color: "#b0b0b0",
                                    fontWeight: 500,
                                  }}
                                >
                                  Image Quality
                                </Text>
                              </Flex>
                              <Text
                                style={{
                                  fontSize: "13px",
                                  color: "#52c41a",
                                  fontWeight: 600,
                                }}
                              >
                                Excellent
                              </Text>
                            </Flex>

                            {/* Quality Indicators */}
                            <Flex gap="8">
                              <div
                                style={{
                                  flex: 1,
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "4px",
                                }}
                              >
                                <Flex justify="space-between" align="middle">
                                  <Text
                                    style={{
                                      fontSize: "9px",
                                      color: "#b0b0b0",
                                    }}
                                  >
                                    Sharpness
                                  </Text>
                                  <Text
                                    style={{
                                      fontSize: "9px",
                                      color: "#52c41a",
                                      fontWeight: 600,
                                    }}
                                  >
                                    95%
                                  </Text>
                                </Flex>
                                <div
                                  style={{
                                    width: "100%",
                                    height: "3px",
                                    backgroundColor: "#293653",
                                    borderRadius: "1.5px",
                                    overflow: "hidden",
                                  }}
                                >
                                  <div
                                    style={{
                                      width: "95%",
                                      height: "100%",
                                      backgroundColor: "#52c41a",
                                      borderRadius: "1.5px",
                                    }}
                                  />
                                </div>
                              </div>
                              <div
                                style={{
                                  flex: 1,
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "4px",
                                }}
                              >
                                <Flex justify="space-between" align="middle">
                                  <Text
                                    style={{
                                      fontSize: "9px",
                                      color: "#b0b0b0",
                                    }}
                                  >
                                    Contrast
                                  </Text>
                                  <Text
                                    style={{
                                      fontSize: "9px",
                                      color: "#52c41a",
                                      fontWeight: 600,
                                    }}
                                  >
                                    88%
                                  </Text>
                                </Flex>
                                <div
                                  style={{
                                    width: "100%",
                                    height: "3px",
                                    backgroundColor: "#293653",
                                    borderRadius: "1.5px",
                                    overflow: "hidden",
                                  }}
                                >
                                  <div
                                    style={{
                                      width: "88%",
                                      height: "100%",
                                      backgroundColor: "#52c41a",
                                      borderRadius: "1.5px",
                                    }}
                                  />
                                </div>
                              </div>
                            </Flex>
                          </div>

                          {/* Coordinates */}
                          {result.coordinates &&
                            result.coordinates[0] !== undefined &&
                            result.coordinates[1] !== undefined && (
                              <div
                                style={{
                                  padding: "10px 16px",
                                  borderRadius: "4px",
                                  marginBottom: "10px",
                                  border: "1px solid #293653",
                                }}
                              >
                                <Flex
                                  justify="space-between"
                                  align="middle"
                                  style={{ marginBottom: "6px" }}
                                >
                                  <Flex gap="6" align="middle">
                                    <InfoCircleOutlined
                                      style={{
                                        color: "#1890ff",
                                        fontSize: "11px",
                                      }}
                                    />
                                    <Text
                                      style={{
                                        fontSize: "10px",
                                        color: "#b0b0b0",
                                        fontWeight: 500,
                                      }}
                                    >
                                      Location
                                    </Text>
                                  </Flex>
                                </Flex>
                                <div
                                  style={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr 1fr",
                                    gap: "8px",
                                  }}
                                >
                                  <div>
                                    <Text
                                      style={{
                                        fontSize: "9px",
                                        color: "#b0b0b0",
                                        display: "block",
                                        marginBottom: "2px",
                                      }}
                                    >
                                      Latitude
                                    </Text>
                                    <Text
                                      style={{
                                        fontSize: "11px",
                                        color: "white",
                                        fontFamily: "monospace",
                                      }}
                                    >
                                      {Array.isArray(result.coordinates) &&
                                      result.coordinates.length > 0
                                        ? (
                                            result.coordinates[0] as [
                                              number,
                                              number,
                                            ]
                                          )[0].toFixed(6)
                                        : typeof result.coordinates[0] ===
                                            "number"
                                          ? (
                                              result.coordinates[0] as number
                                            ).toFixed(6)
                                          : "N/A"}
                                    </Text>
                                  </div>
                                  <div>
                                    <Text
                                      style={{
                                        fontSize: "9px",
                                        color: "#b0b0b0",
                                        display: "block",
                                        marginBottom: "2px",
                                      }}
                                    >
                                      Longitude
                                    </Text>
                                    <Text
                                      style={{
                                        fontSize: "11px",
                                        color: "white",
                                        fontFamily: "monospace",
                                      }}
                                    >
                                      {Array.isArray(result.coordinates) &&
                                      result.coordinates.length > 0
                                        ? (
                                            result.coordinates[0] as [
                                              number,
                                              number,
                                            ]
                                          )[1].toFixed(6)
                                        : typeof result.coordinates[1] ===
                                            "number"
                                          ? (
                                              result.coordinates[1] as number
                                            ).toFixed(6)
                                          : "N/A"}
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
                                cloud:
                                  typeof result.value === "number"
                                    ? result.value
                                    : 0,
                                quality: "Excellent",
                                imageUrl: result.imageData?.thumbnailUrl,
                                price: 49.99,
                                quantity: 1,
                              };
                              addToCart(cartItem);
                            }}
                            disabled={isInCart(
                              `${result.name}-${result.timestamp}`,
                            )}
                            style={{
                              width: "100%",
                              marginTop: "12px",
                              height: "36px",
                              fontWeight: 500,
                              borderRadius: "6px",
                              background: isInCart(
                                `${result.name}-${result.timestamp}`,
                              )
                                ? "#52c41a"
                                : undefined,
                              borderColor: isInCart(
                                `${result.name}-${result.timestamp}`,
                              )
                                ? "#52c41a"
                                : undefined,
                            }}
                          >
                            {isInCart(`${result.name}-${result.timestamp}`)
                              ? "Added to Cart"
                              : "Add to Cart"}
                          </Button>
                        </Card>
                      ))}
                    </>
                  )}
              </>
            ) : (
              // No Success State
              <Alert
                message="No Results"
                description={apiResponse.message || "No data available"}
                type="warning"
                showIcon
                style={{ marginBottom: "16px" }}
              />
            )}
          </div>
        </div>
      </Sider>
    </>
  );
};

export default RightSidebar;
