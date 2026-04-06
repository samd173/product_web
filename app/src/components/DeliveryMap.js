import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// 🔥 Fix marker issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// 🚚 Custom icon
const deliveryIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/1046/1046784.png",
  iconSize: [40, 40],
});

function DeliveryMap() {

  const start = [18.5204, 73.8567];
  const destination = [18.5304, 73.8667];

  const [position, setPosition] = useState(start);

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition((prev) => [
        prev[0] + (destination[0] - prev[0]) * 0.05,
        prev[1] + (destination[1] - prev[1]) * 0.05,
      ]);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!position) return null;

  return (
    <MapContainer
      center={position}
      zoom={13}
      style={{ height: "300px", width: "100%", borderRadius: "10px" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <Marker position={position} icon={deliveryIcon} />

      <Polyline positions={[start, destination]} />
    </MapContainer>
  );
}

export default DeliveryMap;