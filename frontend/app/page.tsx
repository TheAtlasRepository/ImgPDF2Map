'use client';
import UploadPipeline from '@/components/component/uploadPipeline';
import Navbar from '../components/ui/navbar';
import { Suspense } from 'react';

export default function Home() {
  return (
    <main className="flex flex-col bg-white dark:bg-gray-900">
      <Navbar
        activePage="Home"
      />
      
      <div className="items-center py-10 justify-between">
        <Suspense fallback={<div>Loading...</div>}>
          <UploadPipeline />
        </Suspense>
      </div>

      <div className="flex justify-center p-2 py-10">
        <div className="flex flex-col 2xl:flex-row md:w-5/6 lg:w-3/4 xl:w-1/2 2xl:w-1/2 justify-between">
          <div className="2xl:w-1/4 p-6 pl-0 flex items-center justify-center h-full">
            <h1 className="text-center xl:text-left text-pretty text-5xl font-bold text-primary dark:text-gray-300">
              The simplest way to geo-reference
            </h1>
          </div>
          <div className="2xl:w-3/4 p-6 card dark:bg-gray-800">
            <p className="text-lg text-secondary dark:text-gray-300">
              Discover PDF/IMG2Map, the simplest solution for seamlessly georeferencing digital images and PDF files! 
              Effortlessly upload your documents and pinpoint specific locations by selecting reference points on the image. 
              By embedding geospatial metadata, you can transform your files into geographically accurate representations, 
              perfect for urban planning, environmental analysis, or historical research. 
              <br /><br />
              Whether you're a GIS expert or new to spatial data, our intuitive platform makes georeferencing accessible to all. 
              Start exploring the possibilities with PDF/IMG2Map today!
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-center p-2 py-10">
        <div className="flex flex-col-reverse 2xl:flex-row md:w-5/6 lg:w-3/4 xl:w-1/2 2xl:w-1/2 justify-between">
          <div className="2xl:w-3/4 p-6 card dark:bg-gray-800">
            <p className="text-lg text-secondary dark:text-gray-300">
              This is a large textbox detailing a little transition to go try out the other service, Text/CSV 2 Map.
            </p>
          </div>
          <div className="2xl:w-1/4 p-6 pl-0 flex items-center justify-center h-full">
            <h1 className="text-center xl:text-left text-pretty text-5xl font-bold text-primary dark:text-gray-300 xl:ml-6">
              Need more?
            </h1>
          </div>
        </div>
      </div>

      <div className="flex justify-center p-2 py-10">
        <div className="flex flex-col 2xl:flex-row md:w-5/6 lg:w-3/4 xl:w-1/2 2xl:w-1/2 justify-between">
          <div className="2xl:w-1/4 p-6 pl-0 flex items-center justify-center h-full">
            <h1 className="text-center xl:text-left text-pretty text-5xl font-bold text-primary dark:text-gray-300">
              What a load of bologna
            </h1>
          </div>
          <div className="2xl:w-3/4 p-6 card dark:bg-gray-800">
            <p className="text-lg text-secondary dark:text-gray-300">
              Bologna, the vibrant capital of the Emilia-Romagna region in northern Italy, is a city steeped in history, 
              culture, and culinary delights. Renowned for its well-preserved medieval architecture, including the iconic Two Towers, 
              Bologna offers a charming blend of ancient streets and lively piazzas. Home to the oldest university in the Western world, 
              the University of Bologna, founded in 1088, the city boasts a rich academic atmosphere. 
              Furthermore, Bologna's gastronomic scene is second to none, with its delectable cuisine, 
              such as handmade tortellini, mortadella, and rich ragù sauce, earning it the moniker "La Grassa" (The Fat One). 
              Visitors to Bologna are treated to a sensory feast, 
              immersing themselves in its timeless charm and culinary excellence.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}