import React, { useState } from 'react';
import UploadFile from '@/components/component/upload-file';
import PdfSelect from '@/components/component/pdfSelector';
import Conversion from '@/components/component/conversion';

function UploadPipeline() {
    const [dataUrl, setDataUrl] = useState<string | null>(null);
    const [fileType, setFileType] = useState<string | null>(null);
    const [selectedPage, setSelectedPage] = useState<number | null>(null);

    // Clear the states, this will hide the components and show the upload file component
    const clearStates = () => {
        setDataUrl(null);
        setFileType(null);
        setSelectedPage(null);
    }

    // On file upload, set the dataUrl and fileType
    const handleFileUpload = (uploadedDataUrl: string, uploadedFileType: string) => {
        setDataUrl(uploadedDataUrl);
        setFileType(uploadedFileType);
    };

    // On page selected, set the selectedPage
    const handlePageSelected = (pageNumber: number) => {
        setSelectedPage(pageNumber);
    };

    return (
        <div>
            {
                // If there is no fileType, show the upload file component
                !fileType &&
                <UploadFile 
                    onFileUpload={handleFileUpload} 
                    clearStateRequest={clearStates}
                />
            }
            {
                // If there is a fileType and it is a PDF, show the PDF selector component
                !selectedPage && fileType === 'application/pdf' && 
                <PdfSelect 
                    fileUrl={dataUrl} 
                    onPageSelected={handlePageSelected} 
                    clearStateRequest={clearStates}
                />
            }
            {
                // If there is a fileType and it is an image or there is a selected page, show the conversion component
                fileType && ((fileType.startsWith('image/') || selectedPage) && 
                <Conversion 
                    fileUrl={dataUrl} 
                    fileType={fileType} 
                    pageNumber={selectedPage} 
                    clearStateRequest={clearStates}
                />)
            }
        </div>
    );
}

export default UploadPipeline;