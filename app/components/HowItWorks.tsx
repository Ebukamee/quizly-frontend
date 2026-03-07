import AnimateIn from "./AnimateIn";

const steps = [
  {
    n: "1",
    title: "Upload your document",
    body: "Drop a PDF, Word doc, or paste raw text. Lecture notes, research papers, training manuals — anything.",
  },
  {
    n: "2",
    title: "AI writes the questions",
    body: "Our model reads your content and crafts targeted questions — multiple choice, short answer, or true/false.",
  },
  {
    n: "3",
    title: "Get graded instantly",
    body: "Submit your answers and receive AI feedback with direct citations from your original document.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <AnimateIn>
          <div className="mb-16">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-zinc-400">How it works</p>
            <h2 className="max-w-md text-3xl font-bold tracking-tight text-black dark:text-white sm:text-4xl">
              From document to graded quiz in under a minute
            </h2>
          </div>
        </AnimateIn>

        <div className="relative grid gap-10 sm:grid-cols-3 sm:gap-6">
          {/* Dashed connector line (desktop only) */}
          <div className="absolute left-[calc(16.5%+24px)] right-[calc(16.5%+24px)] top-6 hidden border-t border-dashed border-zinc-200 dark:border-zinc-800 sm:block" />

          {steps.map((s, i) => (
            <AnimateIn key={s.n} delay={i * 120} className="relative flex flex-col gap-5">
              <div className="z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 border-zinc-200 bg-white text-sm font-bold text-black dark:border-zinc-800 dark:bg-black dark:text-white">
                {s.n}
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-black dark:text-white">{s.title}</h3>
                <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{s.body}</p>
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
