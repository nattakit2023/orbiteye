import React from "react";
import { Layout, Button } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import "@/styles/sidebar.css";
import SearchArch from "./RightSidebar/SearchArch";
import Cart from "./RightSidebar/Cart";
import Order from "./RightSidebar/Order";
import { TransformedApiResponse } from "@/service/graphql/hooks/useStac";

const { Sider } = Layout;

export type RightSidebarMode = "search" | "cart" | "order";

interface RightSidebarProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
  mode?: RightSidebarMode;
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

const RightSidebar: React.FC<RightSidebarProps> = ({
  collapsed,
  onCollapse,
  mode = "search",
  apiResponse,
  isLoading = false,
  error = null,
  onResultHover,
  onResultClick,
}) => {
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
        }
        .rightsidebar-scroll::-webkit-scrollbar-thumb:hover {
          background: #1890ff;
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
          {/* Content based on mode */}
          <div style={{ flex: "1 1 auto", overflow: "hidden" }}>
            {mode === "search" && (
              <SearchArch
                apiResponse={apiResponse}
                isLoading={isLoading}
                error={error}
                onResultHover={onResultHover}
                onResultClick={onResultClick}
              />
            )}
            {mode === "cart" && <Cart />}
            {mode === "order" && <Order />}
          </div>

          {/* Close Button */}
          <Button
            type="text"
            icon={<CloseOutlined style={{ color: "white", fontSize: "16px" }} />}
            onClick={() => onCollapse(true)}
            style={{ position: "absolute", top: "20px", right: "20px", padding: "4px 8px", color: "white" }}
            title="Close Sidebar"
          />
        </div>
      </Sider>
    </>
  );
};

export default RightSidebar;
