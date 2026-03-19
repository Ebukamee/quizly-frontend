"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchUserAttempts } from "../utilis/helper";
import Spinner from "../components/Spinner";

function scorePill(score: number) {
  if (score >= 70) return "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400";
  if (score >= 50) return "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400";
  return "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400";
}

// SAFE DATE FORMATTER
function safeFormatDate(dateInput?: string | Date) {
  if (!dateInput) return "Unknown Date";
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return "Unknown Date";
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

const formatMap: Record<string, string> = {
  MCQ: "MCQ",
  SUBJECTIVE: "Subjective",
  THEORY: "Essay",
  MATH: "Maths",
};

export default function AttemptsPage() {
  const [loading, setLoading] = useState(true);
  const [attempts, setAttempts] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const data = await fetchUserAttempts();
      if (data && Array.isArray(data)) {
        const sorted = [...data].sort(
          (a: any, b: any) => new Date(b.completedAt || 0).getTime() - new Date(a.completedAt || 0).getTime()
        );
        setAttempts(sorted);
      }
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold tracking-tight text-black dark:text-white">Attempts</h1>
        <p className="mt-0.5 text-sm text-zinc-500">{attempts.length} quiz attempts recorded</p>
      </div>

      {attempts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-200 py-12 text-center text-zinc-500 dark:border-zinc-800">
          No attempts yet. Complete a quiz to see your results here!
        </div>
      ) : (
        <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          {/* Table header — desktop */}
          <div className="hidden border-b border-zinc-100 px-5 py-3 dark:border-zinc-800 sm:grid sm:grid-cols-[1fr_auto_auto_auto_auto] sm:gap-4">
            {["Subject & Quiz", "Type", "Visibility", "Score", "Date"].map((h) => (
              <p key={h} className="text-xs font-semibold uppercase tracking-widest text-zinc-400">{h}</p>
            ))}
          </div>

          <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {attempts.map((a) => (
              <li key={a.id}>
                <Link
                  href={`/attempts/${a.id}`}
                  className="flex items-center justify-between px-3 py-3 transition-all duration-150 hover:bg-zinc-50 hover:pl-4 sm:px-5 sm:py-4 sm:hover:pl-6 dark:hover:bg-zinc-800/50 sm:grid sm:grid-cols-[1fr_auto_auto_auto_auto] sm:gap-4"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-black dark:text-white">
                      {a.quiz?.title || "Untitled Quiz"}
                      {a.quiz?.isPublic && a.studentName && <span className="ml-2 text-xs font-normal text-zinc-400">by {a.studentName}</span>}
                    </p>
                    <p className="text-xs text-zinc-400">{a.quiz?.subject?.name || "General"}</p>
                  </div>
                  <span className="hidden rounded-md border border-zinc-200 px-2.5 py-0.5 text-xs text-zinc-500 dark:border-zinc-700 dark:text-zinc-400 sm:inline-flex">
                    {formatMap[a.quizType] || a.quizType || "Standard"}
                  </span>
                  <span className={`hidden rounded-md border px-2.5 py-0.5 text-xs font-medium sm:inline-flex ${a.quiz?.isPublic ? "border-green-200 bg-green-50 text-green-600 dark:border-green-800 dark:bg-green-900/30 dark:text-green-400" : "border-zinc-200 bg-zinc-50 text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800"}`}>
                    {a.quiz?.isPublic ? "Public" : "Private"}
                  </span>
                  <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${scorePill(a.scorePercent ?? a.totalScore ?? 0)}`}>
                    {/* Fallback to totalScore if scorePercent is missing for older records */}
                    {a.scorePercent ?? (a.totalScore && a.totalPossible ? Math.round((a.totalScore / a.totalPossible) * 100) : 0)}%
                  </span>
                  <span className="hidden text-xs text-zinc-400 sm:inline">
                    {safeFormatDate(a.completedAt)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}