import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { cn } from "./lib/utils";
import { Loader2Icon, PackageOpenIcon, Trash2Icon } from "lucide-react";
import { Button } from "./components/Button";
import { getPresignedUrl } from "./services/getPresignedUrl";
import { uploadFile } from "./services/uploadFile";
import { Progress } from "./components/Progress";
import { toast, Toaster } from "sonner";

interface UploadProps {
  file: File;
  progress: number;
}

export function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [uploads, setUploads] = useState<UploadProps[]>([]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      setUploads((prevFiles) =>
        prevFiles.concat(acceptedFiles.map((file) => ({ file, progress: 0 })))
      );
    },
    maxSize: 2 * 1024 * 1024, // 2MB
    onDropRejected: (files) => {
      files.forEach(({ file, errors }) => {
        toast.error(
          `${file.name} cannot be uploaded because it exceeds the size limit.`
        );
        console.log(JSON.stringify(errors, null, 2));
      });
    },
  });

  function handleRemoveUpload(removingIndex: number) {
    setUploads((prevState) => {
      const newState = [...prevState];
      newState.splice(removingIndex, 1);

      return newState;
    });
  }

  async function handleUpload() {
    try {
      setIsLoading(true);
      const uploadObjects = await Promise.all(
        uploads.map(async (file) => ({
          url: await getPresignedUrl(file.file),
          file: file,
        }))
      );

      await Promise.allSettled(
        uploadObjects.map(({ url, file }, index) =>
          uploadFile(url, file.file, (progress) => {
            setUploads((prevState) => {
              const newState = [...prevState];
              const upload = newState[index];

              newState[index] = {
                ...upload,
                progress,
              };

              return newState;
            });
          })
        )
      );

      setUploads([]);
      toast.success("Uploads completed successfully!");
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex justify-center py-20 px-6">
      <Toaster />
      <div className="w-full max-w-xl">
        <div
          {...getRootProps()}
          className={cn(
            "border-2 h-60 rounded-md border-dashed transition-colors flex items-center justify-center flex-col cursor-pointer",
            isDragActive && "bg-accent/50"
          )}
        >
          <input {...getInputProps()} className="" />

          <PackageOpenIcon className="size-10  stroke-1 mb-2" />

          <span>Drop your files here</span>
          <span className="text-muted-foreground">
            Only PNG files up to 2MB
          </span>
        </div>

        {uploads.length > 0 && (
          <div className="mt-6 border border-dashed p-3 rounded-md">
            <h2 className="font-medium text-2xl tracking-tight">
              Selected files
            </h2>

            <div className="mt-4 space-y-2">
              {uploads.map(({ file, progress }, index) => (
                <div
                  className="border p-3 rounded-md gap-3 flex items-center justify-between"
                  key={file.name}
                >
                  <div className="flex flex-col gap-2 w-full">
                    <span className="text-sm">{file.name}</span>
                    <Progress className="h-2" value={progress} />
                  </div>
                  <Button
                    variant="destructive"
                    onClick={() => handleRemoveUpload(index)}
                  >
                    <Trash2Icon className="size-4" />
                  </Button>
                </div>
              ))}
              <Button
                className="mt-4 w-full"
                onClick={handleUpload}
                disabled={isLoading}
              >
                {isLoading && <Loader2Icon className="size-4 animate-spin" />}
                Upload
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
