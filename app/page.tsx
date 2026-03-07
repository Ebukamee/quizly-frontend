import Link from "next/link";
import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans dark:bg-black">
      <Navbar />

      {/* ─── HERO ─────────────────────────────────────────── */}
      {/* pt-16 clears the fixed 64px navbar */}
      <section className="pt-16">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:py-28">
          <div className="grid items-center gap-14 lg:grid-cols-2">

            {/* Left: Copy */}
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
                AI-powered · No account needed
              </span>

              <h1 className="mt-5 text-5xl font-bold leading-[1.1] tracking-tight text-black dark:text-white lg:text-[3.75rem]">
                Turn any document into a quiz — instantly.
              </h1>

              <p className="mt-5 max-w-md text-lg leading-relaxed text-zinc-500 dark:text-zinc-400">
                Upload a PDF, Word doc, or paste text. Our AI reads it, writes the questions, and grades your answers — all grounded in your source material.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/upload"
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-black px-6 text-sm font-semibold text-white transition-all hover:bg-zinc-800 active:scale-[0.97] dark:bg-white dark:text-black dark:hover:bg-zinc-100"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17,8 12,3 7,8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  Upload a Document
                </Link>
                <Link
                  href="#how-it-works"
                  className="inline-flex h-11 items-center rounded-full border border-zinc-300 px-6 text-sm font-semibold text-black transition-all hover:border-zinc-500 hover:bg-zinc-50 active:scale-[0.97] dark:border-zinc-700 dark:text-white dark:hover:border-zinc-500 dark:hover:bg-zinc-900"
                >
                  See how it works
                </Link>
              </div>

              <div className="mt-7 flex flex-wrap gap-2">
                {["PDF", "DOCX", "TXT", "Markdown", "Paste text"].map((fmt) => (
                  <span
                    key={fmt}
                    className="rounded-full border border-zinc-200 px-3 py-1 text-xs text-zinc-400 dark:border-zinc-800 dark:text-zinc-500"
                  >
                    {fmt}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: Product mockup */}
            <div className="w-full overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl shadow-black/5 dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-black/40">

              {/* Window chrome */}
              <div className="flex items-center gap-1.5 border-b border-zinc-100 px-4 py-3 dark:border-zinc-800/80">
                <div className="h-2.5 w-2.5 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                <div className="h-2.5 w-2.5 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                <div className="h-2.5 w-2.5 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                <span className="mx-auto text-xs text-zinc-300 dark:text-zinc-600">quizly.app/quiz/bio-ch3</span>
              </div>

              <div className="p-5">
                {/* Uploaded doc pill */}
                <div className="flex items-center gap-3 rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-zinc-400">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14,2 14,8 20,8" />
                  </svg>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-black dark:text-white">biology_lecture_ch3.pdf</p>
                    <p className="text-xs text-zinc-400">12 pages · Analyzed</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-black px-2.5 py-0.5 text-xs font-semibold text-white dark:bg-white dark:text-black">
                    Done
                  </span>
                </div>

                {/* Question label */}
                <div className="mb-3 mt-5 flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Question 2 of 8</p>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                      <div
                        key={i}
                        className={`h-1 w-4 rounded-full ${i === 1 ? "bg-black dark:bg-white" : "bg-zinc-200 dark:bg-zinc-800"}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Question card */}
                <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
                  <p className="text-sm font-medium leading-snug text-black dark:text-white">
                    What is the primary role of mitochondria in eukaryotic cells?
                  </p>
                  <div className="mt-3 space-y-2">
                    {[
                      { label: "A", text: "Protein synthesis", active: false },
                      { label: "B", text: "ATP energy production", active: true },
                      { label: "C", text: "DNA replication", active: false },
                      { label: "D", text: "Lipid storage", active: false },
                    ].map((opt) => (
                      <div
                        key={opt.label}
                        className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs transition-colors ${
                          opt.active
                            ? "bg-black text-white dark:bg-white dark:text-black"
                            : "bg-zinc-50 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400"
                        }`}
                      >
                        <span
                          className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold ${
                            opt.active
                              ? "border-white/30 dark:border-black/30"
                              : "border-zinc-300 dark:border-zinc-700"
                          }`}
                        >
                          {opt.label}
                        </span>
                        {opt.text}
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI grading feedback */}
                <div className="mt-3 rounded-xl border border-zinc-100 bg-zinc-50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900">
                  <div className="flex items-start gap-2.5">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0 text-black dark:text-white">
                      <polyline points="20,6 9,17 4,12" />
                    </svg>
                    <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                      <span className="font-semibold text-black dark:text-white">Correct. </span>
                      From paragraph 3 of your document: &ldquo;Mitochondria are the primary sites of ATP production via oxidative phosphorylation.&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── STATS BAR ────────────────────────────────────── */}
      <section className="border-y border-zinc-100 py-10 dark:border-zinc-900">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid grid-cols-2 gap-8 text-center sm:grid-cols-4">
            {[
              { value: "50k+", label: "Documents processed" },
              { value: "2M+", label: "Questions generated" },
              { value: "< 30s", label: "Quiz generation time" },
              { value: "4.9★", label: "Average user rating" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-bold tracking-tight text-black dark:text-white">{stat.value}</p>
                <p className="mt-1 text-xs text-zinc-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─────────────────────────────────── */}
      <section id="how-it-works" className="px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-16">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-zinc-400">How it works</p>
            <h2 className="max-w-md text-3xl font-bold tracking-tight text-black dark:text-white sm:text-4xl">
              From document to graded quiz in under a minute
            </h2>
          </div>

          <div className="relative grid gap-10 sm:grid-cols-3 sm:gap-6">
            {/* Dashed connector line (desktop) */}
            <div className="absolute left-[calc(16.5%+24px)] right-[calc(16.5%+24px)] top-6 hidden border-t border-dashed border-zinc-200 dark:border-zinc-800 sm:block" />

            {[
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
            ].map((s) => (
              <div key={s.n} className="relative flex flex-col gap-5">
                <div className="z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 border-zinc-200 bg-white text-sm font-bold text-black dark:border-zinc-800 dark:bg-black dark:text-white">
                  {s.n}
                </div>
                <div>
                  <h3 className="mb-2 font-semibold text-black dark:text-white">{s.title}</h3>
                  <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES BENTO ───────────────────────────────── */}
      <section className="border-t border-zinc-100 px-6 py-24 dark:border-zinc-900">
        <div className="mx-auto max-w-5xl">
          <div className="mb-16">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-zinc-400">Why Quizly</p>
            <h2 className="max-w-sm text-3xl font-bold tracking-tight text-black dark:text-white sm:text-4xl">
              Built for serious learners
            </h2>
          </div>

          {/* Bento grid */}
          <div className="grid auto-rows-fr gap-4 sm:grid-cols-3">

            {/* Big card — spans 2 cols */}
            <div className="flex flex-col justify-between rounded-2xl border border-zinc-200 p-7 sm:col-span-2 dark:border-zinc-800">
              <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 text-black dark:border-zinc-800 dark:text-white">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14,2 14,8 20,8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold text-black dark:text-white">Grounded in your content</h3>
                <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                  Every question is derived from your document. Every grade comes with a citation. No hallucinations, no off-topic filler — just your material, tested back at you.
                </p>
              </div>
            </div>

            {/* Small card */}
            <div className="flex flex-col justify-between rounded-2xl border border-zinc-200 p-7 dark:border-zinc-800">
              <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 text-black dark:border-zinc-800 dark:text-white">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-black dark:text-white">Any format</h3>
                <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                  PDF, DOCX, TXT, Markdown, or pasted text. If it&apos;s words, Quizly can quiz you on it.
                </p>
              </div>
            </div>

            {/* Small card */}
            <div className="flex flex-col justify-between rounded-2xl border border-zinc-200 p-7 dark:border-zinc-800">
              <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 text-black dark:border-zinc-800 dark:text-white">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12,6 12,12 16,14" />
                </svg>
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-black dark:text-white">Instant AI grading</h3>
                <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                  Get your score and detailed feedback the moment you submit — no waiting.
                </p>
              </div>
            </div>

            {/* Big card — spans 2 cols */}
            <div className="flex flex-col justify-between rounded-2xl border border-zinc-200 p-7 sm:col-span-2 dark:border-zinc-800">
              <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 text-black dark:border-zinc-800 dark:text-white">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold text-black dark:text-white">Share with one link</h3>
                <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                  Generated a quiz from your study guide? Share it with your whole class. Works for study groups, teams, and classrooms alike — no sign-up required for takers.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── WHO IT'S FOR ──────────────────────────────────── */}
      <section className="border-t border-zinc-100 px-6 py-24 dark:border-zinc-900">
        <div className="mx-auto max-w-5xl">
          <div className="mb-16">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-zinc-400">Use cases</p>
            <h2 className="max-w-sm text-3xl font-bold tracking-tight text-black dark:text-white sm:text-4xl">
              Who is it for?
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Students", text: "Turn lecture slides into practice exams the night before a test." },
              { label: "Teachers", text: "Draft quiz questions from lesson plans in seconds, not hours." },
              { label: "Professionals", text: "Test your team's retention of training documents and SOPs." },
              { label: "Researchers", text: "Self-test on dense academic papers and retain more of what you read." },
            ].map((u) => (
              <div key={u.label} className="rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800">
                <p className="mb-3 text-xs font-bold uppercase tracking-widest text-black dark:text-white">{u.label}</p>
                <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{u.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA (dark) ────────────────────────────────────── */}
      <section className="px-6 py-6">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-black px-8 py-20 text-center dark:border dark:border-zinc-800 dark:bg-zinc-950">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">Get started</p>
          <h2 className="mx-auto max-w-xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Your document. Your quiz. Ready in seconds.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-zinc-400">
            No flashcards to make. No question banks to browse. Just upload and learn.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/upload"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-black transition-all hover:bg-zinc-100 active:scale-[0.97]"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17,8 12,3 7,8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              Try it free — no account needed
            </Link>
            <Link
              href="#how-it-works"
              className="inline-flex h-11 items-center rounded-full border border-zinc-700 px-6 text-sm font-semibold text-white transition-all hover:border-zinc-500 hover:bg-zinc-900"
            >
              See how it works
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ───────────────────────────────────────── */}
      <footer className="border-t border-zinc-100 px-6 py-8 dark:border-zinc-900">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 text-xs text-zinc-400 sm:flex-row">
          <span className="font-semibold tracking-tight text-black dark:text-white">Quizly</span>
          <span>© {new Date().getFullYear()} Quizly. All rights reserved.</span>
          <div className="flex gap-5">
            <Link href="/privacy" className="transition-colors hover:text-black dark:hover:text-white">Privacy</Link>
            <Link href="/terms" className="transition-colors hover:text-black dark:hover:text-white">Terms</Link>
            <Link href="/contact" className="transition-colors hover:text-black dark:hover:text-white">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
