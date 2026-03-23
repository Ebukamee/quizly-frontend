"use client";

import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Filler,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Filler);

type DataPoint = { label: string; value: number };

type Props = {
  data: DataPoint[];
  title?: string;
  suffix?: string;
};

const barColors = [
  "#6366f1", // indigo
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#f43f5e", // rose
  "#f97316", // orange
  "#eab308", // yellow
  "#22c55e", // green
];

export default function BarChart({ data, title, suffix = "quizzes" }: Props) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setDark(mq.matches);
    const handler = (e: MediaQueryListEvent) => setDark(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        data: data.map((d) => d.value),
        backgroundColor: data.map((_, i) => barColors[i % barColors.length]),
        hoverBackgroundColor: data.map((_, i) => barColors[i % barColors.length] + "cc"),
        borderRadius: 3,
        borderSkipped: false as const,
        barPercentage: 0.65,
        categoryPercentage: 0.75,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 600, easing: "easeOutQuart" as const },
    plugins: {
      tooltip: {
        backgroundColor: dark ? "#27272a" : "#18181b",
        titleColor: "#fff",
        bodyColor: "#a1a1aa",
        borderColor: dark ? "#3f3f46" : "#27272a",
        borderWidth: 1,
        cornerRadius: 6,
        padding: 10,
        titleFont: { size: 12, weight: 600 as const },
        bodyFont: { size: 11 },
        displayColors: true,
        boxWidth: 8,
        boxHeight: 8,
        usePointStyle: true,
        callbacks: {
          title: (items: { label: string }[]) => items[0]?.label ?? "",
          label: (item: { raw: unknown }) => ` ${item.raw}${suffix === "%" ? "%" : ` ${suffix}`}`,
        },
      },
    },
    scales: {
      x: {
        border: { display: false },
        grid: { display: false },
        ticks: {
          color: "#a1a1aa",
          font: { size: 11 },
          padding: 4,
        },
      },
      y: {
        border: { display: false },
        grid: {
          color: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
        },
        ticks: {
          color: "#a1a1aa",
          font: { size: 10 },
          padding: 8,
          stepSize: 2,
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      {title && (
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-400">{title}</p>
      )}
      <div className="h-[180px]">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}
