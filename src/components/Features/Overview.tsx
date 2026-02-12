import React from "react";
import { Card, Row, Col, Statistic, Timeline, Badge } from "antd";
import {
  EyeOutlined,
  DownloadOutlined,
  StarOutlined,
  SearchOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

interface Activity {
  id: string;
  type: "search" | "download" | "favorite" | "view";
  title: string;
  description: string;
  timestamp: Date;
}

const Overview: React.FC = () => {
  // Mock data - replace with actual data from API
  const activities: Activity[] = [
    {
      id: "1",
      type: "search",
      title: "Searched Bangkok region",
      description: "Found 25 satellite images matching criteria",
      timestamp: new Date("2023-12-15T10:00:00"), // 1 hour ago
    },
    {
      id: "2",
      type: "download",
      title: "Downloaded satellite imagery",
      description: "Tokyo area - 2023-12-15",
      timestamp: new Date("2023-12-15T09:00:00"), // 2 hours ago
    },
    {
      id: "3",
      type: "favorite",
      title: "Added to favorites",
      description: "Singapore coastline view",
      timestamp: new Date("2023-12-14T10:00:00"), // 1 day ago
    },
    {
      id: "4",
      type: "view",
      title: "Viewed map region",
      description: "New York metropolitan area",
      timestamp: new Date("2023-12-13T10:00:00"), // 2 days ago
    },
  ];

  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "search":
        return <SearchOutlined style={{ color: "#1890ff" }} />;
      case "download":
        return <DownloadOutlined style={{ color: "#52c41a" }} />;
      case "favorite":
        return <StarOutlined style={{ color: "#faad14" }} />;
      case "view":
        return <EyeOutlined style={{ color: "#722ed1" }} />;
      default:
        return <ClockCircleOutlined style={{ color: "#8c8c8c" }} />;
    }
  };

  const getActivityColor = (type: Activity["type"]) => {
    switch (type) {
      case "search":
        return "#1890ff";
      case "download":
        return "#52c41a";
      case "favorite":
        return "#faad14";
      case "view":
        return "#722ed1";
      default:
        return "#8c8c8c";
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div
      style={{
        padding: "24px",
        minHeight: "100vh",
        backgroundColor: "#030416",
        color: "#ffffff",
      }}
    >
      <h1
        style={{
          fontSize: "28px",
          fontWeight: 700,
          marginBottom: "24px",
          color: "#ffffff",
        }}
      >
        Account Overview
      </h1>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: "32px" }}>
        <Col xs={24} sm={12} md={6}>
          <Card
            style={{
              backgroundColor: "#0f1828",
              border: "1px solid #404d63",
              borderRadius: "12px",
              height: "100%",
            }}
          >
            <Statistic
              title={
                <span style={{ color: "#8c8c8c", fontSize: "14px" }}>
                  Total Searches
                </span>
              }
              value={156}
              prefix={<SearchOutlined style={{ color: "#1890ff" }} />}
              valueStyle={{ color: "#ffffff", fontSize: "24px", fontWeight: 600 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card
            style={{
              backgroundColor: "#0f1828",
              border: "1px solid #404d63",
              borderRadius: "12px",
              height: "100%",
            }}
          >
            <Statistic
              title={
                <span style={{ color: "#8c8c8c", fontSize: "14px" }}>
                  Downloads
                </span>
              }
              value={42}
              prefix={<DownloadOutlined style={{ color: "#52c41a" }} />}
              valueStyle={{ color: "#ffffff", fontSize: "24px", fontWeight: 600 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card
            style={{
              backgroundColor: "#0f1828",
              border: "1px solid #404d63",
              borderRadius: "12px",
              height: "100%",
            }}
          >
            <Statistic
              title={
                <span style={{ color: "#8c8c8c", fontSize: "14px" }}>
                  Favorites
                </span>
              }
              value={18}
              prefix={<StarOutlined style={{ color: "#faad14" }} />}
              valueStyle={{ color: "#ffffff", fontSize: "24px", fontWeight: 600 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card
            style={{
              backgroundColor: "#0f1828",
              border: "1px solid #404d63",
              borderRadius: "12px",
              height: "100%",
            }}
          >
            <Statistic
              title={
                <span style={{ color: "#8c8c8c", fontSize: "14px" }}>
                  Map Views
                </span>
              }
              value={234}
              prefix={<EyeOutlined style={{ color: "#722ed1" }} />}
              valueStyle={{ color: "#ffffff", fontSize: "24px", fontWeight: 600 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Recent Activity Timeline */}
      <Card
        title="Recent Activity"
        style={{
          backgroundColor: "#0f1828",
          border: "1px solid #404d63",
          borderRadius: "12px",
        }}
        headStyle={{
          borderBottom: "1px solid #404d63",
          color: "#ffffff",
        }}
      >
        <Timeline
          items={activities.map((activity) => ({
            dot: getActivityIcon(activity.type),
            color: getActivityColor(activity.type),
            children: (
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "4px",
                  }}
                >
                  <span
                    style={{
                      color: "#ffffff",
                      fontSize: "15px",
                      fontWeight: 500,
                      flex: 1,
                    }}
                  >
                    {activity.title}
                  </span>
                  <Badge
                    count={formatTimeAgo(activity.timestamp)}
                    style={{
                      backgroundColor: "#0f1828",
                      border: "1px solid #404d63",
                      color: "#8c8c8c",
                      fontSize: "11px",
                      height: "20px",
                      lineHeight: "20px",
                      padding: "0 8px",
                    }}
                  />
                </div>
                <div
                  style={{
                    color: "#8c8c8c",
                    fontSize: "13px",
                    lineHeight: "1.4",
                  }}
                >
                  {activity.description}
                </div>
              </div>
            ),
          }))}
        />
      </Card>
    </div>
  );
};

export default Overview;