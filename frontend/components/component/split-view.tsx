import { useEffect, useRef, useState } from "react";
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

  //georeferencing types
  type GeoCoordinates = [number, number];
  type imageCoordinates = [number, number];
  type ImageMarker = {
    pixelCoordinates: imageCoordinates;
  };

  //array of lonlat and pixel coordinates in pairs
  const [georefMarkerPairs, setGeorefMarkerPairs] = useState<
    { latLong: GeoCoordinates; pixelCoords: imageCoordinates }[]
  >([]);

  //map states
  const [mapMarkers, setMapMarkers] = useState<
    { geoCoordinates: GeoCoordinates }[]
  >([]);

  const [waitingForImageMarker, setWaitingForImageMarker] = useState(false);
  const [waitingForMapMarker, setWaitingForMapMarker] = useState(false);

  const addMapMarker = (geoCoordinates: GeoCoordinates) => {
    if (waitingForImageMarker) return;
    //limit to 3 markers initially
    if (mapMarkers.length >= 3) return;

    setMapMarkers([...mapMarkers, { geoCoordinates }]);

    setGeorefMarkerPairs([
      ...georefMarkerPairs,
      { latLong: geoCoordinates, pixelCoords: [0, 0] },
    ]);

    setWaitingForImageMarker(true);
    setWaitingForMapMarker(false);
  };

  //image states
  const [transform, setTransform] = useState({ x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageMarkers, setImageMarkers] = useState<ImageMarker[]>([]);
  const [calculatedDragDistance, setCalculatedDragDistance] = useState(0);

  const addImageMarker = (event: React.MouseEvent<HTMLDivElement>) => {
    if (waitingForMapMarker) return;
    if (isDragging) return;

    //get the x and y coordinates of the click event
    const rect = (event.target as Element).getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    //calculate the start position of the drag
    setCalculatedDragDistance(
      Math.sqrt(Math.pow(dragStart.x - x, 2) + Math.pow(dragStart.y - y, 2))
    );

    //calculate the distance between the start and end of the drag
    const distance = Math.sqrt(
      Math.pow(dragStart.x - x, 2) + Math.pow(dragStart.y - y, 2)
    );

    //difference between dragdistance and distance, shows amount of pixels dragged
    const dragDifference = Math.abs(distance - calculatedDragDistance);
    //if distance is greater than 0.1 pixels, consider it a drag
    if (dragDifference > 0.1) {
      console.log("dragging");
      console.log("distance dragged:", dragDifference);
      return;
    }
    // limit to 3 markers initially
    if (imageMarkers.length >= 3) return;

    //
    setImageMarkers([...imageMarkers, { pixelCoordinates: [x, y] }]);
    const updatedPairs = [...georefMarkerPairs];
    if (updatedPairs.length > 0) {
      const lastPair = updatedPairs[updatedPairs.length - 1];
      if (!lastPair.latLong) {
        lastPair.latLong = [0, 0];
        lastPair.pixelCoords = [x, y];
        setGeorefMarkerPairs(updatedPairs);
      } else {
        lastPair.pixelCoords = [x, y];
        setGeorefMarkerPairs(updatedPairs);
      }
    }

    setWaitingForMapMarker(true);
    setWaitingForImageMarker(false);
  };

  const renderGeorefPairTable = () => {
    if (!georefMarkerPairs.length) return null;
    return (
      <div className="">
        <div className="absolute bottom-0 right-0">
          <table className="table-auto w-full text-sm text-left">
            <thead>
              <tr>
                <th>Latitude</th>
                <th>Longitude</th>
                <th>Map X</th>
                <th>Map Y</th>
              </tr>
            </thead>
            <tbody>
              {georefMarkerPairs.map((pair, index) => (
                <tr key={index}>
                  <td>{pair.latLong[0]}</td>
                  <td>{pair.latLong[1]}</td>
                  <td>{pair.pixelCoords[0]}</td>
                  <td>{pair.pixelCoords[1]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  //adjust marker positions based on image manipulation
  const adjustMarkerPositions = (
    pixelCoordinates: [number, number],
    transform: { x: number; y: number },
    zoomLevel: number
  ): { left: string; top: string } => {
    const adjustedX = pixelCoordinates[0] * zoomLevel + transform.x;
    const adjustedY = pixelCoordinates[1] * zoomLevel + transform.y;

    return {
      left: `${adjustedX}px`,
      top: `${adjustedY}px`,
    };
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
            //transforms passed to imagemap component for image manipulation
            setTransform={setTransform}
            setZoomLevel={setZoomLevel}
            transform={transform}
            zoomLevel={zoomLevel}
            setIsDragging={setIsDragging}
            setDragStart={setDragStart}
            dragStart={dragStart}
          >
            {imageMarkers.map((marker, index) => (
              <div
                key={index}
                style={{
                  position: "absolute",
                  // left: `${marker.pixelCoordinates[0]}px`,
                  // top: `${marker.pixelCoordinates[1]}px`,
                  transform: "translate(-50%, -85%)", // Center the marker
                  ...adjustMarkerPositions(
                    marker.pixelCoordinates,
                    transform,
                    zoomLevel
                  ),
                }}
              >
                <Image
                  src="/map-pin.svg"
                  alt="map-pin"
                  width={30}
                  height={30}
                  onDragStart={(e) => e.preventDefault()}
                />
              </div>
            ))}
          </ImageMap>
          {renderGeorefPairTable()}
        </Allotment.Pane>
      </Allotment>
    </div>
  );
}
