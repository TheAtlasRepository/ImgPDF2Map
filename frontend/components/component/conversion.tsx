import { RotateLoader } from 'react-spinners';

export default function Conversion() {
    return (
        <div className="flex flex-col h-screen bg-white">
            <div className="mx-auto mt-10 max-w-xl">
                <div className="rounded-lg border-4 border-dashed border-blue-200 p-10 py-20 text-center">
                    <div className="p-10 text-center text-gray-400">
                        <h1>Getting your file ready</h1>
                    </div>
                    <RotateLoader color="#9CA3AF"/>
                </div>
            </div>
        </div>
    );
}