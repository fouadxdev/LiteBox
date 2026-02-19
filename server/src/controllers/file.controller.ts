import type { Request, Response } from 'express';
import { prisma } from '../config/database.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../services/cloudinary.service.js';

const getUserId = (req: Request): string => {
  const user = req.user as any;
  return user.id;
};

// Upload file to a folder
export const uploadFile = async (req: Request, res: Response) => {
  try {
    const { folderId } = req.params;
    const userId = getUserId(req);

    // Explicit check for folderId
    if (!folderId) {
      return res.status(400).json({ error: 'Folder ID is required' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    // Verify folder exists and user owns it
    const folder = await prisma.folder.findFirst({
      where: { id: folderId, userId },
    });

    if (!folder) {
      return res.status(404).json({ error: 'Folder not found' });
    }

    // Upload to Cloudinary (folder path litebox/{folderId})
    const folderPath = `litebox/${folderId}`;
    const { url, publicId } = await uploadToCloudinary(
      req.file.buffer,
      req.file.originalname,
      folderPath
    );

    const file = await prisma.file.create({
      data: {
        name: req.file.originalname,
        url,
        size: req.file.size,
        publicId,
        folderId: folderId as string,
        userId,
      },
    });

    res.status(201).json(file);
  } catch (error) {
    console.error('Upload file error:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
};

// Get file details
export const getFile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = getUserId(req);

    const file = await prisma.file.findFirst({
      where: {
        id: id as string,
        folder: { userId }, // Ensure user owns the folder this file is in
      },
      include: {
        folder: true,
      },
    });

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.json(file);
  } catch (error) {
    console.error('Get file error:', error);
    res.status(500).json({ error: 'Failed to fetch file' });
  }
};

// Delete file
export const deleteFile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = getUserId(req);

    const file = await prisma.file.findFirst({
      where: {
        id: id as string,
        folder: { userId },
      },
    });

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    if (file.publicId) {
      try {
        await deleteFromCloudinary(file.publicId);
      } catch (err) {
        console.error('Cloudinary delete error:', err);
      }
    }

    await prisma.file.delete({
      where: { id: id as string },
    });

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
};