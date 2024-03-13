import React, { useState, useEffect } from "react";
import Map, { Source, Layer } from "react-map-gl";
import axios from "axios";
import CoordinateList from "./coordinateList";
import Slider from "../ui/slider";

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
  const [dataUrl, setDataUrl] = useState("");
  const [imageSrc, setImageSrc] = useState(localStorage.getItem("pdfData")!);
  const [opacity, setOpacity] = useState(1);

  const handleOpacity = (value: number) => {
    setOpacity(value);
  }

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
        initialViewState={{
          longitude: cornerCoordinates[0][0],
          latitude: cornerCoordinates[0][1],
          zoom: 3,
        }}
        style={{ width: "100%", height: "90%" }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={mapboxToken}
      >
        {dataUrl && (
          <Source
            id="georeferenced-image-source"
            type="image"
            url={dataUrl}
            coordinates={cornerCoordinates}
          >
            <Layer
              id="georeferenced-image-layer"
              source="georeferenced-image-source"
              type="raster"
              paint={{ "raster-opacity": opacity / 100}}
              raster-resampling="linear"
            />
          </Source>
        )}
      </Map>
      <Slider value={opacity} onChange={handleOpacity} />
    </div>
  );
  
};

export default OverlayView;
