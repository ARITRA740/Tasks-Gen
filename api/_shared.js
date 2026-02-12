const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const MODEL = "gpt-4o-mini";

export function getApiKey() {
  return process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY;
}

export function normalizeResult(parsed) {
  return {
    userStories: Array.isArray(parsed.userStories) ? parsed.userStories : [],
    engineeringTasks: Array.isArray(parsed.engineeringTasks) ? parsed.engineeringTasks : [],
    risksUnknowns: Array.isArray(parsed.risksUnknowns) ? parsed.risksUnknowns : [],
  };
}

export function makePrompt({ featureGoal, targetUsers, constraints }) {
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

export async function callOpenAI(messages, maxTokens) {
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
