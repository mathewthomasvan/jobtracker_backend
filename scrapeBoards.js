import fetch from "node-fetch";

export async function fetchHTML(url) {
  try {
    const res = await fetch(url, { timeout: 15000 });
    if (!res.ok) return null;
    return await res.text();
  } catch (err) {
    console.error("Failed to fetch:", url, err);
    return null;
  }
}

export async function getAllJobBoardHTML() {
  const urls = [
    "https://www.eco.ca/jobboard/",
    "https://www.goodwork.ca/jobs",
    "https://ca.indeed.com/jobs?q=environmental",
    "https://www.linkedin.com/jobs/environmental-jobs/",
    "https://www.workbc.ca/careers",
    "https://www2.gov.bc.ca/gov/content/careers-myhr/job-seekers/current-job-postings",
    "https://metrovancouver.org/about-us/careers",
    "https://www.envirocareers.ca/",
    "https://www.environmentaljobs.ca/"
  ];

  const results = {};

  for (const url of urls) {
    const html = await fetchHTML(url);
    if (html) results[url] = html;
  }

  return results;
}
