'use client';
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react';
import Editor from '../../components/component/editor';

export default function Page() {
    const router = useRouter();
    const [pdfData, setPdfData] = useState<string | null>(null);

    useEffect(() => {
        // If pdfData is not null, set the pdfData state variable to the value of the pdfData key in localStorage
        if (typeof window !== 'undefined') {
            const pdfDataFromLocalStorage = window.localStorage.getItem('pdfData');
            setPdfData(pdfDataFromLocalStorage !== null ? pdfDataFromLocalStorage : null);

            if (pdfDataFromLocalStorage) {
                const image = new Image();

                image.onerror = () => {
                    // If the image cannot be loaded, redirect to the home page
                    router.push('/');
                };

                // Set the src of the image to start loading it. 
                //If the image is not found, the onerror event will be triggered, and the user will be redirected to the home page
                image.src = pdfDataFromLocalStorage;
            } else {
                // If pdfData is null, redirect to the home page
                router.push('/');
            }
        }
    }, []);

    return (
        <main>
            {pdfData !== null && <Editor />}
        </main>
    );
}