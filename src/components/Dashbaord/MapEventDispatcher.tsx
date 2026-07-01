import React, { useEffect } from "react";
import { useMap } from "react-leaflet";

const MapEventDispatcher: React.FC = () => {
  const map = useMap();

  useEffect(() => {
    // Dispatch map ready event with map instance
    window.dispatchEvent(new CustomEvent("mapReady", {
      detail: { map }
    }));
  }, [map]);

  return null;
};

export default MapEventDispatcher;