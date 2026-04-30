import React, { useState, useEffect } from "react";
import Col from "antd/es/col";
import Flex from "antd/es/flex";
import Image from "antd/es/image";
import Divider from "antd/es/divider";

import Row from "antd/es/row";
import Button from "antd/es/button";
import { LeftOutlined, SearchOutlined } from "@ant-design/icons";
import DrawArea from "@/layouts/Sidebar/DrawArea";
import Resolution from "@/layouts/Sidebar/Resolution";
import DateSelection from "@/layouts/Sidebar/DateSelection/DateSelection";
import Satellite from "@/layouts/Sidebar/Satellite/Satellite";
import CloudQuality from "@/layouts/Sidebar/CloudQuality/CloudQuality";
import "@/styles/sidebar.css";
import image_logo from "@/public/assets/logo/orbiteye_white.png";
import type { ApiRequest } from "@/types/api";

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
  const [selectedItems, setSelectedItems] = useState<string[]>([
    "1",
    "2",
    "3",
    "4",
  ]);
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
    if (
      currentShape?.type === "polygon" ||
      currentShape?.type === "rectangle"
    ) {
      const firstCoordinate = currentShape.coordinates[0];
      currentShape.coordinates.push(firstCoordinate);
    }

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
        : { type: "Polygon", coordinates: [] },
      datetime: selectedDates
        ? `${selectedDates[0]}T00:00:00.000Z/${selectedDates[1]}T23:59:59.999Z`
        : "../" + new Date().toISOString(),
      filter: {
        op: "and",
        args: [
          { op: "<=", args: [{ property: "cloudNotation" }, 100] },
          { op: "<", args: [{ property: "globalIncidence" }, 50] },
        ],
      },
      sortby: "-id",
      offset: 0,
      limit: 10,
    };

    if (onAnalyze) onAnalyze(requestData);
    if (onOpenRightSidebar) onOpenRightSidebar();
  };

  const handleSelectItem = (itemId: string) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId],
    );
  };

  const handleSelectSatellite = (itemId: string) => {
    setSelectedSatellites((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId],
    );
  };

  const handleSelectCloudQuality = (itemId: string) => {
    setSelectedCloudQualities((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId],
    );
  };

  const handleDateChange = (dates: unknown, dateStrings: [string, string]) => {
    setSelectedDates(dateStrings);
  };

  if (collapsed) return null;

  return (
    <div
      style={{
        position: "relative",
        width: 320,
        height: "calc(100vh - 20px)",
        backgroundColor: "#030415",
        zIndex: 1001,
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      {/* Scrollable Content Section */}
      <div style={{ flex: 1, overflow: "auto", paddingBottom: "10px" }}>
        <Flex vertical gap={12} style={{ padding: "10px 10px 0 10px" }}>
          <Row justify="space-between" align="middle">
            <Col span={16}>
              <Image
                src={image_logo}
                alt=""
                style={{ width: "120px" }}
                preview={false}
              />
            </Col>
            <Col span={8} style={{ textAlign: "right" }}>
              <Button
                type="text"
                icon={
                  <LeftOutlined
                    style={{ color: "#9EA5B0", fontSize: "16px" }}
                  />
                }
                onClick={() => onCollapse(true)}
                style={{ padding: "4px 8px" }}
                title="Close Sidebar"
              />
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Divider style={{ borderColor: "#626972", margin: "10px 0" }} />
            </Col>
          </Row>

          <Row>
            <Col span={24} style={{ color: "#9EA5B0", fontSize: "12px" }}>
              ARCHIVE SEARCH
            </Col>
            <Col
              span={24}
              style={{ color: "#E0E0E0", fontSize: "20px", fontWeight: "bold" }}
            >
              Browser historical
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Divider style={{ borderColor: "#626972", margin: "10px 0" }} />
            </Col>
          </Row>
          <Row>
            <DrawArea />
          </Row>
          <Row>
            <Col span={24}>
              <Divider style={{ borderColor: "#626972", margin: "10px 0" }} />
            </Col>
          </Row>
          <Row style={{ marginBottom: "10px" }}>
            <Col span={24}>
              <DateSelection onDateChange={handleDateChange} />
            </Col>
          </Row>
          <Row style={{ marginBottom: "10px" }}>
            <CloudQuality />
          </Row>
          <Row style={{ marginBottom: "10px" }}>
            <Satellite onSelectItem={handleSelectSatellite} selectedItems={selectedSatellites} />
          </Row>
        </Flex>
      </div>

      {/* Bottom Section - Show Result Button */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "16px",
          borderTop: "1px solid #161940",
          backgroundColor: "#090b22",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button
          type="primary"
          size="large"
          onClick={handleShowResult}
          style={{
            width: "70%",
            height: "44px",
            backgroundColor: "#22253C",
            color: "#626972",
          }}
        >
          <SearchOutlined />
          Search archive
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
