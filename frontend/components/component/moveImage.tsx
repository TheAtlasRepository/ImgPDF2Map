import { init } from "next/dist/compiled/webpack/webpack";
import React, { useState, useEffect, use } from "react";

interface ImageMapProps {
  src: string;
  children?: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;

  // variables for dragging and zooming
  zoomLevel: number;
  transform: { x: number; y: number };
  setTransform: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  setZoomLevel: React.Dispatch<React.SetStateAction<number>>;

  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
  initialIsDragging: boolean;
}

export default function ImageMap({
  src,
  children,
  onClick,
  setIsDragging,
  initialIsDragging,

  setTransform,
  setZoomLevel,
  transform,
  zoomLevel,
}: ImageMapProps) {
  //local state for dragging
  const [localIsDragging, setLocalIsDragging] = useState(initialIsDragging);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  //size of imgs container
  const [imgSize, setImgSize] = useState({ width: 0, height: 0 });

  //sets size of img container relative to size of img
  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setImgSize({ width: img.width, height: img.height });
    };
  }, [src]);

  const setDragState = (bool: boolean) => {
    setIsDragging(bool);
    setLocalIsDragging(bool);
  };
  // Update local state when prop changes
  useEffect(() => {
    setLocalIsDragging(initialIsDragging);
  }, [initialIsDragging]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (initialIsDragging) {
      const deltaX = event.clientX - dragStart.x; // speed of drag
      const deltaY = event.clientY - dragStart.y; // speed of drag
      setTransform((prevTransform) => ({
        x: prevTransform.x + deltaX,
        y: prevTransform.y + deltaY,
      }));
      setDragStart({ x: event.clientX, y: event.clientY });
    }
  };

  const handleMouseUp = () => {
    // //short timeout to prevent click event from firing after drag
    // setTimeout(() => {
    //   setDragState(false);
    // }, 10);
    setDragState(false);
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    setDragState(true);
    setDragStart({ x: event.clientX, y: event.clientY });
  };

  const handleMouseWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    const zoomDelta = event.deltaY > 0 ? -0.1 : 0.1;
    setZoomLevel((prevZoomLevel) => prevZoomLevel + zoomDelta);
  };

  //event listener for mouse wheel
  useEffect(() => {
    const container = document.getElementById("image-container");
    if (container) {
      container.addEventListener(
        "wheel",
        handleMouseWheel as unknown as EventListener
      );
    }
    return () => {
      if (container) {
        container.removeEventListener(
          "wheel",
          handleMouseWheel as unknown as EventListener
        );
      }
    };
  }, []);

  return (
    <div
      className="flex h-full"
      style={{
        position: "relative",
        width: imgSize.width / 4,
        height: imgSize.height / 4,
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={onClick}
      id="image-container"
    >
      <div
        style={{
          position: "absolute",
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${zoomLevel})`,
          overflow: "auto",
        }}
      >
        <img
          src={src}
          alt="Image"
          onDragStart={(e) => e.preventDefault()}
          // style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </div>
      {children}
    </div>
  );
}
