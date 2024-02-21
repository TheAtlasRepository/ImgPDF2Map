"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Conversion from "../../components/component/conversion";
import UploadFile from "../../components/component/upload-file";
import axios from "axios";

export default function Page() {
  const router = useRouter();
  const searchParam = useSearchParams();

  // Initialize pdfData state variable
  const [pdfData, setPdfData] = useState<string | null>(null);

  // Convert Image or PDF to PNG after component has been rendered on the client side.
  useEffect(() => {
    if (typeof window !== "undefined") {
      const pdfDataFromLocalStorage = window.localStorage.getItem("pdfData");

      // Check if pdfData is already in local storage
      if (pdfDataFromLocalStorage !== null) {
        // Parse the data from local storage
        const parsedData = JSON.parse(pdfDataFromLocalStorage);
        setPdfData(parsedData);

        // Fetch the Blob from the URL
        fetch(parsedData.url)
          .then((res) => res.blob())
          .then((blob) => {
            const formData = new FormData();
            formData.append("file", blob, "");
            // Get the file type
            const fileType = parsedData.type;

            // Handle different the different file types
            if (fileType === "image/png") {
              // Create a Blob URL from the fetched Blob
              const fileURL = URL.createObjectURL(blob);

              // Save the Blob URL to local storage
              window.localStorage.setItem("pdfData", fileURL);

              //push to Editor
              router.push("/Editor");

              // Pass the Blob to the handleFileUpload function
              handleFileConversion(null, null, blob);
            } else if (fileType === "application/pdf") {
              const pageNumber = searchParam.get("pageNumber");
              // Make API call for PDF file
              handleFileConversion(`http://localhost:8000/converter/pdf2png?page_number=${pageNumber || 1}`, formData);
            } else if (fileType.startsWith("image/")) {
              // Make a different API call for other image files
              handleFileConversion("http://localhost:8000/converter/image2png", formData);
            } else {
              goToUpload("The file you uploaded is not supported.");
            }
          });
      }
    }
  }, []);

  // Function to handle file conversion
  // Url is the API endpoint to convert the file
  // formData is the file data
  // blob is the Blob of the file
  function handleFileConversion(url: string | null, formData: any, blob: Blob | null = null) {
    // If no URL is provided, we assume the file is already a PNG Blob and go straight to the Editor
    if (url === null) {
      //push to Editor
      router.push("/Editor");
      return;
    }

    // Make API call to convert the file
    axios
    .post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      responseType: "blob", // Tell axios to expect a Blob
    })
    .then((response) => {
      // Create a Blob URL from the returned file
      const fileURL = blob ? URL.createObjectURL(blob) : URL.createObjectURL(response.data);

      // Save the Blob URL to local storage
      window.localStorage.setItem("pdfData", fileURL);

      //push to Editor
      router.push("/Editor");
    })
    .catch((error) => {
      if (error.response && error.response.status === 415) {
        goToUpload("The file type you uploaded is not supported.");
      } else {
        goToUpload("An error occurred.");
      }
    });
  }

  // Function to push to UploadFile with an error message
  function goToUpload(string = "An error occurred.") {
    router.push("/?e=" + string);
  }

  return <main>{pdfData !== null ? <Conversion /> : <UploadFile />}</main>;
}
