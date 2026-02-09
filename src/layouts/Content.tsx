import React from "react";
import { Layout, Button } from "antd";
import { Outlet } from "react-router-dom";
import { MenuOutlined } from "@ant-design/icons";

const { Content } = Layout;

interface ContentsProps {
  data: string;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  rightSidebarCollapsed: boolean;
  setRightSidebarCollapsed: (collapsed: boolean) => void;
  hoveredResult?: any | null;
  clickedResult?: any | null;
  apiResponse?: any;
}

const Contents: React.FC<ContentsProps> = (props) => {
  return (
    <>
      {/* Open Toggle Button - Shows in Dashboard when sidebar is closed */}
      {props.sidebarCollapsed && (
        <Button
          type="text"
          icon={<MenuOutlined style={{ color: "white", fontSize: "14px" }} />}
          onClick={() => props.setSidebarCollapsed(false)}
          style={{
            position: "absolute",
            left: "20px",
            top: "20px",
            zIndex: 1000,
            backgroundColor: "#293653",
            borderRadius: "50%",
            padding: "12px 8px",
            boxShadow: "2px 0 8px rgba(0,0,0,0.3)",
            transition: "background-color 0.2s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = "#3a4a6c";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = "#293653";
          }}
          title="Open Sidebar"
        />
      )}

      {/* Theme 1 */}
      <Content style={{ position: "relative" }}>
        <Outlet
          context={{
            rightSidebarCollapsed: props.rightSidebarCollapsed,
            setRightSidebarCollapsed: props.setRightSidebarCollapsed,
            hoveredResult: props.hoveredResult,
            clickedResult: props.clickedResult,
            apiResponse: props.apiResponse,
          }}
        />
      </Content>

      {/* Theme 2 */}
      {/* <Content
        style={{
          padding: "0 48px",
        }}
      >
        <Layout
          style={{
            margin: "16px 0",
            padding: "24px 0",
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Content
            style={{
              padding: "0 24px",
              minHeight: 280,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Content> */}
    </>
  );
};

export default Contents;
