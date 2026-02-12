import { Sparkles } from "lucide-react";

const initialForm = {
  featureGoal: "",
  targetUsers: "",
  constraints: "",
};

export default function SpecForm({ onGenerate, loading, initialValue }) {
  const form = initialValue ?? initialForm;

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate(form);
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card sm:p-6">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-slate-900">Create a Feature Spec</h2>
        <p className="mt-1 text-sm text-slate-600">
          Define the intent and constraints, then generate implementable tasks.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <Field
          id="featureGoal"
          label="Feature Goal"
          placeholder="Example: Add role-based access control to admin dashboards"
          value={form.featureGoal}
          onChange={(v) => form.setFeatureGoal?.(v)}
        />
        <Field
          id="targetUsers"
          label="Target Users"
          placeholder="Example: Product admins, support managers, and auditors"
          value={form.targetUsers}
          onChange={(v) => form.setTargetUsers?.(v)}
        />
        <TextAreaField
          id="constraints"
          label="Constraints"
          placeholder="Example: Must ship in 3 sprints, no schema-breaking DB migrations, WCAG AA"
          value={form.constraints}
          onChange={(v) => form.setConstraints?.(v)}
        />

        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          <Sparkles size={16} />
          {loading ? "Generating..." : "Generate Plan"}
        </button>
      </form>
    </section>
  );
}

function Field({ id, label, placeholder, value, onChange }) {
  return (
    <label htmlFor={id} className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span>
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-brand-400 transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-2"
      />
    </label>
  );
}

function TextAreaField({ id, label, placeholder, value, onChange }) {
  return (
    <label htmlFor={id} className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-brand-400 transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-2"
      />
    </label>
  );
}
