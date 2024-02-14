import React, { useState, useEffect } from "react";

interface ImageMapProps {
  src: string;
  children?: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

export default function ImageMap({ src, children, onClick }: ImageMapProps) {
  const [transform, setTransform] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState(1);

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

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setDragStart({ x: event.clientX, y: event.clientY });
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const deltaX = event.clientX - dragStart.x; // speed of drag
    const deltaY = event.clientY - dragStart.y; // speed of drag
    setTransform((prevTransform) => ({
      x: prevTransform.x + deltaX,
      y: prevTransform.y + deltaY,
    }));
    setDragStart({ x: event.clientX, y: event.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    const zoomDelta = event.deltaY > 0 ? -0.1 : 0.1;
    setZoomLevel((prevZoomLevel) => prevZoomLevel + zoomDelta);
  };

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
