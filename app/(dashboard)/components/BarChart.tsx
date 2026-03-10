type DataPoint = { label: string; value: number };

type Props = {
  data: DataPoint[];
  title?: string;
};

export default function BarChart({ data, title }: Props) {
  const max = Math.max(...data.map((d) => d.value));
  const W = 420;
  const H = 160;
  const paddingLeft = 24;
  const paddingBottom = 28;
  const paddingTop = 12;
  const chartW = W - paddingLeft - 8;
  const chartH = H - paddingBottom - paddingTop;
  const barW = Math.floor(chartW / data.length) - 6;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      {title && (
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-400">{title}</p>
      )}
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" className="overflow-visible">
        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
          const y = paddingTop + chartH * (1 - ratio);
          return (
            <g key={ratio}>
              <line x1={paddingLeft} y1={y} x2={W - 8} y2={y} stroke="currentColor" strokeOpacity={0.08} strokeWidth={1} />
              <text x={paddingLeft - 4} y={y + 4} textAnchor="end" fontSize={9} fill="currentColor" opacity={0.35}>
                {Math.round(max * ratio)}
              </text>
            </g>
          );
        })}
        {data.map((d, i) => {
          const barH = max > 0 ? (d.value / max) * chartH : 0;
          const x = paddingLeft + (chartW / data.length) * i + 3;
          const y = paddingTop + chartH - barH;
          return (
            <g key={d.label}>
              <rect x={x} y={y} width={barW} height={barH} rx={3} className="fill-black dark:fill-white" opacity={0.85} />
              <text x={x + barW / 2} y={H - 6} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.45}>
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
