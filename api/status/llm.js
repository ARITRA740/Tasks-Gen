import { callOpenAI } from "../_shared.js";

export default async function handler(_req, res) {
  try {
    await callOpenAI([{ role: "user", content: "Return valid JSON: {\"ok\":true}" }], 20);
    res.status(200).json({ ok: true });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : "LLM health check failed.",
    });
  }
}
