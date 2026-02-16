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
import DateSelection from "@/layouts/Sidebar/DateSelection/DateSelection";
import Satellite from "@/layouts/Sidebar/Satellite/Satellite";
import CloudQuality from "@/layouts/Sidebar/CloudQuality/CloudQuality";
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
  const [selectedItems, setSelectedItems] = useState<string[]>(["1","2","3","4"]);
  const [selectedSatellites, setSelectedSatellites] = useState<string[]>(["1"]);
  const [selectedCloudQualities, setSelectedCloudQualities] = useState<
    string[]
  >([]);
  const [selectedDates, setSelectedDates] = useState<[string, string] | null>(
    null,
  );
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
    // For polygons, add the first coordinate to the end to close the polygon
    if (
      currentShape?.type === "polygon" ||
      currentShape?.type === "rectangle"
    ) {
      const firstCoordinate = currentShape.coordinates[0];
      currentShape.coordinates.push(firstCoordinate);
    }
    console.log("Show Result clicked", {
      resolutions: selectedItems,
      satellites: selectedSatellites,
      cloudQualities: selectedCloudQualities,
      dates: selectedDates,
    });
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
                  coordinates: [
                    currentShape.coordinates.map(([lat, lng]) => [lng, lat]),
                  ],
                }),
          }
        : {
            type: "Polygon",
            coordinates: [],
          },
      datetime: selectedDates
        ? `${selectedDates[0]}T00:00:00.000Z/${selectedDates[1]}T23:59:59.999Z`
        : "../" + new Date().toISOString(),
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
      limit: 10,
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

  const handleSelectSatellite = (itemId: string) => {
    setSelectedSatellites((prev: string[]) =>
      prev.includes(itemId)
        ? prev.filter((id: string) => id !== itemId)
        : [...prev, itemId],
    );
  };

  const handleSelectCloudQuality = (itemId: string) => {
    setSelectedCloudQualities((prev: string[]) =>
      prev.includes(itemId)
        ? prev.filter((id: string) => id !== itemId)
        : [...prev, itemId],
    );
  };

  const handleDateChange = (dates: unknown, dateStrings: [string, string]) => {
    console.log("Date range selected:", dateStrings);
    setSelectedDates(dateStrings);
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
                    <TabsTrigger value="date">Select Date</TabsTrigger>
                    <TabsTrigger value="satellite">Satellite</TabsTrigger>
                    <TabsTrigger value="condition">Condition</TabsTrigger>
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

                  <TabsContent value="date" className="mt-6">
                    <DateSelection onDateChange={handleDateChange} />
                  </TabsContent>

                  <TabsContent value="satellite" className="mt-6">
                    <Satellite
                      onSelectItem={handleSelectSatellite}
                      selectedItems={selectedSatellites}
                    />
                  </TabsContent>

                  <TabsContent value="condition" className="mt-6">
                    <CloudQuality
                      onSelectItem={handleSelectCloudQuality}
                      selectedItems={selectedCloudQualities}
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
              disabled={
                selectedItems.length === 0 &&
                selectedSatellites.length === 0 &&
                selectedCloudQualities.length === 0 &&
                !selectedDates
              }
              style={{
                width: "100%",
                backgroundColor:
                  selectedItems.length === 0 &&
                  selectedSatellites.length === 0 &&
                  selectedCloudQualities.length === 0 &&
                  !selectedDates
                    ? "#505050"
                    : "#293653",
                border: "none",
                height: "40px",
                fontSize: "16px",
                fontWeight: "600",
                color:
                  selectedItems.length === 0 &&
                  selectedSatellites.length === 0 &&
                  selectedCloudQualities.length === 0 &&
                  !selectedDates
                    ? "#808080"
                    : "#FFFFFF",
                cursor:
                  selectedItems.length === 0 &&
                  selectedSatellites.length === 0 &&
                  selectedCloudQualities.length === 0 &&
                  !selectedDates
                    ? "not-allowed"
                    : "pointer",
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
