import type { Request, Response } from "express";
import { prisma } from "../config/database.js";



export const getUserId = (req: Request): string => {
  const user = req.user as any;
  return user.id;
};

export const createFolder = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const userId = getUserId(req);

    if (!name) {
      return res.status(400).json({ error: "Folder name is required" });
    }

    const folder = await prisma.folder.create({
      data: {
        name,
        userId,
      },
    });

    res.status(201).json(folder);
  } catch (error) {
    console.error("Create folder error:", error);
    res.status(500).json({ error: "Failed to create folder" });
  }
};

// all
export const getFolders = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);

    const folders = await prisma.folder.findMany({
      where: { userId },
      include: {
        _count: {
          select: { files: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(folders);
  } catch (error) {
    console.error("Get folders error:", error);
    res.status(500).json({ error: "Failed to get all Folders" });
  }
};

//single
export const getFolder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = getUserId(req);

    const folder = await prisma.folder.findFirst({
      where: {
        id: id as string,
        userId,
      },
      include: {
        files: {
          orderBy: { uploadedAt: "desc" },
        },
      },
    });

    if (!folder) {
      return res.status(404).json({ error: "Folder not found" });
    }
    res.json(folder);
  } catch (error) {
    console.error("Get folder error:", error);
    res.status(500).json({ error: "Failed to fetch Folder" });
  }
};

export const updateFolder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const userId = getUserId(req);

    if (!name) {
      return res.status(400).json({ error: "Folder name is required" });
    }

    const existingFolder = await prisma.folder.findFirst({
      where: {
        id: id as string,
        userId,
      },
    });

    if (!existingFolder) {
      return res.status(404).json({ error: "Folder not found" });
    }

    const folder = await prisma.folder.update({
      where: { id: id as string },
      data: { name },
    });

    res.json(folder);
  } catch (error) {
    console.error("Update folder error:", error);
    res.status(500).json({ error: "Failed to update folder" });
  }
};

export const deleteFolder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = getUserId(req);

    // Check if folder exists and user owns it
    const folder = await prisma.folder.findFirst({
      where: { id: id as string, userId },
    });

    if (!folder) {
      return res.status(404).json({ error: "Folder not found" });
    }

    await prisma.folder.delete({
      where: { id: id as string },
    });

    res.json({ message: "Folder deleted successfully" });
  } catch (error) {
    console.error("Delete folder error:", error);
    res.status(500).json({ error: "Failed to delete folder" });
  }
};
