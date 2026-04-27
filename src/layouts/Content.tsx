/// <reference types="react" />
import React from "react";
import { Layout, Button, Select } from "antd";
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
  isFullWidth?: boolean;
  featureSidebarOpen?: boolean;
  setFeatureSidebarOpen?: (open: boolean) => void;
}

const Contents: React.FC<ContentsProps> = (props) => {
  const [archLive, setArchLive] = React.useState<string>("live");

  return (
    <>
      {/* Left Side Controls - Toggle Button + Arch/Live Select */}
      <div
        style={{
          position: "fixed",
          left: "20px",
          top: "20px",
          zIndex: 999,
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        {/* Open Left Sidebar Toggle Button */}
        {props.sidebarCollapsed && !props.isFullWidth && (
          <Button
            type="text"
            icon={<MenuOutlined style={{ color: "white", fontSize: "14px" }} />}
            onClick={() => props.setSidebarCollapsed(true)}
            style={{
              backgroundColor: "#293653",
              borderRadius: "8px",
              padding: "10px 12px",
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

        {/* Open Feature Sidebar Toggle Button */}
        {props.isFullWidth && props.featureSidebarOpen === false && props.setFeatureSidebarOpen && (
          <Button
            type="text"
            icon={<MenuOutlined style={{ color: "white", fontSize: "14px" }} />}
            onClick={() => props.setFeatureSidebarOpen?.(true)}
            style={{
              backgroundColor: "#293653",
              borderRadius: "8px",
              padding: "10px 12px",
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
            title="Open Feature Sidebar"
          />
        )}

        {/* Arch/Live Select */}
        <Select
          value={archLive}
          onChange={setArchLive}
          style={{ width: 120 }}
          options={[
            { value: "arch", label: "Archive" },
            { value: "live", label: "Live" },
          ]}
        />
      </div>

      {/* Main Content */}
      <Content
        style={{
          position: "relative",
          ...(props.isFullWidth ? { width: "100%" } : {}),
          transition: "width 0.3s ease-in-out",
        }}
      >
        <Outlet
          context={{
            rightSidebarCollapsed: props.rightSidebarCollapsed,
            setRightSidebarCollapsed: props.setRightSidebarCollapsed,
            hoveredResult: props.hoveredResult,
            clickedResult: props.clickedResult,
            apiResponse: props.apiResponse,
            isFullWidth: props.isFullWidth,
          }}
        />
      </Content>
    </>
  );
};

export default Contents;