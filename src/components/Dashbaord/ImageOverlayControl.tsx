import React from "react";

interface ImageOverlayControlProps {
  opacity: number;
  onOpacityChange: (value: number) => void;
  onClose: () => void;
}

const ImageOverlayControl: React.FC<ImageOverlayControlProps> = ({
  opacity,
  onOpacityChange,
  onClose,
}) => {
  return (
    <>
      <style>{`
        .opacity-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #1890ff;
          border: 2px solid #fff;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        .opacity-slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #1890ff;
          border: 2px solid #fff;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
      `}</style>
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1001,
          background: "rgba(13, 17, 23, 0.95)",
          borderRadius: "12px",
          border: "1px solid #30363d",
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.4)",
          padding: "12px 16px",
          minWidth: "280px",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "12px",
          }}
        >
          <span style={{ color: "#e6edf3", fontSize: "13px", fontWeight: 600 }}>
            Image Overlay
          </span>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "#7d8590",
              cursor: "pointer",
              fontSize: "18px",
              padding: "2px 6px",
            }}
          >
            ×
          </button>
        </div>

        {/* Opacity Slider */}
        <div style={{ marginBottom: "8px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "4px",
            }}
          >
            <span style={{ color: "#7d8590", fontSize: "11px" }}>Opacity</span>
            <span style={{ color: "#e6edf3", fontSize: "11px" }}>{opacity}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={opacity}
            onChange={(e) => onOpacityChange(Number(e.target.value))}
            className="opacity-slider"
            style={{
              width: "100%",
              height: "6px",
              borderRadius: "3px",
              background: `linear-gradient(to right, #1890ff ${opacity}%, #30363d ${opacity}%)`,
              outline: "none",
              cursor: "pointer",
              WebkitAppearance: "none",
            }}
          />
        </div>

        {/* Quick Buttons */}
        <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
          {[0, 50, 100].map((val) => (
            <button
              key={val}
              onClick={() => onOpacityChange(val)}
              style={{
                flex: 1,
                padding: "6px 8px",
                background: opacity === val ? "#1890ff" : "transparent",
                border: "1px solid #30363d",
                borderRadius: "4px",
                color: "#e6edf3",
                fontSize: "11px",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {val === 0 ? "Hide" : val === 50 ? "50%" : "Show"}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default ImageOverlayControl;
