"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Menu01Icon,
  UserIcon,
  Settings01Icon,
  Logout01Icon,
  SidebarLeft01Icon,
} from "@hugeicons/core-free-icons";

type Props = {
  title: string;
  onMenuClick: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
};

export default function DashHeader({ title, onMenuClick, isCollapsed, onToggleCollapse }: Props) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between border-b border-zinc-200 bg-white/90 px-5 backdrop-blur dark:border-zinc-800 dark:bg-black/90">
      <div className="flex items-center gap-3">
        {/* Mobile: hamburger */}
        <button
          onClick={onMenuClick}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-black dark:hover:bg-zinc-900 dark:hover:text-white lg:hidden"
          aria-label="Open menu"
        >
          <HugeiconsIcon icon={Menu01Icon} size={16} />
        </button>
        {/* Desktop: sidebar toggle */}
        <button
          onClick={onToggleCollapse}
          className="hidden h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-black dark:hover:bg-zinc-900 dark:hover:text-white lg:flex"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <HugeiconsIcon
            icon={SidebarLeft01Icon}
            size={16}
            className={`transition-transform duration-200 ${isCollapsed ? "rotate-180" : ""}`}
          />
        </button>
        {/* Logo — mobile only */}
        <Link href="/" className="flex items-center gap-2 lg:hidden">
          <Image src="/logo.svg" alt="Quizly" width={20} height={20} className="block dark:hidden" />
          <Image src="/logoDark.svg" alt="Quizly" width={20} height={20} className="hidden dark:block" />
          <span className="font-heading text-sm font-bold tracking-tight text-black dark:text-white">Quizly</span>
        </Link>
        <h1 className="hidden font-display text-sm font-semibold text-black dark:text-white lg:block">{title}</h1>
      </div>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen((v) => !v)}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-xs font-bold text-white transition-opacity hover:opacity-80 dark:bg-white dark:text-black"
          aria-label="Profile menu"
        >
          JD
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 top-10 w-44 rounded-xl border border-zinc-200 bg-white py-1 shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
            <Link
              href="/profile"
              className="flex items-center gap-2.5 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-900"
              onClick={() => setDropdownOpen(false)}
            >
              <HugeiconsIcon icon={UserIcon} size={14} />
              Profile
            </Link>
            <Link
              href="/settings"
              className="flex items-center gap-2.5 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-900"
              onClick={() => setDropdownOpen(false)}
            >
              <HugeiconsIcon icon={Settings01Icon} size={14} />
              Settings
            </Link>
            <div className="my-1 border-t border-zinc-100 dark:border-zinc-800" />
            <button
              className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-red-500 hover:bg-zinc-50 dark:hover:bg-zinc-900"
              onClick={() => setDropdownOpen(false)}
            >
              <HugeiconsIcon icon={Logout01Icon} size={14} />
              Log out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
