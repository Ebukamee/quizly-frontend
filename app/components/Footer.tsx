import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-100 px-6 py-8 dark:border-zinc-900">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 text-xs text-zinc-400 sm:flex-row">
        <span className="font-heading font-bold tracking-tight text-black dark:text-white">Quizly</span>
        <span>© {new Date().getFullYear()} Quizly. All rights reserved.</span>
        <div className="flex gap-5">
          <Link href="/privacy" className="transition-colors hover:text-black dark:hover:text-white">Privacy</Link>
          <Link href="/terms" className="transition-colors hover:text-black dark:hover:text-white">Terms</Link>
          <Link href="/contact" className="transition-colors hover:text-black dark:hover:text-white">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
