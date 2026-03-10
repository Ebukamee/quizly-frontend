type Segment = { label: string; value: number; color: string };

type Props = {
  segments: Segment[];
  title?: string;
};

export default function DonutChart({ segments, title }: Props) {
  const total = segments.reduce((s, d) => s + d.value, 0);
  const r = 52;
  const cx = 70;
  const cy = 70;
  const circumference = 2 * Math.PI * r;

  let cumulative = 0;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      {title && (
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-400">{title}</p>
      )}
      <div className="flex items-center gap-6">
        <svg width="140" height="140" viewBox="0 0 140 140" className="shrink-0">
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="currentColor" strokeOpacity={0.08} strokeWidth={18} />
          {segments.map((seg, i) => {
            const segLength = (seg.value / total) * circumference;
            const offset = circumference - cumulative * (circumference / total);
            cumulative += seg.value;
            return (
              <circle
                key={i}
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke={seg.color}
                strokeWidth={18}
                strokeDasharray={`${segLength} ${circumference - segLength}`}
                strokeDashoffset={offset}
                transform={`rotate(-90 ${cx} ${cy})`}
                strokeLinecap="butt"
              />
            );
          })}
          <text x={cx} y={cy - 6} textAnchor="middle" fontSize={18} fontWeight="700" fill="currentColor">
            {total}
          </text>
          <text x={cx} y={cy + 12} textAnchor="middle" fontSize={9} fill="currentColor" opacity={0.4}>
            total
          </text>
        </svg>

        <ul className="flex flex-col gap-2.5">
          {segments.map((seg) => (
            <li key={seg.label} className="flex items-center gap-2 text-xs">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: seg.color }} />
              <span className="text-zinc-500 dark:text-zinc-400">{seg.label}</span>
              <span className="ml-auto pl-4 font-semibold text-black dark:text-white">{seg.value}%</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
