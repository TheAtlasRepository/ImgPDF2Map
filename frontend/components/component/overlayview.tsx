import React, { useState, useEffect } from 'react';
import Map, {Source, Layer} from 'react-map-gl';
import axios from 'axios';

interface MapOverlayProps {
  projectId: number;
}

const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

const OverlayView = ({projectId}: MapOverlayProps) => {
  const  [mapImageUrl, setMapImageUrl] = useState(null);


  useEffect(() => {

    const fetchGeorefImage = async () => {
      try {
        const response = await axios.get(`/localhost:8000/projects/${projectId}/georef-image`);
        setMapImageUrl(response.data);
      } catch (error) {
        console.error("Error fetching georeferenced image:", error);
      }
    };
    fetchGeorefImage();
  }, []);

  return (
    <Map
      initialViewState={{
        longitude: -100,
        latitude: 40,
        zoom: 3
      }}
      style={{width: "100%", height: "100%"}}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      mapboxAccessToken={mapboxToken}
    >
      {mapImageUrl && (
        <Source
          id="georeferenced-image-source"
          type="image"
          url={mapImageUrl}
        >
          <Layer
            id="georeferenced-image-layer"
            source="georeferenced-image-source"
            type="raster"
          />
        </Source>
      )}
    </Map>
  );
};
  
export default OverlayView;