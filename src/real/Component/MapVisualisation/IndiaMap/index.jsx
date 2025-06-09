// src/components/IndiaMap.js
import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  CircleMarker,
  Popup,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import connections from "../../../data/cityConnections.json";

const IndiaMap = () => {
  const [cities, setCities] = useState([]);

  // Map city name to coordinates
  const cityCoords = {};
  cities.forEach((city) => {
    cityCoords[city.name] = [city.latitude, city.longitude];
  });

  // Build polyline paths from connections
  const lines = connections
    .map(([from, to]) => {
      if (cityCoords[from] && cityCoords[to]) {
        return [cityCoords[from], cityCoords[to]];
      }
      return null;
    })
    .filter(Boolean);

  useEffect(() => {
    // Fetch cityData.json from public folder
    fetch("/cityData.json")
      .then((res) => res.json())
      .then((data) => setCities(data))
      .catch((err) => console.error("Failed to load cities:", err));
  }, []);

  return (
    <MapContainer
      bounds={[
        [6, 68],
        [37, 97],
      ]}
      style={{ height: "100%", width: "100%" }}
      scrollWheelZoom={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {cities.map((city, index) => (
        <CircleMarker
          key={index}
          center={[city.latitude, city.longitude]}
          radius={6}
          pathOptions={{ color: "red", fillColor: "red", fillOpacity: 0 }}
        >
          <Popup>{city.name}</Popup>
        </CircleMarker>
      ))}

      {/* City-to-city polylines */}
      {lines.map((path, idx) => (
        <Polyline
          key={idx}
          positions={path}
          pathOptions={{ color: "green", weight: 2 }}
        />
      ))}
    </MapContainer>
  );
};

export default IndiaMap;
