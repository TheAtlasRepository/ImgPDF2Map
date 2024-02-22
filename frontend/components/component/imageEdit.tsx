import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import axios from 'axios';

export default function ImageEdit({ editBool, onCrop }: { editBool: boolean, onCrop: () => void }) {
    const [crop, setCrop] = useState<Crop>(); 
    const [imageSrc, setImageSrc] = useState(localStorage.getItem("pdfData")!); // Keeps track of image URL

    // When the user requests to apply the crop
    const handleApplyCrop = async () => {
        // Make sure that there is crop data, return if not
        if (!crop) {
            console.log("No crop data!");
            return;
        }

        // Set the coordinates for the top-left corner, and calculate the coordinates of the bottom-right corner
        // (Values need to be rounded to the nearest whole number to avoid issues with the API.)
        const p1x = Math.round(crop.x);
        const p1y = Math.round(crop.y)
        const p2x = Math.round(crop.x + crop.width);
        const p2y = Math.round(crop.y + crop.height);

        // Fetch the Blob from the blob URL
        const response = await fetch(imageSrc);
        const blob = await response.blob();

        // Create a FormData and add the blob file
        const formData = new FormData();
        formData.append('file', blob, 'filename');

        //Try to send a request to the API
        try {
            // Send a POST request to the API with the coordinates and file
            const response = await axios.post(`http://localhost:8000/converter/cropPng?p1x=${p1x}&p1y=${p1y}&p2x=${p2x}&p2y=${p2y}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                responseType: 'blob' // Tell axios to expect a Blob in the response
            });

            // Convert the response data to a Blob
            const newBlob = new Blob([response.data], { type: 'image/png' });

            // Convert the new Blob to a Blob URL
            const blobUrl = URL.createObjectURL(newBlob);

            // Update the source URL of the image
            window.localStorage.setItem("pdfData", blobUrl);
            
            // Tell the current component and parent component that the image has been cropped
            setImageSrc(localStorage.getItem("pdfData")!);
            onCrop();

            // Reset the crop state, use max width and height
            setCrop({
                unit: '%',
                x: 0,
                y: 0,
                width: 100,
                height: 100,
            });
        } catch (error) {
            // Log any errors
            console.error('Error:', error);
        }

        
    };

    // When the user requests to cancel the crop
    const handleCancelCrop = () => {
        // Todo: Cancel the crop
    };

    return (
        <>
            {editBool ? (
                <div className="flex flex-col justify-items-center">
                    <div>
                        <ReactCrop
                            crop={crop}
                            onChange={(newCrop) => setCrop(newCrop)}
                        >
                            <img src={imageSrc} alt="Image" />
                        </ReactCrop>
                    </div>
                    <div className="">
                        <Button
                            className="btn bg-red-600"
                            onClick={handleCancelCrop}
                        >
                            Cancel Crop
                        </Button>
                        <Button
                            className="btn bg-green-600"
                            onClick={handleApplyCrop}
                        >
                            Apply Crop
                        </Button>
                    </div>
                </div>
            ) : (
                <img src={imageSrc} alt="Image" />
            )}
        </>
    );
}