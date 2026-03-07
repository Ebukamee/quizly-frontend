import Link from "next/link";
import AnimateIn from "./AnimateIn";

export default function CTA() {
  return (
    <section className="px-6 py-6">
      <AnimateIn className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-black px-8 py-20 text-center dark:border dark:border-zinc-800 dark:bg-zinc-950">
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
            Get started free
          </Link>
          <Link
            href="#how-it-works"
            className="inline-flex h-11 items-center rounded-full border border-zinc-700 px-6 text-sm font-semibold text-white transition-all hover:border-zinc-500 hover:bg-zinc-900"
          >
            See how it works
          </Link>
        </div>
      </AnimateIn>
    </section>
  );
}
