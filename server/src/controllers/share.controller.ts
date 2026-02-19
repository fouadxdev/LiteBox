import type { Request, Response } from "express";
import { prisma } from "../config/database.js";
import { randomUUID } from "crypto";

function getUserId(req: Request): string {
  const user = req.user as { id: string } | undefined;
  if (!user) throw new Error("Unauthorized");
  return user.id;
}

function parseExpiresIn(expiresIn: string): number {
  const match = (expiresIn ?? "").match(/^(\d+)(d|h)$/i);
  if (!match || match[1] == null || match[2] == null) return 24 * 60 * 60 * 1000;
  const value = parseInt(match[1], 10);
  const unit = match[2].toLowerCase();
  if (unit === "d") return value * 24 * 60 * 60 * 1000;
  if (unit === "h") return value * 60 * 60 * 1000;
  return 24 * 60 * 60 * 1000;
}

export const createShare = async (req: Request, res: Response) => {
  try {
    const folderId = req.params.id;
    if (!folderId) {
      return res.status(400).json({ error: "Folder ID is required" });
    }
    const expiresIn = (req.body as { expiresIn?: string })?.expiresIn ?? "7d";
    const userId = getUserId(req);

    const folder = await prisma.folder.findFirst({
      where: { id: folderId, userId },
    });

    if (!folder) {
      return res.status(404).json({ error: "Folder not found" });
    }

    const expiresAt = new Date(Date.now() + parseExpiresIn(expiresIn));
    const token = randomUUID();

    await prisma.folderShare.create({
      data: {
        folderId: folderId,
        token,
        expiresAt,
      },
    });

    const shareUrl = `${process.env.CLIENT_ORIGIN || "http://localhost:5173"}/share/${token}`;

    res.status(201).json({ shareUrl, token, expiresAt: expiresAt.toISOString() });
  } catch (error) {
    console.error("Create share error:", error);
    res.status(500).json({ error: "Failed to create share link" });
  }
};

export const getSharedFolder = async (req: Request, res: Response) => {
  try {
    const token = req.params.token;
    if (!token) {
      return res.status(400).json({ error: "Token is required" });
    }

    const share = await prisma.folderShare.findFirst({
      where: { token },
      include: {
        folder: {
          include: {
            files: {
              orderBy: { uploadedAt: "desc" as const },
            },
          },
        },
      },
    });

    if (!share || !share.folder) {
      return res.status(404).json({ error: "Share not found" });
    }

    if (new Date() > share.expiresAt) {
      return res.status(410).json({ error: "Share link has expired" });
    }

    const { folder } = share;
    res.json({
      folder: {
        id: folder.id,
        name: folder.name,
        files: folder.files,
      },
    });
  } catch (error) {
    console.error("Get shared folder error:", error);
    res.status(500).json({ error: "Failed to load shared folder" });
  }
};
