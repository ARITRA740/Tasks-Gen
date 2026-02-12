import { Clock3 } from "lucide-react";

export default function HistorySidebar({ history, onLoad }) {
  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card sm:p-5">
      <div className="mb-4 flex items-center gap-2">
        <Clock3 size={16} className="text-brand-700" />
        <h3 className="text-sm font-semibold text-slate-900">Recent Specs</h3>
      </div>

      {history.length === 0 ? (
        <p className="text-sm text-slate-500">No generated specs yet.</p>
      ) : (
        <ul className="space-y-2">
          {history.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onLoad(item)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-left transition hover:border-brand-300 hover:bg-brand-50"
              >
                <p className="truncate text-sm font-medium text-slate-900">{item.featureGoal}</p>
                <p className="mt-0.5 text-xs text-slate-500">{new Date(item.createdAt).toLocaleString()}</p>
              </button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
