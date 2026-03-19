import Link from "next/link";
import Image from "next/image";
import "katex/dist/katex.min.css";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#fafafa] font-sans text-black antialiased selection:bg-black selection:text-white dark:bg-black dark:text-white dark:selection:bg-white dark:selection:text-black">
      {/* Logo-only nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-black/10 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-black/80">
        <div className="mx-auto flex h-16 max-w-6xl items-center px-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <Image
              src="/logo.svg"
              alt="Quizly"
              width={32}
              height={32}
              className="block dark:hidden transition-transform duration-200 group-hover:scale-110"
              priority
            />
            <Image
              src="/logoDark.svg"
              alt="Quizly"
              width={32}
              height={32}
              className="hidden dark:block transition-transform duration-200 group-hover:scale-110"
              priority
            />
            <span className="font-heading text-lg font-bold tracking-tight text-black dark:text-white">
              Quizly
            </span>
          </Link>
        </div>
      </nav>

      <main className="px-4 pt-24 pb-12 sm:px-6">
        {children}
      </main>
    </div>
  );
}
