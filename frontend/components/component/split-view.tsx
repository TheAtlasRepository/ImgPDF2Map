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

  type GeoCoordinates = [number, number];

  type imageCoordinates = [number, number];

  const [georefMarkerPairs, setGeorefMarkerPairs] = useState<
    { latLong: GeoCoordinates; pixelCoords: imageCoordinates }[]
  >([]);

  const handleStyleChange = (newStyle: string) => {
    setMapStyle(newStyle);
  };

  const [mapMarkers, setMapMarkers] = useState<
    { geoCoordinates: GeoCoordinates }[]
  >([]);

  const addMapMarker = (geoCoordinates: GeoCoordinates) => {
    if (mapMarkers.length >= 3) return;
    setMapMarkers([...mapMarkers, { geoCoordinates }]);

    if (georefMarkerPairs.length < 3) {
      setGeorefMarkerPairs([
        ...georefMarkerPairs,
        { latLong: geoCoordinates, pixelCoords: [0, 0] },
      ]);
    }
    console.log(georefMarkerPairs);
  };

  //image states
  const [transform, setTransform] = useState({ x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState(1);

  const [isDragging, setIsDragging] = useState(false);

  type ImageMarker = {
    pixelCoordinates: [number, number];
  };

  const [imageMarkers, setImageMarkers] = useState<ImageMarker[]>([]);

  const addImageMarker = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) return;
    if (imageMarkers.length >= 3) return;
    const rect = (event.target as Element).getBoundingClientRect();
    const x = event.clientX - rect.left; // x position within the element.
    const y = event.clientY - rect.top; // y position within the element.
    setImageMarkers([...imageMarkers, { pixelCoordinates: [x, y] }]);
    // console.log(imageMarkers);

    const updatedPairs = [...georefMarkerPairs];
    updatedPairs[georefMarkerPairs.length - 1].pixelCoords = [x, y];
    setGeorefMarkerPairs(updatedPairs);
  };

  const renderGeorefPairTable = () => {
    if (!georefMarkerPairs.length) return null;
    return (
      <table>
        <thead>
          <tr>
            <th>Latitude</th>
            <th>Longitude</th>
            <th>Pixel X</th>
            <th>Pixel Y</th>
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
    );
  };

  //adjust marker positions based on image manipulation
  const adjustMarkerPositions = (
    pixelCoordinates: [number, number],
    transform: { x: number; y: number },
    zoomLevel: number
  ): { left: string; top: string } => {
    const adjustedX = pixelCoordinates[0] + transform.x;
    const adjustedY = pixelCoordinates[1] + transform.y;

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
            initialIsDragging={isDragging}
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
          <div className="absolute bottom-0">{renderGeorefPairTable()}</div>
        </Allotment.Pane>
      </Allotment>
    </div>
  );
}
