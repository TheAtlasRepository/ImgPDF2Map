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
  const northEastLngLat = [cornerCoordinates[1][0], cornerCoordinates[1][1]];
  const southWestLngLat = [cornerCoordinates[3][0], cornerCoordinates[3][1]];
  const [dataUrl, setDataUrl] = useState("");
  const [imageSrc, setImageSrc] = useState(localStorage.getItem("pdfData")!);

  const baseURL = "http://localhost:8000";
  useEffect(() => {
    async function fetchCornerCoordinates() {
      try {
        const coordinatesResponse = await axios.get(
          `${baseURL}/project/${projectId}/georef/coordinates`
        );
        const coords = coordinatesResponse.data;
        setCornerCoordinates(coords);
      } catch (error) {
        console.error("Error fetching corner coordinates:", error);
      }
    }

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
    fetchCornerCoordinates();
  }, [projectId]);

  return (
    <div className="w-full h-full">
      <Map
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={mapboxToken}
      >
        {dataUrl && (
          <Source
            id="georeferenced-image-source"
            type="raster"
            tiles={[`${baseURL}/project/${projectId}/tiles/{z}/{x}/{y}.png`]}
            tileSize={256}
            // sets the bounds of the image to the corner coordinates
            // stops requests for tiles outside of the bounds
            bounds={[...southWestLngLat, ...northEastLngLat]}
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
