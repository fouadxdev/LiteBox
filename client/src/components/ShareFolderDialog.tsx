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
import { Label } from "@/components/ui/label";
import { createShare } from "@/lib/api";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

const EXPIRATION_OPTIONS = [
  { value: "1d", label: "1 day" },
  { value: "7d", label: "7 days" },
  { value: "30d", label: "30 days" },
] as const;

interface ShareFolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folderId: string;
  folderName: string;
}

export function ShareFolderDialog({
  open,
  onOpenChange,
  folderId,
  folderName,
}: ShareFolderDialogProps) {
  const [expiresIn, setExpiresIn] = useState<string>("7d");
  const [isLoading, setIsLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCreateShare = async () => {
    try {
      setIsLoading(true);
      setShareUrl(null);
      const res = await createShare(folderId, expiresIn);
      setShareUrl(res.shareUrl);
      toast.success("Share link created.");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create share link";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copied to clipboard.");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy link.");
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setShareUrl(null);
      setExpiresIn("7d");
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Share folder</DialogTitle>
          <DialogDescription>
            Create a view-only link for &quot;{folderName}&quot;. Anyone with the link can view and
            download files until it expires.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="expires">Expiration</Label>
            <select
              id="expires"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={expiresIn}
              onChange={(e) => setExpiresIn(e.target.value)}
              disabled={isLoading}
            >
              {EXPIRATION_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {shareUrl && (
            <div className="grid gap-2">
              <Label>Share link</Label>
              <div className="flex gap-2">
                <input
                  readOnly
                  className="flex h-10 flex-1 rounded-md border border-input bg-muted px-3 py-2 text-sm"
                  value={shareUrl}
                  aria-label="Share link"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleCopy}
                  aria-label="Copy link"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
            {shareUrl ? "Close" : "Cancel"}
          </Button>
          {!shareUrl ? (
            <Button type="button" onClick={handleCreateShare} disabled={isLoading}>
              {isLoading ? "Creating..." : "Create link"}
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
