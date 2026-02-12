import { describe, expect, it, vi, afterEach } from "vitest";
import { generateSpec } from "./api";

describe("api utility", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns parsed JSON from backend response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          userStories: ["story"],
          engineeringTasks: ["task"],
          risksUnknowns: ["risk"],
        }),
      }),
    );

    const out = await generateSpec({
      featureGoal: "a",
      targetUsers: "b",
      constraints: "c",
    });

    expect(out.engineeringTasks[0]).toBe("task");
  });

  it("throws on backend failure", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        text: async () => "boom",
      }),
    );

    await expect(
      generateSpec({ featureGoal: "a", targetUsers: "b", constraints: "c" }),
    ).rejects.toThrow("Spec generation failed (500): boom");
  });
});
