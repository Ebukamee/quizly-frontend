import AnimateIn from "./AnimateIn";

type Feature = {
  title: string;
  description: string;
  wide: boolean;
  icon: React.ReactNode;
};

const features: Feature[] = [
  {
    wide: true,
    title: "4 quiz formats — one platform",
    description:
      "MCQ, subjective, theory/essay, or maths & calculations. Choose the format that matches your exam style and let AI build the questions directly from your uploaded material.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
  {
    wide: false,
    title: "Subject organisation",
    description: "Group your documents into subjects. Keep Biology separate from History. Add as many docs as you need per subject.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
  },
  {
    wide: false,
    title: "Private or public quizzes",
    description: "Study alone with a private quiz, or flip it public and share a link with classmates. You control who sees it.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
      </svg>
    ),
  },
  {
    wide: true,
    title: "AI grading grounded in your documents",
    description:
      "Every answer is graded against your source material — not a generic knowledge base. You get a score, detailed feedback, and exact citations from your uploaded notes.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14,2 14,8 20,8" />
        <polyline points="9,15 11,17 15,13" />
      </svg>
    ),
  },
];

export default function Features() {
  return (
    <section className="border-t border-zinc-100 px-6 py-24 dark:border-zinc-900">
      <div className="mx-auto max-w-5xl">
        <AnimateIn className="mb-16">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-zinc-400">Why Quizly</p>
          <h2 className="max-w-sm text-3xl font-bold tracking-tight text-black dark:text-white sm:text-4xl">
            Built for serious learners
          </h2>
        </AnimateIn>

        <div className="grid auto-rows-fr gap-4 sm:grid-cols-3">
          {features.map((f, i) => (
            <AnimateIn
              key={f.title}
              delay={i * 80}
              className={`flex flex-col justify-between rounded-2xl border border-zinc-200 p-7 dark:border-zinc-800 ${f.wide ? "sm:col-span-2" : ""}`}
            >
              <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 text-black dark:border-zinc-800 dark:text-white">
                {f.icon}
              </div>
              <div>
                <h3 className={`mb-2 font-semibold text-black dark:text-white ${f.wide ? "text-lg" : ""}`}>
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{f.description}</p>
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
