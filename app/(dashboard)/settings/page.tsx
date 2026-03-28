"use client";

import { useState } from "react";
import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Spinner from "../components/Spinner";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Delete02Icon,
  Logout01Icon,
  Moon02Icon,
  Sun03Icon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons";

export default function SettingsPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [toast, setToast] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isDark, setIsDark] = useState(() =>
    typeof document !== "undefined" && document.documentElement.classList.contains("dark")
  );

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const toggleTheme = () => {
    const html = document.documentElement;
    const wasDark = html.classList.contains("dark");
    if (wasDark) {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setIsDark(!wasDark);
    showToast(wasDark ? "Switched to light mode" : "Switched to dark mode");
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/delete-user`, {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        await signOut();
        router.push("/");
      } else {
        showToast("Failed to delete account");
      }
    } catch {
      showToast("Failed to delete account");
    }
    setDeleting(false);
  };

  if (isPending) return <Spinner />;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-black dark:text-white">Settings</h1>
        <p className="mt-1 text-sm text-zinc-500">Manage your preferences</p>
      </div>

      {/* Appearance */}
      <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="border-b border-zinc-100 px-5 py-3 dark:border-zinc-800">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Appearance</p>
        </div>
        <div className="px-5 py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <HugeiconsIcon icon={isDark ? Moon02Icon : Sun03Icon} size={16} className="shrink-0 text-zinc-400" />
              <div>
                <p className="text-sm font-medium text-black dark:text-white">Theme</p>
                <p className="text-xs text-zinc-500">{isDark ? "Dark" : "Light"} mode is active</p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className="shrink-0 self-start rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 sm:self-auto dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Switch to {isDark ? "light" : "dark"}
            </button>
          </div>
        </div>
      </div>

      {/* Account */}
      <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="border-b border-zinc-100 px-5 py-3 dark:border-zinc-800">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Account</p>
        </div>

        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {/* Email */}
          <div className="flex items-center gap-3 px-5 py-4">
            <HugeiconsIcon icon={InformationCircleIcon} size={16} className="shrink-0 text-zinc-400" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-black dark:text-white">Email</p>
              <p className="text-xs text-zinc-500">{session?.user?.email || "Not set"}</p>
            </div>
          </div>

          {/* Sign out */}
          <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <HugeiconsIcon icon={Logout01Icon} size={16} className="shrink-0 text-zinc-400" />
              <div>
                <p className="text-sm font-medium text-black dark:text-white">Sign out</p>
                <p className="text-xs text-zinc-500">Sign out of your account on this device</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="shrink-0 self-start rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 sm:self-auto dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Danger zone */}
      <div className="rounded-xl border border-red-200 bg-white dark:border-red-900/50 dark:bg-zinc-900">
        <div className="border-b border-red-100 px-5 py-3 dark:border-red-900/50">
          <p className="text-xs font-semibold uppercase tracking-widest text-red-400">Danger zone</p>
        </div>
        <div className="px-5 py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <HugeiconsIcon icon={Delete02Icon} size={16} className="shrink-0 text-red-400" />
              <div>
                <p className="text-sm font-medium text-black dark:text-white">Delete account</p>
                <p className="text-xs text-zinc-500">Permanently delete your account and all data</p>
              </div>
            </div>
            {showDeleteConfirm ? (
              <div className="flex shrink-0 items-center gap-2 self-start sm:self-auto">
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                  className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                >
                  {deleting ? "Deleting..." : "Confirm"}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="shrink-0 self-start rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 sm:self-auto dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-black shadow-lg dark:border-zinc-700 dark:bg-zinc-900 dark:text-white">
          {toast}
        </div>
      )}
    </div>
  );
}
