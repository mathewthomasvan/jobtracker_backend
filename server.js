import express from "express";
import cors from "cors";
import fs from "fs";
import { runClaudeScan } from "./claudeAgent.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/jobs", (req, res) => {
  const data = fs.readFileSync("jobs.json", "utf8");
  res.json(JSON.parse(data));
});

app.post("/scan", async (req, res) => {
  const results = await runClaudeScan();
  fs.writeFileSync("jobs.json", JSON.stringify(results, null, 2));
  res.json({ status: "ok", results });
});

app.listen(3000, () => console.log("Backend running on port 3000"));
