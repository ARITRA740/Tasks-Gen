// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest";
import { getHistory, saveToHistory } from "./storage";

function makeEntry(i) {
  return {
    id: `id-${i}`,
    featureGoal: `goal-${i}`,
    targetUsers: `users-${i}`,
    constraints: `constraints-${i}`,
    createdAt: new Date().toISOString(),
    result: { userStories: [], engineeringTasks: [], risksUnknowns: [] },
  };
}

describe("storage history", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("saves and returns latest first", () => {
    saveToHistory(makeEntry(1));
    saveToHistory(makeEntry(2));
    const history = getHistory();
    expect(history[0].id).toBe("id-2");
    expect(history[1].id).toBe("id-1");
  });

  it("keeps only last five", () => {
    for (let i = 1; i <= 7; i += 1) {
      saveToHistory(makeEntry(i));
    }
    const history = getHistory();
    expect(history).toHaveLength(5);
    expect(history[0].id).toBe("id-7");
    expect(history[4].id).toBe("id-3");
  });
});
