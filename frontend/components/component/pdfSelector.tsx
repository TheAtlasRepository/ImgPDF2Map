
import { useRouter } from 'next/navigation';

export default function PdfSelect({ src }: { src: string }) {
    const router = useRouter();

    //check if source is empty
    if (src == null) {
        //redirect to main page
        router.push('/');
    }
    //check if source is pdf
    else if (src.includes('.pdf')) {
        //redirect to pdf page
        router.push('/');
    }

    return (

        <div className=''>
            <h1>PDF Selector</h1>
            <p>Select which page you want to use from your PDF</p>

        </div>
    );
}