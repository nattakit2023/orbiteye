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

const App: React.FC = () => {
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(true);

  // State for API request
  const [apiRequest, setApiRequest] = useState<ApiRequest | null>(null);

  // Use SWR to fetch data when apiRequest is set
  const { data: apiResponse, error, isLoading } = useSWR<TransformedApiResponse>(
    apiRequest ? ['', apiRequest] : null,
    () => apiRequest ? analyzeShape(apiRequest) : Promise.resolve({ success: false }),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000,
    }
  );

  // Handle analyze request from sidebar
  const handleAnalyze = (request: ApiRequest) => {
    console.log("App: Handle analyze called with:", request);
    setApiRequest(request);
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
        />
        <RightSidebar
          collapsed={rightSidebarCollapsed}
          onCollapse={setRightSidebarCollapsed}
          apiResponse={apiResponse}
          isLoading={isLoading}
          error={error}
        />
      </Layout>
    </div>
  );
};

export default App;
