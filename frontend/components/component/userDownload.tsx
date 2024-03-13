import React from "react";
import { Button } from "@/components/ui/button";

interface UserDownloadProps {
    projectId: number;
}

const UserDownload = ({ projectId }: UserDownloadProps) => {


    const handleDownload = () => {

        const link = document.createElement("a");
        link.href = localStorage.getItem("tiffUrl")!;
        link.download = "georeferenced.tiff";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (
        <div>
            <Button
                className="bg-gray-200 dark:bg-gray-700 dark:hover:bg-blue-800 dark:text-white"
                variant="default"
                size="default"
                asChild={false}
                onClick={handleDownload}
                >
                Download
            </Button>
        </div>
    );
}
export default UserDownload;