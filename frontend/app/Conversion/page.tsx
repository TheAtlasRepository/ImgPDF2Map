'use client';
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react';
import Conversion from '../../components/component/conversion';
import UploadFile from '../../components/component/upload-file';
import axios from 'axios';

export default function Page() {
    const router = useRouter();

    // Initialize pdfData state variable
    const [pdfData, setPdfData] = useState<string | null>(null);

    // Convert Image or PDF to PNG after component has been rendered on the client side.
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const pdfDataFromLocalStorage = window.localStorage.getItem('pdfData');

            // Check if pdfData is already in local storage
            if (pdfDataFromLocalStorage !== null) {
                // Parse the data from local storage
                const parsedData = JSON.parse(pdfDataFromLocalStorage);
                setPdfData(parsedData);

                // Fetch the Blob from the URL
                fetch(parsedData.url)
                .then(res => res.blob())
                .then(blob => {
                    const formData = new FormData();
                    formData.append('file', blob, '');

                    // Get the file type
                    const fileType = parsedData.type;

                    // This has a lot of duplication, should perhaps be refactored
                    if (fileType === 'application/pdf') {
                        // Make API call for PDF file
                        axios.post('http://localhost:8000/converter/pdf2png', formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            },
                            responseType: 'blob' // Tell axios to expect a Blob
                        }).then(response => {
                            // Create a Blob URL from the returned file
                            const fileURL = URL.createObjectURL(response.data);

                            // Save the Blob URL to local storage
                            window.localStorage.setItem('pdfData', fileURL);

                            //push to Editor
                            router.push('/Editor');
                        }).catch(error => {
                            if (error.response && error.response.status === 400) {
                                goToUpload("The file you uploaded is not supported.");
                            }
                        });
                    } else if (fileType === 'image/png') {
                        // Create a Blob URL from the fetched Blob
                        const fileURL = URL.createObjectURL(blob);

                        // Save the Blob URL to local storage
                        window.localStorage.setItem('pdfData', fileURL);

                        //push to Editor
                        router.push('/Editor');
                    } else if (fileType.startsWith('image/')) {
                        // Make a different API call for other image files
                        axios.post('http://localhost:8000/converter/image2png', formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            },
                            responseType: 'blob' // Tell axios to expect a Blob
                        }).then(response => {
                            // Create a Blob URL from the returned file
                            const fileURL = URL.createObjectURL(response.data);

                            // Save the Blob URL to local storage
                            window.localStorage.setItem('pdfData', fileURL);

                            //push to Editor
                            router.push('/Editor');
                        }).catch(error => {
                            // This is mainly added in case the user uploads a file with a header that starts with image/, 
                            // but is not supported by the backend, e.g. SVG
                            if (error.response && error.response.status === 400) {
                                goToUpload("The file you uploaded is not supported.");
                            }
                        });
                    }
                });
            }
        }
    }, []);

    // Function to push to UploadFile with an error message
    function goToUpload(string = 'An error occurred.') {
        router.push('/?e=' + string);
    }

    return (
        <main>
            {pdfData !== null ? <Conversion /> : <UploadFile />}
        </main>
    );
}