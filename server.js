import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT || 8787);
const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const MODEL = "gpt-4o-mini";

app.use(express.json({ limit: "1mb" }));

function getApiKey() {
  return process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY;
}

function normalizeResult(parsed) {
  return {
    userStories: Array.isArray(parsed.userStories) ? parsed.userStories : [],
    engineeringTasks: Array.isArray(parsed.engineeringTasks) ? parsed.engineeringTasks : [],
    risksUnknowns: Array.isArray(parsed.risksUnknowns) ? parsed.risksUnknowns : [],
  };
}

function makePrompt({ featureGoal, targetUsers, constraints }) {
  return `
You are a senior product and engineering planner.
Return ONLY JSON (no prose, no markdown) with this exact shape:
{
  "userStories": ["..."],
  "engineeringTasks": ["..."],
  "risksUnknowns": ["..."]
}

Inputs:
- Feature Goal: ${featureGoal}
- Target Users: ${targetUsers}
- Constraints: ${constraints}

Rules:
- 5-8 concise user stories in "As a ..., I want ..., so that ..." format.
- 8-14 actionable engineering tasks with implementation details.
- 4-8 realistic risks/unknowns.
- No duplicate items.
`.trim();
}

async function callOpenAI(messages, maxTokens) {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("Missing OPENAI_API_KEY on server.");
  }

  const response = await fetch(OPENAI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.3,
      response_format: { type: "json_object" },
      messages,
      ...(maxTokens ? { max_tokens: maxTokens } : {}),
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenAI request failed (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("OpenAI response did not include content.");
  }

  return JSON.parse(content);
}

app.get("/api/status/llm", async (_req, res) => {
  try {
    await callOpenAI([{ role: "user", content: "Return valid JSON: {\"ok\":true}" }], 20);
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : "LLM health check failed.",
    });
  }
});

app.post("/api/generate", async (req, res) => {
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
    res.json(normalizeResult(raw));
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Spec generation failed.",
    });
  }
});

const distPath = path.join(__dirname, "dist");
app.use(express.static(distPath));
app.get("*", (_req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(port, () => {
  console.log(`Task Generator server running on http://localhost:${port}`);
});
