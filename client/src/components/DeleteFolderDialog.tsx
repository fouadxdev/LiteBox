import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface DeleteFolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folderName: string;
  fileCount: number;
  onDelete: () => Promise<void>;
}

export function DeleteFolderDialog({
  open,
  onOpenChange,
  folderName,
  fileCount,
  onDelete,
}: DeleteFolderDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await onDelete();
      onOpenChange(false);
    } catch (error) {
      console.error('Delete failed:', error);
      // Error handling could be improved here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader className="text-center">
          <DialogTitle>Delete Folder?</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{folderName}"?
            {fileCount > 0 && (
              <span className="block mt-2 text-red-600 dark:text-red-400 font-medium">
                This will permanently delete {fileCount} file{fileCount !== 1 ? 's' : ''}.
              </span>
            )}
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
            {isLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}