/// <reference types="react" />
import React, { useState, useRef, useEffect } from "react";
import {
  Breadcrumb,
  Typography,
  Flex,
  Col,
  Input,
  Avatar as AntAvatar,
} from "antd";
import {
  SearchOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
  HomeOutlined,
  EyeOutlined,
  UserOutlined,
  StarOutlined,
  LockOutlined,
  LogoutOutlined,
  LeftOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

interface HeaderProps {
  title?: string;
  item?: string[];
  userProfile?: {
    name: string;
    role: string;
    avatar: string;
  };
  rightSidebarCollapsed?: boolean;
  onToggleRightSidebar?: () => void;
  sidebarCollapsed?: boolean;
  isFullWidth?: boolean;
  onOpenSidebar?: () => void;
  onOpenFeatureSidebar?: () => void;
}

const Header: React.FC<HeaderProps> = (props) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const avatarButtonRef = useRef<HTMLButtonElement>(null);

  const userProfile = props.userProfile || {
    name: "John Doe",
    role: "Administrator",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  };

  const [archLive, setArchLive] = useState<string>("arch");

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

  return (
    <>
      {/* Top Header Bar - Fixed floating overlay */}
      <div
        style={{
          position: "fixed",
          top: "10px",
          left: props.sidebarCollapsed ? "20px" : "340px",
          right: "10px",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
        }}
      >
        {/* Left Side Controls - Toggle Button + Arch/Live Tabs */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Sidebar Toggle Button */}
          {!props.isFullWidth && props.sidebarCollapsed && (
            <button
              onClick={props.onOpenSidebar}
              style={{
                backgroundColor: "#030415",
                borderRadius: "8px",
                padding: "10px 12px",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#3a4a6c")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#030415")
              }
              title="Open Sidebar"
            >
              <span style={{ color: "white", fontSize: "14px" }}>☰</span>
            </button>
          )}

          {/* Feature Sidebar Toggle Button */}
          {props.isFullWidth && (
            <button
              onClick={props.onOpenFeatureSidebar}
              style={{
                backgroundColor: "#030415",
                borderRadius: "8px",
                padding: "10px 12px",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#3a4a6c")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#293653")
              }
              title="Open Feature Sidebar"
            >
              <span style={{ color: "white", fontSize: "14px" }}>☰</span>
            </button>
          )}

          {/* Arch/Live Tab Buttons */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#030415",
              borderRadius: "6px",
              padding: "3px",
              gap: "4px",
            }}
          >
            <button
              onClick={() => setArchLive("arch")}
              style={{
                padding: "6px 14px",
                borderRadius: "4px",
                border: "none",
                backgroundColor:
                  archLive === "arch" ? "#0B5AFE" : "transparent",
                color: "#FFFFFF",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 500,
                transition: "all 0.2s",
              }}
            >
              Archive
            </button>
            {/* Divider Line */}
            <div
              style={{
                width: "1px",
                height: "20px",
                margin: "5px 10px",
                backgroundColor: "#FFFFFF",
              }}
            />
            <button
              onClick={() => setArchLive("live")}
              style={{
                padding: "6px 14px",
                borderRadius: "4px",
                border: "none",
                backgroundColor:
                  archLive === "live" ? "#2DBE09" : "transparent",
                color: "#FFFFFF",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 500,
                transition: "all 0.2s",
              }}
            >
              Live
            </button>
          </div>

          <Input
            placeholder="Search Location..."
            prefix={
              <SearchOutlined style={{ color: "rgba(255,255,255,0.5)" }} />
            }
            style={{
              backgroundColor: "#030415",
              border: "none",
              color: "#FFFFFF",
              height: "40px",
              flex: 1,
              width: "400px",
            }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            onClick={() => navigate("/feature/order")}
            style={{
              height: "40px",
              padding: "0 16px",
              backgroundColor: "#030415",
              border: "none",
              borderRadius: "8px",
              color: "#FFFFFF",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "14px",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#3a4a6c")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#030415")
            }
          >
            <ShoppingOutlined />
          </button>
          <button
            onClick={() => navigate("/feature/cart")}
            style={{
              height: "40px",
              padding: "0 16px",
              backgroundColor: "#030415",
              border: "none",
              borderRadius: "8px",
              color: "#FFFFFF",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "14px",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#3a4a6c")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#030415")
            }
          >
            <ShoppingCartOutlined />
          </button>

          <button
            ref={avatarButtonRef}
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              width: "46px",
              height: "46px",
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
            <AntAvatar
              src={userProfile.avatar}
              size={42}
              style={{ backgroundColor: "#1890ff" }}
            />
          </button>

          {/*props.rightSidebarCollapsed && (
            <button
              onClick={props.onToggleRightSidebar}
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                backgroundColor: "#293653",
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
          )*/}
        </div>
      </div>

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
          <div
            style={{
              padding: "16px",
              borderBottom: "1px solid #404d63",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <AntAvatar
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
            {[
              { icon: HomeOutlined, label: "Home", path: "/dashboard" },
              {
                icon: EyeOutlined,
                label: "Overview",
                path: "/feature/overview",
              },
              {
                icon: UserOutlined,
                label: "Profile",
                path: "/feature/profile",
              },
              {
                icon: StarOutlined,
                label: "Favorites",
                path: "/feature/favorites",
              },
              {
                icon: ShoppingCartOutlined,
                label: "Cart",
                path: "/feature/cart",
              },
              {
                icon: ShoppingOutlined,
                label: "Order",
                path: "/feature/order",
              },
              {
                icon: LockOutlined,
                label: "Change Password",
                path: "/feature/change-password",
              },
            ].map(({ icon: Icon, label, path }) => (
              <div
                key={path}
                style={{
                  padding: "10px 16px",
                  cursor: "pointer",
                  color: "#FFFFFF",
                  transition: "background-color 0.2s",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
                onClick={() => {
                  navigate(path);
                  setMenuOpen(false);
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#364762")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <Icon /> {label}
              </div>
            ))}
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
              onClick={() => {
                localStorage.removeItem("userToken");
                localStorage.removeItem("userData");
                navigate("/authentication/login");
                setMenuOpen(false);
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
    </>
  );
};

export default Header;
