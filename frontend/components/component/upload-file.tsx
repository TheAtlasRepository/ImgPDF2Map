import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function UploadFile({ onFileUpload }: { onFileUpload: (fileUrl: string, fileType: string) => void }) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const params = useSearchParams();


  useEffect(() => {
    // If there is an error message in the URL, set the error message state to the value in the URL
    if (params.get("e")) {
      setErrorMessage(params.get("e") as string);
    }
  });

  // Handle file input change when user has used "Open a file"-button
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      checkFileType(file);
    }
  };

  // Handle drag over
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  // Handle file drop
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      checkFileType(file);
    }
  };

  // Check if file type is supported
  const checkFileType = (file: File) => {
    if (file) {
      // Clear any existing error message and set file type and name
      setErrorMessage(null);
      setFileName(file.name);

      // Read and save file to local storage
      const reader = new FileReader();
      reader.onload = () => {
          const blob = new Blob([reader.result as string], { type: file.type });
          const fileUrl = URL.createObjectURL(blob);
          localStorage.setItem(
              "pdfData",
              JSON.stringify({
                  url: fileUrl,
                  type: blob.type,
              })
          );

          // Call onFileUpload with the file type and the file URL
          onFileUpload(fileUrl, file.type);
      };
      reader.readAsArrayBuffer(file);

      // Delete previous PDF if it exists
      if (localStorage.getItem("pdfData")) {
          URL.revokeObjectURL(localStorage.getItem("pdfData")!);
          localStorage.removeItem("pdfData");
      }
    } else {
      setErrorMessage("File type not supported.");
    }
  };

  return (
    <div className="mx-auto w-1/4">
      <div
        onClick={() => document.querySelector("input")?.click()}
        className="cursor-pointer"
      >
        <div
          className="rounded-lg border-4 border-dashed border-lb p-10 py-20 text-center transition-all hover:bg-gray-100"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <FolderUploadIcon className="mx-auto mb-6 text-blue-300" />
          <div className="text-lg font-medium text-gray-400">
            Open, or drop your <b>image or PDF</b> here
          </div>
          {fileName && (
            <div className="text-lg font-medium text-gray-400 mt-4">
              {fileName}
            </div>
          )}
        </div>

        <input
          type="file"
          accept=".pdf, image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <Button
          className="mt-6 w-full bg-blue-600 text-white text-xl"
          variant="blue"
        >
          Open a file
        </Button>
      </div>

      {errorMessage && (
        <Alert variant="destructive" className="mt-5">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}

function FolderPlusIcon(props: any) {
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
      <path d="M4 20h16a2 2 0 2-2V8a2 0-2-2h-7.93a2 1-1.66-.9l-.82-1.2A2 7.93 3H4a2 0-2 2v13c0 1.1.9 2Z" />
      <line x1="12" x2="12" y1="10" y2="16" />
      <line x1="9" x2="15" y1="13" y2="13" />
    </svg>
  );
}

function FolderUploadIcon(props: any) {
  return (
    <svg 
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="100"
      height="130"
      fill="currentColor"
      stroke="none"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <title>file-upload</title>
      <path d="M64.64,13,86.77,36.21H64.64V13ZM42.58,71.67a3.25,3.25,0,0,1-4.92-4.25l9.42-10.91a3.26,3.26,0,0,1,4.59-.33,5.14,5.14,0,0,1,.4.41l9.3,10.28a3.24,3.24,0,0,1-4.81,4.35L52.8,67.07V82.52a3.26,3.26,0,1,1-6.52,0V67.38l-3.7,4.29ZM24.22,85.42a3.26,3.26,0,1,1,6.52,0v7.46H68.36V85.42a3.26,3.26,0,1,1,6.51,0V96.14a3.26,3.26,0,0,1-3.26,3.26H27.48a3.26,3.26,0,0,1-3.26-3.26V85.42ZM99.08,39.19c.15-.57-1.18-2.07-2.68-3.56L63.8,1.36A3.63,3.63,0,0,0,61,0H6.62A6.62,6.62,0,0,0,0,6.62V116.26a6.62,6.62,0,0,0,6.62,6.62H92.46a6.62,6.62,0,0,0,6.62-6.62V39.19Zm-7.4,4.42v71.87H7.4V7.37H57.25V39.9A3.71,3.71,0,0,0,61,43.61Z"/>
    </svg>
  );
}
