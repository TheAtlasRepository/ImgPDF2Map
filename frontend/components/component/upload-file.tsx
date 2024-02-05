import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function UploadFile() {

	const [errorMessage, setErrorMessage] = useState<string | null>(null); // Add state for error message
	const router = useRouter()
	const [fileType, setFileType] = useState('');
	const [fileName, setFileName] = useState('');
	const params = useSearchParams();


	useEffect(() => {
		if (params.get("e")) {
			setErrorMessage(params.get("e") as string);
		}
	});

	// Handle file input change when user has used "Open a file"-button
	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			checkFileType(file);
		}
	};

	// Handle drag over
	const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
	};

	// Handle file drop
	const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		const file = event.dataTransfer.files?.[0];
		if (file) {
			checkFileType(file);
		}
	};

	// Check if file type is supported
	const checkFileType = (file: File) => {
		if (file && (file.type === 'application/pdf' || file.type.startsWith('image/'))) {
			setErrorMessage(null); // Clear any existing error message
			setFileType(file.type);
			setFileName(file.name);

			// Read and save file to local storage
			const reader = new FileReader();
			reader.onload = () => {
				const blob = new Blob([reader.result as string], { type: file.type });
				localStorage.setItem('pdfData', JSON.stringify({
					url: URL.createObjectURL(blob),
					type: blob.type
				}));
			};
			reader.readAsArrayBuffer(file);

			// Delete previous PDF if it exists
			if (localStorage.getItem('pdfData')) {
				URL.revokeObjectURL(localStorage.getItem('pdfData')!);
				localStorage.removeItem('pdfData');
			}

			//Push to Conversion, where the file will be converted to PNG
			router.push('/Conversion');
			
		} else {
			setErrorMessage('File type not supported.');
		}
	}

	return (
		<div className="mx-auto mt-10 max-w-xl">
			<div onClick={() => document.querySelector('input')?.click()} className="cursor-pointer">
				<div className="rounded-lg border-4 border-dashed border-blue-200 p-10 py-20 text-center" onDragOver={handleDragOver} onDrop={handleDrop}>
					<FolderPlusIcon className="mx-auto mb-6 text-blue-500 text-8xl" />
					<div className="text-lg font-medium text-gray-400">Open, or drop your <b>image or PDF</b> here</div>
					{fileName && <div className="text-lg font-medium text-gray-400 mt-4">{fileName}</div>}
				</div>

				<input type="file" accept=".pdf, image/*" onChange={handleFileChange} className="hidden" />
				<Button className="mt-6 w-full bg-blue-600 text-white text-xl" variant="blue">Open a file</Button>
			</div>
			

			{errorMessage &&
				<Alert variant="destructive" className="mt-5">
					<AlertTitle>Error</AlertTitle>
					<AlertDescription>
						{errorMessage}
					</AlertDescription>
				</Alert>
			}
		</div>
	)
}

function FolderPlusIcon(props: any) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M4 20h16a2 2 0 2-2V8a2 0-2-2h-7.93a2 1-1.66-.9l-.82-1.2A2 7.93 3H4a2 0-2 2v13c0 1.1.9 2Z" />
			<line x1="12" x2="12" y1="10" y2="16" />
			<line x1="9" x2="15" y1="13" y2="13" />
		</svg>
	)
}
