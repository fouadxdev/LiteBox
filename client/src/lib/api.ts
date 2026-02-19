import axios from "axios";
import type { AuthCredentials, AuthResponse, User, File as FileRecord } from "../types";
import type { Folder, FolderWithFiles } from "../types";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

export const loginUser = async (
  data: AuthCredentials,
): Promise<AuthResponse> => {
  try {
    const response = await api.post("/auth/login", data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || "Login failed");
    }

    throw new Error("Network error");
  }
};

export const signupUser = async (
  data: AuthCredentials,
): Promise<AuthResponse> => {
  try {
    const response = await api.post("/auth/signup", data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || "Signup failed");
    }
    throw new Error("Network error");
  }
};

export const logoutUser = async (): Promise<{ message: string }> => {
  const response = await api.post("/auth/logout");
  return response.data;
};

export const checkAuth = async (): Promise<User> => {
  const response = await api.get("/auth/me");
  return response.data.user;
};

export interface GetFoldersResponse {
  data: Folder[];
  total: number;
  page: number;
  totalPages: number;
}

export const getFolders = async (
  params?: { page?: number; limit?: number }
): Promise<GetFoldersResponse> => {
  const response = await api.get("/folders", { params });
  return response.data;
};

export const getFolder = async (id: string): Promise<FolderWithFiles> => {
  const response = await api.get(`/folders/${id}`);
  return response.data;
};

export const createFolder = async (name: string): Promise<Folder> => {
  const response = await api.post("/folders", { name });
  return response.data;
};

export const updateFolder = async (
  id: string,
  name: string,
): Promise<Folder> => {
  const response = await api.put(`/folders/${id}`, { name });
  return response.data;
};

export const deleteFolder = async (
  id: string,
): Promise<{ message: string }> => {
  const response = await api.delete(`/folders/${id}`);
  return response.data;
};

export interface UploadOptions {
  onUploadProgress?: (percent: number) => void;
  signal?: AbortSignal;
}

// File API calls
export const uploadFile = async (
  folderId: string,
  file: File,
  options?: UploadOptions
): Promise<FileRecord> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post(`/files/upload/${folderId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    signal: options?.signal,
    onUploadProgress: options?.onUploadProgress
      ? (e) => {
          if (e.total != null && e.total > 0) {
            options.onUploadProgress!(Math.round((100 * e.loaded) / e.total));
          }
        }
      : undefined,
  });
  return response.data;
};

export const getFile = async (id: string): Promise<FileRecord> => {
  const response = await api.get(`/files/${id}`);
  return response.data;
};

export const deleteFile = async (id: string): Promise<{ message: string }> => {
  const response = await api.delete(`/files/${id}`);
  return response.data;
};

// Share API
export interface CreateShareResponse {
  shareUrl: string;
  token: string;
  expiresAt: string;
}

export const createShare = async (
  folderId: string,
  expiresIn: string
): Promise<CreateShareResponse> => {
  const response = await api.post(`/folders/${folderId}/share`, { expiresIn });
  return response.data;
};

export interface SharedFolderData {
  folder: { id: string; name: string; files: FileRecord[] };
}

export const getSharedFolder = async (token: string): Promise<SharedFolderData> => {
  const response = await api.get(`/share/${token}`);
  return response.data;
};

export default api;
