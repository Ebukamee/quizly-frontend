"use client";

type Props = {
  data: Record<string, number>;
  title?: string;
};

function getColor(count: number, dark: boolean) {
  if (count === 0) return dark ? "bg-zinc-800" : "bg-zinc-100";
  if (count === 1) return dark ? "bg-green-900" : "bg-green-200";
  if (count <= 3) return dark ? "bg-green-700" : "bg-green-400";
  return dark ? "bg-green-500" : "bg-green-600";
}

const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WEEKS = 13;

export default function Heatmap({ data, title }: Props) {
  // Build grid: 13 weeks × 7 days ending today
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Find the Sunday at the start of the current week
  const endOfGrid = new Date(today);
  endOfGrid.setDate(endOfGrid.getDate() + (6 - endOfGrid.getDay())); // next Saturday

  const startOfGrid = new Date(endOfGrid);
  startOfGrid.setDate(startOfGrid.getDate() - WEEKS * 7 + 1);

  // Build cells
  const weeks: { date: Date; count: number; key: string }[][] = [];
  const current = new Date(startOfGrid);

  for (let w = 0; w < WEEKS; w++) {
    const week: { date: Date; count: number; key: string }[] = [];
    for (let d = 0; d < 7; d++) {
      const key = current.toISOString().split("T")[0];
      const isFuture = current > today;
      week.push({
        date: new Date(current),
        count: isFuture ? -1 : (data[key] || 0),
        key,
      });
      current.setDate(current.getDate() + 1);
    }
    weeks.push(week);
  }

  // Month labels
  const monthLabels: { label: string; col: number }[] = [];
  let lastMonth = -1;
  for (let w = 0; w < weeks.length; w++) {
    const firstDay = weeks[w][0].date;
    const month = firstDay.getMonth();
    if (month !== lastMonth) {
      monthLabels.push({ label: MONTHS[month], col: w });
      lastMonth = month;
    }
  }

  // Detect dark mode via class on <html>
  const isDark = typeof document !== "undefined" && document.documentElement.classList.contains("dark");

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      {title && (
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-400">{title}</p>
      )}

      <div className="overflow-x-auto">
        {/* Month labels */}
        <div className="flex" style={{ paddingLeft: 28 }}>
          {monthLabels.map((m, i) => {
            const nextCol = i < monthLabels.length - 1 ? monthLabels[i + 1].col : WEEKS;
            const span = nextCol - m.col;
            return (
              <div key={`${m.label}-${m.col}`} className="text-[10px] text-zinc-400" style={{ width: span * 14, minWidth: span * 14, flexShrink: 0 }}>
                {m.label}
              </div>
            );
          })}
        </div>

        {/* Grid */}
        <div className="flex gap-0.5 mt-1">
          {/* Day labels */}
          <div className="flex flex-col gap-0.5 pr-1.5" style={{ width: 24 }}>
            {DAY_LABELS.map((label, i) => (
              <div key={i} className="flex h-[10px] items-center text-[9px] leading-none text-zinc-400">
                {label}
              </div>
            ))}
          </div>

          {/* Weeks */}
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-0.5">
              {week.map((cell) => (
                <div
                  key={cell.key}
                  title={cell.count >= 0 ? `${cell.date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}: ${cell.count} quiz${cell.count !== 1 ? "zes" : ""}` : ""}
                  className={`h-[10px] w-[10px] rounded-[2px] ${
                    cell.count < 0
                      ? "bg-transparent"
                      : getColor(cell.count, isDark)
                  }`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-3 flex items-center justify-end gap-1.5 text-[10px] text-zinc-400">
        <span>Less</span>
        <div className={`h-[10px] w-[10px] rounded-[2px] ${getColor(0, isDark)}`} />
        <div className={`h-[10px] w-[10px] rounded-[2px] ${getColor(1, isDark)}`} />
        <div className={`h-[10px] w-[10px] rounded-[2px] ${getColor(2, isDark)}`} />
        <div className={`h-[10px] w-[10px] rounded-[2px] ${getColor(4, isDark)}`} />
        <span>More</span>
      </div>
    </div>
  );
}
