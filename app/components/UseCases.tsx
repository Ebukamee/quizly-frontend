import AnimateIn from "./AnimateIn";

const useCases = [
  { label: "Students", text: "Turn lecture slides into practice exams the night before a test." },
  { label: "Teachers", text: "Draft quiz questions from lesson plans in seconds, not hours." },
  { label: "Professionals", text: "Test your team's retention of training documents and SOPs." },
  { label: "Researchers", text: "Self-test on dense academic papers and retain more of what you read." },
];

export default function UseCases() {
  return (
    <section className="border-t border-zinc-100 px-6 py-24 dark:border-zinc-900">
      <div className="mx-auto max-w-5xl">
        <AnimateIn className="mb-16">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-zinc-400">Use cases</p>
          <h2 className="max-w-sm text-3xl font-bold tracking-tight text-black dark:text-white sm:text-4xl">
            Who is it for?
          </h2>
        </AnimateIn>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {useCases.map((u, i) => (
            <AnimateIn key={u.label} delay={i * 80} className="rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800">
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-black dark:text-white">{u.label}</p>
              <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{u.text}</p>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
