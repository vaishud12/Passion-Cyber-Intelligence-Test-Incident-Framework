import React, { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-fullscreen";
import "leaflet-fullscreen/dist/leaflet.fullscreen.css";

// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const MapComponent = ({ onPlaceSelect }) => {
  const [marker, setMarker] = useState(null);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    const map = L.map("map", {
      fullscreenControl: true,
    }).setView([-34.397, 150.644], 8);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(map);

    map.on("click", (e) => {
      const { lat, lng } = e.latlng;

      if (marker) {
        marker.setLatLng([lat, lng]);
      } else {
        const newMarker = L.marker([lat, lng]).addTo(map);
        setMarker(newMarker);
      }

      onPlaceSelect({ lat, lng });
    });

    map.on("fullscreenchange", () => {
      setFullscreen(map.isFullscreen());
    });

    return () => {
      map.remove();
    };
  }, [onPlaceSelect, marker]);

  const toggleFullscreen = () => {
    if (!fullscreen) {
      document.getElementById("map").requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div>
      <div id="map" style={{ width: "100%", height: "400px" }} />
      <button onClick={toggleFullscreen} style={{ marginTop: '10px' }}>
        {fullscreen ? "Minimize" : "Fullscreen"}
      </button>
    </div>
  );
};

export default MapComponent;
