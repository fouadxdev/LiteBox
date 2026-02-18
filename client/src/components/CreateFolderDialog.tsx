import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


interface CreateFolderDialogProps {
  onCreateFolder: (name: string) => Promise<void>;
  trigger?: React.ReactNode;
}

export function CreateFolderDialog({
  onCreateFolder,
  trigger,
}: CreateFolderDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    if (!name.trim) {
      setError("Folder name is required");
      return;
    }

    try {
      setError("");
      setIsLoading(true);
      await onCreateFolder(name.trim());

      setOpen(false);
      setName("");
    } catch (err) {
      if (err instanceof Error) {
      // Check for specific backend errors
      if (err.message.includes('required')) {
        setError('Folder name is required');
      } else if (err.message.includes('exists')) {
        setError('A folder with this name already exists');
      } else {
        setError('Failed to create folder. Please try again.');
      }
    } else {
      setError('Something went wrong. Please try again.');
    }
    } finally {
      setIsLoading(false);
    }
  };

    const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      // Reset form when closing
      setName('');
      setError('Enter a folder name');
    }
  };

  return (
    <>
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || <Button>+ New Folder</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader >
            <DialogTitle className="text-center">Create New Folder</DialogTitle>
            <DialogDescription className="text-center">
              Give your folder a name to organize your files.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Folder Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder=""
                autoFocus
                disabled={isLoading}
              />
              {error && (
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Folder'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>


    </>
  )
  
  
  ;
}
