
NAME - Lite BOX

Phase 1: Foundation (Days 1-2)
Goal: Get frontend and backend talking to each other

Setup Projects

Create Vite React TypeScript project for frontend
Create Node TypeScript project for backend
Install dependencies
Learn: Basic TypeScript syntax (types, interfaces)
Docs: TypeScript Handbook - Basics


Database Schema

Design Prisma schema (User, Folder, File models)
Run migrations
Learn: Prisma basics (models, relations)
Docs: Prisma Quickstart


Basic Express Setup

Create Express app with TypeScript
Test a simple route: GET /api/health → { status: "ok" }
Connect frontend to backend (test the fetch)
Learn: CORS (why frontend can't talk to backend without it)



Phase 2: Authentication (Days 3-4)
Goal: Users can sign up, log in, log out

Passport Setup

Set up Passport local strategy
Set up express-session with Prisma store
Learn: How sessions work (the "remembering users" part)
Docs: Passport Local Strategy


Auth Routes & Controllers

POST /api/auth/signup
POST /api/auth/login
POST /api/auth/logout
GET /api/auth/me (check if logged in)
Learn: Password hashing (bcrypt)


Auth Frontend

Login/Signup forms (use shadcn Form components)
Protected routes (redirect if not logged in)
Learn: React Router protected routes



Phase 3: Folders (Days 5-6)
Goal: Users can create, view, edit, delete folders

Folder Backend

Routes: GET, POST, PUT, DELETE /api/folders
Controllers: CRUD operations
Auth middleware (only your folders)
Learn: RESTful API design


Folder Frontend

Dashboard showing folders
Create folder form (shadcn Dialog + Form)
Delete/rename folder
Learn: React state management for lists



Phase 4: File Upload (Days 7-9)
Goal: Upload files to folders, see them, download them

Multer Setup

Configure multer middleware
Test uploading to local filesystem
Learn: How file uploads work in HTTP (multipart/form-data)
Docs: Multer


Cloudinary Integration

Set up Cloudinary account
Create service to upload files
Store URLs in database
Learn: Environment variables (.env files)
Docs: Cloudinary Node SDK


File Routes & Controllers

POST /api/files/upload
GET /api/files/:id
GET /api/files/:id/download
DELETE /api/files/:id


File Frontend

Upload form (drag-and-drop would be cool)
File list in folder view
Download button
File validation (size, type)
Learn: FormData API, file input handling



Phase 5: Extra Credit (Days 10+)

Folder Sharing

Generate unique share links
Public routes (no auth needed)
Expiration logic
Learn: UUIDs, date math