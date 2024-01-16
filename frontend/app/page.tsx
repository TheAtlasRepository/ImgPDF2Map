'use client';
import UploadFileComp from '../components/component/upload-file';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <UploadFileComp />
    </main>
  );
}