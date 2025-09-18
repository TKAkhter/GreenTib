import React from "react";
import { useNavigate } from "react-router-dom"; // Change to Next.js `useRouter` if needed
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { Files } from "@/generated";

interface ImageViewerProps {
  images: Files[];
}

export const ImageViewer: React.FC<ImageViewerProps> = ({ images }) => {
  const navigate = useNavigate(); // Change to `useRouter` for Next.js

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {images.map((image) => (
        <Card
          key={image.id}
          className="relative h-80 overflow-hidden rounded-lg shadow-md cursor-pointer transition-transform duration-300 hover:scale-105"
          onClick={() => navigate(`/image/${image.id}`)}
        >
          <img
            src={`${import.meta.env.VITE_BACKEND_API_URL}/${image.path}`}
            alt={image.name}
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
          {/* Views & Tags Overlay */}
          <div className="absolute bottom-3 left-3 bg-black/60 px-3 py-2 rounded-md text-white flex items-center space-x-3">
            {/* <span className="flex items-center text-sm">
              <Eye className="h-4 w-4 mr-1" /> {image.views}
            </span> */}
            <div className="flex flex-wrap gap-1">
              {image.tags
                ? image.tags.split(",").map((tag, index) => (
                    <Badge key={index} className="bg-gray-700 text-white text-xs">
                      {tag}
                    </Badge>
                  ))
                : null}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
