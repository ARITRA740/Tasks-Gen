import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { isLocalStorageAccessible } from "../utils/storage";
import { testLlmConnection } from "../utils/api";

export default function StatusPage() {
  const [checks, setChecks] = useState({
    frontend: { status: "pending", detail: "" },
    localStorage: { status: "pending", detail: "" },
    llm: { status: "pending", detail: "" },
  });

  useEffect(() => {
    let active = true;

    async function runChecks() {
      if (!active) return;

      setChecks((prev) => ({
        ...prev,
        frontend: { status: "ok", detail: "React application loaded successfully." },
      }));

      const localStorageOk = isLocalStorageAccessible();
      setChecks((prev) => ({
        ...prev,
        localStorage: localStorageOk
          ? { status: "ok", detail: "LocalStorage is readable and writable." }
          : { status: "fail", detail: "LocalStorage is not accessible in this environment." },
      }));

      try {
        await testLlmConnection();
        if (active) {
          setChecks((prev) => ({
            ...prev,
            llm: { status: "ok", detail: "OpenAI API request completed." },
          }));
        }
      } catch (error) {
        if (active) {
          setChecks((prev) => ({
            ...prev,
            llm: { status: "fail", detail: error.message || "LLM connection test failed." },
          }));
        }
      }
    }

    runChecks();
    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold text-slate-900">System Status</h1>
          <Link
            to="/"
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 transition hover:border-brand-400 hover:text-brand-700"
          >
            Back to Planner
          </Link>
        </div>

        <div className="space-y-3">
          <StatusCard label="Frontend" check={checks.frontend} />
          <StatusCard label="LocalStorage" check={checks.localStorage} />
          <StatusCard label="LLM Connection" check={checks.llm} />
        </div>
      </div>
    </main>
  );
}

function StatusCard({ label, check }) {
  const icon =
    check.status === "ok" ? (
      <CheckCircle2 size={18} className="text-emerald-600" />
    ) : check.status === "fail" ? (
      <XCircle size={18} className="text-rose-600" />
    ) : (
      <Loader2 size={18} className="animate-spin text-slate-500" />
    );

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="text-sm font-semibold text-slate-900">{label}</h2>
      </div>
      <p className="mt-1.5 text-sm text-slate-600">{check.detail || "Running check..."}</p>
    </div>
  );
}
