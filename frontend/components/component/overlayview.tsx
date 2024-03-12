import React, { useState, useEffect } from 'react';
import Map, {Source, Layer} from 'react-map-gl';
import axios from 'axios';

interface MapOverlayProps {
  projectId: number;
}

const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

const OverlayView = ({projectId}: MapOverlayProps) => {
  const  [tiffBlob, setTiffBlob] = useState(null || new Blob());
  const [tiffUrl, setTiffUrl] = useState("");


  useEffect(() => {
    const fetchGeorefImage = async () => {
      try {
        const apiUrl = `http://localhost:8000/project/${projectId}/image/geo`;
        const response = await axios.get(apiUrl, {
          responseType: 'blob', // This tells Axios to expect a blob response
        });
        // Since response.data contains the blob, you can directly create a blob URL from it
        const url = URL.createObjectURL(response.data);
        setTiffUrl(url); // Set the blob URL for use in the <img> or as a source for the Map component
  
      } catch (error) {
        console.error("Error fetching georeferenced image:", error);
      }
    };
  
    fetchGeorefImage();
  
    // Clean up function to revoke the blob URL when the component unmounts
    return () => {
      if (tiffUrl) {
        URL.revokeObjectURL(tiffUrl);
      }
    };
  }, [projectId]); // Include projectId in the dependency array to refetch the image if it changes

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
      {tiffUrl && (
        <Source
          id="georeferenced-image-source"
          type="image"
          url={tiffUrl}
          coordinates=
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