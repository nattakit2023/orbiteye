declare module "@/assets/logo/SatelliteIcon.jsx" {
  import React from "react";
  interface SatelliteIconProps {
    size?: number;
    color?: string;
    className?: string;
    style?: React.CSSProperties;
  }
  const SatelliteIcon: React.FC<SatelliteIconProps>;
  export default SatelliteIcon;
}