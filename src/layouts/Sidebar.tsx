import React, { useState, useEffect } from "react";
import Col from "antd/es/col";
import Flex from "antd/es/flex";
import Image from "antd/es/image";
import Divider from "antd/es/divider";
import Row from "antd/es/row";
import Button from "antd/es/button";
import { LeftOutlined, SearchOutlined } from "@ant-design/icons";
import DrawArea from "@/layouts/Sidebar/DrawArea";
import DateSelection from "@/layouts/Sidebar/DateSelection/DateSelection";
import Satellite from "@/layouts/Sidebar/Satellite/Satellite";
import CloudQuality from "@/layouts/Sidebar/CloudQuality/CloudQuality";
import DrawnShapeCard from "@/layouts/Sidebar/DrawnShapeCard";
import "@/styles/sidebar.css";
import image_logo from "@/public/assets/logo/orbiteye_white.png";
import type { ApiRequest } from "@/types/api";

interface ResultData {
  id: string;
  name?: string;
  coordinates?: [number, number] | [number, number][];
  timestamp?: number;
}

interface SidebarProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
  onOpenRightSidebar?: () => void;
  onAnalyze?: (request: ApiRequest) => void;
  selectedResult?: ResultData | null;
  onClearSelectedResult?: () => void;
  drawnShape?: {
    type: "circle" | "polygon" | "rectangle";
    coordinates: Array<[number, number]>;
    radius?: number;
    area?: number;
  } | null;
  onClearDrawnShape?: () => void;
  selectedSatellites?: string[];
  onSelectSatellite?: (selected: string[]) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onCollapse,
  onOpenRightSidebar,
  onAnalyze,
  drawnShape,
  onClearDrawnShape,
  selectedSatellites = ["1"],
  onSelectSatellite,
}) => {
  const [internalSelectedSatellites, setInternalSelectedSatellites] = useState<string[]>(selectedSatellites);
  const [selectedDates, setSelectedDates] = useState<[string, string] | null>(null);
  const [selectedCloud, setSelectedCloud] = useState<number>(100);
  const [currentShape, setCurrentShape] = useState<{
    type: "circle" | "polygon" | "rectangle" | null;
    coordinates: Array<[number, number]>;
    radius?: number;
  } | null>(null);

  // Sync internal state when prop changes from parent
  useEffect(() => {
    setInternalSelectedSatellites(selectedSatellites);
  }, [selectedSatellites]);

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

    // Map satellite IDs to STAC API types
    const satelliteTypeMap: Record<string, string> = {
      "1": "theos2",
      "2": "sentinel",
      "3": "landsat",
    };

    const stacType = selectedSatellites
      .map((id) => satelliteTypeMap[id])
      .filter((type): type is string => Boolean(type));


    const requestData: ApiRequest = {
      ...(stacType.length > 0 && { stacType }),
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
      datetime: (() => {
        if (!selectedDates) return undefined;
        const start = selectedDates[0];
        const end = selectedDates[1];

        if (start === "..") {
          // Open start - from beginning to end date
          return `../${end}T23:59:59.999Z`;
        } else if (end === "..") {
          // Open end - from start date to present
          return `${start}T00:00:00.000Z/..`;
        } else {
          // Both dates specified
          return `${start}T00:00:00.000Z/${end}T23:59:59.999Z`;
        }
      })(),
      filter: {
        op: "and",
        args: [
          { op: "<=", args: [{ property: "cloudNotation" }, selectedCloud] },
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

  const handleSelectSatellite = (itemId: string) => {
    const newSelection = internalSelectedSatellites.includes(itemId)
      ? internalSelectedSatellites.filter((id) => id !== itemId)
      : [...internalSelectedSatellites, itemId];
    setInternalSelectedSatellites(newSelection);
    onSelectSatellite?.(newSelection);
  };

  const handleDateChange = (dates: unknown, dateStrings: [string, string]) => {
    setSelectedDates(dateStrings);
  };

  const handleCloudChange = (value: number) => {
    setSelectedCloud(value);
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
      }}
    >
      {/* Scrollable Content Section */}
      <div className="rightsidebar-scroll" style={{ flex: 1, overflowY: "auto", paddingBottom: "80px" }}>
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
          {drawnShape && (
            <Row>
              <Col span={24}>
                <DrawnShapeCard shape={drawnShape} onClose={onClearDrawnShape} />
              </Col>
            </Row>
          )}
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
            <CloudQuality onCloudChange={handleCloudChange} selectedCloud={selectedCloud} />
          </Row>
          <Row style={{ marginBottom: "10px" }}>
            <Satellite onSelectItem={handleSelectSatellite} selectedItems={internalSelectedSatellites} />
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
