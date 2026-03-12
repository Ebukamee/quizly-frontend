"use client";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

type Segment = { label: string; value: number; color: string };

type Props = {
  segments: Segment[];
  title?: string;
};

export default function DonutChart({ segments, title }: Props) {
  const total = segments.reduce((s, d) => s + d.value, 0);

  const chartData = {
    labels: segments.map((s) => s.label),
    datasets: [
      {
        data: segments.map((s) => s.value),
        backgroundColor: segments.map((s) => s.color),
        borderColor: "transparent",
        borderWidth: 0,
        hoverBorderColor: "#fff",
        hoverBorderWidth: 2,
        spacing: 3,
        borderRadius: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "65%",
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#18181b",
        titleColor: "#fff",
        bodyColor: "#a1a1aa",
        borderColor: "#27272a",
        borderWidth: 1,
        cornerRadius: 6,
        padding: 10,
        titleFont: { size: 12, weight: 600 as const },
        bodyFont: { size: 11 },
        displayColors: true,
        boxWidth: 8,
        boxHeight: 8,
        boxPadding: 4,
        usePointStyle: true,
        callbacks: {
          label: (item: { label: string; raw: unknown }) => ` ${item.label}: ${item.raw}%`,
        },
      },
    },
  };

  const centerTextPlugin = {
    id: "centerText",
    afterDraw(chart: ChartJS) {
      const { ctx, chartArea } = chart;
      if (!chartArea) return;
      const centerX = (chartArea.left + chartArea.right) / 2;
      const centerY = (chartArea.top + chartArea.bottom) / 2;

      ctx.save();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      ctx.font = "bold 20px system-ui, sans-serif";
      ctx.fillStyle = getComputedStyle(chart.canvas).color || "#000";
      ctx.fillText(String(total), centerX, centerY - 8);

      ctx.font = "400 10px system-ui, sans-serif";
      ctx.fillStyle = "#a1a1aa";
      ctx.fillText("total", centerX, centerY + 10);
      ctx.restore();
    },
  };

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      {title && (
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-400">{title}</p>
      )}
      <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:gap-6">
        <div className="h-[140px] w-[140px] shrink-0">
          <Doughnut data={chartData} options={options} plugins={[centerTextPlugin]} />
        </div>

        <ul className="flex flex-wrap justify-center gap-x-4 gap-y-2.5 sm:flex-col sm:gap-x-0">
          {segments.map((seg) => (
            <li key={seg.label} className="flex items-center gap-2 text-xs">
              <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: seg.color }} />
              <span className="text-zinc-500 dark:text-zinc-400">{seg.label}</span>
              <span className="ml-auto pl-4 font-semibold text-black dark:text-white">{seg.value}%</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
