"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import PdfUploader from "@/components/Pdfuploader";
import { TextareaWithButton } from "@/components/TextareaWithButton";
import ChatBotDemo  from "@/components/ChatExchange"
import WelcomePage from "@/components/WelcomePage";

export default function Home() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [showPromptSpace, setShowPromptSpace] = useState<boolean>(false);

  // This function receives the data FROM the child component

  const handleFileChange = async (files: File[]) => {
    console.log("Enterd in handle file changes");
    if (files.length > 0) {
      setShowPromptSpace(true);
      setUploadedFile(files[0]);

      const file = files[0];
      const formData = new FormData();
      formData.append("pdf", file);

      await fetch("http://localhost:8000/upload/pdf", {
        method: "POST",
        body: formData,
      });

      console.log("Home page received file:", files[0].name);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6">

      {showPromptSpace ? <><h1 className="text-4xl font-bold mb-2">Prompt Page</h1><ChatBotDemo/></> : <WelcomePage/>}




      {!showPromptSpace && (
        <div className="flex w-xl flex-col justify-center items-center border p-2 rounded-xl shadow-sm">
          <div className="w-full max-w-xl border rounded-xl bg-card">
            <PdfUploader
              onFilesSelected={(files: any) => {
                handleFileChange(files);
              }}
            />
          </div>
        </div>
      )}

      {showPromptSpace && (
        <div className="flex w-xl flex-col justify-center items-center border p-2 rounded-xl shadow-sm">
          <TextareaWithButton />
        </div>
      )}


    </main>
  );
}
