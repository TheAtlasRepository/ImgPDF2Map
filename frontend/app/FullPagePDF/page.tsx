'use client';
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react';

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
        <div>
            {pdfData ? (
                <>
                    <p>PDF found.</p>
                    <embed src={pdfData} type="application/pdf" width="100%" height="600px" />
                </>
            ) : (
                <p>No PDF found.</p>
            )}
        </div>
    );
}