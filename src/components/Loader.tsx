import React from "react";
import { cn } from "@/lib/utils";

export const Loader = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "fixed inset-0 flex items-center justify-center z-50",
        "bg-background/80",
        className,
      )}
    >
      <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
    </div>
  );
};
