import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getSharedFolder } from "@/lib/api";
import type { File as FileRecord } from "@/types";
import { FolderOpen, FileText } from "lucide-react";

interface SharedFolderState {
  folder: { id: string; name: string; files: FileRecord[] };
}

export default function SharedFolderView() {
  const { token } = useParams<{ token: string }>();
  const [data, setData] = useState<SharedFolderState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError("Invalid link");
      setIsLoading(false);
      return;
    }
    getSharedFolder(token)
      .then((res) => setData({ folder: res.folder }))
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to load");
      })
      .finally(() => setIsLoading(false));
  }, [token]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="h-8 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-16 rounded-lg animate-pulse bg-gray-200 dark:bg-gray-700"
              />
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen grid place-items-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            {error === "Share link has expired"
              ? "This share link has expired."
              : error || "Share not found."}
          </p>
          <Link to="/">
            <Button variant="outline">Go home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const { folder } = data;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                Go home
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <FolderOpen className="h-6 w-6 text-gray-500" aria-hidden />
                {folder.name} (shared)
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                View-only • {folder.files.length} file{folder.files.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {folder.files.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">No files in this folder.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {folder.files.map((file) => (
              <div
                key={file.id}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <FileText className="h-8 w-8 text-gray-400 shrink-0" aria-hidden />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 dark:text-white truncate">
                      {file.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(file.url, "_blank")}
                >
                  Download
                </Button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
