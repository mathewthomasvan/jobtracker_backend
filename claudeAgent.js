import fetch from "node-fetch";

export async function runClaudeScan() {
  const prompt = `
Scan job boards for environmental roles in Greater Vancouver that match:

- environmental management
- environmental assessment
- environmental planning
- environmental data / GIS
- A.Ag → P.Ag pathway

Exclude:
- technician roles
- field roles
- contaminated sites
- Indigenous engagement
- construction monitoring
- fisheries/wildlife tech

Return JSON only:
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
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }]
    })
  });

  const data = await response.json();

  // basic safety: if Claude returns non-JSON, avoid crashing
  const text = data?.content?.[0]?.text || "[]";
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("Failed to parse Claude JSON:", e, text);
    return [];
  }
}

