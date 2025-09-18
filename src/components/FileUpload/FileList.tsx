import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetFileUploaded } from "../../redux/slices/fileSlice";
import { RootState } from "../../redux/store";
import { ImageViewer } from "../ImageViewer";
import { Files, getFilesUserByUserId } from "@/generated";
import { toast } from "sonner";
import logger from "@/common/pino";

export const FileList: React.FC = () => {
  const [files, setFiles] = useState<Files[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const dispatch = useDispatch();
  const userId = useSelector((state: RootState) => state.user.id);
  const isFileUploaded = useSelector((state: RootState) => state.file.isFileUploaded);

  useEffect(() => {
    const fetchFiles = async () => {

      setLoading(true);
      const loadingToast = toast.loading("Uploading files...");

      try {
        const { data: filesResponse, error } = await getFilesUserByUserId({
          path: {
            userId
          }
        });
        if (!filesResponse?.success) {
          throw error;
        }

        setFiles(filesResponse?.data!);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        logger.error(error.message);
        toast.error(`Fetch files failed: ${error.message}`, { id: loadingToast });
        setError(error.message || "Files not found!");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchFiles();
    }

    if (isFileUploaded) {
      fetchFiles();
      dispatch(resetFileUploaded());
    }
  }, [userId, isFileUploaded, dispatch]);

  if (loading) {
    return <h2 className="text-xl">Loading files...</h2>;
  }
  if (error) {
    return <h2 className="text-xl">{error}</h2>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Image Gallery</h1>
      <ImageViewer images={files} />
    </div>
  );
};
