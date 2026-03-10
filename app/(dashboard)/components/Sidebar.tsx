"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  DashboardSquare01Icon,
  Quiz01Icon,
  BookOpen01Icon,
  ChartLineData01Icon,
  ArrowLeft01Icon,
} from "@hugeicons/core-free-icons";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: DashboardSquare01Icon },
  { label: "Quizzes", href: "/quiz", icon: Quiz01Icon },
  { label: "Subjects", href: "/subjects", icon: BookOpen01Icon },
  { label: "Attempts", href: "/attempts", icon: ChartLineData01Icon },
];

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function Sidebar({ open, onClose }: Props) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-60 flex-col border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black transition-transform duration-200 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex h-14 shrink-0 items-center gap-2.5 border-b border-zinc-200 px-5 dark:border-zinc-800">
          <Link href="/" className="flex items-center gap-2.5 group" onClick={onClose}>
            <Image src="/logo.svg" alt="Quizly" width={22} height={22} className="block dark:hidden" />
            <Image src="/logoDark.svg" alt="Quizly" width={22} height={22} className="hidden dark:block" />
            <span className="font-display text-sm font-bold tracking-tight text-black dark:text-white">Quizly</span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-zinc-100 font-semibold text-black dark:bg-zinc-900 dark:text-white"
                    : "text-zinc-500 hover:bg-zinc-50 hover:text-black dark:hover:bg-zinc-900 dark:hover:text-white"
                }`}
              >
                <HugeiconsIcon icon={item.icon} size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom: back to site */}
        <div className="shrink-0 border-t border-zinc-200 p-3 dark:border-zinc-800">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-zinc-400 transition-colors hover:text-zinc-600 dark:hover:text-zinc-300"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={13} />
            Back to site
          </Link>
        </div>
      </aside>
    </>
  );
}
