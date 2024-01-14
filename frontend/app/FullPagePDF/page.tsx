'use client';
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react';

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
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
            {pdfData ? (
                <embed src={pdfData} type="application/pdf" width="100%" height="100%" />
            ) : (
                <p>No PDF found.</p>
            )}
        </div>
    );
}