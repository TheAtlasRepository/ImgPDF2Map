import Map, { NavigationControl, GeolocateControl } from "react-map-gl";


export default function splitView() {
  
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

  return (
    <div className="flex h-screen">
      <div className="w-1/2">
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
      <div className="w-1/2">
        <img
          alt="PDF"
          className="h-full w-full object-cover"
          height="100"
          src="/placeholder.svg"
          style={{
            aspectRatio: "100/100",
            objectFit: "cover",
          }}
          width="100"
        />
      </div>
    </div>
  )
}
