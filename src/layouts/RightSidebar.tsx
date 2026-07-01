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
  selectedSatellites?: string[];
  apiResponse?: TransformedApiResponse | null;
  isLoading?: boolean;
  error?: Error | null;
  onResultHover?: (result: {
    id: string;
    coordinates?: number[];
  } | null) => void;
  onResultClick?: (result: {
    id: string;
    coordinates?: number[];
  }) => void;
}

const RightSidebar: React.FC<RightSidebarProps> = ({
  collapsed,
  onCollapse,
  mode = "search",
  selectedSatellites = [],
  apiResponse,
  isLoading = false,
  error = null,
  onResultHover,
  onResultClick,
}) => {
  return (
    <>
      <style>{`
        .ant-layout-sider-right .ant-layout-content {
          scrollbar-width: thin;
          scrollbar-color: #3b4045 #1c2128;
        }
        .ant-layout-sider-right ::-webkit-scrollbar {
          width: 6px;
        }
        .ant-layout-sider-right ::-webkit-scrollbar-track {
          background: #1c2128;
          border-radius: 3px;
        }
        .ant-layout-sider-right ::-webkit-scrollbar-thumb {
          background: #3b4045;
          border-radius: 3px;
        }
        .ant-layout-sider-right ::-webkit-scrollbar-thumb:hover {
          background: #484f58;
        }
        .ant-layout-sider-right > .ant-layout-sider-children {
          overflow-y: auto !important;
          overflow-x: hidden;
        }
      `}</style>

      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={onCollapse}
        breakpoint="lg"
        collapsedWidth="0"
        width={380}
        theme="dark"
        className="ant-layout-sider-right"
        style={{
          padding: "0",
          height: "calc(100vh - 80px)",
          color: "white",
          background: "#03041590",
          marginRight: "10px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: collapsed ? "0" : "15px 15px 15px 15px",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            opacity: collapsed ? 0 : 1,
            transition: "padding 0.2s ease, opacity 0.2s ease",
          }}
        >
          {/* Content based on mode */}
          <div style={{ flex: 1, minHeight: 0, overflow: "auto" }}>
            {mode === "search" && (
              <SearchArch
                apiResponse={apiResponse}
                isLoading={isLoading}
                error={error}
                selectedSatellites={selectedSatellites}
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
