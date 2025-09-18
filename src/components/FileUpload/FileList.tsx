import React, { useEffect, useState } from "react";
import { axiosClient } from "../../common/axios";
import { useDispatch, useSelector } from "react-redux";
import { resetFileUploaded } from "../../redux/slices/fileSlice";
import { RootState } from "../../redux/store";
import { ImageViewer } from "../ImageViewer";
import { Files, getFilesUserByUserId } from "@/generated";

export const FileList: React.FC = () => {
  const [files, setFiles] = useState<Files[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const dispatch = useDispatch();
  const userId = useSelector((state: RootState) => state.user.id);
  const isFileUploaded = useSelector((state: RootState) => state.file.isFileUploaded);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        // const response = await axiosClient.get(`/files/user/${userId}`);
        const { data: filesResponse } = await getFilesUserByUserId({
          path: {
            userId
          }
        });
        if (filesResponse && filesResponse?.success && filesResponse?.data) {
          setFiles(filesResponse.data);
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_) {
        setError("Files not found!");
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
    if (isFileUploaded) {
      fetchFiles();
      dispatch(resetFileUploaded());
    }
  }, [isFileUploaded, dispatch]);

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
