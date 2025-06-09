import React from "react";
import "leaflet/dist/leaflet.css";
import IndiaMap from "./IndiaMap";

const MapVisualisation = () => {
  return (
    <>
      <div>Map Visualisation</div>
      <div style={{ height: "100%", width: "100%" }}>
        <IndiaMap />
      </div>
    </>
  );
};

export default MapVisualisation;
