"use client";

import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import Spinner from "../components/Spinner";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserIcon,
  Mail01Icon,
  Calendar03Icon,
  Edit02Icon,
  Cancel01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";

export default function ProfilePage() {
  const { data: session, isPending } = useSession();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  const user = session?.user;

  const startEdit = () => {
    setName(user?.name || "");
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setName("");
  };

  const saveProfile = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/update-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: name.trim() }),
      });
      if (res.ok) {
        setToast("Profile updated");
        setEditing(false);
        setTimeout(() => setToast(""), 3000);
        window.location.reload();
      } else {
        setToast("Failed to update profile");
        setTimeout(() => setToast(""), 3000);
      }
    } catch {
      setToast("Failed to update profile");
      setTimeout(() => setToast(""), 3000);
    }
    setSaving(false);
  };

  if (isPending) return <Spinner />;

  const initials = (user?.name || "User")
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const joined = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })
    : "Unknown";

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-black dark:text-white">Profile</h1>
        <p className="mt-1 text-sm text-zinc-500">Manage your account information</p>
      </div>

      {/* Avatar & Name Card */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-start gap-5">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-black text-lg font-bold text-white dark:bg-white dark:text-black">
            {initials}
          </div>

          <div className="flex-1 min-w-0">
            {editing ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="flex-1 rounded-lg border border-zinc-300 bg-transparent px-3 py-1.5 text-sm text-black outline-none focus:border-black dark:border-zinc-700 dark:text-white dark:focus:border-white"
                  autoFocus
                  onKeyDown={(e) => e.key === "Enter" && saveProfile()}
                />
                <button
                  onClick={saveProfile}
                  disabled={saving}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-green-600 hover:bg-green-50 dark:hover:bg-green-950"
                >
                  <HugeiconsIcon icon={Tick02Icon} size={16} />
                </button>
                <button
                  onClick={cancelEdit}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  <HugeiconsIcon icon={Cancel01Icon} size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-black dark:text-white">{user?.name || "User"}</h2>
                <button
                  onClick={startEdit}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-black dark:hover:bg-zinc-800 dark:hover:text-white"
                >
                  <HugeiconsIcon icon={Edit02Icon} size={14} />
                </button>
              </div>
            )}
            <p className="mt-0.5 text-sm text-zinc-500">{user?.email || "No email"}</p>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="border-b border-zinc-100 px-5 py-3 dark:border-zinc-800">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Account details</p>
        </div>

        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
          <div className="flex items-center gap-3 px-5 py-3.5">
            <HugeiconsIcon icon={UserIcon} size={16} className="shrink-0 text-zinc-400" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-zinc-400">Full name</p>
              <p className="text-sm text-black dark:text-white">{user?.name || "Not set"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 px-5 py-3.5">
            <HugeiconsIcon icon={Mail01Icon} size={16} className="shrink-0 text-zinc-400" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-zinc-400">Email</p>
              <p className="text-sm text-black dark:text-white">{user?.email || "Not set"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 px-5 py-3.5">
            <HugeiconsIcon icon={Calendar03Icon} size={16} className="shrink-0 text-zinc-400" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-zinc-400">Joined</p>
              <p className="text-sm text-black dark:text-white">{joined}</p>
            </div>
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
