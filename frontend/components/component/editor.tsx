import { useState } from "react";
import { Button } from "@/components/ui/button";
import SplitView from "./split-view";
import ImageEdit from "./imageEdit";

export default function Editor() {
  const [projectName, setProjectName] = useState(""); // Set initial value to an empty string
  const [isAutoSaved, setIsAutoSaved] = useState(false);
  const [isSideBySide, setIsSideBySide] = useState(false); // Add state for side by side toggle
  const [wasSideBySide, setWasSideBySide] = useState(false);
  const [isCrop, setIsCrop] = useState(false);
  const [imageSrc, setImageSrc] = useState(localStorage.getItem("pdfData")!); // Keeps track of image URL

  const handleSave = () => {
    setIsAutoSaved(true);
  };

  const handleToggleSideBySide = () => {
    if (!isCrop) {
      setIsSideBySide(!isSideBySide); // Toggle the value of isSideBySide
      console.log(isSideBySide); // Log the value of isSideBySide
    }
  };

  const handleToggleCrop = () => {
    if (!isCrop) {
      setWasSideBySide(isSideBySide); // Save the current value of isSideBySide
      setIsSideBySide(false); // Set isSideBySide to false when cropping is activated
    } else {
      setIsSideBySide(wasSideBySide); // Restore the value of isSideBySide when cropping is deactivated
    }

    setIsCrop((prevCrop) => !prevCrop); // Toggle the value of isCrop

    console.log(isCrop); // Log the value of isSideBySide
  };

  // Update the image source when the user has cropped the image, and close the crop tool
  const handleCrop = () => {
    setImageSrc(localStorage.getItem("pdfData")!);
    handleToggleCrop();
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <div className="flex items-center justify-between p-4 bg-gray-800 shadow-md">
        <div className="items-center text-white">
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="text-xl font-semibold bg-transparent border-none outline-none"
            placeholder="Project name" // Add placeholder attribute
          />
          {isAutoSaved && (
            <span className="text-sm text-gray-500">Auto saved</span>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <Button
            className={`${isSideBySide ? "bg-blue-500" : "bg-blue-800"}`}
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
          <Button
            className={`${isCrop ? "bg-blue-500" : "bg-gray-700"}`}
            variant="toggle"
            onClick={handleToggleCrop} // Add onClick event handler
          >
            <ScissorsIcon className="text-gray-500" />
            Crop
          </Button>
        </div>
        <Button className="bg-gray-200" onClick={handleSave}>
          Continue
        </Button>
      </div>
      {isSideBySide ? (
        <SplitView />
      ) : (
        <div
          className={`flex flex-col items-center justify-center flex-1 ${
            !isCrop ? "bg-gray-100" : "bg-gray-500"
          }`}
        >
          <div className="flex items-center justify-center w-full">
            <div className="w-1/2 flex justify-center items-center">
              <ImageEdit
                editBool={isCrop}
                onCrop={handleCrop} // When the user has cropped the image
              />
            </div>
          </div>
        </div>
      )}
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
