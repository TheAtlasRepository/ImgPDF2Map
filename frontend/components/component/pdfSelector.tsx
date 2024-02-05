import { useState } from "react";
import ReactDOM from "react-dom";
import { PDFViewer } from "@react-pdf/renderer";
import { Document, Page, pdfjs } from "react-pdf";
import { useRouter } from "next/navigation";

export default function PdfSelect({ src }: { src: string }) {
  const [numPages, setNumPages] = useState(0);
  const [selectedPage, setSelectedPage] = useState(1);
  const router = useRouter();

  // // check if source is empty or not a PDF
  // if (!src || !src.includes(".pdf")) {
  //   // redirect to main page
  //   router.push("/");
  // }

  // handle PDF loading
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  // handle page selection
  const handlePageSelection = (pageNumber: number) => {
    setSelectedPage(pageNumber);
    // perform logic for the selected page
    console.log(`page ${pageNumber} selected for georeferecing`);
  };

  // handle PDF loading error
  const handlePdfError = (error: any) => {
    console.error("Error loading PDF:", error);
    // redirect to main page or display an error message
    router.push("/");
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-center p-4 bg-gray-800 shadow-md">
        <div className="items-center text-white">
          <h1>PDF Selector</h1>
          <p>Select which page you want to use from your PDF (max one page)</p>
        </div>
      </div>
      <div>
        {src && (
          <Document file={src} onLoadSuccess={onDocumentLoadSuccess}>
            {numPages}
          </Document>
        )}
      </div>
      <div className="">
        {Array.from(new Array(numPages), (_, index) => index + 1).map(
          (pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => handlePageSelection(pageNumber)}
              disabled={pageNumber === selectedPage}
            >
              Page {pageNumber}
            </button>
          )
        )}
      </div>
    </div>
  );
}
