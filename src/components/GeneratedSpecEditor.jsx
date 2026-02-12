import { Download, ArrowUp, ArrowDown } from "lucide-react";

export default function GeneratedSpecEditor({
  spec,
  onUpdateStory,
  onUpdateTask,
  onUpdateRisk,
  onMoveTask,
  onExportMarkdown,
}) {
  if (!spec) return null;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card sm:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Generated Specification</h2>
          <p className="text-sm text-slate-600">Edit content inline and reorder engineering tasks.</p>
        </div>
        <button
          type="button"
          onClick={onExportMarkdown}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-brand-400 hover:text-brand-700"
        >
          <Download size={16} />
          Export Markdown
        </button>
      </div>

      <SectionList
        title="User Stories"
        items={spec.userStories}
        onChange={onUpdateStory}
        withReorder={false}
      />

      <SectionList
        title="Engineering Tasks"
        items={spec.engineeringTasks}
        onChange={onUpdateTask}
        withReorder
        onMoveItem={onMoveTask}
      />

      <SectionList
        title="Risks & Unknowns"
        items={spec.risksUnknowns}
        onChange={onUpdateRisk}
        withReorder={false}
      />
    </section>
  );
}

function SectionList({ title, items, onChange, withReorder, onMoveItem }) {
  return (
    <div className="mb-6 last:mb-0">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-600">{title}</h3>
      <div className="space-y-2">
        {items.map((item, idx) => (
          <div key={`${title}-${idx}`} className="flex items-start gap-2">
            <textarea
              value={item}
              onChange={(e) => onChange(idx, e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-brand-400 transition focus:border-brand-500 focus:ring-2"
            />
            {withReorder && (
              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => onMoveItem(idx, "up")}
                  disabled={idx === 0}
                  className="rounded-md border border-slate-300 p-1 text-slate-600 transition hover:border-brand-400 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ArrowUp size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => onMoveItem(idx, "down")}
                  disabled={idx === items.length - 1}
                  className="rounded-md border border-slate-300 p-1 text-slate-600 transition hover:border-brand-400 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ArrowDown size={14} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
