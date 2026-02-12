const API_BASE = import.meta.env.VITE_API_BASE || "";

export async function generateSpec({ featureGoal, targetUsers, constraints }) {
  const response = await fetch(`${API_BASE}/api/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ featureGoal, targetUsers, constraints }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Spec generation failed (${response.status}): ${errText}`);
  }

  return response.json();
}

export async function testLlmConnection() {
  const response = await fetch(`${API_BASE}/api/status/llm`);

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`LLM connection failed (${response.status}): ${errText}`);
  }

  return true;
}
