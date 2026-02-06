import React, { useState, useEffect, useRef, lazy, Suspense } from "react";
import Button from "antd/es/button";
import Avatar from "antd/es/avatar";
import { Spin, message } from "antd";
import {
  MenuOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  EyeOutlined,
  UserOutlined,
  StarOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  LockOutlined,
  LogoutOutlined,
  CopyOutlined,
  LeftOutlined,
} from "@ant-design/icons";
import { useOutletContext } from "react-router-dom";
import "@/styles/dashboard.css";

// Lazy load the map component
const MapComponent = lazy(() => import("./MapComponent"));

interface DrawnShape {
  type: "circle" | "polygon" | "rectangle";
  coordinates: Array<[number, number]>;
  radius?: number;
  timestamp?: number;
  id: string;
}

interface OutletContext {
  rightSidebarCollapsed: boolean;
  setRightSidebarCollapsed: (collapsed: boolean) => void;
}

const Dashboard: React.FC = () => {
  const { rightSidebarCollapsed, setRightSidebarCollapsed } =
    useOutletContext<OutletContext>();
  const [menuOpen, setMenuOpen] = useState(false);
  const [drawingMode, setDrawingMode] = useState<
    "circle" | "polygon" | "rectangle" | null
  >(null);
  const [drawnShapes, setDrawnShapes] = useState<DrawnShape[]>([]);
  const [copiedShapeId, setCopiedShapeId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const avatarButtonRef = useRef<HTMLButtonElement>(null);

  // User Profile Data
  const userProfile = {
    name: "John Doe",
    role: "Administrator",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  };

  // Sample marker data - replace with your actual data
  const markers: [number, number][] = [];

  useEffect(() => {
    const handleStartDrawing = (event: Event) => {
      const customEvent = event as CustomEvent;
      setDrawingMode(customEvent.detail.shapeType);
    };

    const handleClearDrawings = () => {
      setDrawingMode(null);
      setDrawnShapes([]);
    };

    const handleShapeCompleted = (event: Event) => {
      const customEvent = event as CustomEvent;
      setDrawnShapes((prev) => [
        ...prev,
        { ...customEvent.detail, id: Date.now().toString() },
      ]);
      setDrawingMode(null);
    };

    window.addEventListener("startDrawing", handleStartDrawing);
    window.addEventListener("clearDrawings", handleClearDrawings);
    window.addEventListener("shapeCompleted", handleShapeCompleted);

    return () => {
      window.removeEventListener("startDrawing", handleStartDrawing);
      window.removeEventListener("clearDrawings", handleClearDrawings);
      window.removeEventListener("shapeCompleted", handleShapeCompleted);
    };
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        avatarButtonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !avatarButtonRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  // Handle copying coordinates to clipboard
  const handleCopyCoordinates = (shape: DrawnShape) => {
    const coordsStr = shape.coordinates
      .map((coord) => `${coord[0].toFixed(6)},${coord[1].toFixed(6)}`)
      .join(" | ");

    // Copy to clipboard
    navigator.clipboard
      .writeText(coordsStr)
      .then(() => {
        setCopiedShapeId(shape.id);
        message.success("Coordinates copied to clipboard!", 1);

        // Reset the copied state after 2 seconds
        setTimeout(() => {
          setCopiedShapeId(null);
        }, 2000);
      })
      .catch((err) => {
        message.error("Failed to copy coordinates");
        console.error("Failed to copy:", err);
      });
  };

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      {/* Top Right Controls */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
        }}
      >
        {/* Avatar Toggle Button */}
        <button
          ref={avatarButtonRef}
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            border: menuOpen ? "3px solid #1890ff" : "2px solid transparent",
            backgroundColor: "transparent",
            padding: 0,
            cursor: "pointer",
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Avatar
            src={userProfile.avatar}
            size={46}
            style={{ backgroundColor: "#1890ff" }}
          />
        </button>

        {/* Right Sidebar Toggle Button - Shows when sidebar is closed */}
        {rightSidebarCollapsed && (
          <button
            onClick={() => setRightSidebarCollapsed(false)}
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              backgroundColor: "#293653",
              // border: "2px solid #1890ff",
              padding: 0,
              cursor: "pointer",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor =
                "#3a4a6c";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor =
                "#293653";
            }}
            title="Open Right Sidebar"
          >
            <LeftOutlined style={{ color: "white", fontSize: "12px" }} />
          </button>
        )}
      </div>

      {/* Menu Popup */}
      {menuOpen && (
        <div
          ref={menuRef}
          className="menu-popup"
          style={{
            position: "absolute",
            top: "70px",
            right: "20px",
            zIndex: 1001,
            backgroundColor: "#030416",
            border: "1px solid #404d63",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
            minWidth: "220px",
          }}
        >
          {/* Profile Section */}
          <div
            style={{
              padding: "16px",
              borderBottom: "1px solid #404d63",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <Avatar
              src={userProfile.avatar}
              size={48}
              style={{ backgroundColor: "#1890ff" }}
            />
            <div style={{ flex: 1 }}>
              <p
                style={{
                  margin: "0 0 4px 0",
                  fontSize: "14px",
                  color: "#FFFFFF",
                  fontWeight: 600,
                }}
              >
                {userProfile.name}
              </p>
              <p style={{ margin: 0, fontSize: "12px", color: "#999999" }}>
                {userProfile.role}
              </p>
            </div>
          </div>

          <div style={{ padding: "12px 0" }}>
            <div
              style={{
                padding: "10px 16px",
                cursor: "pointer",
                color: "#FFFFFF",
                transition: "background-color 0.2s",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#364762")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <HomeOutlined /> Home
            </div>
            <div
              style={{
                padding: "10px 16px",
                cursor: "pointer",
                color: "#FFFFFF",
                transition: "background-color 0.2s",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#364762")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <EyeOutlined /> Overview
            </div>
            <div
              style={{
                padding: "10px 16px",
                cursor: "pointer",
                color: "#FFFFFF",
                transition: "background-color 0.2s",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#364762")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <UserOutlined /> Profile
            </div>
            <div
              style={{
                padding: "10px 16px",
                cursor: "pointer",
                color: "#FFFFFF",
                transition: "background-color 0.2s",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#364762")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <StarOutlined /> Favorites
            </div>
            <div
              style={{
                padding: "10px 16px",
                cursor: "pointer",
                color: "#FFFFFF",
                transition: "background-color 0.2s",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#364762")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <ShoppingCartOutlined /> Cart
            </div>
            <div
              style={{
                padding: "10px 16px",
                cursor: "pointer",
                color: "#FFFFFF",
                transition: "background-color 0.2s",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#364762")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <ShoppingOutlined /> Order
            </div>
            <div
              style={{
                padding: "10px 16px",
                cursor: "pointer",
                color: "#FFFFFF",
                transition: "background-color 0.2s",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#364762")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <LockOutlined /> Change Password
            </div>
            <div
              style={{
                padding: "10px 16px",
                cursor: "pointer",
                color: "#FF6B6B",
                transition: "background-color 0.2s",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                borderTop: "1px solid #404d63",
                marginTop: "8px",
                paddingTop: "12px",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#364762")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <LogoutOutlined /> Logout
            </div>
          </div>
        </div>
      )}

      {/* Lazy loaded MapComponent with Suspense fallback */}
      <Suspense
        fallback={
          <Spin
            size="large"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        }
      >
        <MapComponent drawingMode={drawingMode} markers={markers} />
      </Suspense>

      {/* Drawn Shapes Display - Center Bottom Popup */}
      {drawnShapes.length > 0 && (
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 999,
            backgroundColor: "rgba(41, 54, 83, 0.95)",
            backdropFilter: "blur(10px)",
            border: "1px solid #404d63",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
            padding: "12px 16px",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "12px",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            {drawnShapes.map((shape, idx) => {
              const coordsStr = shape.coordinates
                .map((coord) => `${coord[0].toFixed(6)},${coord[1].toFixed(6)}`)
                .join(" | ");
              const displayCoords =
                coordsStr.length > 40
                  ? coordsStr.substring(0, 40) + "..."
                  : coordsStr;
              const isCopied = copiedShapeId === shape.id;

              return (
                <div
                  key={shape.id}
                  title="Click to copy coordinates"
                  onClick={() => handleCopyCoordinates(shape)}
                  style={{
                    padding: "8px 12px",
                    backgroundColor: isCopied
                      ? "rgba(82, 196, 26, 0.3)"
                      : "rgba(31, 41, 55, 0.8)",
                    borderRadius: "4px",
                    fontSize: "11px",
                    color: "#FFFFFF",
                    border: isCopied
                      ? "2px solid #52c41a"
                      : "1px solid #374151",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    maxWidth: "200px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                  onMouseEnter={(e) => {
                    if (!isCopied) {
                      e.currentTarget.style.backgroundColor =
                        "rgba(41, 54, 83, 1)";
                      e.currentTarget.style.borderColor = "#1890ff";
                    } else {
                      e.currentTarget.style.backgroundColor =
                        "rgba(82, 196, 26, 0.4)";
                      e.currentTarget.style.borderColor = "#52c41a";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isCopied) {
                      e.currentTarget.style.backgroundColor =
                        "rgba(31, 41, 55, 0.8)";
                      e.currentTarget.style.borderColor = "#374151";
                    } else {
                      e.currentTarget.style.backgroundColor =
                        "rgba(82, 196, 26, 0.3)";
                      e.currentTarget.style.borderColor = "#52c41a";
                    }
                  }}
                >
                  <CopyOutlined
                    style={{
                      fontSize: "12px",
                      color: isCopied ? "#52c41a" : "#999",
                    }}
                  />
                  <span style={{ fontWeight: 600, marginRight: "4px" }}>
                    {idx + 1}. {shape.type.toUpperCase()}:
                  </span>
                  <span>{coordsStr}</span>
                </div>
              );
            })}
            <button
              onClick={() => setDrawnShapes([])}
              style={{
                background: "none",
                border: "none",
                color: "#999999",
                cursor: "pointer",
                fontSize: "14px",
                padding: "0 4px",
                transition: "color 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#FF6B6B")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#999999")}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
