'use client';
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react';
import Editor from '../../components/component/editor';
import UploadFile from '../../components/component/upload-file';

// This will be a component in the future

export default function Page() {
    const router = useRouter();

    // Initialize pdfData state variable
    const [pdfData, setPdfData] = useState<string | null>(null);

    // Update pdfData after component has been rendered on the client side
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const pdfDataFromLocalStorage = window.localStorage.getItem('pdfData');
            setPdfData(pdfDataFromLocalStorage !== null ? pdfDataFromLocalStorage : null);
        }
    }, []);

    return (
        <main>
            {pdfData !== null ? <Editor /> : <UploadFile />}
        </main>
    );
}