export interface User {
  id: string;
  email: string;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  message?: string;
}

export interface AuthCredentials {
  email: string;
  password?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export interface Folder {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
  _count?: {
    files: number;
  };
}

export interface File {
  id: string;
  name: string;
  url: string;
  size: number;
  folderId?: string | null;
  publicId?: string | null;
  uploadedAt: string;
}

export interface FolderWithFiles extends Folder {
  files: File[];
}
