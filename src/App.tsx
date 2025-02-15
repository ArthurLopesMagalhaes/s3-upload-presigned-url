import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { cn } from "./lib/utils";
import { PackageOpenIcon, Trash2Icon } from "lucide-react";
import { Button } from "./components/Button";

export function App() {
  const [files, setFiles] = useState<File[]>([]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      setFiles((prevFiles) => prevFiles.concat(acceptedFiles));
    },
  });

  function handleRemoveFile(removingIndex: number) {
    setFiles((prevState) => {
      const newState = [...prevState];
      newState.splice(removingIndex, 1);

      return newState;
    });
  }

  return (
    <div className="min-h-screen flex justify-center py-20 px-6">
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

        {files.length > 0 && (
          <div className="mt-6">
            <h2 className="font-medium text-2xl tracking-tight">
              Selected files
            </h2>

            <div className="mt-4 space-y-2">
              {files.map((file, index) => (
                <div
                  className="border p-3 rounded-md flex items-center justify-between"
                  key={file.name}
                >
                  <span className="text-sm">{file.name}</span>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleRemoveFile(index)}
                  >
                    <Trash2Icon className="size-4" />
                  </Button>
                </div>
              ))}
              <Button className="mt-4 w-full">Upload</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
