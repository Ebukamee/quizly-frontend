"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchUserSubjects, createSubject, deleteSubjectById } from "../utilis/helper";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon, BookOpen01Icon, ArrowRight01Icon, MoreVerticalIcon } from "@hugeicons/core-free-icons";

export default function SubjectsPage() {
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [subjects, setSubjects] = useState<any[]>([]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // States for Toasts and Modal
  const [toast, setToast] = useState<{ message: string; type: "warning" | "success" | "error" } | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; targetId?: string }>({
    isOpen: false,
  });

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

  const showToast = (message: string, type: "warning" | "success" | "error") => {
    setToast({ message, type });
    if (type !== "warning") {
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleCreate = async () => {
    if (!newName.trim()) return;

    showToast("Creating...", "warning"); // Show yellow loading toast

    const newSub = await createSubject(newName);
    if (newSub) {
      setNewName("");
      setShowForm(false);
      loadSubjects();
      showToast("Subject created successfully", "success"); // Show green success toast
    } else {
      showToast("Failed to create subject", "error"); // Show red error toast
    }
  };

  const toggleMenu = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  // 1. Trigger the Modal instead of instant deletion
  const triggerDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenMenuId(null); // Close the menu
    setDeleteModal({ isOpen: true, targetId: id });
  };

  // 2. Execute Actual Deletion from Modal Confirmation
  const confirmDelete = async () => {
    const { targetId } = deleteModal;
    if (!targetId) return;

    setDeleteModal({ isOpen: false }); // Close modal
    showToast("Deleting...", "warning"); // Show yellow deleting toast

    const success = await deleteSubjectById(targetId);
    if (success) {
      showToast("Subject deleted successfully", "success");
      loadSubjects(); // Refresh the list instantly after deletion
    } else {
      showToast("Failed to delete subject", "error");
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
              <div className="flex items-start justify-between">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
                  <HugeiconsIcon icon={BookOpen01Icon} size={16} />
                </div>

                <div className="relative">
                  <button
                    onClick={(e) => toggleMenu(e, s.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-black dark:hover:bg-zinc-800 dark:hover:text-white"
                  >
                    <HugeiconsIcon icon={MoreVerticalIcon} size={16} />
                  </button>

                  {openMenuId === s.id && (
                    <div className="absolute right-0 top-full z-20 mt-1 w-32 rounded-xl border border-zinc-200 bg-white p-1.5 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
                      <button
                        onClick={(e) => triggerDelete(e, s.id)}
                        className="flex w-full items-center justify-start rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
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

      {/* --- CONFIRMATION MODAL --- */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:border dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="font-display text-lg font-bold text-black dark:text-white">
              Delete Subject?
            </h3>
            <p className="mt-2 text-sm text-zinc-500">
              Are you sure you want to delete this subject? This will also delete all documents inside it. This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDeleteModal({ isOpen: false })}
                className="rounded-full px-4 py-2 text-sm font-semibold text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- TOAST NOTIFICATIONS --- */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg transition-all ${
            toast.type === "warning" ? "bg-yellow-500" :
            toast.type === "success" ? "bg-green-600" :
            "bg-red-600"
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}