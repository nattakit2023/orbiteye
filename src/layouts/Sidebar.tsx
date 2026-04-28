import React, { useState, useEffect } from "react";
import Col from "antd/es/col";
import Flex from "antd/es/flex";
import Image from "antd/es/image";
import Divider from "antd/es/divider";

import Row from "antd/es/row";
import Button from "antd/es/button";
import { LeftOutlined } from "@ant-design/icons";
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
        padding: "10px",
        borderRadius: "12px",
      }}
    >
      {/* Header Section with logo and close button */}
      <div
        style={{
          // padding: "20px 16px 16px 16px",
          background:
            "linear-gradient(180deg, rgba(3,4,21,0.95) 0%, rgba(3,4,21,0) 100%)",
          flex: "0 0 auto",
        }}
      >
        <Flex vertical gap={12}>
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
              <Divider style={{borderColor:"#626972"}}/>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Divider style={{borderColor:"#626972"}}/>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Divider style={{borderColor:"#626972"}}/>
            </Col>
          </Row>
        </Flex>
      </div>

      {/* Bottom Section - Show Result Button */}
      <div
        style={{
          flex: "0 0 auto",
          padding: "16px",
          background:
            "linear-gradient(0deg, rgba(3,4,21,0.95) 0%, rgba(3,4,21,0) 100%)",
        }}
      >
        <Button
          type="primary"
          disabled={
            selectedItems.length === 0 &&
            selectedSatellites.length === 0 &&
            selectedCloudQualities.length === 0 &&
            !selectedDates
          }
          onClick={handleShowResult}
          style={{
            width: "100%",
            height: "44px",
            backgroundColor:
              selectedItems.length === 0 &&
              selectedSatellites.length === 0 &&
              selectedCloudQualities.length === 0 &&
              !selectedDates
                ? "rgba(80,80,80,0.5)"
                : "#1890ff",
            border: "none",
            borderRadius: "8px",
            fontSize: "15px",
            fontWeight: 600,
            color: "#FFFFFF",
          }}
        >
          Show Result
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
