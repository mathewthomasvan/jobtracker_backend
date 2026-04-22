console.log("🔥 NEW BUILD DEPLOYED:", Date.now());

import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import { runClaudeScan } from "./claudeAgent.js";

const app = express();
app.use(cors());
app.use(express.json());

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

// helper: get jobs from Redis
async function getJobsFromKV() {
  const res = await fetch(`${UPSTASH_URL}/get/jobs`, {
    headers: {
      Authorization: `Bearer ${UPSTASH_TOKEN}`
    }
  });

  if (!res.ok) return [];
  const data = await res.json();
  if (!data.result) return [];
  try {
    return JSON.parse(data.result);
  } catch {
    return [];
  }
}

// helper: save jobs to Redis
async function saveJobsToKV(jobs) {
  await fetch(`${UPSTASH_URL}/set/jobs`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${UPSTASH_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ value: JSON.stringify(jobs) })
  });
}

// GET /jobs — read from KV
app.get("/jobs", async (req, res) => {
  try {
    const jobs = await getJobsFromKV();
    res.json(jobs);
  } catch (err) {
    console.error("Error reading jobs from KV:", err);
    res.status(500).json({ error: "Failed to load jobs" });
  }
});

// POST /scan — run Claude + save to KV
app.post("/scan", async (req, res) => {
  try {
    const results = await runClaudeScan();
    await saveJobsToKV(results);
    res.json({ status: "ok", results });
  } catch (err) {
    console.error("Scan failed:", err);
    res.status(500).json({ error: "Scan failed", details: err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Backend running on port ${port}`));
