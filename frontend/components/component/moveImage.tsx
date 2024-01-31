import React, { useState, useEffect } from 'react';

export default function ImageMap({ src }: { src: string }) {
  const [transform, setTransform] = useState({ x: 0, y: 0});
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setDragStart({ x: event.clientX, y: event.clientY });
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const deltaX = (event.clientX - dragStart.x);// speed of drag
    const deltaY = (event.clientY - dragStart.y); // speed of drag
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
    const container = document.getElementById('image-container');
    if (container) {
      container.addEventListener('wheel', handleMouseWheel as unknown as EventListener);
    }
    return () => {
      if (container) {
        container.removeEventListener('wheel', handleMouseWheel as unknown as EventListener);
      }
    };
  }, []);

  return (
    <div
      className="flex h-full"
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      id="image-container"
    >
      <div
        style={{
          position: 'absolute',
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${zoomLevel})`,
          overflow: 'auto',
        }}
      >
        <img
          src={src}
          alt="Image"
          onDragStart={(e) => e.preventDefault()}
        />
      </div>
    </div>
  );
}