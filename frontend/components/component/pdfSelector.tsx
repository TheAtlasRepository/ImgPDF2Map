import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import "react-pdf/dist/esm/Page/TextLayer.css";

type PdfSelectProps = {
    fileUrl: string | null;
    onPageSelected: (pageNumber: number) => void;
    clearStateRequest: () => void;
};

const PdfSelect: React.FC<PdfSelectProps> = ({ fileUrl, onPageSelected, clearStateRequest }) => {
  const [numPages, setNumPages] = useState(0);
  const [selectedPage, setSelectedPage] = useState(1);
  const [file, setFile] = useState<string | null>(fileUrl);
  const router = useRouter();

  // pdfworker needed for pdf.js
  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
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
    clearStateRequest();
    router.push(`/?e=Error loading PDF: ${error.message}`);
  };

  // handle page selection
  const handlePageSelection = (pageNumber: number) => {
    setSelectedPage(pageNumber);
    // perform logic for the selected page
    selectPageForConversion(pageNumber);
    console.log(`page ${pageNumber} selected for georeferecing`);
  };

  // sends page number back to parent component
  async function selectPageForConversion(pageNumber: number) {
    onPageSelected(pageNumber); // Inform the parent component about the page selection
  }

  return (
    <div className="flex flex-row justify-center">
      <div className="flex flex-col w-1/2 border shadow-lg card">
        <div className=" top-0 left-0 right-0 z-50 flex items-center justify-center p-4 bg-gray-800 shadow-md rounded-t-lg">
          <div className="items-center text-white">
            <p>Please select which page you would like to use from your PDF (max one page)</p>
          </div>
        </div>
        <div>
          <div className="flex justify-center">
            
          </div>
          <div>
            <div className="flex justify-center mb-2 mt-3">
              <Button
                className="py-1 px-5 bg-blue-600 text-white mx-2 hover:bg-blue-700 w-28"
                type="button"
                disabled={selectedPage <= 1}
                onClick={previousPage}
              >
                Previous
              </Button>
              <Button
                className="py-1 px-5 bg-green-600 text-white mx-2 hover:bg-green-700 w-28"
                type="button"
                onClick={() => handlePageSelection(selectedPage)}
              >
                Select Page
              </Button>
              <Button
                className="py-1 px-5 bg-blue-600 text-white mx-2 hover:bg-blue-700 w-28"
                type="button"
                disabled={selectedPage >= numPages}
                onClick={nextPage}
              >
                Next
              </Button>
            </div>
            <p className="flex justify-center text-secondary">
              Page {selectedPage || (numPages ? 1 : "--")} of {numPages || "--"}
            </p>
            <div className="flex items-center justify-center">
              <Document
                file={file}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={handlePdfError}
                className="border m-2"
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
    </div>
  );
};

export default PdfSelect;
