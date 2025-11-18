'use client';
import { Dropzone, DropzoneContent, DropzoneEmptyState } from '@/components/ui/shadcn-io/dropzone';
import { UploadIcon } from 'lucide-react';
import { useState } from 'react';


interface PdfUploaderProps{

  onFilesSelected:(files:File[]) => void;
}


const PdfUploader = ({ onFilesSelected }: PdfUploaderProps ) => {
  const [files, setFiles] = useState<File[] | undefined>();
  const handleDrop = (files: File[]) => {
    console.log(files);
    setFiles(files);
    onFilesSelected(files)
  };
  return (
    <Dropzone onDrop={handleDrop} onError={console.error} src={files}>
      <DropzoneEmptyState>
        <div className="flex w-full h-8 items-center gap-2 p-1">
          <div className="flex size-16 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            <UploadIcon size={24} />
          </div>
          <div className="text-left">
            <p className="font-medium text-sm p-3">Upload a file</p>
            <p className="text-muted-foreground text-xs p-3">
              Drag and drop or click to upload
            </p>
          </div>
        </div>
      </DropzoneEmptyState>
      <DropzoneContent />
    </Dropzone>
  );
};
export default PdfUploader;
