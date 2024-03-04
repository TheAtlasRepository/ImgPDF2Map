import { use, useEffect, useRef, useState } from "react";
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
import * as api from "./projectAPI";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function SplitView() {
  //project states
  const [projectId, setProjectId] = useState(1);
  const [projectName, setProjectName] = useState("Project 1");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [helpMessage, setHelpMessage] = useState<string | null>(null);

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

    setMapMarkers([...mapMarkers, { geoCoordinates }]);
    setGeorefMarkerPairs((pairs) => {
      const lastPair = pairs[pairs.length - 1];
      if (
        pairs.length === 0 ||
        (lastPair.latLong[0] !== 0 &&
          lastPair.latLong[1] !== 0 &&
          lastPair.pixelCoords[0] !== 0 &&
          lastPair.pixelCoords[1] !== 0)
      ) {
        // Add a new pair if the array is empty or the last pair is complete
        return [...pairs, { latLong: geoCoordinates, pixelCoords: [0, 0] }];
      } else {
        // Update the last pair if it's incomplete
        return pairs.map((pair, index) =>
          index === pairs.length - 1
            ? { ...pair, latLong: geoCoordinates }
            : pair
        );
      }
    });
    setWaitingForImageMarker(true);
    setWaitingForMapMarker(false);
  };

  //image states
  const [transform, setTransform] = useState({ x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState(1);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageMarkers, setImageMarkers] = useState<ImageMarker[]>([]);
  const [calculatedDragDistance, setCalculatedDragDistance] = useState(0);

  const addImageMarker = (event: React.MouseEvent<HTMLDivElement>) => {
    if (waitingForMapMarker) return;

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
      //reset the drag start
      setDragStart({ x, y });
      return;
    }

    // //TODO: FIX THIS, trying to adjust marker placement based on zoomlevel
    // const centerX = imageSize.width / 2;
    // const centerY = imageSize.height / 2;

    // //adjust the marker position based on the transform and zoom level
    // const adjustedX = centerX + (x - centerX) * zoomLevel;
    // const adjustedY = centerY + (y - centerY) * zoomLevel;
    //
    setImageMarkers([...imageMarkers, { pixelCoordinates: [x, y] }]);

    setGeorefMarkerPairs((pairs) => {
      const lastPair = pairs[pairs.length - 1];
      if (
        pairs.length === 0 ||
        (lastPair.pixelCoords[0] !== 0 &&
          lastPair.pixelCoords[1] !== 0 &&
          lastPair.latLong[0] !== 0 &&
          lastPair.latLong[1] !== 0)
      ) {
        // Add a new pair if the array is empty or the last pair is complete
        return [...pairs, { latLong: [0, 0], pixelCoords: [x, y] }];
      } else {
        // Update the last pair if it's incomplete
        return pairs.map((pair, index) =>
          index === pairs.length - 1 ? { ...pair, pixelCoords: [x, y] } : pair
        );
      }
    });
    setWaitingForMapMarker(true);
    setWaitingForImageMarker(false);
  };

  //adjust marker positions based on image manipulation
  const adjustMarkerPositions = (
    pixelCoordinates: [number, number],
    transform: { x: number; y: number },
    zoomLevel: number,
    imageSize: { width: number; height: number }
  ): { left: string; top: string } => {
    //defines the center of the image
    const centerX = imageSize.width / 2;
    const centerY = imageSize.height / 2;

    //adjusts the marker position based on the transform and zoom level
    const adjustedX =
      centerX + (pixelCoordinates[0] - centerX) * zoomLevel + transform.x;
    const adjustedY =
      centerY + (pixelCoordinates[1] - centerY) * zoomLevel + transform.y;

    return {
      left: `${adjustedX}px`,
      top: `${adjustedY}px`,
    };
  };

  //useEffect to make API call when georefMarkerPairs changes and filter out pairs where latlong or pixelcoords is [0,0]
  useEffect(() => {
    //filter out pairs where latlong or pixelcoords is [0,0]
    const validPairs = georefMarkerPairs.filter(
      (pair) =>
        pair.latLong[0] !== 0 &&
        pair.latLong[1] !== 0 &&
        pair.pixelCoords[0] !== 0 &&
        pair.pixelCoords[1] !== 0
    );
    // iterate through valid pairs and make API call
    validPairs.forEach((pair) => {
      const { latLong, pixelCoords } = pair;
      api
        .addMarkerPair(projectId, ...latLong, ...pixelCoords)
        .then((data) => {
          // handle success
          console.log("Success:", data);
          setWaitingForImageMarker(false);
          setWaitingForMapMarker(false);
        })
        .catch((error) => {
          // handle error
          console.error("Error:", error.message);
          // setErrorMessage(error.message);
        });
    });
  }, [georefMarkerPairs]);

  //function to add a new project
  const addProject = (name: string) => {
    if (!projectName) return;

    //make API call to add project
    api
      .addProject(name)
      .then((data) => {
        // handle success
        console.log("Success:", data);
        setProjectId(data.id);
        console.log("project id:", projectId);
      })
      .catch((error) => {
        // handle error
        console.error("Error:", error.message);
        setErrorMessage(error.message);
      });
  };

  //call the addProject function when the component mounts
  useEffect(() => {
    let mounted = true;
    if (mounted) {
      addProject(projectName);
      setHelpMessage(
        "Start by adding markers to the map in the area you want to georeference."
      );
    }
    return () => {
      mounted = false;
    };
  }, []);

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

  return (
    <div className="h-screen">
      <div className=""></div>
      <div className="flex justify-center">
        <div className="fixed w-2/5 z-50 m-4 text-center">
          <Alert variant={"help"} className="">
            <AlertDescription>{helpMessage}</AlertDescription>
            {errorMessage && (
              <Alert variant="destructive" className="p-1">
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
          </Alert>
        </div>
      </div>
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
            setImageSize={setImageSize}
            imageSize={imageSize}
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
                    zoomLevel,
                    imageSize
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
