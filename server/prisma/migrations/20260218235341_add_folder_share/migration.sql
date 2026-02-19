-- CreateTable
CREATE TABLE "FolderShare" (
    "id" TEXT NOT NULL,
    "folderId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FolderShare_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FolderShare_token_key" ON "FolderShare"("token");

-- CreateIndex
CREATE INDEX "FolderShare_token_idx" ON "FolderShare"("token");

-- CreateIndex
CREATE INDEX "FolderShare_expiresAt_idx" ON "FolderShare"("expiresAt");

-- AddForeignKey
ALTER TABLE "FolderShare" ADD CONSTRAINT "FolderShare_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "Folder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
