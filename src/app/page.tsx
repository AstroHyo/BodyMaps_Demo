"use client";

import dynamic from "next/dynamic";

// Using dynamic imports to exclude the UploadCT component from SSR
const DynamicUploadCT = dynamic(() => import("@/components/UploadCT"), {
  ssr: false,
});

export default function MainPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <img src="/bodymaps-logo.svg" alt="BodyMaps Logo" className="w-32 mb-4" />
      <h1 className="text-4xl font-bold mb-8 text-center">BodyMaps Demo</h1>
      <DynamicUploadCT />
      <p className="text-sm text-gray-400 mt-4 max-w-md text-center">
        By using this online service, you agree that the data can be used to
        improve the model.
      </p>
    </div>
  );
}
