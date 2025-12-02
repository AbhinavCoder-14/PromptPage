import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

export default function WelcomePage() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-start gap-8 shadow-2xl backdrop-blur-sm">
        {/* Left: Text content */}
        <div className="flex-1">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-white">
            Welcome to Prompt Page
          </h2>

          <p className="text-base text-neutral-400 mb-6 leading-relaxed">
            Upload a PDF and ask natural-language questions about its content.
            The app indexes your document locally, then generates precise answers
            pulled directly from the PDF — fast and private.
          </p>

          <ul className="text-sm text-neutral-400 space-y-3 mb-6">
            <li className="flex items-start gap-2">
              <span className="text-neutral-600 mt-1">•</span>
              <span>Best for text-based PDFs (scanned docs may need OCR).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-neutral-600 mt-1">•</span>
              <span>Keep files under 20MB for faster processing and indexing.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-neutral-600 mt-1">•</span>
              <span>Files are uploaded to your local server at /upload/pdf only.</span>
            </li>
          </ul>

          <div className="flex items-center gap-3">
            <Button
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-2 rounded-lg transition-colors"
              onClick={() => {
                const el = document.querySelector("#pdf-uploader");
                if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
              }}
            >
              Upload PDF
            </Button>

            <Button
              variant="ghost"
              className="text-neutral-400 hover:text-white hover:bg-neutral-800 font-medium px-6 py-2 rounded-lg transition-colors"
              onClick={() => {
                const el = document.querySelector("#prompt-area");
                if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
              }}
            >
              Quick tips
            </Button>
          </div>
        </div>

        {/* Right: How it works card */}
        <div className="w-full md:w-64 flex-none rounded-xl border border-neutral-800 p-6 bg-neutral-900/80 backdrop-blur-sm">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-purple-600/10 text-purple-500">
              <FileText size={28} strokeWidth={1.5} />
            </div>

            <h3 className="text-base font-semibold text-white">
              How it works
            </h3>

            <ol className="text-sm text-neutral-400 space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-neutral-600 font-medium">1.</span>
                <span>Upload a PDF — it gets indexed locally.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-neutral-600 font-medium">2.</span>
                <span>Ask a question in the prompt area that appears.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-neutral-600 font-medium">3.</span>
                <span>Answers are generated using content from your PDF.</span>
              </li>
            </ol>
          </div>
        </div>
      </div>

      <p className="mt-6 text-sm text-neutral-500 text-center max-w-2xl mx-auto">
        Tip: after uploading, the prompt box will replace the uploader. Use clear,
        specific questions for best results.
      </p>
    </div>
  );
}