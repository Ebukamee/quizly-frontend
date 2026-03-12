"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const navLinks = [
  { label: 'Home', href: '/' },
  { label: "How it Works", href: "/#how-it-works" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-black/10 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-black/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          {/* Light mode logo */}
          <Image
            src="/logo.svg"
            alt="Quizly"
            width={32}
            height={32}
            className="block dark:hidden transition-transform duration-200 group-hover:scale-110"
            priority
          />
          {/* Dark mode logo */}
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

        {/* Desktop nav links */}
        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="relative rounded-lg px-4 py-2 text-sm font-medium text-zinc-500 transition-colors duration-150 hover:text-black dark:text-zinc-400 dark:hover:text-white after:absolute after:bottom-1 after:left-4 after:right-4 after:h-0.5 after:scale-x-0 after:rounded-full after:bg-black dark:after:bg-white after:transition-transform hover:after:scale-x-100"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-4 md:flex">
          <Link
            href="/login"
            className="text-sm font-medium text-zinc-500 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-white"
          >
            Sign in
          </Link>
          <Link
            href="/upload"
            className="inline-flex h-9 items-center rounded-full bg-black px-5 text-sm font-semibold text-white transition-all duration-200 hover:bg-zinc-800 active:scale-[0.97] dark:bg-white dark:text-black dark:hover:bg-zinc-100"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-white/10 md:hidden"
        >
          {menuOpen ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="3" y1="7" x2="21" y2="7" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="17" x2="21" y2="17" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-black/10 bg-white/95 px-6 pb-6 pt-4 backdrop-blur-xl dark:border-white/10 dark:bg-black/95 md:hidden">
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-lg px-4 py-2.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-black dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-col gap-3">
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="block rounded-lg px-4 py-2.5 text-center text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-white/10"
            >
              Sign in
            </Link>
            <Link
              href="/upload"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center rounded-full bg-black py-2.5 text-sm font-semibold text-white dark:bg-white dark:text-black"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
