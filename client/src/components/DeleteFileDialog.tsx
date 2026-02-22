import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DeleteFileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fileName: string;
  fileSize: string;
  onDelete: () => Promise<void>;
}

export function DeleteFileDialog({
  open,
  onOpenChange,
  fileName,
  fileSize,
  onDelete,
}: DeleteFileDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await onDelete();
      onOpenChange(false);
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader className="text-center">
          <DialogTitle>Delete {fileName}</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{fileName}"?
            <span className="block mt-2 text-gray-500 dark:text-gray-400">
              Size: {fileSize}
            </span>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
