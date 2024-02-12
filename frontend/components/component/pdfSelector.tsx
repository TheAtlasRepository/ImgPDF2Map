import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useRouter } from "next/navigation";
import "react-pdf/dist/esm/Page/TextLayer.css";

export default function PdfSelect() {
  const [numPages, setNumPages] = useState(0);
  const [selectedPage, setSelectedPage] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();

  // pdfworker needed for pdf.js
  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
  }, []);

  useEffect(() => {
    const pdfData = JSON.parse(localStorage.getItem("pdfData") ?? "");
    if (pdfData && pdfData.url) {
      setFile(pdfData.url);
    }
  }, []);

  // handle PDF loading
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setSelectedPage(1);
    if (numPages === 1) {
      selectPageForConversion(1);
    }
  };

  function changePage(offset: number) {
    setSelectedPage((prevPageNumber) => prevPageNumber + offset);
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }

  // handle PDF loading error
  const handlePdfError = (error: any) => {
    console.error("Error loading PDF:", error);
    //log error message
    console.error(error.message);
    router.push(`/?e=Error loading PDF: ${error.message}`);
  };

  // handle page selection
  const handlePageSelection = (pageNumber: number) => {
    setSelectedPage(pageNumber);
    // perform logic for the selected page
    selectPageForConversion(pageNumber);
    console.log(`page ${pageNumber} selected for georeferecing`);
  };

  // sends page number to conversion page
  async function selectPageForConversion(pageNumber: number) {
    router.push(`/Conversion?pageNumber=${pageNumber}`);
  }

  return (
    <div className="flex flex-col">
      <div className=" top-0 left-0 right-0 z-50 flex items-center justify-center p-4 bg-gray-800 shadow-md">
        <div className="items-center text-white">
          <h1>PDF Selector</h1>
          <p>Select which page you want to use from your PDF (max one page)</p>
        </div>
      </div>
      <div>
        <div className="flex justify-center">
          <button
            className="mt-4 w-full bg-blue-600 text-white mx-2"
            type="button"
            onClick={() => handlePageSelection(selectedPage)}
          >
            Select Page
          </button>
        </div>
        <div>
          <p className="flex justify-center">
            Page {selectedPage || (numPages ? 1 : "--")} of {numPages || "--"}
          </p>
          <div className="flex justify-center mb-2">
            <button
              className="mt-4 w-full bg-blue-600 text-white mx-2"
              type="button"
              disabled={selectedPage <= 1}
              onClick={previousPage}
            >
              Previous
            </button>
            <button
              className="mt-4 w-full bg-blue-600 text-white mx-2"
              type="button"
              disabled={selectedPage >= numPages}
              onClick={nextPage}
            >
              Next
            </button>
          </div>
          <div className="flex items-center justify-center">
            <Document
              file={file}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={handlePdfError}
            >
              <Page
                renderAnnotationLayer={false}
                //renderTextLayer={false}
                pageNumber={selectedPage}
              />
            </Document>
          </div>
        </div>
      </div>
    </div>
  );
}
