import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, ClipboardList } from "lucide-react";
import SpecForm from "./SpecForm";
import GeneratedSpecEditor from "./GeneratedSpecEditor";
import HistorySidebar from "./HistorySidebar";
import { generateSpec } from "../utils/api";
import { getHistory, saveToHistory } from "../utils/storage";

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function toMarkdown(entry) {
  const lines = [
    `# Task Generator Spec`,
    ``,
    `## Inputs`,
    `- **Feature Goal:** ${entry.featureGoal}`,
    `- **Target Users:** ${entry.targetUsers}`,
    `- **Constraints:** ${entry.constraints}`,
    ``,
    `## User Stories`,
    ...entry.result.userStories.map((s, i) => `${i + 1}. ${s}`),
    ``,
    `## Engineering Tasks`,
    ...entry.result.engineeringTasks.map((t, i) => `${i + 1}. ${t}`),
    ``,
    `## Risks & Unknowns`,
    ...entry.result.risksUnknowns.map((r, i) => `${i + 1}. ${r}`),
    ``,
    `Generated: ${new Date(entry.createdAt).toLocaleString()}`,
  ];

  return lines.join("\n");
}

export default function HomePage() {
  const [featureGoal, setFeatureGoal] = useState("");
  const [targetUsers, setTargetUsers] = useState("");
  const [constraints, setConstraints] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeSpec, setActiveSpec] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const formState = useMemo(
    () => ({
      featureGoal,
      targetUsers,
      constraints,
      setFeatureGoal,
      setTargetUsers,
      setConstraints,
    }),
    [featureGoal, targetUsers, constraints],
  );

  const handleGenerate = async (values) => {
    setError("");

    if (!values.featureGoal.trim() || !values.targetUsers.trim() || !values.constraints.trim()) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    try {
      const result = await generateSpec(values);

      const entry = {
        id: makeId(),
        createdAt: new Date().toISOString(),
        featureGoal: values.featureGoal.trim(),
        targetUsers: values.targetUsers.trim(),
        constraints: values.constraints.trim(),
        result,
      };

      setActiveSpec(entry);
      setHistory(saveToHistory(entry));
    } catch (apiError) {
      setError(apiError.message || "Generation failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const loadSpecFromHistory = (entry) => {
    setFeatureGoal(entry.featureGoal);
    setTargetUsers(entry.targetUsers);
    setConstraints(entry.constraints);
    setActiveSpec(entry);
    setError("");
  };

  const updateActiveSpec = (next) => {
    setActiveSpec(next);
    setHistory((prev) => {
      const updated = prev.map((item) => (item.id === next.id ? next : item));
      localStorage.setItem("task_generator_history_v1", JSON.stringify(updated.slice(0, 5)));
      return updated;
    });
  };

  const updateListItem = (key, idx, value) => {
    if (!activeSpec) return;
    const next = { ...activeSpec, result: { ...activeSpec.result } };
    next.result[key] = [...next.result[key]];
    next.result[key][idx] = value;
    updateActiveSpec(next);
  };

  const moveTask = (idx, direction) => {
    if (!activeSpec) return;
    const tasks = [...activeSpec.result.engineeringTasks];
    const nextIdx = direction === "up" ? idx - 1 : idx + 1;
    if (nextIdx < 0 || nextIdx >= tasks.length) return;
    [tasks[idx], tasks[nextIdx]] = [tasks[nextIdx], tasks[idx]];
    updateActiveSpec({
      ...activeSpec,
      result: { ...activeSpec.result, engineeringTasks: tasks },
    });
  };

  const exportMarkdown = () => {
    if (!activeSpec) return;
    const blob = new Blob([toMarkdown(activeSpec)], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `feature-spec-${activeSpec.id}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-brand-50 via-slate-50 to-slate-100">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <header className="mb-6 rounded-2xl border border-brand-100 bg-white/90 p-5 shadow-card sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-800">
                <ClipboardList size={14} />
                Task Generator & Feature Planner
              </p>
              <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
                Turn product ideas into shippable engineering plans
              </h1>
              <p className="mt-2 max-w-3xl text-sm text-slate-600 sm:text-base">
                Provide your goal, users, and constraints. The planner generates user stories,
                engineering tasks, and risks, then lets you edit, reorder, and export.
              </p>
            </div>
            <Link
              to="/status"
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-brand-400 hover:text-brand-700"
            >
              Open Status Page
            </Link>
          </div>
        </header>

        <div className="grid gap-5 lg:grid-cols-[1.9fr_1fr]">
          <div className="space-y-5">
            <SpecForm onGenerate={handleGenerate} loading={loading} initialValue={formState} />

            {error ? (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                <div className="mb-2 flex items-center gap-2 font-medium">
                  <AlertTriangle size={16} />
                  Generation failed
                </div>
                <p>{error}</p>
                <p className="mt-2 text-rose-700/90">Please correct inputs and try again.</p>
              </div>
            ) : null}

            <GeneratedSpecEditor
              spec={activeSpec?.result ? activeSpec.result : null}
              onUpdateStory={(idx, value) => updateListItem("userStories", idx, value)}
              onUpdateTask={(idx, value) => updateListItem("engineeringTasks", idx, value)}
              onUpdateRisk={(idx, value) => updateListItem("risksUnknowns", idx, value)}
              onMoveTask={moveTask}
              onExportMarkdown={exportMarkdown}
            />
          </div>

          <div>
            <HistorySidebar history={history} onLoad={loadSpecFromHistory} />
          </div>
        </div>
      </div>
    </main>
  );
}
