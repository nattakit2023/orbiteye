import React, { useState, useEffect } from "react";
import Col from "antd/es/col";
import Flex from "antd/es/flex";
import Image from "antd/es/image";
import Input from "antd/es/input";
import Layout from "antd/es/layout";
import Row from "antd/es/row";
import Button from "antd/es/button";
import { LeftOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs-carousel";
import DrawArea from "@/layouts/Sidebar/DrawArea";
import Resolution from "@/layouts/Sidebar/Resolution";
import "@/styles/sidebar.css";
import image_logo from "@/public/assets/logo/orbiteye_white.png";
import type { ApiRequest } from "@/types/api";

const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
  onOpenRightSidebar?: () => void;
  onAnalyze?: (request: ApiRequest) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onCollapse,
  onOpenRightSidebar,
  onAnalyze,
}) => {
  const [sidenavType] = useState("transparent");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentShape, setCurrentShape] = useState<{
    type: "circle" | "polygon" | "rectangle" | null;
    coordinates: Array<[number, number]>;
    radius?: number;
  } | null>(null);

  // Listen for shape completion events from DrawArea component
  useEffect(() => {
    const handleShapeCompleted = (event: Event) => {
      const customEvent = event as CustomEvent<{
        type: "circle" | "polygon" | "rectangle";
        coordinates: Array<[number, number]>;
        radius?: number;
      }>;
      const { type, coordinates, radius } = customEvent.detail;

      setCurrentShape({
        type,
        coordinates,
        radius,
      });
    };

    window.addEventListener("shapeCompleted", handleShapeCompleted);
    return () =>
      window.removeEventListener("shapeCompleted", handleShapeCompleted);
  }, []);

  const handleShowResult = () => {
    console.log("Show Result clicked", selectedItems);
    console.log("Current shape:", currentShape);

    // Prepare API request data with correct structure
    const requestData: ApiRequest = {
      intersects: currentShape
        ? {
            type: currentShape.type === "circle" ? "Circle" : "Polygon",
            ...(currentShape.type === "circle" && currentShape.radius
              ? {
                  center: [
                    currentShape.coordinates[0][1],
                    currentShape.coordinates[0][0],
                  ],
                  radius: currentShape.radius,
                }
              : {
                  coordinates: [currentShape.coordinates.map(([lat, lng]) => [
                    parseFloat(lng.toFixed(14) + "1"),
                    parseFloat(lat.toFixed(14) + "1"),
                  ])],
                  // 16.193575,98.767090 | 16.066929,101.623535 | 14.881087,101.744385 | 14.796128,98.250732 | 16.204125,98.767090
                  // coordinates: [
                  //   [
                  //     [102.45590015508692, 16.089334833780047],
                  //     [103.51641932064055, 16.089334833780047],
                  //     [103.51641932064055, 17.00068389749823],
                  //     [102.45590015508692, 17.00068389749823],
                  //     [102.45590015508692, 16.089334833780047],
                  //   ],
                  // ],
                }),
          }
        : {
            type: "Polygon",
            coordinates: [],
          },
      datetime: "../" + new Date().toISOString(),
      filter: {
        op: "and",
        args: [
          {
            op: "<=",
            args: [
              {
                property: "cloudNotation",
              },
              100,
            ],
          },
          {
            op: "<",
            args: [
              {
                property: "globalIncidence",
              },
              50,
            ],
          },
        ],
      },
      sortby: "-id",
      offset: 0,
      limit: 100,
    };

    console.log("API Request Data:", requestData);

    // Call the analyze function to trigger SWR fetch
    if (onAnalyze) {
      onAnalyze(requestData);
    }

    // Open right sidebar when Show Result is clicked
    if (onOpenRightSidebar) {
      onOpenRightSidebar();
    }
  };

  const handleSelectItem = (itemId: string) => {
    setSelectedItems((prev: string[]) =>
      prev.includes(itemId)
        ? prev.filter((id: string) => id !== itemId)
        : [...prev, itemId],
    );
  };

  return (
    <>
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
          background: sidenavType,
          padding: "0",
          // margin: "10px 0px",
          height: "100vh",
          color: "white",
        }}
      >
        {/* Content Wrapper with padding */}
        <div
          style={{
            padding: collapsed ? "0" : "15px 20px",
            transition: "padding 0.5s ease-in-out, opacity 0.5s ease-in-out",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            opacity: collapsed ? 0 : 1,
          }}
        >
          {/* Top Section */}
          <div style={{ flex: "0 0 auto" }}>
            <Flex vertical gap={10}>
              <Row justify="center" align="middle">
                <Col span={6}></Col>
                <Col span={12}>
                  <Image
                    src={image_logo}
                    alt=""
                    style={{ width: "100%" }}
                    preview={false}
                  />
                </Col>
                <Col
                  span={6}
                  style={{ justifyContent: "end", display: "flex" }}
                >
                  <Button
                    type="text"
                    icon={
                      <LeftOutlined
                        style={{ color: "white", fontSize: "16px" }}
                      />
                    }
                    onClick={() => onCollapse(true)}
                    style={{
                      padding: "4px 8px",
                      color: "white",
                      right: "0",
                    }}
                    title="Close Sidebar"
                  />
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Input
                    placeholder="Search"
                    style={{
                      backgroundColor: "#293653",
                      border: "none",
                      color: "#FFFFFF",
                      fontSize: "18px",
                      height: "40px",
                    }}
                    prefix={
                      <SearchOutlined
                        style={{ color: "rgba(255,255,255,0.5)" }}
                      />
                    }
                  />
                </Col>
              </Row>
            </Flex>
          </div>

          {/* Middle Section - Tabs Content */}
          <div
            style={{ flex: "1 1 auto", overflow: "auto", marginTop: "16px" }}
          >
            <Row>
              <Col span={24}>
                <Tabs defaultValue="drawarea" className="w-full">
                  <TabsList className="w-full">
                    <TabsTrigger value="drawarea">Draw Area</TabsTrigger>
                    <TabsTrigger value="resolution">Resolution</TabsTrigger>
                    <TabsTrigger value="resolutions">Resolutions</TabsTrigger>
                  </TabsList>

                  <TabsContent value="drawarea" className="mt-6">
                    <DrawArea />
                  </TabsContent>

                  <TabsContent value="resolution" className="mt-6">
                    <Resolution
                      onSelectItem={handleSelectItem}
                      selectedItems={selectedItems}
                    />
                  </TabsContent>
                  <TabsContent value="resolutions" className="mt-6">
                    <Resolution
                      onSelectItem={handleSelectItem}
                      selectedItems={selectedItems}
                    />
                  </TabsContent>
                </Tabs>
              </Col>
            </Row>
          </div>

          {/* Bottom Section - Show Result Button */}
          <div style={{ flex: "0 0 auto", marginTop: "16px" }}>
            <Button
              type="primary"
              disabled={selectedItems.length === 0}
              style={{
                width: "100%",
                backgroundColor:
                  selectedItems.length === 0 ? "#505050" : "#293653",
                border: "none",
                height: "40px",
                fontSize: "16px",
                fontWeight: "600",
                color: selectedItems.length === 0 ? "#808080" : "#FFFFFF",
                cursor: selectedItems.length === 0 ? "not-allowed" : "pointer",
              }}
              onClick={handleShowResult}
            >
              Show Result
            </Button>
          </div>
        </div>
      </Sider>
    </>
  );
};

export default Sidebar;
