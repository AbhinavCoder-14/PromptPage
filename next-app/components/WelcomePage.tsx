// ...existing code...
import { Button } from "@/components/ui/button";

export default function WelcomePage() {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-card border rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 shadow-sm">
        {/* Left: Text content */}
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-2">
            Welcome to Prompt Page
          </h2>

          <p className="text-sm text-muted-foreground mb-4 max-w-2xl">
            Upload a PDF and ask natural-language questions about its content.
            The app indexes your document locally, then generates precise answers
            pulled directly from the PDF — fast and private.
          </p>

          <ul className="text-sm list-disc list-inside text-left max-w-md mx-auto md:mx-0 mb-4 space-y-1">
            <li>Best for text-based PDFs (scanned docs may need OCR).</li>
            <li>Keep files under 20MB for faster processing and indexing.</li>
            <li>Files are uploaded to your local server at /upload/pdf only.</li>
          </ul>

          <div className="flex items-center justify-center md:justify-start gap-2">
            <Button
              onClick={() => {
                // smooth-scroll to uploader if present on page
                const el = document.querySelector("#pdf-uploader");
                if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
              }}
            >
              Upload PDF
            </Button>

            <Button
              variant="ghost"
              onClick={() => {
                // reveal short tip modal or scroll to prompt area
                const el = document.querySelector("#prompt-area");
                if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
              }}
            >
              Quick tips
            </Button>
          </div>
        </div>

        {/* Right: Visual / How it works */}
        <div className="w-full md:w-56 flex-none rounded-lg border p-4 bg-gradient-to-b from-muted/40 to-transparent">
          <div className="flex flex-col items-start gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-md bg-primary/10 text-primary">
              {/* simple pdf icon */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 2v6h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            <h3 className="text-sm font-medium">How it works</h3>

            <ol className="text-xs text-muted-foreground list-decimal list-inside ml-4 space-y-1">
              <li>Upload a PDF — it gets indexed locally.</li>
              <li>Ask a question in the prompt area that appears.</li>
              <li>Answers are generated using content from your PDF.</li>
            </ol>
          </div>
        </div>
      </div>

      <p className="mt-4 text-xs text-muted-foreground text-center">
        Tip: after uploading, the prompt box will replace the uploader. Use clear,
        specific questions for best results.
      </p>
    </div>
  );
}
// ...existing code...