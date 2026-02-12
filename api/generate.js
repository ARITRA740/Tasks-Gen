import { callOpenAI, makePrompt, normalizeResult } from "./_shared.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  const { featureGoal, targetUsers, constraints } = req.body || {};
  if (!featureGoal || !targetUsers || !constraints) {
    res.status(400).json({ error: "featureGoal, targetUsers, and constraints are required." });
    return;
  }

  try {
    const raw = await callOpenAI(
      [{ role: "user", content: makePrompt({ featureGoal, targetUsers, constraints }) }],
      undefined,
    );
    res.status(200).json(normalizeResult(raw));
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Spec generation failed.",
    });
  }
}
