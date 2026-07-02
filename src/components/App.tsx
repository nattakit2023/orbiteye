import React, { useState, useEffect } from "react";
import Content from "../layouts/Content";
import Header from "../layouts/Header";
import Sidebar from "../layouts/Sidebar";
import RightSidebar, { RightSidebarMode } from "../layouts/RightSidebar";
import FeatureSidebar from "../layouts/FeatureSidebar";
import { Layout } from "antd";
import { useLocation } from "react-router-dom";
import useSWR from "swr";
import "@/styles/globals.css";
import type { ApiRequest } from "@/types/api";
import { analyzeShape, TransformedApiResponse } from "@/service/graphql/hooks/useStac";

// Type definitions for result data
interface ResultData {
  id: string;
  name?: string;
  // Accept both 1D (point/bbox) and 2D (polygon) coordinates to match
  // ArchiveResult (RightSidebar). The runtime discriminator in
  // MapComponent (`Array.isArray(result.coordinates[0])`) handles both.
  coordinates?: number[] | number[][];
  timestamp?: number;
  imageData?: {
    thumbnailUrl?: string;
    downloadUrl?: string;
  };
}

const App: React.FC = () => {
  const location = useLocation();
  const isFeatureRoute = location.pathname.startsWith("/feature/");
  const [sidebarOpen, setSidebarOpen] = useState(!isFeatureRoute);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const [rightSidebarMode, setRightSidebarMode] = useState<RightSidebarMode>("search");
  const [featureSidebarOpen, setFeatureSidebarOpen] = useState(false);
  const [selectedSatellites, setSelectedSatellites] = useState<string[]>(["1"]);

  // Mock user profile data for feature sidebar
  const [userProfile] = useState({
    name: "John Doe",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    role: "Premium User",
  });

  // State for API request
  const [apiRequest, setApiRequest] = useState<ApiRequest | null>(null);

  // State for tracking hovered/clicked result
  const [hoveredResult, setHoveredResult] = useState<ResultData | null>(null);
  const [clickedResult, setClickedResult] = useState<ResultData | null>(null);
  const [drawnShape, setDrawnShape] = useState<{
    type: "circle" | "polygon" | "rectangle";
    coordinates: Array<[number, number]>;
    radius?: number;
  } | null>(null);

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

    // Listen for shape completed events from MapComponent
    useEffect(() => {
      const handleShapeCompleted = (event: Event) => {
        const customEvent = event as CustomEvent<{
          type: "circle" | "polygon" | "rectangle";
          coordinates: Array<[number, number]>;
          radius?: number;
          area?: number;
        }>;
        setDrawnShape({
          type: customEvent.detail.type,
          coordinates: customEvent.detail.coordinates,
          radius: customEvent.detail.radius,
        });
      };

      window.addEventListener("shapeCompleted", handleShapeCompleted);
      return () => window.removeEventListener("shapeCompleted", handleShapeCompleted);
    }, []);

  // Handle result click from RightSidebar
  const handleResultClick = (result: ResultData) => {
    console.log("App: Result clicked:", result);
    setClickedResult(result);
  };

  // Listen for clearClickedResult event from MapComponent overlay
  useEffect(() => {
    const handleClearClickedResult = () => {
      setClickedResult(null);
    };
    window.addEventListener("clearClickedResult", handleClearClickedResult);
    return () => window.removeEventListener("clearClickedResult", handleClearClickedResult);
  }, []);

  // Open right sidebar in search mode
  const openRightSidebarSearch = () => {
    setRightSidebarMode("search");
    setRightSidebarOpen(true);
  };

  // Open right sidebar in cart mode
  const openRightSidebarCart = () => {
    setRightSidebarMode("cart");
    setRightSidebarOpen(true);
  };

  // Open right sidebar in order mode
  const openRightSidebarOrder = () => {
    setRightSidebarMode("order");
    setRightSidebarOpen(true);
  };

  return (
    <div className="w-full h-full">
      <Layout
        style={{ background: "#030415", height: "100vh", position: "relative" }}
      >
        {/* Left Sidebar - Floating Popup */}
        {!isFeatureRoute && sidebarOpen && (
          <div
            style={{
              position: "fixed",
              top: 10,
              left: 10,
              bottom: 100,
              width: 320,
              height: "100%",
              zIndex: 1001,
              boxShadow: "4px 0 16px rgba(0,0,0,0.3)",
              overflow: "auto",
            }}
          >
            <Sidebar
              collapsed={false}
              onCollapse={() => setSidebarOpen(false)}
              onOpenRightSidebar={openRightSidebarSearch}
              onAnalyze={handleAnalyze}
              drawnShape={drawnShape}
              onClearDrawnShape={() => setDrawnShape(null)}
              selectedSatellites={selectedSatellites}
              onSelectSatellite={setSelectedSatellites}
            />
          </div>
        )}

        {/* Feature Sidebar - Floating Popup */}
        {isFeatureRoute && featureSidebarOpen && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: 280,
              height: "100vh",
              zIndex: 1001,
              boxShadow: "4px 0 16px rgba(0,0,0,0.3)",
            }}
          >
            <FeatureSidebar
              collapsed={false}
              onCollapse={() => setFeatureSidebarOpen(false)}
              userProfile={userProfile}
            />
          </div>
        )}

        {/* Right Sidebar - Floating Popup */}
        {rightSidebarOpen && (
          <div
            style={{
              position: "fixed",
              top: 70,
              right: 25,
              width: 380,
              height: "calc(100vh - 70px)",
              zIndex: 1001,
            }}
          >
            <RightSidebar
              collapsed={false}
              onCollapse={() => setRightSidebarOpen(false)}
              mode={rightSidebarMode}
              selectedSatellites={selectedSatellites}
              apiResponse={apiResponse}
              isLoading={isLoading}
              error={error}
              onResultHover={setHoveredResult}
              onResultClick={handleResultClick}
            />
          </div>
        )}

        {/* Header - Floating Overlay */}
        {!isFeatureRoute && (
          <Header
            userProfile={userProfile}
            rightSidebarCollapsed={!rightSidebarOpen}
            onToggleRightSidebar={() => {
              if (rightSidebarOpen) {
                setRightSidebarOpen(false);
              } else {
                openRightSidebarSearch();
              }
            }}
            onOpenCart={openRightSidebarCart}
            onOpenOrder={openRightSidebarOrder}
            sidebarCollapsed={!sidebarOpen}
            isFullWidth={isFeatureRoute}
            onOpenSidebar={() => setSidebarOpen(true)}
            onOpenFeatureSidebar={() => setFeatureSidebarOpen(true)}
          />
        )}

        {/* Main Content - Full Width */}
        <Content
          data={location.pathname.slice(1)}
          sidebarCollapsed={!sidebarOpen}
          setSidebarCollapsed={setSidebarOpen}
          rightSidebarCollapsed={!rightSidebarOpen}
          setRightSidebarCollapsed={setRightSidebarOpen}
          hoveredResult={hoveredResult}
          clickedResult={clickedResult}
          apiResponse={apiResponse}
          isFullWidth={isFeatureRoute}
          featureSidebarOpen={featureSidebarOpen}
          setFeatureSidebarOpen={setFeatureSidebarOpen}
        />
      </Layout>
    </div>
  );
};

export default App;
