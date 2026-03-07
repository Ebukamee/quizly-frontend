import AnimateIn from "./AnimateIn";

const stats = [
  { value: "50k+", label: "Documents processed" },
  { value: "2M+", label: "Questions generated" },
  { value: "< 30s", label: "Quiz generation time" },
  { value: "4.9★", label: "Average user rating" },
];

export default function Stats() {
  return (
    <section className="border-y border-zinc-100 py-10 dark:border-zinc-900">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid grid-cols-2 gap-8 text-center sm:grid-cols-4">
          {stats.map((stat, i) => (
            <AnimateIn key={stat.label} delay={i * 80}>
              <p className="text-2xl font-bold tracking-tight text-black dark:text-white">{stat.value}</p>
              <p className="mt-1 text-xs text-zinc-400">{stat.label}</p>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
