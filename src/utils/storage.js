const HISTORY_KEY = "task_generator_history_v1";
const MAX_HISTORY = 5;

export function isLocalStorageAccessible() {
  try {
    const key = "__task_gen_test__";
    localStorage.setItem(key, "ok");
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

export function getHistory() {
  if (!isLocalStorageAccessible()) return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveToHistory(specEntry) {
  if (!isLocalStorageAccessible()) return [];

  const history = getHistory();
  const updated = [specEntry, ...history].slice(0, MAX_HISTORY);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  return updated;
}
