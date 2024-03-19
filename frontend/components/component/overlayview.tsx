import React, { useState, useEffect } from "react";
import Map, { Source, Layer } from "react-map-gl";
import { Slider } from "@/components/ui/slider"

interface MapOverlayProps {
  projectId: number;
}

const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

const OverlayView = ({ projectId }: MapOverlayProps) => {

  const [dataUrl, setDataUrl] = useState("");
  const [imageSrc, setImageSrc] = useState(localStorage.getItem("pdfData")!);
  const [opacity, setOpacity] = useState(100);

  const handleOpacity = (values: number[]) => {
    const opacityValue = values[0]
    setOpacity(opacityValue);
  };

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
        <div className="flex justify-center mt-5">
          <div className="fixed z-50 w-1/5">
            <Slider
              defaultValue={[50]}
              max={100}
              step={1}
              onValueChange={handleOpacity}/>
          </div>
        </div>
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
              paint={{ "raster-opacity": opacity / 100 }}
            />
          </Source>
        )}
      </Map>
    </div>
  );
};

export default OverlayView;
