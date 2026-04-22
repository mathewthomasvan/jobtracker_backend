console.log("🔥 CLAUDE AGENT LOADED — NEW VERSION");

import fetch from "node-fetch";

export async function runClaudeScan(jobBoardHTML) {
  const prompt = `
You are an environmental job extractor.

You will be given RAW HTML from multiple job boards.
Your task is to extract ONLY valid environmental management/planning/assessment/analyst roles.

HTML INPUT:
${Object.entries(jobBoardHTML)
  .map(([url, html]) => `URL: ${url}\nHTML:\n${html.slice(0, 5000)}\n---`)
  .join("\n")}

RETURN STRICT JSON ONLY:
[
  {
    "title": "",
    "company": "",
    "location": "",
    "category": "",
    "tier": 1,
    "postingDate": "",
    "closingDate": "",
    "link": "",
    "whyFit": "",
    "redFlags": []
  }
]

RULES:
- Extract ONLY real jobs found in the HTML.
- DO NOT hallucinate.
- If a job board has no valid roles, skip it.
- If no jobs found at all, return [].
- DO NOT return text outside the JSON array.
`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": process.env.CLAUDE_API_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json"
    },
    body: JSON.stringify({
      model: "claude-3-sonnet-20240229",
      max_tokens: 4000,
      messages: [{ role: "user", content: prompt }]
    })
  });

  const data = await response.json();
  const text = data?.content?.[0]?.text || "[]";

  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("Failed to parse Claude JSON:", e, text);
    return [];
  }
}
