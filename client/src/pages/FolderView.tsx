import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { getFolder, uploadFile as uploadFileAPI, deleteFile as deleteFileAPI } from '@/lib/api';
import type { FolderWithFiles } from '@/types';
import {
  MAX_FILE_SIZE_MB,
  ALLOWED_DESCRIPTION,
  validateFile,
  getValidationMessage,
} from '@/lib/uploadConfig';
import { ArrowLeft, Upload, FolderOpen, FileText, X, Share2 } from 'lucide-react';
import { FileDropzone } from '@/components/FileDropzone';
import { ShareFolderDialog } from '@/components/ShareFolderDialog';
import { Skeleton } from '@/components/ui/skeleton';

const CONCURRENT_UPLOADS = 2;

type UploadStatus = 'pending' | 'uploading' | 'done' | 'error' | 'cancelled';

interface UploadJob {
  id: string;
  file: File;
  progress: number;
  status: UploadStatus;
}

export default function FolderView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [folder, setFolder] = useState<FolderWithFiles | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [uploads, setUploads] = useState<UploadJob[]>([]);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const abortsRef = useRef<Map<string, AbortController>>(new Map());
  const startedIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const loadFolder = async () => {
      if (!id) return;
      try {
        const data = await getFolder(id);
        setFolder(data);
      } catch (error) {
        console.error('Failed to load folder:', error);
        navigate('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };
    if (user) loadFolder();
  }, [id, user, navigate]);

  const removeUpload = useCallback((uploadId: string, delayMs: number) => {
    abortsRef.current.delete(uploadId);
    startedIdsRef.current.delete(uploadId);
    setTimeout(() => {
      setUploads((prev) => prev.filter((u) => u.id !== uploadId));
    }, delayMs);
  }, []);

  const runOneUpload = useCallback(
    async (job: UploadJob) => {
      if (!id) return;
      const controller = new AbortController();
      abortsRef.current.set(job.id, controller);

      setUploads((prev) =>
        prev.map((u) => (u.id === job.id ? { ...u, status: 'uploading' as const, progress: 0 } : u))
      );

      try {
        const uploadedFile = await uploadFileAPI(id, job.file, {
          signal: controller.signal,
          onUploadProgress: (percent) => {
            setUploads((prev) =>
              prev.map((u) => (u.id === job.id ? { ...u, progress: percent } : u))
            );
          },
        });
        setFolder((prev) =>
          prev ? { ...prev, files: [uploadedFile, ...prev.files] } : prev
        );
        setUploads((prev) =>
          prev.map((u) => (u.id === job.id ? { ...u, status: 'done' as const, progress: 100 } : u))
        );
        toast.success(`Uploaded "${job.file.name}".`);
        removeUpload(job.id, 1500);
      } catch (err: unknown) {
        const isAborted =
          (err instanceof Error && err.name === 'CanceledError') ||
          (err && typeof err === 'object' && (err as { code?: string }).code === 'ERR_CANCELED');
        if (isAborted) {
          setUploads((prev) =>
            prev.map((u) => (u.id === job.id ? { ...u, status: 'cancelled' as const } : u))
          );
          removeUpload(job.id, 800);
          return;
        }
        const message = err instanceof Error ? err.message : 'Upload failed';
        toast.error(`Upload failed: ${message}`);
        setUploads((prev) =>
          prev.map((u) => (u.id === job.id ? { ...u, status: 'error' as const } : u))
        );
        removeUpload(job.id, 2000);
      }
    },
    [id, removeUpload]
  );

  useEffect(() => {
    const pending = uploads.filter(
      (u) => u.status === 'pending' && !startedIdsRef.current.has(u.id)
    );
    const uploading = uploads.filter((u) => u.status === 'uploading');
    if (pending.length === 0 || uploading.length >= CONCURRENT_UPLOADS) return;
    const next = pending[0];
    startedIdsRef.current.add(next.id);
    runOneUpload(next);
  }, [uploads, runOneUpload]);

  const enqueueFile = useCallback((file: File) => {
    const { valid, error } = validateFile(file);
    if (!valid && error) {
      toast.error(getValidationMessage(error));
      return;
    }
    setUploads((prev) => [
      ...prev,
      { id: crypto.randomUUID(), file, progress: 0, status: 'pending' },
    ]);
  }, []);

  const cancelUpload = useCallback((uploadId: string) => {
    abortsRef.current.get(uploadId)?.abort();
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length) {
      for (let i = 0; i < files.length; i++) enqueueFile(files[i]);
    }
    e.target.value = '';
  };

  const handleFilesDrop = useCallback(
    (files: File[]) => {
      files.forEach(enqueueFile);
    },
    [enqueueFile]
  );

  const handleDeleteFile = async (fileId: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return;

    try {
      await deleteFileAPI(fileId);
      setFolder((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          files: prev.files.filter((f) => f.id !== fileId),
        };
      });
      toast.success('File deleted.');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Delete failed';
      toast.error(`Delete failed: ${message}`);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-8 w-48" />
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-48 rounded-lg mb-6" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-16 rounded-lg" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (!folder) {
    return (
      <div className="min-h-screen grid place-items-center bg-gray-50 dark:bg-gray-900">
        <div className="text-gray-600 dark:text-gray-400">Folder not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <FolderOpen className="h-6 w-6 text-gray-500" aria-hidden />
                {folder.name}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {folder.files.length} file{folder.files.length !== 1 ? 's' : ''}
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShareDialogOpen(true)}
              aria-label="Share folder"
            >
              <Share2 className="h-4 w-4 mr-2" aria-hidden />
              Share
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FileDropzone onFilesDrop={handleFilesDrop}>
        {/* Upload Area */}
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 p-8 text-center">
          <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" aria-hidden />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Upload Files
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Click to select or drag and drop files here
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mb-4">
            Max size: {MAX_FILE_SIZE_MB} MB. Allowed: {ALLOWED_DESCRIPTION}
          </p>
          <input
            type="file"
            onChange={handleFileInputChange}
            className="hidden"
            id="file-upload"
            aria-label="Choose file to upload"
            multiple
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <Button type="button" asChild>
              <span>Choose File(s)</span>
            </Button>
          </label>
        </div>

        {/* Upload progress list */}
        {uploads.length > 0 && (
          <div className="mb-6 space-y-3">
            {uploads.map((job) => (
              <div
                key={job.id}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 flex items-center gap-4"
              >
                <FileText className="h-5 w-5 text-gray-400 shrink-0" aria-hidden />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {job.file.name}
                  </p>
                  <div className="mt-1.5 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-teal-500 dark:bg-teal-400 transition-[width] duration-200"
                      style={{ width: `${job.progress}%` }}
                    />
                  </div>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 w-10 text-right">
                  {job.status === 'uploading' && `${job.progress}%`}
                  {job.status === 'done' && 'Done'}
                  {job.status === 'error' && 'Error'}
                  {job.status === 'cancelled' && 'Cancelled'}
                  {job.status === 'pending' && 'Queued'}
                </span>
                {(job.status === 'pending' || job.status === 'uploading') && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="shrink-0 text-gray-500 hover:text-red-600"
                    onClick={() => cancelUpload(job.id)}
                    aria-label={`Cancel upload of ${job.file.name}`}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Files List */}
        {folder.files.length === 0 ? (
          <div className="text-center py-12 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30">
            <FileText className="h-14 w-14 mx-auto text-gray-400 dark:text-gray-500 mb-4" aria-hidden />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
              No files yet
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Upload or drop files here to get started
            </p>
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
                      {formatFileSize(file.size)} • {formatDate(file.uploadedAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(file.url, '_blank')}
                  >
                    Download
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteFile(file.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        </FileDropzone>
      </main>

      <ShareFolderDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        folderId={id!}
        folderName={folder.name}
      />
    </div>
  );
}