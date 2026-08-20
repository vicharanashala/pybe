import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import progressRoutes from "./routes/progress.js";
import classesProgressRoutes from "./routes/classesProgress.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/pybe_inheritance";

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", feature: "inheritance-bird-family" });
});

app.use("/api/progress", progressRoutes);
app.use("/api/classes-progress", classesProgressRoutes);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });