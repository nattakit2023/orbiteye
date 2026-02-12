import React, { useState } from "react";
import {
  Card,
  Row,
  Col,
  Button,
  Image,
  Tag,
  Empty,
  Popconfirm,
  message,
} from "antd";
import {
  StarFilled,
  DeleteOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  EyeOutlined,
  DownloadOutlined,
} from "@ant-design/icons";

interface FavoriteItem {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  location?: string;
  dateAdded: Date;
  category: "satellite-image" | "search-result" | "map-region";
}

const Favorites: React.FC = () => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([
    {
      id: "1",
      title: "Bangkok City Center",
      description: "High-resolution satellite imagery of downtown Bangkok",
      imageUrl: "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=400",
      location: "Bangkok, Thailand",
      dateAdded: new Date("2023-12-15"),
      category: "satellite-image",
    },
    {
      id: "2",
      title: "Tokyo Bay Area",
      description: "Coastal region with detailed urban infrastructure",
      imageUrl: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400",
      location: "Tokyo, Japan",
      dateAdded: new Date("2023-12-10"),
      category: "satellite-image",
    },
    {
      id: "3",
      title: "Singapore Skyline",
      description: "Night-time view of Singapore's CBD and marina bay",
      imageUrl: "https://images.unsplash.com/photo-1506318137071-a8ebb06d3cc7?w=400",
      location: "Singapore",
      dateAdded: new Date("2023-12-08"),
      category: "satellite-image",
    },
    {
      id: "4",
      title: "New York Harbor",
      description: "Port and surrounding metropolitan area",
      location: "New York, USA",
      dateAdded: new Date("2023-12-05"),
      category: "map-region",
    },
    {
      id: "5",
      title: "San Francisco Bay",
      description: "Bay area with bridges and cityscape",
      location: "San Francisco, USA",
      dateAdded: new Date("2023-12-02"),
      category: "map-region",
    },
  ]);

  const handleRemoveFavorite = (id: string) => {
    setFavorites(favorites.filter((item) => item.id !== id));
    message.success("Removed from favorites");
  };

  const getCategoryColor = (category: FavoriteItem["category"]) => {
    switch (category) {
      case "satellite-image":
        return "#1890ff";
      case "search-result":
        return "#52c41a";
      case "map-region":
        return "#722ed1";
      default:
        return "#8c8c8c";
    }
  };

  const getCategoryText = (category: FavoriteItem["category"]) => {
    switch (category) {
      case "satellite-image":
        return "Satellite Image";
      case "search-result":
        return "Search Result";
      case "map-region":
        return "Map Region";
      default:
        return "Other";
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <h1
          style={{
            fontSize: "28px",
            fontWeight: 700,
            color: "#ffffff",
            margin: 0,
          }}
        >
          My Favorites
        </h1>
        <Button
          icon={<DeleteOutlined />}
          danger
          onClick={() => {
            setFavorites([]);
            message.success("All favorites cleared");
          }}
          style={{
            borderColor: "#ff4d4f",
            color: "#ff4d4f",
          }}
        >
          Clear All
        </Button>
      </div>

      {favorites.length === 0 ? (
        <Card
          style={{
            backgroundColor: "#0f1828",
            border: "1px solid #404d63",
            borderRadius: "12px",
            textAlign: "center",
            padding: "60px 24px",
          }}
        >
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <span style={{ color: "#8c8c8c", fontSize: "14px" }}>
                  No favorites yet. Start exploring and add items to your favorites!
                </span>
            }
          />
        </Card>
      ) : (
        <Row gutter={[16, 16]}>
          {favorites.map((favorite) => (
            <Col xs={24} sm={12} lg={8} xl={6} key={favorite.id}>
              <Card
                hoverable
                style={{
                  backgroundColor: "#0f1828",
                  border: "1px solid #404d63",
                  borderRadius: "12px",
                  height: "100%",
                  overflow: "hidden",
                }}
                cover={
                  favorite.imageUrl ? (
                    <div
                      style={{
                        position: "relative",
                        height: "200px",
                        overflow: "hidden",
                      }}
                    >
                      <Image
                        src={favorite.imageUrl}
                        alt={favorite.title}
                        preview={false}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          top: "8px",
                          right: "8px",
                        }}
                      >
                        <StarFilled style={{ color: "#faad14", fontSize: "20px" }} />
                      </div>
                    </div>
                  ) : null
                }
                actions={[
                  <Popconfirm
                    key="remove"
                    title="Remove from favorites?"
                    description="This action cannot be undone"
                    onConfirm={() => handleRemoveFavorite(favorite.id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button
                      type="text"
                      icon={<DeleteOutlined />}
                      style={{ color: "#ff4d4f" }}
                    >
                      Remove
                    </Button>
                  </Popconfirm>,
                  <Button
                    key="view"
                    type="text"
                    icon={<EyeOutlined />}
                    style={{ color: "#1890ff" }}
                    onClick={() => message.info("View functionality coming soon!")}
                  >
                    View
                  </Button>,
                  <Button
                    key="download"
                    type="text"
                    icon={<DownloadOutlined />}
                    style={{ color: "#52c41a" }}
                    onClick={() => message.info("Download functionality coming soon!")}
                  >
                    Download
                  </Button>,
                ]}
              >
                <Tag
                  color={getCategoryColor(favorite.category)}
                  style={{
                    marginBottom: "8px",
                    border: "none",
                    fontWeight: 500,
                  }}
                >
                  {getCategoryText(favorite.category)}
                </Tag>
                <h3
                  style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    marginBottom: "8px",
                    color: "#ffffff",
                    margin: 0,
                  }}
                >
                  {favorite.title}
                </h3>
                <p
                  style={{
                    color: "#8c8c8c",
                    fontSize: "13px",
                    marginBottom: "12px",
                    lineHeight: "1.5",
                  }}
                >
                  {favorite.description}
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    color: "#8c8c8c",
                    fontSize: "12px",
                  }}
                >
                  {favorite.location && (
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <EnvironmentOutlined
                        style={{ marginRight: "4px", color: "#1890ff" }}
                      />
                      {favorite.location}
                    </div>
                  )}
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <CalendarOutlined
                      style={{ marginRight: "4px", color: "#52c41a" }}
                    />
                    {formatDate(favorite.dateAdded)}
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default Favorites;