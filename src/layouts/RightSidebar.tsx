import React from "react";
import Col from "antd/es/col";
import Flex from "antd/es/flex";
import Layout from "antd/es/layout";
import Row from "antd/es/row";
import Button from "antd/es/button";
import Card from "antd/es/card";
import Spin from "antd/es/spin";
import Typography from "antd/es/typography";
import Alert from "antd/es/alert";
import Empty from "antd/es/empty";
import { RightOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import "@/styles/sidebar.css";
import type { TransformedApiResponse } from "@/service/api";

const { Text } = Typography;

const { Sider } = Layout;

interface RightSidebarProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
  apiResponse?: TransformedApiResponse | null;
  isLoading?: boolean;
  error?: Error | null;
}

const RightSidebar: React.FC<RightSidebarProps> = ({
  collapsed,
  onCollapse,
  apiResponse,
  isLoading = false,
  error = null,
}) => {
  return (
    <>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={onCollapse}
        breakpoint="lg"
        collapsedWidth="0"
        width={280}
        theme="dark"
        className="dark"
        style={{
          background: "#0f1419",
          padding: "0",
          height: "100vh",
          color: "white",
        }}
      >
        {/* Content Wrapper with padding */}
        <div
          style={{
            padding: collapsed ? "0" : "15px 20px",
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
                style={{ position: "relative" }}
              >
                <Col
                  span={6}
                  style={{ justifyContent: "start", display: "flex" }}
                >
                  <Button
                    type="text"
                    icon={
                      <RightOutlined
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
                <Col span={12}>
                  <div
                    style={{
                      fontSize: "18px",
                      fontWeight: "600",
                      color: "white",
                      textAlign: "center",
                    }}
                  >
                    Results
                  </div>
                </Col>
                <Col span={6}></Col>
              </Row>
            </Flex>
          </div>

          {/* Middle Section - Content */}
          <div
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
                  type="secondary"
                  style={{ marginTop: "16px", fontSize: "14px" }}
                >
                  Analyzing shape...
                </Text>
              </div>
            ) : error ? (
              // Error State
              <Alert
                message="Error"
                description={apiResponse?.error || error.message || "Failed to fetch results"}
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
                  <Text type="secondary">
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
                    backgroundColor: "#1a2332",
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
                    <Text style={{ marginLeft: "8px", fontSize: "14px", color: "white" }}>
                      {apiResponse.data.shapeAnalysis.type.toUpperCase()}
                    </Text>
                  </div>
                  <div style={{ marginBottom: "8px" }}>
                    <Text style={{ fontSize: "12px", color: "#1890ff" }}>
                      Area:
                    </Text>
                    <Text style={{ marginLeft: "8px", fontSize: "14px", color: "white" }}>
                      {apiResponse.data.shapeAnalysis.area.toLocaleString()} m²
                    </Text>
                  </div>
                  <div style={{ marginBottom: "8px" }}>
                    <Text style={{ fontSize: "12px", color: "#1890ff" }}>
                      Perimeter:
                    </Text>
                    <Text style={{ marginLeft: "8px", fontSize: "14px", color: "white" }}>
                      {apiResponse.data.shapeAnalysis.perimeter.toLocaleString()} m
                    </Text>
                  </div>
                  <div>
                    <Text style={{ fontSize: "12px", color: "#1890ff" }}>
                      Centroid:
                    </Text>
                    <Text style={{ marginLeft: "8px", fontSize: "14px", color: "white" }}>
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
                    backgroundColor: "#1a2332",
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
                    <Text style={{ marginLeft: "8px", fontSize: "14px", color: "white" }}>
                      {apiResponse.data.statistics.pointCount}
                    </Text>
                  </div>
                  <div>
                    <Text style={{ fontSize: "12px", color: "#1890ff" }}>
                      Bounding Box:
                    </Text>
                  </div>
                  <div style={{ marginLeft: "16px", fontSize: "13px", color: "#b0b0b0" }}>
                    <div>
                      Min: {apiResponse.data.statistics.boundingBox.minLat.toFixed(6)},{" "}
                      {apiResponse.data.statistics.boundingBox.minLng.toFixed(6)}
                    </div>
                    <div>
                      Max: {apiResponse.data.statistics.boundingBox.maxLat.toFixed(6)},{" "}
                      {apiResponse.data.statistics.boundingBox.maxLng.toFixed(6)}
                    </div>
                  </div>
                </Card>

                {/* Results Section */}
                {apiResponse.data.results && apiResponse.data.results.length > 0 && (
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
                      <Text style={{ color: "white", fontSize: "16px", fontWeight: 600 }}>
                        Analysis Results
                      </Text>
                    </div>
                    {apiResponse.data.results.map((result) => (
                      <Card
                        key={result.id}
                        size="small"
                        style={{
                          backgroundColor: "#1a2332",
                          borderColor: "#293653",
                          marginBottom: "8px",
                        }}
                        bodyStyle={{ padding: "10px" }}
                      >
                        <Flex
                          justify="space-between"
                          align="middle"
                          style={{ marginBottom: "4px" }}
                        >
                          <Text style={{ fontSize: "14px", color: "white" }}>
                            {result.name}
                          </Text>
                          <Text style={{ fontSize: "12px", color: "#1890ff", fontWeight: 600 }}>
                            {result.value}
                          </Text>
                        </Flex>
                        {result.coordinates && (
                          <Text type="secondary" style={{ fontSize: "11px" }}>
                            {result.coordinates[0].toFixed(6)},{" "}
                            {result.coordinates[1].toFixed(6)}
                          </Text>
                        )}
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
