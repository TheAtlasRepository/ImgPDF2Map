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

export default function SplitView() {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";
  const mapRef = useRef<MapRef>(null);

  const [mapStyle, setMapStyle] = useState(
    "mapbox://styles/mapbox/streets-v12"
  );

  const handleStyleChange = (newStyle: string) => {
    setMapStyle(newStyle);
  };

  const [markers, setMarkers] = useState<{ geoCoordinates: GeoCoordinates }[]>(
    []
  );
  type GeoCoordinates = [number, number];

  const addMarker = (geoCoordinates: GeoCoordinates) => {
    setMarkers([...markers, { geoCoordinates }]);
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
              addMarker([lng, lat]);
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
            {markers.map((marker, index) => (
              <Marker
                key={index}
                longitude={marker.geoCoordinates[0]}
                latitude={marker.geoCoordinates[1]}
              >
                {/* use this for custom css on marker */}
                {/* <div className="marker">📍</div> */}
              </Marker>
            ))}
          </Map>
        </Allotment.Pane>
        <Allotment.Pane minSize={200} className="bg-gray-100">
          <ImageMap src={localStorage.getItem("pdfData")!} />
        </Allotment.Pane>
      </Allotment>
    </div>
  );
}
