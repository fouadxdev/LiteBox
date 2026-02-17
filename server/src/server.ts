import express from "express";
import { prisma } from "./config/database.js";
import cors from "cors";
import 'dotenv/config'

const app = express();
const PORT = Number(process.env.PORT) || 3000;

//middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());

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
