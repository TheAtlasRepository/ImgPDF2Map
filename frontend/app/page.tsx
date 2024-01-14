'use client';
import UploadFileComp from './components/uploadFile';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <UploadFileComp />
    </main>
  );
}