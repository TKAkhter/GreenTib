import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Upload } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setFileUploaded } from "@/redux/slices/fileSlice";
import { postFileUpload } from "@/generated";
import { RootState } from "@/redux/store";
import logger from "@/common/pino";
import clsx from "clsx";

export const FileUpload: React.FC = () => {
  const userId = useSelector((state: RootState) => state.user.id);
  const authToken = useSelector((state: RootState) => state.auth.token);
  const [tags, setTags] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    },
    onDrop: (acceptedFiles: File[]) => {
      setUploadedFiles(acceptedFiles);
    },
  });

  const handleTagChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTags(event.target.value.split(","));
  };

  const handleUpload = async () => {
    if (uploadedFiles.length === 0) {
      return toast.error("No files selected!");
    }

    setLoading(true);
    const loadingToast = toast.loading("Uploading files...");

    try {
      for (const file of uploadedFiles) {
        // eslint-disable-next-line  no-await-in-loop
        const { error } = await postFileUpload({
          body: {
            userId,
            name: file.name,
            file,
            tags: tags.join(","),
          },
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        if (error) {
          throw new Error((error as { message?: string }).message || "An unknown error occurred");
        }
      }

      toast.success("Files uploaded successfully!", { id: loadingToast });
      dispatch(setFileUploaded());
      setUploadedFiles([]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      logger.error(error.message);
      toast.error(`Upload failed: ${error.message}`, { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <CardHeader>
        <CardTitle>File Upload</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={clsx(
            "border-2 border-dashed rounded-lg transition-all duration-200 ease-in-out p-10 cursor-pointer text-center",
            isDragActive ? "border-primary bg-muted" : "border-muted hover:border-primary/80",
          )}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center space-y-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted">
              <Upload className="text-primary" />
            </div>
            <p className="text-sm">
              <span className="text-primary font-medium">Click to upload</span> or drag & drop
            </p>
            <p className="text-xs text-muted-foreground">JPEG, PNG, JPG, GIF (Max: 10MB)</p>
          </div>
        </div>

        {/* Selected Files */}
        {uploadedFiles.length > 0 && (
          <div className="mt-4 space-y-2">
            <h4 className="text-base font-medium">Selected Files:</h4>
            {uploadedFiles.map((file, index) => (
              <div key={index} className="text-sm text-muted-foreground">
                {file.name}
              </div>
            ))}
          </div>
        )}

        {/* Tags + Upload */}
        <div className="flex w-full max-w-sm items-center space-x-2 mt-4">
          <Input type="text" placeholder="Tags (comma separated)" onChange={handleTagChange} />
          <Button onClick={handleUpload} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2 h-5 w-5" />
                Uploading
              </>
            ) : (
              "Upload Files"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
