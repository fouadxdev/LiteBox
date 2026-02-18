import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import { getFolders } from "@/lib/api";
import type { Folder } from "@/types";
import { createFolder as createFolderAPI } from "@/lib/api";
import { CreateFolderDialog } from "@/components/CreateFolderDialog";
import {
  updateFolder as updateFolderAPI,
  deleteFolder as deleteFolderAPI,
} from "@/lib/api";
import { FolderMenu } from "@/components/FolderMenu";
import { RenameFolderDialog } from "@/components/RenameFolderDialog";
import { DeleteFolderDialog } from "@/components/DeleteFolderDialog";


export default function Dashboard() {
  const { user, isLoading: authLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  

  const [renameDialog, setRenameDialog] = useState<{
    open: boolean;
    folder: Folder | null;
  }>({
    open: false,
    folder: null,
  });
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    folder: Folder | null;
  }>({
    open: false,
    folder: null,
  });

  useEffect(() => {
    const loadFolders = async () => {
      try {
        const data = await getFolders();
        setFolders(data);
      } catch (error) {
        console.error("Failed to load folders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadFolders();
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen grid place-items-center">
        Loading Folders...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen grid place-items-center">Not logged in</div>
    );
  }

  const handleCreateFolder = async (name: string) => {
    const newFolder = await createFolderAPI(name);
    // Add new folder to the list
    setFolders((prev) => [newFolder, ...prev]);
  };

  const handleRenameFolder = async (newName: string) => {
    if (!renameDialog.folder) return;

    await updateFolderAPI(renameDialog.folder.id, newName);

    setFolders((prev) =>
      prev.map((f) =>
        f.id === renameDialog.folder!.id ? { ...f, name: newName } : f,
      ),
    );
  };

  const handleDeleteFolder = async () => {
    if (!deleteDialog.folder) return;

    await deleteFolderAPI(deleteDialog.folder.id);

    setFolders((prev) => prev.filter((f) => f.id !== deleteDialog.folder!.id));
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-400">
              LiteBox
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {user.email}
              </span>
              <Button variant={"outline"} size={"sm"} onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </header>

        {/* main */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {folders.length === 0 ? (
            <div className="grid place-items-center min-h-[60vh]">
              <div className="text-center space-y-6">
                <div className="text-6xl">📁</div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    No folders yet...
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 max-w-md">
                    Create your first folder to organize your files and keep
                    everything tidy
                  </p>
                </div>
                <CreateFolderDialog
                  onCreateFolder={handleCreateFolder}
                  trigger={<Button size="lg">+ Create Folder</Button>}
                />
              </div>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  Your Folders
                </h2>
                <CreateFolderDialog onCreateFolder={handleCreateFolder} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {folders.map((folder) => (
                  <div
                    key={folder.id}
                    className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => navigate(`/folder/${folder.id}`)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="text-4xl">📁</div>
                      <FolderMenu
                        onRename={() => setRenameDialog({ open: true, folder })}
                        onDelete={() => setDeleteDialog({ open: true, folder })}
                      />
                    </div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-1 truncate">
                      {folder.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {folder._count?.files || 0} {(folder._count?.files === 1 ? 'file' : 'files')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rename Dialog */}
          <RenameFolderDialog
            open={renameDialog.open}
            onOpenChange={(open) => setRenameDialog({ open, folder: null })}
            currentName={renameDialog.folder?.name || ""}
            onRename={handleRenameFolder}
          />

          {/* Delete Dialog */}
          <DeleteFolderDialog
            open={deleteDialog.open}
            onOpenChange={(open) => setDeleteDialog({ open, folder: null })}
            folderName={deleteDialog.folder?.name || ""}
            fileCount={deleteDialog.folder?._count?.files || 0}
            onDelete={handleDeleteFolder}
          />
        </main>
      </div>
    </>
  );
}
