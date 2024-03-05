import React from "react";

const svgParams = {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    width: "1.5rem",
    height: "1.5rem",
    viewBox: "0 0 24 24",
    strokeWidth: 1.5,
    stroke: "currentColor",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    class: 'inline-flex',
}

// Manipulation
const UploadIcon = (props: any) => {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 20 16"
            aria-hidden="true" fill="none" strokeWidth="2"
            strokeLinejoin="round" strokeLinecap="round" stroke="currentColor" >
            <path d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
        </svg>
    )
}

const UploadIconFolder = (props: any) => {
    return (
        <svg 
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="100"
        height="130"
        fill="currentColor"
        stroke="none"
        >
            <title>file-upload</title>
            <path d="M64.64,13,86.77,36.21H64.64V13ZM42.58,71.67a3.25,3.25,0,0,1-4.92-4.25l9.42-10.91a3.26,3.26,0,0,1,4.59-.33,5.14,5.14,0,0,1,.4.41l9.3,10.28a3.24,3.24,0,0,1-4.81,4.35L52.8,67.07V82.52a3.26,3.26,0,1,1-6.52,0V67.38l-3.7,4.29ZM24.22,85.42a3.26,3.26,0,1,1,6.52,0v7.46H68.36V85.42a3.26,3.26,0,1,1,6.51,0V96.14a3.26,3.26,0,0,1-3.26,3.26H27.48a3.26,3.26,0,0,1-3.26-3.26V85.42ZM99.08,39.19c.15-.57-1.18-2.07-2.68-3.56L63.8,1.36A3.63,3.63,0,0,0,61,0H6.62A6.62,6.62,0,0,0,0,6.62V116.26a6.62,6.62,0,0,0,6.62,6.62H92.46a6.62,6.62,0,0,0,6.62-6.62V39.19Zm-7.4,4.42v71.87H7.4V7.37H57.25V39.9A3.71,3.71,0,0,0,61,43.61Z"/>
        </svg>
    )
}

const DownloadIcon = (props: any) => {
    return (
        <svg
            {...props} {...svgParams}>
            <path d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
        </svg>
    )
}

const TrashHeroIcon = (props: any) => {
    return (
        <svg
        {...props} {...svgParams}>
            <path d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
        </svg>
    )
}

const CloseIcon = (props: any) => {
    return (
        <svg {...props} {...svgParams} >
            <path d="M6 18 18 6M6 6l12 12" />
        </svg>
    )
}
// Navigation
const OpenBook = (props: any) => {
    return (
        <svg 
            {...props} {...svgParams}
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            >
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v13m0-13c-2.8-.8-4.7-1-8-1a1 1 0 0 0-1 1v11c0 .6.5 1 1 1 3.2 0 5 .2 8 1m0-13c2.8-.8 4.7-1 8-1 .6 0 1 .5 1 1v11c0 .6-.5 1-1 1-3.2 0-5 .2-8 1"/>
        </svg>
    )
}

const TargetIcon = (props: any) => {
    return (
        <svg
            {...props} {...svgParams}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            >
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="6" />
            <circle cx="12" cy="12" r="2" />
        </svg>
    )
}

const SelectionIcon = (props: any) => {
    return (
        <svg 
            {...props}
            className="w-6 h-6" 
            aria-hidden="true" 
            fill="currentColor" 
            viewBox="0 0 24 24">
            <path d="M5 3a2 2 0 0 0-2 2v2c0 1.1.9 2 2 2h2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5Zm0 12a2 2 0 0 0-2 2v2c0 1.1.9 2 2 2h2a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2H5Zm12 0a2 2 0 0 0-2 2v2c0 1.1.9 2 2 2h2a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-2Zm0-12a2 2 0 0 0-2 2v2c0 1.1.9 2 2 2h2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2Z"/>
            <path fill-rule="evenodd" d="M10 6.5c0-.6.4-1 1-1h2a1 1 0 1 1 0 2h-2a1 1 0 0 1-1-1ZM10 18c0-.6.4-1 1-1h2a1 1 0 1 1 0 2h-2a1 1 0 0 1-1-1Zm-4-4a1 1 0 0 1-1-1v-2a1 1 0 1 1 2 0v2c0 .6-.4 1-1 1Zm12 0a1 1 0 0 1-1-1v-2a1 1 0 1 1 2 0v2c0 .6-.4 1-1 1Z" clip-rule="evenodd"/>
        </svg>
    )
}

const WindowsIcon = (props: any) => {
    return (
        <svg
            {...props} 
            className="w-6 h-6 text-gray-800 dark:text-white" 
            >
            <path fill-rule="evenodd" d="M8 5c0-.6.4-1 1-1h11a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-1a1 1 0 1 1 0-2h1V6H9a1 1 0 0 1-1-1Z" clip-rule="evenodd"/>
            <path fill-rule="evenodd" d="M4 7a2 2 0 0 0-2 2v9c0 1.1.9 2 2 2h11a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2H4Zm0 11v-5.5h11V18H4Z" clip-rule="evenodd"/>
        </svg>
    )
}

const ChevronArrowIcon = (props: any) => {
    if (props.left) {
        return (
            <svg {...props} {...svgParams} >
                <path d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
        )
    } else {
        return (
            <svg {...props} {...svgParams} >
                <path d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
        )
    }
}

const FatArrowIcon = (props: any) => {
    return (
        <svg {...props} {...svgParams} >
            <path d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
    )
}

const ArrowLongIcon = (props: any) => {
    return (
        <svg {...props} {...svgParams} >
            <path d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
        </svg>

    )
}

// Information
const TextDocumentIcon = (props: any) => {
    return (
        <svg {...props} {...svgParams} >
            <path d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
        </svg>
    )
}
const DoubleBubbleIcon = (props: any) => {
    return (
        <svg {...props} {...svgParams} >
            <path d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
        </svg>
    )
}

export { UploadIcon, UploadIconFolder, DownloadIcon, TextDocumentIcon, DoubleBubbleIcon, OpenBook, TargetIcon, SelectionIcon, WindowsIcon, ChevronArrowIcon, FatArrowIcon, ArrowLongIcon, TrashHeroIcon, CloseIcon }