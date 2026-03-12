import AnimateIn from "./AnimateIn";

const steps = [
  {
    n: "1",
    title: "Create a subject & add documents",
    body: "Organise your study material into subjects. Upload your lecture notes, textbooks, or any PDF — as many documents as you need.",
  },
  {
    n: "2",
    title: "Generate a quiz your way",
    body: "Choose your format — MCQ, subjective, theory/essay, or maths & calculations. AI builds the questions directly from your documents.",
  },
  {
    n: "3",
    title: "Study privately or share publicly",
    body: "Take the quiz yourself, or make it public and share a link with classmates. AI grades every answer against your source material.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <AnimateIn>
          <div className="mb-16">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-zinc-400">How it works</p>
            <h2 className="max-w-md font-display text-3xl font-bold tracking-tight text-black dark:text-white sm:text-4xl">
              From documents to graded quizzes in minutes
            </h2>
          </div>
        </AnimateIn>

        <div className="relative grid gap-10 sm:grid-cols-3 sm:gap-6">
          <div className="absolute left-[calc(16.5%+24px)] right-[calc(16.5%+24px)] top-6 hidden border-t border-dashed border-zinc-200 dark:border-zinc-800 sm:block" />

          {steps.map((s, i) => (
            <AnimateIn key={s.n} delay={i * 120} className="relative flex flex-col gap-5">
              <div className="z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 border-zinc-200 bg-white text-sm font-bold text-black dark:border-zinc-800 dark:bg-black dark:text-white">
                {s.n}
              </div>
              <div>
                <h3 className="mb-2 font-display font-semibold text-black dark:text-white">{s.title}</h3>
                <p className="font-body text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{s.body}</p>
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
