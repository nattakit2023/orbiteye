import React, { useState } from "react";
import Content from "../layouts/Content";
import Sidebar from "../layouts/Sidebar";
import RightSidebar from "../layouts/RightSidebar";
import { Layout } from "antd";
import { useLocation } from "react-router-dom";
import useSWR from "swr";
import "@/styles/globals.css";
import type { ApiRequest } from "@/types/api";
import { analyzeShape, TransformedApiResponse } from "@/service/api";

// Type definitions for result data
interface ResultData {
  id: string;
  coordinates?: [number, number] | [number, number][];
  timestamp?: number;
}

const App: React.FC = () => {
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(true);

  // State for API request
  const [apiRequest, setApiRequest] = useState<ApiRequest | null>(null);

  // State for tracking hovered/clicked result
  const [hoveredResult, setHoveredResult] = useState<ResultData | null>(null);
  const [clickedResult, setClickedResult] = useState<ResultData | null>(null);

  // Use SWR to fetch data when apiRequest is set
  const {
    data: apiResponse,
    error,
    isLoading,
  } = useSWR<TransformedApiResponse>(
    apiRequest ? ["", apiRequest] : null,
    () =>
      apiRequest
        ? analyzeShape(apiRequest)
        : Promise.resolve({ success: false }),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000,
    },
  );

  // Handle analyze request from sidebar
  const handleAnalyze = (request: ApiRequest) => {
    console.log("App: Handle analyze called with:", request);
    setApiRequest(request);
  };

  // Handle result click from RightSidebar
  const handleResultClick = (result: ResultData) => {
    console.log("App: Result clicked:", result);

    // Set clickedResult to trigger zoom to the feature
    setClickedResult(result);

    // Clear clickedResult after a short delay (500ms) to allow zoom animation to complete
    // This ensures the red highlighting doesn't persist too long
    setTimeout(() => {
      setClickedResult(null);
    }, 500);
  };

  return (
    <div className="w-full h-full">
      {/* Style 1 */}
      <Layout style={{ background: "#030416", height: "100vh" }}>
        <Sidebar
          collapsed={sidebarCollapsed}
          onCollapse={setSidebarCollapsed}
          onOpenRightSidebar={() => setRightSidebarCollapsed(false)}
          onAnalyze={handleAnalyze}
        />

        <Content
          data={location.pathname.slice(1)}
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          rightSidebarCollapsed={rightSidebarCollapsed}
          setRightSidebarCollapsed={setRightSidebarCollapsed}
          hoveredResult={hoveredResult}
          clickedResult={clickedResult}
          apiResponse={apiResponse}
        />

        <RightSidebar
          collapsed={rightSidebarCollapsed}
          onCollapse={setRightSidebarCollapsed}
          apiResponse={apiResponse}
          isLoading={isLoading}
          error={error}
          onResultHover={setHoveredResult}
          onResultClick={handleResultClick}
        />
      </Layout>
    </div>
  );
};

export default App;
