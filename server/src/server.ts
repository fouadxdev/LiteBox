import express from "express";
import cors from "cors";
import authRoutes from './routes/auth.routes.js'
import { prisma } from "./config/database.js";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import 'dotenv/config'
import session from "express-session";
import passport from "passport";
import './config/passport.js'
import fileRoutes from './routes/file.routes.js';

import folderRoutes from './routes/folder.routes.js';

const app = express();
const PORT = Number(process.env.PORT) || 3000;


app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());



app.use(
  session({
    secret: String(process.env.SESSION_SECRET),
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, 
      httpOnly: true,
      secure: false // set to true in prod
    },
    store: new PrismaSessionStore(
      prisma, 
      {
        checkPeriod: 2 * 60 * 1000,  //ms
        dbRecordIdIsSessionId: true,
      }
    )
  })
)

app.use(passport.initialize());
app.use(passport.session());

// Auth routes
app.use('/api/auth', authRoutes);
// Folders
app.use('/api/folders', folderRoutes); // ← Add this
//files
app.use('/api/files', fileRoutes);

//test
app.get('/', (req, res) => {
  res.send('This is the Homepage')
})

// test
app.get("/api/health", (req, res) => {
  res.send({ status: "ok", message: "server is running!" });
});

//db-test 
app.get('/api/test-db' , async (req, res) => {
  try {
    const userCount = await prisma.user.count()
    res.json({sucess: true, message: 'Lite box is connected to db', userInDb: userCount})
  } catch (e) {
    res.status(500).json({error: 'Database Connection failed!'})
  }
})

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
})
