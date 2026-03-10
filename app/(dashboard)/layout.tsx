"use client";

import { useState } from "react";
import Sidebar from "./components/Sidebar";
import DashHeader from "./components/DashHeader";
import { usePathname } from "next/navigation";
import "katex/dist/katex.min.css";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/quiz": "Quizzes",
  "/subjects": "Subjects",
  "/attempts": "Attempts",
};

function getTitle(pathname: string): string {
  if (pageTitles[pathname]) return pageTitles[pathname];
  if (pathname.startsWith("/quiz/")) return "Take Quiz";
  if (pathname.startsWith("/subjects/")) return "Subject";
  if (pathname.startsWith("/attempts/")) return "Attempt Detail";
  return "Dashboard";
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const title = getTitle(pathname);

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-h-screen flex-1 flex-col lg:ml-60">
        <DashHeader title={title} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-5 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
