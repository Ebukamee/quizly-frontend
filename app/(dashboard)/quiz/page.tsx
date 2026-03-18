"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import CreateQuizModal from "../components/CreateQuizModal";
import Spinner from "../components/Spinner";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon, MoreVerticalIcon } from "@hugeicons/core-free-icons";
import { fetchUserSubjects, generateQuizRequest, fetchUserQuizzes, deleteQuizRequest } from "../utilis/helper";

// Fallback color mapping for the DB enum types
const formatColor: Record<string, string> = {
  MCQ: "text-zinc-500",
  SUBJECTIVE: "text-zinc-500",
  THEORY: "text-zinc-500",
  MATH: "text-zinc-500",
};

export default function QuizPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [userQuizzes, setUserQuizzes] = useState<any[]>([]); // New state for real quizzes
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; targetId?: string }>({ isOpen: false });
  const [generating, setGenerating] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "warning" | "success" | "error" } | null>(null);

  const showToast = (message: string, type: "warning" | "success" | "error") => {
    setToast({ message, type });
    if (type !== "warning") setTimeout(() => setToast(null), 3000);
  };

  const toggleMenu = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  const triggerDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenMenuId(null);
    setDeleteModal({ isOpen: true, targetId: id });
  };

  const confirmDelete = async () => {
    const { targetId } = deleteModal;
    if (!targetId) return;

    setDeleteModal({ isOpen: false });
    showToast("Deleting...", "warning");

    const success = await deleteQuizRequest(targetId);
    if (success) {
      showToast("Quiz deleted successfully", "success");
      const updatedQuizzes = await fetchUserQuizzes();
      if (updatedQuizzes) setUserQuizzes(updatedQuizzes);
    } else {
      showToast("Failed to delete quiz", "error");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      // Fetch both subjects and quizzes simultaneously 
      const [fetchedSubjects, fetchedQuizList] = await Promise.all([
        fetchUserSubjects(),
        fetchUserQuizzes()
      ]);
      
      if (fetchedSubjects) setSubjects(fetchedSubjects);
      if (fetchedQuizList) setUserQuizzes(fetchedQuizList);
      
      setLoading(false);
    };

    loadData();
  }, []);

  // Wrapper function to handle the API call and close the modal on success
  const handleGenerateQuiz = async (
    subjectId: string,
    documentIds: string[],
    type: 'mcq' | 'subjective' | 'theory' | 'math',
    topic?: string,
    requestedCount?: number,
    isPublic?: boolean
  ) => {
    setGenerating(true);
    const newQuiz = await generateQuizRequest(subjectId, documentIds, type, topic, requestedCount, isPublic);
    setGenerating(false);

    if (newQuiz) {
      setModalOpen(false);
      showToast("Quiz generated successfully!", "success");
      
      // Refresh real quiz data immediately so the new card pops up!
      const updatedQuizzes = await fetchUserQuizzes();
      if (updatedQuizzes) setUserQuizzes(updatedQuizzes);
    } else {
      showToast("Failed to generate quiz. Please try again.", "error");
    }
  };

  if (loading) return <Spinner />;

  return (
    <>
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-black dark:text-white">Your Quizzes</h1>
            <p className="mt-0.5 text-sm text-zinc-500">{userQuizzes.length} quizzes generated from your documents</p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="hidden items-center gap-2 rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-zinc-800 active:scale-[0.97] dark:bg-white dark:text-black dark:hover:bg-zinc-100 sm:inline-flex"
          >
            <HugeiconsIcon icon={PlusSignIcon} size={13} />
            Create Quiz
          </button>
        </div>

        {/* Quiz cards — reference-style tall cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {userQuizzes.length === 0 ? (
            <div className="col-span-full rounded-xl border border-dashed border-zinc-200 py-12 text-center text-zinc-500 dark:border-zinc-800">
              You haven't generated any quizzes yet. Click "Create Quiz" to get started!
            </div>
          ) : (
            userQuizzes.map((q) => (
              <Link
                key={q.id}
                href={`/quiz/${q.id}`}
                className="card-hover group flex h-[140px] flex-col justify-between rounded-xl border border-zinc-200 bg-white p-4 sm:h-[160px] sm:p-5 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-display text-base font-bold text-black dark:text-white">{q.title}</h3>
                    <p className="mt-0.5 text-sm text-zinc-500">{q.subject?.name || "General"}</p>
                  </div>
                  <div className="relative">
                    <button
                      onClick={(e) => toggleMenu(e, q.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-black dark:hover:bg-zinc-800 dark:hover:text-white"
                    >
                      <HugeiconsIcon icon={MoreVerticalIcon} size={16} />
                    </button>

                    {openMenuId === q.id && (
                      <div className="absolute right-0 top-full z-20 mt-1 w-32 rounded-xl border border-zinc-200 bg-white p-1.5 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
                        <button
                          onClick={(e) => triggerDelete(e, q.id)}
                          className="flex w-full items-center justify-start rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`rounded-md border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-xs font-medium dark:border-zinc-700 dark:bg-zinc-800 ${formatColor[q.type] || "text-zinc-500"}`}>
                      {q.type}
                    </span>
                    <span className={`rounded-md border px-2 py-0.5 text-xs font-medium ${q.isPublic ? "border-green-200 bg-green-50 text-green-600 dark:border-green-800 dark:bg-green-900/30 dark:text-green-400" : "border-zinc-200 bg-zinc-50 text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800"}`}>
                      {q.isPublic ? "Public" : "Private"}
                    </span>
                    <span className="text-xs text-zinc-400">{q.questionCount} Qs</span>
                  </div>
                  <span className="text-xs text-zinc-400">
                    {new Date(q.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Mobile FAB */}
      <button
        onClick={() => setModalOpen(true)}
        className="fixed bottom-6 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-black text-white shadow-lg transition-transform hover:scale-105 active:scale-95 dark:bg-white dark:text-black sm:hidden"
      >
        <HugeiconsIcon icon={PlusSignIcon} size={24} />
      </button>

      <CreateQuizModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        subjects={subjects}
        onGenerate={handleGenerateQuiz}
      />

      {/* --- CONFIRMATION MODAL --- */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:border dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="font-display text-lg font-bold text-black dark:text-white">
              Delete Quiz?
            </h3>
            <p className="mt-2 text-sm text-zinc-500">
              Are you sure you want to delete this quiz? This will also delete all questions inside it. This action cannot be undone.
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

      {generating && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 flex items-center gap-2.5 rounded-full border border-zinc-200 bg-white px-5 py-2.5 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
          <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-zinc-200 border-t-black dark:border-zinc-700 dark:border-t-white" />
          <p className="text-sm font-medium text-black dark:text-white">Generating quiz — don't exit the page</p>
        </div>
      )}

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
    </>
  );
}