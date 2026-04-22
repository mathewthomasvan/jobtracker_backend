import fetch from "node-fetch";

export async function runClaudeScan() {
  const prompt = `
You are an environmental job‑board scraper. 
Your task is to scan ALL major environmental job boards in Canada (especially BC) and return ONLY roles that match the user's criteria.

SCAN THESE JOB BOARDS:
- https://www.eco.ca/jobboard/
- https://www.goodwork.ca/jobs
- https://ca.indeed.com/jobs?q=environmental
- https://www.linkedin.com/jobs/environmental-jobs/
- https://www.workbc.ca/careers
- https://www2.gov.bc.ca/gov/content/careers-myhr/job-seekers/current-job-postings
- https://metrovancouver.org/about-us/careers
- https://www.envirocareers.ca/
- https://www.environmentaljobs.ca/

YOUR TARGET ROLES (INCLUDE ONLY):
- environmental management
- environmental assessment (EIA)
- environmental planning
- environmental policy
- environmental analyst / data / GIS
- sustainability analyst (non‑field)
- climate / adaptation planning
- A.Ag → P.Ag pathway roles
- junior/intermediate environmental consultant (office‑leaning)

EXCLUDE (DO NOT RETURN):
- technician roles
- field roles
- contaminated sites
- Indigenous engagement
- construction monitoring
- fisheries/wildlife technician
- restoration fieldwork
- sampling, monitoring, boots‑on‑ground roles
- anything requiring RPBio, PBiol, or heavy fieldwork

RETURN STRICT JSON ONLY.
FORMAT:
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

TIER RULES:
1 = Perfect match (environmental mgmt, assessment, planning, analyst)
2 = Acceptable match (office‑leaning consultant roles)
3 = Weak match (only include if borderline acceptable)

EXAMPLES OF GOOD ROLES:
- Environmental Planner (City of Vancouver)
- Environmental Assessment Specialist (Urban Systems)
- Environmental Analyst (Hatfield)
- Climate & Sustainability Analyst (Metro Vancouver)
- Environmental Management Coordinator (BC Gov)

EXAMPLES OF BAD ROLES (DO NOT RETURN):
- Environmental Technician
- Field Technician
- Fisheries Technician
- Restoration Technician
- Environmental Monitor
- Construction Monitor
- Contaminated Sites Technician

IF A JOB BOARD CANNOT BE ACCESSED:
- Skip it silently
- Still return valid JSON

IF NO JOBS FOUND:
Return an empty array: []

DO NOT RETURN ANY TEXT OUTSIDE THE JSON ARRAY.
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

