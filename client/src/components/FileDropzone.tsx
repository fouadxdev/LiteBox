import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface FileDropzoneProps {
  onFilesDrop: (files: File[]) => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export function FileDropzone({
  onFilesDrop,
  children,
  className,
  disabled = false,
}: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) setIsDragging(true);
    },
    [disabled]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    },
    []
  );

  const handleDragLeave = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!e.currentTarget.contains(e.relatedTarget as Node)) {
        setIsDragging(false);
      }
    },
    []
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (disabled) return;
      const items = e.dataTransfer?.files;
      if (items?.length) {
        onFilesDrop(Array.from(items));
      }
    },
    [onFilesDrop, disabled]
  );

  return (
    <div
      className={cn(
        "relative transition-all duration-200",
        isDragging && "ring-2 ring-teal-500 ring-offset-2 dark:ring-offset-gray-900 rounded-lg",
        className
      )}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDragging && (
        <div
          className="absolute inset-0 z-10 rounded-lg bg-teal-500/10 dark:bg-teal-400/10 border-2 border-dashed border-teal-500 dark:border-teal-400 flex items-center justify-center pointer-events-none"
          aria-hidden
        >
          <p className="text-sm font-medium text-teal-700 dark:text-teal-300">
            Drop files here
          </p>
        </div>
      )}
      {children}
    </div>
  );
}
