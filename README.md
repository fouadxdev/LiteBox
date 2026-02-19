# LiteBox — File Uploader (Google Drive clone)

A full-stack file storage app: upload files to folders, share via expiring links, and manage files with drag-and-drop and progress tracking.

## Tech stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, shadcn/ui, Lucide icons, Sonner toasts
- **Backend:** Node.js, Express, TypeScript, Prisma, PostgreSQL
- **Auth:** Passport.js (local strategy) with express-session; sessions stored in PostgreSQL via `@quixo3/prisma-session-store`
- **Storage:** Cloudinary for file uploads
- **Performance:** Compression (gzip), rate limiting on auth, DB indexes, lazy-loaded routes, optional pagination

## Prerequisites

- Node.js 18+
- PostgreSQL
- [Cloudinary](https://cloudinary.com) account
- npm or pnpm

## Environment variables

### Server (`server/.env`)

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string (e.g. `postgresql://user:pass@localhost:5432/file_uploader_db`) |
| `SESSION_SECRET` | Secret for signing session cookies |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `PORT` | Server port (default `3000`) |
| `CLIENT_ORIGIN` | Frontend origin for share links (default `http://localhost:5173`) |

### Client

The client uses `http://localhost:3000/api` as the API base URL (see `client/src/lib/api.ts`). For production, use a build-time or runtime env (e.g. `VITE_API_URL`).

## How to run

1. **Database**

   ```bash
   cd server
   cp .env.example .env   # or create .env with the variables above
   npx prisma migrate dev
   npx prisma generate
   ```

2. **Server**

   ```bash
   cd server
   npm install
   npm run dev
   ```

   Server runs at `http://localhost:3000`.

3. **Client**

   ```bash
   cd client
   npm install
   npm run dev
   ```

   Client runs at `http://localhost:5173`.

4. **Usage**

   Open `http://localhost:5173`. Sign up, create folders, open a folder, and upload files (click or drag-and-drop). Use **Share** to create a view-only link with expiration.

## Architecture

- **Client:** React SPA with React Router. Auth state from `AuthProvider` (session cookie). Landing at `/`, app at `/dashboard`, folder view at `/folder/:id`, shared view at `/share/:token`.
- **API:** Express with `/api/auth`, `/api/folders`, `/api/files`, `/api/share`. Auth via `requireAuth` middleware (session). File uploads go to Cloudinary; metadata and share links live in PostgreSQL.
- **Data flow:** Login/signup → session cookie → authenticated requests. File upload: multipart to API → Cloudinary → `File` row with `url` and `publicId`. Share: `FolderShare` row with `token` and `expiresAt`; public GET `/api/share/:token` returns folder + files (no auth).

---

## Implementation walkthrough

### Phase 0 — Foundation (FolderView + file upload)

- **Implemented:** Cloudinary service (`server/src/services/cloudinary.service.ts`) with folder path `litebox/{folderId}`; multer upload middleware (memory, 50 MB, allowed MIME types); file controller (upload, get file, delete with Cloudinary delete by `publicId`); file routes at `/api/files` (POST `upload/:folderId`, GET `:id`, DELETE `:id`); compression middleware; `File.publicId` in Prisma for Cloudinary cleanup on delete.
- **Frontend:** `FolderView` page at `/folder/:id`; `getFolder(id)` loads folder + files; upload via file input; file list with download and delete; navigation from Dashboard folder cards to `/folder/:id`; Back to `/dashboard`.
- **Key files:** `server/src/services/cloudinary.service.ts`, `server/src/middleware/upload.ts`, `server/src/controllers/file.controller.ts`, `server/src/routes/file.routes.ts`, `client/src/pages/FolderView.tsx`, `client/src/lib/api.ts` (uploadFile, getFile, deleteFile).
- **Test:** Log in, create a folder, open it, upload a file (click), see it in the list, download and delete.

### Phase 1 — Drag-and-drop upload

- **Implemented:** `FileDropzone` component wrapping the folder content; `dragenter` / `dragover` / `dragleave` / `drop` with `isDragging` state and “Drop files here” overlay; on drop, multiple files passed to parent; FolderView enqueues each file into the same upload queue used by the file input (multiple selection supported).
- **Key files:** `client/src/components/FileDropzone.tsx`, `client/src/pages/FolderView.tsx` (FileDropzone + handleFilesDrop, multiple file input).
- **Test:** Drag several files onto the folder view; all enter the queue and upload with progress.

### Phase 2 — Folder sharing

- **Implemented:** `FolderShare` model (folderId, token UUID, expiresAt); `createShare` (POST `/api/folders/:id/share`, body `expiresIn`: 1d/7d/30d or e.g. 24h); `getSharedFolder` (GET `/api/share/:token`, no auth, 404/410 if not found or expired); Share button on FolderView opens `ShareFolderDialog` (expiration select, create link, copy URL); `SharedFolderView` at `/share/:token` (read-only file list, download only).
- **Key files:** `server/prisma/schema.prisma` (FolderShare), `server/src/controllers/share.controller.ts`, `server/src/routes/share.routes.ts`, `server/src/routes/folder.routes.ts` (POST `:id/share`), `client/src/components/ShareFolderDialog.tsx`, `client/src/pages/SharedFolderView.tsx`, `client/src/lib/api.ts` (createShare, getSharedFolder).
- **Test:** In a folder click Share, create link (e.g. 7 days), copy URL, open in incognito or another browser; see folder name and files, download only.

### Phase 3 — File validation UI

- **Implemented:** `client/src/lib/uploadConfig.ts` with `MAX_FILE_SIZE` (50 MB), `ALLOWED_MIME_TYPES`, `validateFile()`, `getValidationMessage()`, `ALLOWED_DESCRIPTION`; validation before upload in FolderView (enqueue and upload path); upload area shows “Max size: 50 MB. Allowed: …”; toasts via Sonner for success/error (upload, delete, validation error).
- **Key files:** `client/src/lib/uploadConfig.ts`, `client/src/pages/FolderView.tsx`, `client/src/App.tsx` (Toaster).
- **Test:** Try uploading an oversized or disallowed file type; see toast and/or inline limit text.

### Phase 4 — Upload progress and cancel

- **Implemented:** `uploadFile` in api accepts `onUploadProgress` and `signal`; FolderView keeps an upload queue (`UploadJob[]`: id, file, progress, status); up to 2 concurrent uploads; each job shows progress bar, percentage, and Cancel (AbortController); on success/error/cancel, job is removed after a short delay; toasts for success and errors.
- **Key files:** `client/src/lib/api.ts` (UploadOptions), `client/src/pages/FolderView.tsx` (uploads state, runOneUpload, progress list UI, cancelUpload).
- **Test:** Upload several files; see progress bars and cancel one mid-upload.

### Phase 5 — UI polish and empty states

- **Implemented:** Skeleton loading: Dashboard and FolderView use `<Skeleton>` (and SharedFolderView uses pulse placeholders) instead of “Loading…”; empty state for no folders (icon + copy + Create Folder); empty state for no files in folder (icon + “No files yet” + “Upload or drop files here”); Folder and file icons from Lucide (FolderOpen, FileText) instead of emoji; transitions (e.g. duration-200 on folder cards).
- **Key files:** `client/src/components/ui/skeleton.tsx`, `client/src/pages/Dashboard.tsx`, `client/src/pages/FolderView.tsx`, `client/src/pages/SharedFolderView.tsx`.
- **Test:** Reload dashboard and folder view to see skeletons; use empty folder and empty folder list to see empty states.

### Phase 6 — Performance

- **Implemented:** **Frontend:** Lazy-loaded routes for `FolderView` and `SharedFolderView` with `<Suspense fallback={<PageSkeleton />}>`; **Backend:** Compression middleware; rate limiting on `/api/auth/login` and `/api/auth/signup` (e.g. 20 per 15 min); Prisma indexes on `Folder(userId)`, `File(folderId)`, `File(userId)`, `FolderShare(token)`, `FolderShare(expiresAt)`; pagination for `GET /api/folders` (`?page=1&limit=50`, response `{ data, total, page, totalPages }`); client getFolders uses response `.data` for the list.
- **Key files:** `client/src/App.tsx` (lazy, Suspense), `server/src/server.ts` (compression, rate limit), `server/prisma/schema.prisma` (indexes), `server/src/controllers/folder.controller.ts` (getFolders pagination), `client/src/lib/api.ts` and `client/src/pages/Dashboard.tsx` (paginated response).
- **Test:** Navigate to folder and share routes (brief skeleton); run many login attempts to hit rate limit; call `GET /folders?page=1&limit=10` to verify pagination.

### Phase 7 — This README

- **Implemented:** Project overview, tech stack, prerequisites, environment variables, run instructions, architecture summary, and per-phase implementation walkthrough with what was built, key files, and how to test.

---

## Optional env (documentation)

- `MAX_UPLOAD_MB` — not used yet; multer limit is hardcoded 50 MB; can be wired later.
- `RATE_LIMIT_WINDOW_MS` / `RATE_LIMIT_MAX_REQUESTS` — not used; rate limit is hardcoded in `server.ts`; can be made configurable.

## License

MIT (or your choice).
