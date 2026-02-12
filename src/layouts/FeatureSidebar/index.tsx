import React from "react";
import { useNavigate } from "react-router-dom";
import { Avatar } from "antd";
import {
  HomeOutlined,
  EyeOutlined,
  UserOutlined,
  StarOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  LockOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

interface MenuItem {
  key: string;
  icon: React.ReactNode;
  label: string;
  route: string;
  color?: string;
}

interface SidebarProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
  userProfile: {
    name: string;
    avatar: string;
    role: string;
  };
}

const FeatureSidebar: React.FC<SidebarProps> = ({
  collapsed,
  onCollapse,
  userProfile,
}) => {
  const [activeRoute, setActiveRoute] = React.useState<string>("/feature/overview");
  const navigate = useNavigate();
  const location = window.location.pathname;

  const menuItems: MenuItem[] = [
    {
      key: "home",
      icon: <HomeOutlined />,
      label: "Home",
      route: "/dashboard",
    },
    {
      key: "overview",
      icon: <EyeOutlined />,
      label: "Overview",
      route: "/feature/overview",
    },
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Profile",
      route: "/feature/profile",
    },
    {
      key: "favorites",
      icon: <StarOutlined />,
      label: "Favorites",
      route: "/feature/favorites",
    },
    {
      key: "cart",
      icon: <ShoppingCartOutlined />,
      label: "Cart",
      route: "/feature/cart",
    },
    {
      key: "order",
      icon: <ShoppingOutlined />,
      label: "Order",
      route: "/feature/order",
    },
    {
      key: "change-password",
      icon: <LockOutlined />,
      label: "Change Password",
      route: "/feature/change-password",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      route: "/login",
      color: "#FF6B6B",
    },
  ];

  const handleMenuClick = (item: MenuItem) => {
    if (item.key === "logout") {
      // Handle logout
      localStorage.removeItem("userToken");
      localStorage.removeItem("userData");
      navigate("/login");
    } else {
      // Navigate to route
      navigate(item.route);
    }
  };

  React.useEffect(() => {
    setActiveRoute(location);
  }, [location]);

  return (
    <div
      style={{
        width: collapsed ? "80px" : "300px",
        height: "100vh",
        backgroundColor: "#030416",
        borderRight: "1px solid #404d63",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.3s ease",
      }}
    >
      {/* User Profile Section */}
      <div
        style={{
          padding: collapsed ? "16px 8px" : "24px 16px",
          borderBottom: "1px solid #404d63",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: collapsed ? "8px" : "12px",
        }}
      >
        {!collapsed && (
          <Avatar
            src={userProfile.avatar}
            size={64}
            style={{
              backgroundColor: "#1890ff",
              border: "2px solid #1890ff",
              marginBottom: "8px",
            }}
          />
        )}
        <div
          style={{
            textAlign: "center",
            color: "#ffffff",
            width: "100%",
          }}
        >
          {!collapsed && (
            <div
              style={{
                fontSize: "14px",
                fontWeight: 600,
                marginBottom: "4px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {userProfile.name}
            </div>
          )}
          <div
            style={{
              fontSize: collapsed ? "11px" : "12px",
              color: "#8c8c8c",
              fontWeight: collapsed ? 500 : 400,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {collapsed ? userProfile.name : userProfile.role}
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div
        style={{
          flex: 1,
          padding: "16px 8px",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {menuItems.map((item) => (
          <div
            key={item.key}
            onClick={() => handleMenuClick(item)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: collapsed ? "0" : "12px",
              padding: "12px 8px",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              backgroundColor:
                activeRoute === item.route ? "#1890ff" : "transparent",
              color: item.color || (activeRoute === item.route ? "#ffffff" : "#ffffff"),
              marginBottom: "4px",
              justifyContent: collapsed ? "center" : "flex-start",
            }}
            onMouseEnter={(e) => {
              if (activeRoute !== item.route) {
                (e.currentTarget as HTMLElement).style.backgroundColor = "#364762";
              }
            }}
            onMouseLeave={(e) => {
              if (activeRoute !== item.route) {
                (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
              }
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: collapsed ? "18px" : "20px",
                minWidth: "24px",
              }}
            >
              {item.icon}
            </div>
            {!collapsed && (
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  flex: 1,
                }}
              >
                {item.label}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Collapse Button */}
      <div
        style={{
          padding: "16px 8px",
          borderTop: "1px solid #404d63",
        }}
      >
        <div
          onClick={() => onCollapse(!collapsed)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "flex-end",
            gap: "8px",
            padding: "8px 12px",
            borderRadius: "8px",
            cursor: "pointer",
            backgroundColor: "#0f1828",
            color: "#ffffff",
            transition: "all 0.2s ease",
            width: "100%",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = "#1890ff";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = "#0f1828";
          }}
        >
          <span style={{ fontSize: collapsed ? "18px" : "14px" }}>
            {collapsed ? "➡" : "◀"}
          </span>
          {!collapsed && <span>Collapse Sidebar</span>}
        </div>
      </div>
    </div>
  );
};

export default FeatureSidebar;
