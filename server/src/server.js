import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDb from "./config/db.js";
import authRoutes from "./routes/auth.js";
import heritageSiteRoutes from "./routes/heritageSites.js";
import memoryRoutes from "./routes/memories.js";
import adminRoutes from "./routes/admin.js";
import favoriteRoutes from "./routes/favorites.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientBuildPath = path.resolve(__dirname, "../../client/dist");

// Connect to database
connectDb();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Vancouver Heritage API" });
});

app.use("/api/auth", authRoutes);
app.use("/api/heritage-sites", heritageSiteRoutes);
app.use("/api/memories", memoryRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/favorites", favoriteRoutes);

app.use(express.static(clientBuildPath));

app.get("/*", (req, res) => {
  res.sendFile(path.join(clientBuildPath, "index.html"));
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
