"use client";

import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import DashHeader from "./components/DashHeader";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import "katex/dist/katex.min.css";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/quiz": "Quizzes",
  "/subjects": "Subjects",
  "/attempts": "Attempts",
  "/profile": "Profile",
  "/settings": "Settings",
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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const title = getTitle(pathname);
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.replace("/login");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fafafa] dark:bg-black">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-300 border-t-black dark:border-zinc-700 dark:border-t-white" />
      </div>
    );
  }

  if (!session?.user) return null;

  return (
    <div className="flex min-h-screen bg-[#fafafa] font-sans text-black antialiased selection:bg-black selection:text-white dark:bg-black dark:text-white dark:selection:bg-white dark:selection:text-black">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={isCollapsed}
      />

      <div className={`flex min-h-screen flex-1 flex-col transition-all duration-300 ${isCollapsed ? "lg:ml-16" : "lg:ml-64"}`}>
        <DashHeader
          title={title}
          onMenuClick={() => setSidebarOpen(true)}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}