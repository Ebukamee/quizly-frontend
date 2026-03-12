"use client";

import { useState } from "react";
import { subjects } from "../lib/mockData";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const formats = ["MCQ", "Subjective", "Essay", "Maths & Calculations"] as const;

export default function CreateQuizModal({ isOpen, onClose }: Props) {
  const [subject, setSubject] = useState(subjects[0].id);
  const [format, setFormat] = useState<string>("MCQ");
  const [questions, setQuestions] = useState(10);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md rounded-xl border border-zinc-200 bg-white p-5 shadow-2xl sm:p-7 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="font-display text-lg font-bold text-black dark:text-white">Create a Quiz</h2>
            <p className="mt-0.5 text-sm text-zinc-500">
              AI will generate questions from your uploaded documents.
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-4 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-100 hover:text-black dark:hover:bg-zinc-800 dark:hover:text-white"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={14} />
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-black dark:text-white">Subject</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-black outline-none focus:border-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-white"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold text-black dark:text-white">Quiz Format</label>
            <div className="grid grid-cols-2 gap-2">
              {formats.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFormat(f)}
                  className={`rounded-lg border px-3 py-2.5 text-left text-sm transition-colors ${
                    format === f
                      ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                      : "border-zinc-200 text-zinc-600 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-500"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-black dark:text-white">Number of Questions</label>
            <input
              type="number"
              min={1}
              max={50}
              value={questions}
              onChange={(e) => setQuestions(Number(e.target.value))}
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-black outline-none focus:border-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-white"
            />
          </div>
        </div>

        <div className="mt-7 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-full border border-zinc-200 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-500"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="flex-1 rounded-full bg-black py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-100"
          >
            Generate Quiz
          </button>
        </div>
      </div>
    </div>
  );
}
