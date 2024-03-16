import React, { useState, useEffect } from "react";
import Map, { Source, Layer } from "react-map-gl";
import axios from "axios";
import CoordinateList from "./coordinateList";

interface MapOverlayProps {
  projectId: number;
}

const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

const OverlayView = ({ projectId }: MapOverlayProps) => {
  const [cornerCoordinates, setCornerCoordinates] = useState([
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
  ]);

  var [bounds, setBounds] = useState([0, 0, 0, 0]);

  const [dataUrl, setDataUrl] = useState("");
  const [imageSrc, setImageSrc] = useState(localStorage.getItem("pdfData")!);

  const baseURL = "http://localhost:8000";
  useEffect(() => {
    fetch(imageSrc)
      .then((response) => response.blob())
      .then((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const dataUrl = reader.result;
          setDataUrl(dataUrl as string);
        };
        reader.readAsDataURL(blob);
      })
      .catch((error) =>
        console.error("Error converting blob URL to data URL:", error)
      );
  }, [projectId, imageSrc]);

  return (
    <div className="w-full h-full">
      <Map
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={mapboxToken}
        initialViewState={{
          latitude: 58.145,
          longitude: 8,
          zoom: 12,
        }}
        minZoom={5}
        maxZoom={19}
      >
        {dataUrl && (
          <Source
            id="georeferenced-image-source"
            type="raster"
            tiles={[`${baseURL}/project/${projectId}/tiles/{z}/{x}/{y}.png`]}
            tileSize={256}
          >
            <Layer
              id="georeferenced-image-layer"
              source="georeferenced-image-source"
              type="raster"
              raster-opacity={1}
            />
          </Source>
        )}
      </Map>
    </div>
  );
};

export default OverlayView;
