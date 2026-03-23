import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { SparklesIcon } from "@hugeicons/core-free-icons";

export default function Hero() {
  return (
    <section className="pt-16">
      <div className="mx-auto max-w-6xl px-6 py-20 lg:py-28">
        <div className="grid items-center gap-14 lg:grid-cols-2">

          {/* Left: Copy */}
          <div>

            <span
              className="animate-fade-up inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400"
              style={{ animationDelay: "0ms" }}
            >
              <HugeiconsIcon icon={SparklesIcon} size={14} />
              Quizly AI Public Beta
            </span>

            <h1
              className="animate-fade-up mt-5 font-display text-5xl font-bold leading-[1.1] tracking-tight text-black dark:text-white lg:text-[3.75rem]"
              style={{ animationDelay: "80ms" }}
            >
              Turn any document into a quiz — instantly.
            </h1>

            <p
              className="animate-fade-up mt-5 max-w-md font-body text-lg leading-relaxed text-zinc-500 dark:text-zinc-400"
              style={{ animationDelay: "160ms" }}
            >
              Create subjects, upload your documents, and let AI generate quizzes tailored to your material.
            </p>

            <div
              className="animate-fade-up mt-8 flex flex-wrap gap-3"
              style={{ animationDelay: "240ms" }}
            >
              <Link
                href="/dashboard"
                className="inline-flex h-11 items-center rounded-full bg-black px-6 text-sm font-semibold text-white transition-all hover:bg-zinc-800 active:scale-[0.97] dark:bg-white dark:text-black dark:hover:bg-zinc-100"
              >
                Get Started
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex h-11 items-center rounded-full border border-zinc-300 px-6 text-sm font-semibold text-black transition-all hover:border-zinc-500 hover:bg-zinc-50 active:scale-[0.97] dark:border-zinc-700 dark:text-white dark:hover:border-zinc-500 dark:hover:bg-zinc-900"
              >
                See how it works
              </Link>
            </div>

            <div
              className="animate-fade-up mt-7 flex flex-wrap gap-2"
              style={{ animationDelay: "320ms" }}
            >
              {["MCQ", "Subjective", "Essay", "Maths & Calculations"].map((fmt) => (
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
          <div
            className="animate-fade-in w-full overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl shadow-black/5 dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-black/40"
            style={{ animationDelay: "300ms" }}
          >
            {/* Window chrome */}
            <div className="flex items-center gap-1.5 border-b border-zinc-100 px-4 py-3 dark:border-zinc-800/80">
              <div className="h-2.5 w-2.5 rounded-full bg-zinc-200 dark:bg-zinc-700" />
              <div className="h-2.5 w-2.5 rounded-full bg-zinc-200 dark:bg-zinc-700" />
              <div className="h-2.5 w-2.5 rounded-full bg-zinc-200 dark:bg-zinc-700" />
              <span className="mx-auto text-xs text-zinc-300 dark:text-zinc-600">quizly.app / Biology / Quiz #3</span>
            </div>

            <div className="p-5">
              {/* Subject + doc pill */}
              <div className="flex items-center gap-3 rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-zinc-400">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-black dark:text-white">Biology — Chapter 3: Cell Biology</p>
                  <p className="text-xs text-zinc-400">3 documents · MCQ · 8 questions</p>
                </div>
                <span className="shrink-0 rounded-full border border-zinc-200 px-2.5 py-0.5 text-xs font-medium text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
                  Private
                </span>
              </div>

              {/* Question label + progress */}
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
                      className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs transition-colors ${opt.active
                        ? "bg-black text-white dark:bg-white dark:text-black"
                        : "bg-zinc-50 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400"
                        }`}
                    >
                      <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold ${opt.active ? "border-white/30 dark:border-black/30" : "border-zinc-300 dark:border-zinc-700"}`}>
                        {opt.label}
                      </span>
                      {opt.text}
                    </div>
                  ))}
                </div>
              </div>

              {/* AI feedback */}
              <div className="mt-3 rounded-xl border border-zinc-100 bg-zinc-50 p-3.5 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex items-start gap-2.5">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0 text-black dark:text-white">
                    <polyline points="20,6 9,17 4,12" />
                  </svg>
                  <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                    <span className="font-semibold text-black dark:text-white">Correct. </span>
                    From your uploaded notes: &ldquo;Mitochondria are the primary sites of ATP production via oxidative phosphorylation.&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
