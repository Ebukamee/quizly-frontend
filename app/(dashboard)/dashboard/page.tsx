"use client";

import { stats, attempts, barChartData, donutData } from "../lib/mockData";
import BarChart from "../components/BarChart";
import DonutChart from "../components/DonutChart";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Quiz01Icon,
  ChartLineData01Icon,
  AnalyticsUpIcon,
  BookOpen01Icon,
} from "@hugeicons/core-free-icons";

const statCards = [
  { label: "Total Quizzes", value: stats.totalQuizzes, icon: Quiz01Icon },
  { label: "Attempts", value: stats.totalAttempts, icon: ChartLineData01Icon },
  { label: "Avg Score", value: `${stats.avgScore}%`, icon: AnalyticsUpIcon },
  { label: "Subjects", value: stats.subjects, icon: BookOpen01Icon },
];

function scorePill(score: number) {
  if (score >= 70) return "text-green-600 dark:text-green-400";
  if (score >= 50) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

const recentAttempts = [...attempts]
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .slice(0, 5);

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-black dark:text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-500">Welcome back, here&apos;s your overview</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {statCards.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
              <HugeiconsIcon icon={s.icon} size={15} />
            </div>
            <p className="font-display text-2xl font-bold text-black dark:text-white">{s.value}</p>
            <p className="mt-0.5 text-xs text-zinc-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid gap-4 lg:grid-cols-2">
        <BarChart data={barChartData} title="Quiz activity — last 7 days" />
        <DonutChart segments={donutData} title="Format breakdown" />
      </div>

      {/* Recent attempts */}
      <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3 dark:border-zinc-800">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Recent attempts</p>
          <Link href="/attempts" className="text-xs text-zinc-500 hover:text-black dark:hover:text-white">
            View all →
          </Link>
        </div>
        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {recentAttempts.map((a) => (
            <Link
              key={a.id}
              href={`/attempts/${a.id}`}
              className="flex items-center justify-between px-4 py-3 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-black dark:text-white">{a.quizTitle}</p>
                <p className="text-xs text-zinc-400">{a.subjectName} · {a.format} · {a.date}</p>
              </div>
              <span className={`ml-4 shrink-0 font-display text-sm font-bold ${scorePill(a.score)}`}>
                {a.score}%
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
