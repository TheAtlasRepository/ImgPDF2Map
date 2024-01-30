import {Map, NavigationControl, GeolocateControl } from "react-map-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import 'react-image-crop/dist/ReactCrop.css'
import ImageMap from "./moveImage";
import { Allotment } from "allotment";
import "allotment/dist/style.css";

export default function SplitView() {
  
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

  return (
    <div className="h-screen">
      <Allotment>
        <Allotment.Pane minSize={200}>
          <Map
            mapboxAccessToken={mapboxToken}
            mapStyle="mapbox://styles/mapbox/streets-v12"
            initialViewState={{ latitude: 35.668641, longitude: 139.750567, zoom: 10 }}
            maxZoom={20}
            minZoom={3}
            reuseMaps={true}
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
