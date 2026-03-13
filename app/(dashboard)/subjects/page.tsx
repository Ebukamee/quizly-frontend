"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchUserSubjects, createSubject } from "../utilis/helper";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon, BookOpen01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";

export default function SubjectsPage() {
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [subjects, setSubjects] = useState<any[]>([]);

  // 1. Extracted this so we can call it on load AND after creating a new subject
  const loadSubjects = async () => {
    const data = await fetchUserSubjects();
    if (data) {
      const formattedSubjects = data.map((s: any) => ({
        ...s,
        docCount: s._count?.documents || 0,
        lastUpdated: new Date(s.updatedAt).toLocaleDateString(),
      }));
      setSubjects(formattedSubjects);
    }
  };

  useEffect(() => {
    loadSubjects();
  }, []);

  // 2. The handler using your imported createSubject function
  const handleCreate = async () => {
    if (!newName.trim()) return;

    const newSub = await createSubject(newName);
    if (newSub) {
      setNewName("");
      setShowForm(false);
      loadSubjects(); // Refresh the list instantly
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-black dark:text-white">Subjects</h1>
          <p className="mt-0.5 text-sm text-zinc-500">Organise your documents into subjects</p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="hidden items-center gap-2 rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-zinc-800 active:scale-[0.97] dark:bg-white dark:text-black dark:hover:bg-zinc-100 sm:inline-flex"
        >
          <HugeiconsIcon icon={PlusSignIcon} size={13} />
          New Subject
        </button>
      </div>

      {showForm && (
        <div className="mb-5 flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 sm:flex-row sm:items-center dark:border-zinc-800 dark:bg-zinc-900">
          <input
            autoFocus
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Subject name…"
            className="flex-1 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-black outline-none focus:border-black dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:border-white"
          />
          <div className="flex gap-2">
            <button
              onClick={handleCreate}
              className="h-9 flex-1 rounded-full bg-black px-4 text-sm font-semibold text-white hover:bg-zinc-800 sm:flex-none dark:bg-white dark:text-black dark:hover:bg-zinc-100"
            >
              Create
            </button>
            <button
              onClick={() => { setShowForm(false); setNewName(""); }}
              className="h-9 flex-1 rounded-full border border-zinc-200 px-4 text-sm text-zinc-600 hover:border-zinc-400 sm:flex-none dark:border-zinc-700 dark:text-zinc-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* 3. The Empty State Component */}
      {subjects.length === 0 && !showForm ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 py-20 text-center dark:border-zinc-800">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 dark:bg-zinc-800/50 dark:text-zinc-400">
            <HugeiconsIcon icon={BookOpen01Icon} size={24} />
          </div>
          <h3 className="font-display text-lg font-semibold text-black dark:text-white">No subjects found</h3>
          <p className="mt-1 max-w-sm text-sm text-zinc-500">
            You don't have any subjects yet. Create your first subject to start organising your files.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-zinc-800 active:scale-[0.97] dark:bg-white dark:text-black dark:hover:bg-zinc-100"
          >
            <HugeiconsIcon icon={PlusSignIcon} size={14} />
            Create your first subject
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {subjects.map((s) => (
            <Link
              key={s.id}
              href={`/subjects/${s.id}`}
              className="card-hover group flex flex-col rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
                <HugeiconsIcon icon={BookOpen01Icon} size={16} />
              </div>
              <h3 className="font-display font-semibold text-black dark:text-white">{s.name}</h3>
              <p className="mt-0.5 text-xs text-zinc-400">{s.docCount} documents</p>
              <p className="mt-0.5 text-xs text-zinc-400">Updated {s.lastUpdated}</p>
              <div className="mt-4 flex items-center justify-end text-zinc-400 transition-colors group-hover:text-black dark:group-hover:text-white">
                <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Mobile FAB */}
      <button
        onClick={() => setShowForm((v) => !v)}
        className="fixed bottom-6 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-black text-white shadow-lg transition-transform hover:scale-105 active:scale-95 dark:bg-white dark:text-black sm:hidden"
      >
        <HugeiconsIcon icon={PlusSignIcon} size={24} />
      </button>
    </div>
  );
}