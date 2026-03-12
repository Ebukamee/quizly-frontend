import Link from "next/link";
import { attempts } from "../lib/mockData";

function scorePill(score: number) {
  if (score >= 70) return "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400";
  if (score >= 50) return "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400";
  return "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400";
}

const sorted = [...attempts].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
);

export default function AttemptsPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold tracking-tight text-black dark:text-white">Attempts</h1>
        <p className="mt-0.5 text-sm text-zinc-500">{attempts.length} quiz attempts recorded</p>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        {/* Table header — desktop */}
        <div className="hidden border-b border-zinc-100 px-5 py-3 dark:border-zinc-800 sm:grid sm:grid-cols-[1fr_auto_auto_auto] sm:gap-4">
          {["Subject & Quiz", "Format", "Score", "Date"].map((h) => (
            <p key={h} className="text-xs font-semibold uppercase tracking-widest text-zinc-400">{h}</p>
          ))}
        </div>

        <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {sorted.map((a) => (
            <li key={a.id}>
              <Link
                href={`/attempts/${a.id}`}
                className="flex items-center justify-between px-3 py-3 transition-all duration-150 hover:bg-zinc-50 hover:pl-4 sm:px-5 sm:py-4 sm:hover:pl-6 dark:hover:bg-zinc-800/50 sm:grid sm:grid-cols-[1fr_auto_auto_auto] sm:gap-4"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-black dark:text-white">{a.quizTitle}</p>
                  <p className="text-xs text-zinc-400">{a.subjectName}</p>
                </div>
                <span className="hidden rounded-md border border-zinc-200 px-2.5 py-0.5 text-xs text-zinc-500 dark:border-zinc-700 dark:text-zinc-400 sm:inline-flex">
                  {a.format}
                </span>
                <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${scorePill(a.score)}`}>
                  {a.score}%
                </span>
                <span className="hidden text-xs text-zinc-400 sm:inline">{a.date}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
