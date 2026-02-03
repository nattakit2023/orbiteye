import React from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default icon paths for Vite
import iconUrl from "leaflet/dist/images/marker-icon.png?url";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png?url";
import shadowUrl from "leaflet/dist/images/marker-shadow.png?url";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

const Dashboard: React.FC = () => {
  return (
    <div style={{ height: "100vh", width: "100%", margin: 0, padding: 0 }}>
      <MapContainer
        center={[51.505, -0.09]}
        zoom={13}
        style={{ height: "100%", width: "100%", margin: 0, padding: 0 }}
      >
        <TileLayer url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}" attribution="&copy; Google" />
        <Marker position={[51.505, -0.09]}>
          <Popup>A popup</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default Dashboard;
