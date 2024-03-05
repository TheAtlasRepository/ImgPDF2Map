import { useState } from "react";
import { Button } from "@/components/ui/button";
import SplitView from "./split-view";
import ImageEdit from "./imageEdit";
import { OpenBook, TargetIcon, WindowsIcon, SelectionIcon } from "@/components/ui/icons";

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
      <div className="flex items-center justify-between p-4 background-dark shadow-md">
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
            className={`${isSideBySide ? "bg-blue-500" : "bg-gray-700"} hover:bg-blue-800 dark:hover:bg-blue-800`}
            variant="toggle"
            onClick={handleToggleSideBySide} // Add onClick event handler
          >
            <OpenBook className="text-white" />
            Side by side
          </Button>
          <Button className="bg-gray-200 dark:bg-gray-700 hover:bg-blue-800 dark:hover:bg-blue-800" variant="secondary">
            <WindowsIcon className="text-gray-500" />
            Overlay
          </Button>
          <Button className="bg-gray-200 dark:bg-gray-700 hover:bg-blue-800 dark:hover:bg-blue-800" variant="secondary">
            <TargetIcon className="text-gray-500" />
            <span>Coordinates</span>
          </Button>
          <Button
            className={`${isCrop ? "bg-blue-500" : "bg-gray-700"} hover:bg-blue-800 dark:hover:bg-blue-800`}
            variant="toggle"
            onClick={handleToggleCrop} // Add onClick event handler
          >
            <SelectionIcon className="text-white" />
            Crop
          </Button>
        </div>
        <Button className="bg-gray-200 dark:bg-gray-700 dark:hover:bg-blue-800 dark:text-white" onClick={handleSave}>
          Continue
        </Button>
      </div>
      {isSideBySide ? (
        <SplitView />
      ) : (
        <div
          className={`flex flex-col items-center justify-center flex-1 ${
            !isCrop ? "bg-gray-100 dark:bg-gray-900" : "bg-gray-400 dark:bg-gray-800"
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
