import React, { useState } from "react";
import Slider from "antd/es/slider";
import { CloudOutlined } from "@ant-design/icons";

interface CloudQualityProps {
  onCloudChange?: (value: number) => void;
  selectedCloud?: number;
}

const CloudQuality: React.FC<CloudQualityProps> = ({
  onCloudChange,
  selectedCloud,
}) => {
  const [sliderValue, setSliderValue] = useState<number>(selectedCloud ?? 50);

  const handleSliderChange = (value: number) => {
    setSliderValue(value);
    onCloudChange?.(value);
  };

  return (
    <div className="w-full">
      <div
        style={{
          color: "#E0E0E0",
          fontSize: "14px",
          fontWeight: "600",
          marginBottom: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", gap: "8px" }}>
          <CloudOutlined style={{ color: "#E0E0E0" }} />
          Max Cloud Coverage
        </div>
        <span
          style={{
            color: "#A2C0FF",
            fontSize: "14px",
            minWidth: "45px",
            textAlign: "right",
          }}
        >
          {sliderValue}%
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <Slider
          min={0}
          max={100}
          step={10}
          value={sliderValue}
          onChange={handleSliderChange}
          style={{
            flex: 1,
            color: "#E0E0E0",
          }}
          styles={{
            track: { backgroundColor: "#1890ff" },
            rail: { backgroundColor: "#404d63" },
            handle: { borderColor: "#1890ff", backgroundColor: "#1890ff" },
          }}
        />
      </div>

      <style>{`
        .ant-slider .ant-slider-track {
          background-color: #1890ff !important;
        }
        .ant-slider .ant-slider-rail {
          background-color: #404d63 !important;
        }
        .ant-slider .ant-slider-handle {
          border-color: #1890ff !important;
          background-color: #1890ff !important;
        }
        .ant-slider:hover .ant-slider-track {
          background-color: #40a9ff !important;
        }
        .ant-slider:hover .ant-slider-handle {
          border-color: #40a9ff !important;
        }
      `}</style>
    </div>
  );
};

export default CloudQuality;
