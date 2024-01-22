import Map, { NavigationControl, GeolocateControl } from "react-map-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import 'react-image-crop/dist/ReactCrop.css'
import ImageMap from "./moveImage";

export default function SplitView() {
  
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

  return (
    <div className="flex h-screen">
    <div className="w-1/2 relative" style={{ zIndex: 1}}>
      <Map
        mapboxAccessToken={mapboxToken}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        initialViewState={{ latitude: 35.668641, longitude: 139.750567, zoom: 10 }}
        maxZoom={20}
        minZoom={3}
      >
        <GeolocateControl position="bottom-right" />
        <NavigationControl position="bottom-right" />
      </Map>
    </div>
    <div className="w-1/2 flex inset-2 justify-center items-center h-full">
      <ImageMap src={localStorage.getItem('pdfData')!} />
    </div>
  </div>
  
);
}
