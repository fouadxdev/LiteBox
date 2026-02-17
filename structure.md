file-uploader/
├── client/                          # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                  # shadcn components go here
│   │   │   ├── FileUpload.tsx
│   │   │   ├── FolderList.tsx
│   │   │   └── Navbar.tsx
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   └── FolderView.tsx
│   │   ├── lib/
│   │   │   ├── api.ts              # All fetch calls to backend
│   │   │   └── utils.ts            # Helper functions
│   │   ├── types/                   # TypeScript types/interfaces
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── server/                          # Node/Express backend
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts         # Prisma client setup
│   │   │   └── passport.ts         # Auth strategy config
│   │   ├── middleware/
│   │   │   ├── auth.ts             # Check if user logged in
│   │   │   └── upload.ts           # Multer config
│   │   ├── routes/
│   │   │   ├── auth.routes.ts      # /api/auth/* endpoints
│   │   │   ├── folder.routes.ts    # /api/folders/* endpoints
│   │   │   └── file.routes.ts      # /api/files/* endpoints
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts   # login, signup, logout logic
│   │   │   ├── folder.controller.ts # CRUD folders
│   │   │   └── file.controller.ts   # Upload, download, delete files
│   │   ├── services/
│   │   │   ├── cloudinary.service.ts # Upload to cloud
│   │   │   └── folder.service.ts     # Complex folder logic
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── app.ts                   # Express app setup
│   │   └── server.ts                # Start server
│   ├── prisma/
│   │   └── schema.prisma            # Database schema
│   ├── package.json
│   └── tsconfig.json
│
└── README.md