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

