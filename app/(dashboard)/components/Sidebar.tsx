"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  DashboardSquare01Icon,
  Quiz01Icon,
  BookOpen01Icon,
  ChartLineData01Icon,
  Logout01Icon,
} from "@hugeicons/core-free-icons";
import { signOut } from "@/lib/auth-client";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: DashboardSquare01Icon },
  { label: "Quizzes", href: "/quiz", icon: Quiz01Icon },
  { label: "Subjects", href: "/subjects", icon: BookOpen01Icon },
  { label: "Attempts", href: "/attempts", icon: ChartLineData01Icon },
];

type Props = {
  open: boolean;
  onClose: () => void;
  isCollapsed: boolean;
};

export default function Sidebar({ open, onClose, isCollapsed }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    onClose();
    await signOut();
    router.push("/login");
  };

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 flex flex-col border-r border-black/[0.06] bg-white transition-all duration-300 dark:border-white/[0.06] dark:bg-[#0a0a0a] lg:translate-x-0 ${isCollapsed ? "w-16" : "w-64"
          } ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Logo */}
        <div className={`flex h-16 shrink-0 items-center overflow-hidden ${isCollapsed ? "justify-center px-0" : "px-6"}`}>
          <Link href="/" className="group flex items-center gap-3" onClick={onClose}>
            <Image src="/logo.svg" alt="Quizly" width={20} height={20} className="block shrink-0 transition-transform group-hover:scale-105 dark:hidden" />
            <Image src="/logoDark.svg" alt="Quizly" width={20} height={20} className="hidden shrink-0 transition-transform group-hover:scale-105 dark:block" />
            {!isCollapsed && <span className="font-heading text-[15px] font-bold tracking-tight text-black dark:text-white">Quizly</span>}
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-4">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`group flex items-center rounded-lg py-2 text-[14px] font-medium transition-all duration-150 ${isCollapsed ? "justify-center px-0" : "gap-3 px-3"
                  } ${active
                    ? "bg-black/[0.06] text-black dark:bg-white/[0.1] dark:text-white"
                    : "text-zinc-500 hover:bg-black/[0.04] hover:text-black dark:text-zinc-400 dark:hover:bg-white/[0.04] dark:hover:text-white"
                  }`}
              >
                <HugeiconsIcon
                  icon={item.icon}
                  size={18}
                  className={`shrink-0 transition-colors ${active ? "text-black dark:text-white" : "text-zinc-400 group-hover:text-black dark:group-hover:text-white"}`}
                />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="shrink-0 border-t border-black/[0.06] p-3 dark:border-white/[0.06]">
          <Link
            href="/"
            className={`group flex items-center rounded-lg py-2 text-[13px] font-medium text-zinc-400 transition-all hover:text-black dark:hover:text-white ${isCollapsed ? "justify-center px-0" : "gap-3 px-3"}`}
          >
            {isCollapsed ? "←" : "← Back to site"}
          </Link>
          <button
            onClick={handleSignOut}
            className={`group flex w-full items-center rounded-lg py-2 text-[13px] font-medium text-zinc-400 transition-all hover:text-red-500 ${isCollapsed ? "justify-center px-0" : "gap-3 px-3"}`}
          >
            <HugeiconsIcon icon={Logout01Icon} size={16} className="shrink-0" />
            {!isCollapsed && <span>Log out</span>}
          </button>
        </div>
      </aside>
    </>
  );
}