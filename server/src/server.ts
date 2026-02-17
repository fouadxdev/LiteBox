import express from "express";
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

// test
app.get("/api/health", (req, res) => {
  res.send({ status: "ok", message: "server is running!" });
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`)
})
