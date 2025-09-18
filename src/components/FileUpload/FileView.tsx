import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { deleteFilesById, getFilesById, putFilesById } from "@/generated";
import logger from "@/common/pino";

const FileView: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [imageDetails, setImageDetails] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [editing, setEditing] = useState<boolean>(false);
  const [tags, setTags] = useState<string>("");
  const [name, setName] = useState<string>("");

  useEffect(() => {
    const fetchImageDetails = async () => {

      setLoading(true);
      const loadingToast = toast.loading("Fetching file details...");

      try {
        const { data: filesResponse, error } = await getFilesById({
          path: {
            id: id!
          },
        });
        if (!filesResponse?.success) {
          throw error;
        }

        const { data } = filesResponse!;
        setImageDetails(data);
        setTags(data?.tags!);
        setName(data?.name!);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        logger.error(error.message);
        toast.error(`Fetch file details failed: ${error.message}`, { id: loadingToast });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchImageDetails();
    }
  }, [id]);

  const handleUpdate = async () => {

    setLoading(true);
    const loadingToast = toast.loading("Updating file...");

    try {
      const { data: filesResponse, error } = await putFilesById({
        path: {
          id: id!
        },
        body: {
          name,
          tags,
        }
      });
      if (!filesResponse?.success) {
        throw error;
      }

      setImageDetails(filesResponse?.data);
      toast.success("Account updated successfully", { id: loadingToast });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(`Update failed: ${error.message}`, { id: loadingToast });
    } finally {
      setEditing(false);
      setLoading(false);
    }
  };

  const handleDelete = async () => {

    setLoading(true);
    const loadingToast = toast.loading("Deleting file...");

    try {
      const { data: filesResponse, error } = await deleteFilesById({
        path: {
          id: id!
        },
      });
      if (!filesResponse?.success) {
        throw error;
      }

      toast.success("File deleted successfully!", { id: loadingToast });
      navigate("/dashboard");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      logger.error(error.message);
      toast.error("Delete failed!", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  if (!imageDetails) {
    return <div className="text-center p-4">No image found.</div>;
  }

  return (
    <div className="max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Image Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <img
            src={`${import.meta.env.VITE_BACKEND_API_URL}/${imageDetails.path}`}
            alt={imageDetails.name}
            className="w-full max-w-md rounded-md border"
          />

          {editing ? (
            <div className="space-y-4">
              <Input
                disabled
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="File name"
              />
              <Textarea
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Tags (comma separated)"
              />
              <div className="flex gap-2">
                <Button type="submit" onClick={handleUpdate} disabled={loading}>
                  {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Save Changes"}
                </Button>
                <Button variant="outline" onClick={() => setEditing(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">{imageDetails.name}</h2>
              {/* <p className="text-sm text-muted-foreground">{imageDetails.views} views</p> */}
              <div className="flex flex-wrap gap-2 mt-2">
                {imageDetails.tags
                  ? imageDetails.tags.split(",").map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="text-xs bg-primary text-secondary px-2 py-1 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))
                  : null}
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="secondary" onClick={() => setEditing(true)}>
                  Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">Delete</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your image and
                        remove your data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete}>
                        {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Delete"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FileView;