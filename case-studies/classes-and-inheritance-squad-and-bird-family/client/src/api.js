const BASE = "/api/progress";

export async function getProgress(learnerId) {
  const res = await fetch(`${BASE}/${encodeURIComponent(learnerId)}`);
  if (!res.ok) throw new Error("Failed to load progress");
  return res.json();
}

export async function saveProgress(learnerId, patch) {
  const res = await fetch(`${BASE}/${encodeURIComponent(learnerId)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error("Failed to save progress");
  return res.json();
}
