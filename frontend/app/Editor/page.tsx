'use client';
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react';
import Editor from '../../components/component/editor';

// This will be a component in the future

export default function Page() {
    const router = useRouter();

    // Initialize pdfData state variable
    const [pdfData, setPdfData] = useState<string | null>(null);
    const pdfDataFromLocalStorage = window.localStorage.getItem('pdfData');

    useEffect(() => {
        // If pdfData is not null, set the pdfData state variable to the value of the pdfData key in localStorage
        if (typeof window !== 'undefined') {
            setPdfData(pdfDataFromLocalStorage !== null ? pdfDataFromLocalStorage : null);
        }
    }, []);
      
      

    return (
        <main>
            {pdfData !== null && <Editor />}
        </main>
    );
}


