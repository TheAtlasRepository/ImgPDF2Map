import { useState } from "react";
import { Button } from "@/components/ui/button";
import SplitView from "./split-view";

export default function Editor() {
  const [projectName, setProjectName] = useState(""); // Set initial value to an empty string
  const [isAutoSaved, setIsAutoSaved] = useState(false);
  const [isSideBySide, setIsSideBySide] = useState(false); // Add state for side by side toggle

  const handleSave = () => {
    setIsAutoSaved(true);
  };

  const handleToggleSideBySide = () => {
    setIsSideBySide(!isSideBySide); // Toggle the value of isSideBySide
    console.log(isSideBySide); // Log the value of isSideBySide
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gray-800 shadow-md">
        <div className="items-center text-white">
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="text-xl font-semibold bg-transparent border-none outline-none"
            placeholder="Project name" // Add placeholder attribute
          />
          {isAutoSaved && <span className="text-sm text-gray-500">Auto saved</span>}
        </div>
        <Button className="bg-gray-200" onClick={handleSave}>
          Continue
        </Button>
      </div>
      <div className="absolute top-16 left-0 right-0 z-30 flex items-center justify-center p-4">
        <div className="flex items-center space-x-4">
        <Button
            className={`${isSideBySide ? "bg-blue-500" : "bg-gray-800"}`}
            variant="toggle"
            onClick={handleToggleSideBySide} // Add onClick event handler
          >
            Side by side
          </Button>
          <Button className="bg-blue-200" variant="secondary">
            Overlay
          </Button>
          <Button className="bg-gray-200" variant="secondary">
            <TargetIcon className="text-gray-500" />
            <span>Coordinates</span>
          </Button>
          <Button className="bg-gray-200" variant="secondary">
            <ScissorsIcon className="text-gray-500" />
            <span>Clip</span>
          </Button>
        </div>
      </div>
      {isSideBySide ? <SplitView /> : <div className="flex flex-col items-center justify-center flex-1 bg-gray-100">
        <div className="flex items-center justify-center w-full h-full">
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
      </div>}
    </div>
  );
}

function TargetIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function ScissorsIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="6" cy="6" r="3" />
      <path d="M8.12 8.12 12" />
      <path d="M20 4 8.12 15.88" />
      <circle cx="6" cy="18" r="3" />
      <path d="M14.8 14.8 20" />
    </svg>
  );
}
