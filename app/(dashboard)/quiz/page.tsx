"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { quizzes, type QuizFormat } from "../lib/mockData";
import CreateQuizModal from "../components/CreateQuizModal";
import Spinner from "../components/Spinner";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { fetchUserSubjects, generateQuizRequest } from "../utilis/helper";

const formatColor: Record<QuizFormat, string> = {
  MCQ: "text-zinc-500",
  Subjective: "text-zinc-500",
  Essay: "text-zinc-500",
  Maths: "text-zinc-500",
};

export default function QuizPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      // Fetch the real subjects to pass to the modal
      const fetchedSubjects = await fetchUserSubjects();
      if (fetchedSubjects) {
        setSubjects(fetchedSubjects);
      }
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
    requestedCount?: number
  ) => {
    const newQuiz = await generateQuizRequest(subjectId, documentIds, type, topic, requestedCount);
    
    if (newQuiz) {
      setModalOpen(false);
      // We will refresh real quiz data here later!
    } else {
      alert("Failed to generate quiz. Please try again.");
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
            <p className="mt-0.5 text-sm text-zinc-500">{quizzes.length} quizzes generated from your documents</p>
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
          {quizzes.map((q) => (
            <Link
              key={q.id}
              href={`/quiz/${q.id}`}
              className="card-hover group flex h-[140px] flex-col justify-between rounded-xl border border-zinc-200 bg-white p-4 sm:h-[160px] sm:p-5 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div>
                <h3 className="font-display text-base font-bold text-black dark:text-white">{q.title}</h3>
                <p className="mt-0.5 text-sm text-zinc-500">{q.subjectName}</p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`rounded-md border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-xs font-medium dark:border-zinc-700 dark:bg-zinc-800 ${formatColor[q.format]}`}>
                    {q.format}
                  </span>
                  <span className="text-xs text-zinc-400">{q.questionCount} Qs</span>
                </div>
                <span className="text-xs text-zinc-400">{q.createdAt}</span>
              </div>
            </Link>
          ))}
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
    </>
  );
}