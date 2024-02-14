'use client';
import UploadFileComp from '../components/component/upload-file';
import Logo from '../components/component/logo';

export default function Home() {
  return (
    <main className="flex h-screen flex-col bg-white">
      <div className="flex items-center justify-between p-4 bg-gray-800 shadow-md">
        <div className="flex flex-row space-x-20">
          <p className="">Ligma</p>
          <p>Balls</p>
        </div>
      </div>

      <div className="text-center flex-grow">
        <div className="flex items-center justify-center">
          <div className="grid space-y-1 text-center">
            <span className="text-4xl font-bold leading-none text-black">IMG</span>
            <span className="text-4xl font-bold leading-none text-black">PDF</span>
          </div>
          <div className="grid space-y-1 text-center">
            <span className="text-8xl font-bold leading-none text-black">2 MAP</span>
          </div>
        </div>
        <Logo />
      </div>
      
      <div className="items-center p-24 justify-between">
        <UploadFileComp />
      </div>

      <div className="flex justify-center p-7 bg-gray-500">
        <div className="flex flex-row space-x-20">
          <p>About</p>
          <p>Your Data</p>
          <p>Text & CSV To Map</p>
        </div>
      </div>
    </main>
  );
}