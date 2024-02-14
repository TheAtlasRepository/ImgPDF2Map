import { useRef, useState } from "react";
import { Map, NavigationControl, GeolocateControl, Marker } from "react-map-gl";
import type { MapRef } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "react-image-crop/dist/ReactCrop.css";
import ImageMap from "./moveImage";
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import GeocoderControl from "./geocoder-control";
import MapStyleToggle from "./mapStyleToggle";
import Image from "next/image";
import mapboxgl from "mapbox-gl";

export default function SplitView() {
  //mapbox states
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";
  const mapRef = useRef<MapRef>(null);

  const [mapStyle, setMapStyle] = useState(
    "mapbox://styles/mapbox/streets-v12"
  );

  const handleStyleChange = (newStyle: string) => {
    setMapStyle(newStyle);
  };

  const [mapMarkers, setMapMarkers] = useState<
    { geoCoordinates: GeoCoordinates }[]
  >([]);
  type GeoCoordinates = [number, number];

  const addMapMarker = (geoCoordinates: GeoCoordinates) => {
    setMapMarkers([...mapMarkers, { geoCoordinates }]);
  };

  //image states
  // const [transform, setTransform] = useState({ x: 0, y: 0 });
  // const [zoomLevel, setZoomLevel] = useState(1);

  type ImageMarker = {
    pixelCoordinates: [number, number];
  };

  const [imageMarkers, setImageMarkers] = useState<ImageMarker[]>([]);

  const addImageMarker = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = (event.target as Element).getBoundingClientRect();
    const x = event.clientX - rect.left; // x position within the element.
    const y = event.clientY - rect.top; // y position within the element.

    // Adjust the pixel coordinates based on the image's transformation
    // const adjustedX = (x - transform.x) / zoomLevel;
    // const adjustedY = (y - transform.y) / zoomLevel;

    //   setImageMarkers([
    //     ...imageMarkers,
    //     { pixelCoordinates: [adjustedX, adjustedY] },
    //   ]);

    setImageMarkers([...imageMarkers, { pixelCoordinates: [x, y] }]);
  };

  return (
    <div className="h-screen">
      <Allotment onDragEnd={() => mapRef.current?.resize()}>
        <Allotment.Pane minSize={200}>
          <Map
            mapboxAccessToken={mapboxToken}
            mapStyle={mapStyle}
            initialViewState={{}}
            maxZoom={20}
            minZoom={3}
            reuseMaps={true}
            ref={mapRef}
            onClick={(event) => {
              const { lng, lat } = event.lngLat;
              addMapMarker([lng, lat]);
            }}
          >
            <div className="absolute top-0 left-0 m-4">
              <MapStyleToggle onStyleChange={handleStyleChange} />
            </div>

            <GeolocateControl position="bottom-right" />
            <NavigationControl position="bottom-right" />
            <div className="absolute top-20">
              <GeocoderControl
                mapboxAccessToken={mapboxToken}
                position="bottom-left"
              />
            </div>
            {mapMarkers.map((marker, index) => (
              <Marker
                key={index}
                longitude={marker.geoCoordinates[0]}
                latitude={marker.geoCoordinates[1]}
                offset={new mapboxgl.Point(0, -15)}
              >
                {/* use this for custom css on marker */}
                {/* <div className="marker">📍</div> */}
                <Image
                  src="/map-pin.svg"
                  alt="map-pin"
                  width={30}
                  height={30}
                />
              </Marker>
            ))}
          </Map>
        </Allotment.Pane>
        <Allotment.Pane minSize={200} className="bg-gray-100">
          <ImageMap
            src={localStorage.getItem("pdfData")!}
            onClick={addImageMarker}
            // setTransform={setTransform}
            // setZoomLevel={setZoomLevel}
          >
            {imageMarkers.map((marker, index) => (
              <div
                key={index}
                style={{
                  position: "absolute",
                  left: `${marker.pixelCoordinates[0]}px`,
                  top: `${marker.pixelCoordinates[1]}px`,
                  transform: "translate(-50%, -50%)", // Center the marker
                }}
              >
                📍
              </div>
            ))}
          </ImageMap>
        </Allotment.Pane>
      </Allotment>
    </div>
  );
}
