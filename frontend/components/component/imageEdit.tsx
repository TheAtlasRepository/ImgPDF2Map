import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { useState } from 'react';

export default function ImageEdit({ src , editBool }: { src: string, editBool: boolean }) {
    const [crop, setCrop] = useState<Crop>(); 
    return (
        <>
            {editBool ? (
                <ReactCrop
                    crop={crop}
                    onChange={(newCrop) => setCrop(newCrop)}
                >
                    <img src={src} alt="Image" />
                </ReactCrop>
            ) : (
                <img src={src} alt="Image" />
            )}
        </>
    );
}

