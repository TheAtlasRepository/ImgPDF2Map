import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function UploadFile() {

	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const router = useRouter()
	const [fileType, setFileType] = useState('');
	const [fileName, setFileName] = useState('');

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			checkFileType(file);
		}
	};


	const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
	};

	const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		const file = event.dataTransfer.files?.[0];
		if (file) {
			checkFileType(file);
		}
	};

	const checkFileType = (file: File) => {
		if (file && (file.type === 'application/pdf' || file.type.startsWith('image/'))) {
			setErrorMessage(null); // Clear any existing error message
			setFileType(file.type);
			setFileName(file.name);
			const reader = new FileReader();
			reader.onload = () => {
				const blob = new Blob([reader.result as string], { type: file.type });
				localStorage.setItem('pdfData', URL.createObjectURL(blob));
			};
			reader.readAsArrayBuffer(file);

			// Delete previous PDF if it exists
			if (localStorage.getItem('pdfData')) {
				URL.revokeObjectURL(localStorage.getItem('pdfData')!);
				localStorage.removeItem('pdfData');
			}

			//push to Editor
			router.push('/Editor');
		} else {
			setErrorMessage('File type not supported.');
		}
	}

	return (
		<div className="mx-auto mt-10 max-w-xl">
			<div className="rounded-lg border-4 border-dashed border-blue-200 p-12 text-center" onDragOver={handleDragOver} onDrop={handleDrop}>
				<FolderPlusIcon className="mx-auto mb-6 text-blue-500 text-8xl" />
				<div className="text-lg font-medium text-gray-400">Drop your image or pdf here</div>
				{fileName && <div className="text-lg font-medium text-gray-400 mt-4">{fileName}</div>}
			</div>
			<input type="file" accept=".pdf, image/*" onChange={handleFileChange} className="hidden" />
			<Button onClick={() => document.querySelector('input')?.click()} className="mt-6 w-full bg-blue-600 text-white text-xl" variant="blue">Open a file</Button>

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

function checkFileType(file: File) {

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
