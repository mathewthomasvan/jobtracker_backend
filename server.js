console.log("🔥 NEW BUILD DEPLOYED:", Date.now());

import express from "express";
import cors from "cors";
import { runClaudeScan } from "./claudeAgent.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Backend running" });
});

app.get("/jobs", async (req, res) => {
  res.json([]);
});

app.post("/scan", async (req, res) => {
  try {
    const results = await runClaudeScan();
    res.json({ status: "ok", results });
  } catch (err) {
    console.error("Scan error:", err);
    res.status(500).json({ status: "error", message: err.message });
  }
});

// Required for Vercel serverless
export default app;
