/// <reference types="react" />
import React from "react";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";

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
  return (
    <>
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
