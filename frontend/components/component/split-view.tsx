import { useRef } from "react";
import {Map, NavigationControl, GeolocateControl } from "react-map-gl";
import type { MapRef } from "react-map-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import 'react-image-crop/dist/ReactCrop.css'
import ImageMap from "./moveImage";
import { Allotment } from "allotment";
import "allotment/dist/style.css";

export default function SplitView() {
  
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  const mapRef = useRef<MapRef>(null);

  return (
    <div className="h-screen">
      <Allotment onDragEnd={() => mapRef.current?.resize()}>
        <Allotment.Pane minSize={200}>
          <Map
            mapboxAccessToken={mapboxToken}
            mapStyle="mapbox://styles/mapbox/streets-v12"
            initialViewState={{  }}
            maxZoom={20}
            minZoom={3}
            reuseMaps={true}
            ref={mapRef}
          >
            <GeolocateControl position="bottom-right" />
            <NavigationControl position="bottom-right" />
          </Map>
        </Allotment.Pane>
        <Allotment.Pane minSize={200}>
          <ImageMap src={localStorage.getItem('pdfData')!} />
        </Allotment.Pane>
      </Allotment>
    </div>
  
);
}
