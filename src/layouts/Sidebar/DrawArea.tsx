import React, { useState, useCallback, useEffect } from "react";
import Button from "antd/es/button";
import Tooltip from "antd/es/tooltip";
import {
  RadiusBottomleftOutlined,
  BorderOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { Circle } from "lucide-react";

// ==================== Constants ====================

const BUTTON_SIZE = 40;
const BUTTON_ICON_SIZE = 18;
const BUTTON_GAP = 8;
const CONTAINER_GAP = 16;

const COLORS = {
  ACTIVE: "#1890ff",
  WHITE: "#FFFFFF",
  BORDER: "#404d63",
} as const;

const SHAPE_TYPES = {
  CIRCLE: "circle",
  POLYGON: "polygon",
  RECTANGLE: "rectangle",
} as const;

type ShapeType = (typeof SHAPE_TYPES)[keyof typeof SHAPE_TYPES];

// ==================== Types ====================

interface DrawnShape {
  type: ShapeType;
  coordinates: Array<[number, number]>;
  radius?: number;
}

interface ShapeCompletedEventDetail {
  type: ShapeType;
  coordinates: Array<[number, number]>;
  radius?: number;
}

// ==================== Configuration ====================

interface ShapeButtonConfig {
  type: ShapeType;
  icon: React.ReactNode;
  title: string;
}

const SHAPE_BUTTONS: ShapeButtonConfig[] = [
  {
    type: SHAPE_TYPES.POLYGON,
    icon: <RadiusBottomleftOutlined />,
    title: "Draw Polygon",
  },
  {
    type: SHAPE_TYPES.CIRCLE,
    icon: <Circle size={BUTTON_ICON_SIZE} />,
    title: "Draw Circle",
  },
  {
    type: SHAPE_TYPES.RECTANGLE,
    icon: <BorderOutlined />,
    title: "Draw Rectangle",
  },
];

// const SHAPE_TYPE_LABELS: Record<ShapeType, string> = {
//   [SHAPE_TYPES.CIRCLE]: "Circle",
//   [SHAPE_TYPES.POLYGON]: "Polygon",
//   [SHAPE_TYPES.RECTANGLE]: "Rectangle",
// };

// ==================== Helper Functions ====================

const getButtonStyle = (isActive: boolean, isClearButton: boolean = false) => ({
  backgroundColor: isActive ? COLORS.ACTIVE : "transparent",
  color: isClearButton ? "#ff4d4f" : COLORS.WHITE,
  border: `${isActive ? "2px" : "1px"} solid ${isActive ? COLORS.ACTIVE : isClearButton ? "#ff4d4f" : COLORS.BORDER}`,
  width: BUTTON_SIZE,
  height: BUTTON_SIZE,
  display: "flex" as const,
  alignItems: "center" as const,
  justifyContent: "center" as const,
  fontSize: "16px",
  transition: "all 0.2s ease",
});

// ==================== Component ====================

const DrawArea: React.FC = () => {
  const [drawingMode, setDrawingMode] = useState<ShapeType | null>(null);
  const [currentShape, setCurrentShape] = useState<DrawnShape | null>(null);

  const handleStartDrawing = useCallback(
    (shapeType: ShapeType) => {
      const newMode = drawingMode === shapeType ? null : shapeType;
      setDrawingMode(newMode);
      window.dispatchEvent(
        new CustomEvent("startDrawing", { detail: { shapeType: newMode } }),
      );
    },
    [drawingMode],
  );

  const handleClear = useCallback(() => {
    console.log("DrawArea: handleClear called");
    setCurrentShape(null);
    setDrawingMode(null);
    console.log("DrawArea: Dispatching clearDrawings event");
    window.dispatchEvent(new CustomEvent("clearDrawings"));
    console.log("DrawArea: clearDrawings event dispatched");
    console.log(currentShape);
  }, [currentShape]);

  const handleShapeComplete = useCallback((event: Event) => {
    const customEvent = event as CustomEvent<ShapeCompletedEventDetail>;
    const { type, coordinates, radius } = customEvent.detail;

    setCurrentShape({
      type,
      coordinates,
      radius,
    });
    setDrawingMode(null);
  }, []);

  useEffect(() => {
    window.addEventListener("shapeCompleted", handleShapeComplete);
    return () =>
      window.removeEventListener("shapeCompleted", handleShapeComplete);
  }, [handleShapeComplete]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: `${CONTAINER_GAP}px`,
        width: "100%",
      }}
    >
      {/* Drawing Mode Buttons and Clear Button */}
      {/* Clear/Reload Button - Separate row at top */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: `${BUTTON_GAP}px`,
        }}
      >
        <div>Draw area of interest (AOI)</div>
        <Tooltip title="Clear All Drawings">
          <div
            onClick={handleClear}
            style={{
              cursor: "pointer",
              color: "#FFFFFF",
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              backgroundColor: "#888888",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#40a9ff";
              e.currentTarget.style.borderColor = "#40a9ff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#FFFFFF";
              e.currentTarget.style.borderColor = "#1890ff";
            }}
          >
            <ReloadOutlined style={{ fontSize: "12px" }} />
          </div>
        </Tooltip>
      </div>

      {/* Drawing Mode Buttons */}
      <div
        style={{
          display: "flex",
          gap: `${BUTTON_GAP}px`,
          justifyContent: "center",
        }}
      >
        {SHAPE_BUTTONS.map(({ type, icon, title }) => (
          <Tooltip key={type} title={title}>
            <Button
              icon={icon}
              onClick={() => handleStartDrawing(type)}
              style={getButtonStyle(drawingMode === type, false)}
            />
          </Tooltip>
        ))}
      </div>

      {/* Current Shape Info */}
      {/*{currentShape ? (
        <Card
          size="small"
          title={<Text strong>{SHAPE_TYPE_LABELS[currentShape.type]}</Text>}
          style={{ width: "100%" }}
        >
          <Text type="secondary">
            {currentShape.coordinates.length} point
            {currentShape.coordinates.length !== 1 ? "s" : ""}
          </Text>
        </Card>
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <Text type="secondary">
              {drawingMode
                ? "Drawing in progress..."
                : "Select a shape to draw"}
            </Text>
          }
          style={{ padding: "20px 0" }}
        />
      )}*/}
    </div>
  );
};

export default DrawArea;
