"use client";

import { useState, useEffect } from "react";
import Spinner from "../components/Spinner";
import BarChart from "../components/BarChart";
import DonutChart from "../components/DonutChart";
import Heatmap from "../components/Heatmap";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Quiz01Icon,
  ChartLineData01Icon,
  AnalyticsUpIcon,
  BookOpen01Icon,
} from "@hugeicons/core-free-icons";
import { fetchUserAttempts, fetchUserQuizzes, fetchUserSubjects } from "../utilis/helper";

const FORMAT_COLORS: Record<string, string> = {
  MCQ: "#ec4899",
  SUBJECTIVE: "#22c55e",
  THEORY: "#f97316",
  MATH: "#6366f1",
};

const FORMAT_LABELS: Record<string, string> = {
  MCQ: "MCQ",
  SUBJECTIVE: "Subjective",
  THEORY: "Essay",
  MATH: "Maths",
};

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getScore(a: any): number {
  if (a.scorePercent != null) return a.scorePercent;
  if (a.totalScore && a.totalPossible) return Math.round((a.totalScore / a.totalPossible) * 100);
  return 0;
}

function scorePill(score: number) {
  if (score >= 70) return "text-green-600 dark:text-green-400";
  if (score >= 50) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [attempts, setAttempts] = useState<any[]>([]);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const [a, q, s] = await Promise.all([
        fetchUserAttempts(),
        fetchUserQuizzes(),
        fetchUserSubjects(),
      ]);
      if (a && Array.isArray(a)) setAttempts(a);
      if (q && Array.isArray(q)) setQuizzes(q);
      if (s && Array.isArray(s)) setSubjects(s);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <Spinner />;

  // --- Compute Stats ---
  const avgScore = attempts.length > 0
    ? Math.round(attempts.reduce((sum, a) => sum + getScore(a), 0) / attempts.length)
    : 0;

  // Build quizId → questionCount map for "total questions answered"
  const quizCountMap: Record<string, number> = {};
  for (const q of quizzes) {
    quizCountMap[q.id] = q.questionCount || 0;
  }
  const totalQuestions = attempts.reduce((sum, a) => {
    const qId = a.quizId || a.quiz?.id;
    return sum + (quizCountMap[qId] || 0);
  }, 0);

  const statCards = [
    { label: "Avg Score", value: `${avgScore}%`, icon: AnalyticsUpIcon },
    { label: "Questions Answered", value: totalQuestions, icon: ChartLineData01Icon },
    { label: "Quizzes Completed", value: attempts.length, icon: Quiz01Icon },
    { label: "Subjects", value: subjects.length, icon: BookOpen01Icon },
  ];

  // --- Activity Bar (last 7 days) ---
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const last7: Record<string, number> = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    last7[d.toISOString().split("T")[0]] = 0;
  }
  for (const a of attempts) {
    if (!a.completedAt) continue;
    const key = new Date(a.completedAt).toISOString().split("T")[0];
    if (key in last7) last7[key]++;
  }
  const barChartData = Object.entries(last7).map(([dateStr, count]) => ({
    label: DAY_NAMES[new Date(dateStr).getDay()],
    value: count,
  }));

  // --- Format Donut ---
  const formatCounts: Record<string, number> = {};
  for (const a of attempts) {
    const t = a.quizType || "MCQ";
    formatCounts[t] = (formatCounts[t] || 0) + 1;
  }
  const totalAttempts = attempts.length || 1;
  const donutData = Object.entries(formatCounts).map(([type, count]) => ({
    label: FORMAT_LABELS[type] || type,
    value: Math.round((count / totalAttempts) * 100),
    color: FORMAT_COLORS[type] || "#6366f1",
  }));

  // --- Subject Mastery ---
  const subjectScores: Record<string, number[]> = {};
  for (const a of attempts) {
    const name = a.quiz?.subject?.name || "General";
    if (!subjectScores[name]) subjectScores[name] = [];
    subjectScores[name].push(getScore(a));
  }
  const subjectMasteryData = Object.entries(subjectScores).map(([name, scores]) => ({
    label: name,
    value: Math.round(scores.reduce((s, v) => s + v, 0) / scores.length),
  }));

  // --- Format Performance ---
  const formatScores: Record<string, number[]> = {};
  for (const a of attempts) {
    const t = a.quizType || "MCQ";
    const label = FORMAT_LABELS[t] || t;
    if (!formatScores[label]) formatScores[label] = [];
    formatScores[label].push(getScore(a));
  }
  const formatPerfData = Object.entries(formatScores).map(([label, scores]) => ({
    label,
    value: Math.round(scores.reduce((s, v) => s + v, 0) / scores.length),
  }));

  // --- Heatmap Data ---
  const heatmapData: Record<string, number> = {};
  for (const a of attempts) {
    if (!a.completedAt) continue;
    const key = new Date(a.completedAt).toISOString().split("T")[0];
    heatmapData[key] = (heatmapData[key] || 0) + 1;
  }

  // --- Recent Attempts ---
  const recentAttempts = [...attempts]
    .sort((a, b) => new Date(b.completedAt || 0).getTime() - new Date(a.completedAt || 0).getTime())
    .slice(0, 5);

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
            className="card-hover rounded-xl border border-zinc-200 bg-white p-3 sm:p-4 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="mb-2 flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 sm:mb-3 sm:h-8 sm:w-8 dark:border-zinc-700 dark:text-zinc-400">
              <HugeiconsIcon icon={s.icon} size={15} />
            </div>
            <p className="font-display text-xl font-bold text-black sm:text-2xl dark:text-white">{s.value}</p>
            <p className="mt-0.5 text-[11px] text-zinc-500 sm:text-xs">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Activity Heatmap */}
      <Heatmap data={heatmapData} title="Study activity" />

      {/* Charts row 1 */}
      <div className="grid gap-4 md:grid-cols-2">
        <BarChart data={barChartData} title="Quiz activity — last 7 days" />
        <DonutChart segments={donutData.length > 0 ? donutData : [{ label: "None", value: 100, color: "#a1a1aa" }]} title="Format breakdown" />
      </div>

      {/* Charts row 2 */}
      <div className="grid gap-4 md:grid-cols-2">
        {subjectMasteryData.length > 0 ? (
          <BarChart data={subjectMasteryData} title="Subject mastery — avg score %" suffix="%" />
        ) : (
          <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-400">Subject mastery</p>
            <p className="text-sm text-zinc-500">No data yet</p>
          </div>
        )}
        {formatPerfData.length > 0 ? (
          <BarChart data={formatPerfData} title="Format performance — avg score %" suffix="%" />
        ) : (
          <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-400">Format performance</p>
            <p className="text-sm text-zinc-500">No data yet</p>
          </div>
        )}
      </div>

      {/* Recent attempts */}
      <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3 dark:border-zinc-800">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Recent attempts</p>
          <Link href="/attempts" className="text-xs text-zinc-500 hover:text-black dark:hover:text-white">
            View all →
          </Link>
        </div>
        {recentAttempts.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-zinc-500">
            No attempts yet. Complete a quiz to see your results here!
          </div>
        ) : (
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {recentAttempts.map((a) => (
              <Link
                key={a.id}
                href={`/attempts/${a.id}`}
                className="flex items-center justify-between px-4 py-3 transition-all duration-150 hover:bg-zinc-50 hover:pl-5 dark:hover:bg-zinc-800/50"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-black dark:text-white">{a.quiz?.title || "Untitled Quiz"}</p>
                  <p className="text-xs text-zinc-400">
                    {a.quiz?.subject?.name || "General"} · {FORMAT_LABELS[a.quizType] || a.quizType || "Standard"} · {a.completedAt ? new Date(a.completedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" }) : "Recently"}
                  </p>
                </div>
                <span className={`ml-4 shrink-0 font-display text-sm font-bold ${scorePill(getScore(a))}`}>
                  {getScore(a)}%
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
