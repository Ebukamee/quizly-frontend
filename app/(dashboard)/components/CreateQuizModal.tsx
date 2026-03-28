"use client";

import { useState, useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { fetchSubjectById } from "../utilis/helper";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  subjects: any[];
  onGenerate: (
    subjectId: string,
    documentIds: string[],
    type: 'mcq' | 'subjective' | 'theory' | 'math',
    topic?: string,
    count?: number,
    isPublic?: boolean
  ) => void;
};

const formats = ["MCQ", "Subjective", "Essay", "Maths & Calculations"] as const;

export default function CreateQuizModal({ isOpen, onClose, subjects, onGenerate }: Props) {
  const [subject, setSubject] = useState<string>("");
  const [format, setFormat] = useState<string>("MCQ");
  const [questions, setQuestions] = useState(10);
  const [topic, setTopic] = useState("");
  const [isPublic, setIsPublic] = useState(false);

  // Document states
  const [docs, setDocs] = useState<any[]>([]);
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  
  const [isGenerating, setIsGenerating] = useState(false);

  // 1. Set the initial subject when the modal opens and subjects are loaded
  useEffect(() => {
    if (subjects?.length > 0 && !subject) {
      setSubject(subjects[0].id);
    }
  }, [subjects, subject]);

  // 2. Automatically fetch the documents belonging to the selected subject
  useEffect(() => {
    if (!subject) return;
    
    const loadDocs = async () => {
      const data = await fetchSubjectById(subject);
      if (data && data.documents) {
        setDocs(data.documents);
        // Default behavior: Select all documents in the folder automatically
        setSelectedDocs(data.documents.map((d: any) => d.id));
      } else {
        setDocs([]);
        setSelectedDocs([]);
      }
    };
    
    loadDocs();
  }, [subject]);

  // 3. Enforce dynamic question limits (40 for MCQ/Subjective, 10 for Essay/Math)
  useEffect(() => {
    const maxAllowed = (format === "MCQ" || format === "Subjective") ? 40 : 10;
    if (questions > maxAllowed) setQuestions(maxAllowed);
  }, [format, questions]);

  if (!isOpen) return null;

  // 4. Handle the Generate click and map format to API schema
  const handleGenerateClick = async () => {
    if (!subject || selectedDocs.length === 0) {
      alert("Please select a subject with at least one uploaded document.");
      return;
    }

    setIsGenerating(true);

    const typeMap: Record<string, 'mcq' | 'subjective' | 'theory' | 'math'> = {
      "MCQ": "mcq",
      "Subjective": "subjective",
      "Essay": "theory",
      "Maths & Calculations": "math"
    };

    await onGenerate(
      subject,
      selectedDocs,
      typeMap[format],
      topic,
      questions,
      isPublic
    );

    setIsGenerating(false);
  };

  const maxQuestions = (format === "MCQ" || format === "Subjective") ? 40 : 10;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-xl border border-zinc-200 bg-white p-5 shadow-2xl sm:p-7 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="font-display text-lg font-bold text-black dark:text-white">Create a Quiz</h2>
            <p className="mt-0.5 text-sm text-zinc-500">
              AI will generate questions from your uploaded documents.
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isGenerating}
            className="ml-4 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-100 hover:text-black dark:hover:bg-zinc-800 dark:hover:text-white"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={14} />
          </button>
        </div>

        <div className="space-y-5">
          {/* Subject Selector */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-black dark:text-white">Subject</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              disabled={isGenerating}
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-black outline-none focus:border-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-white disabled:opacity-50"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          {/* Document Selector */}
          {docs.length > 0 ? (
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-black dark:text-white">Documents to include</label>
              <div className="max-h-28 overflow-y-auto rounded-lg border border-zinc-200 p-2 dark:border-zinc-700">
                {docs.map((d) => (
                  <label key={d.id} className="flex cursor-pointer items-center gap-2 py-1 text-sm text-zinc-600 transition-colors hover:text-black dark:text-zinc-400 dark:hover:text-white">
                    <input
                      type="checkbox"
                      disabled={isGenerating}
                      checked={selectedDocs.includes(d.id)}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedDocs([...selectedDocs, d.id]);
                        else setSelectedDocs(selectedDocs.filter(id => id !== d.id));
                      }}
                      className="rounded border-zinc-300 accent-black dark:border-zinc-600"
                    />
                    <span className="truncate">{d.title}</span>
                  </label>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-zinc-200 p-3 text-center text-xs text-zinc-500 dark:border-zinc-800">
              No documents found in this subject. Upload some first!
            </div>
          )}

          {/* Topic / Focus Area */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-black dark:text-white">Topic (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Reynolds-Colburn analogy"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              disabled={isGenerating}
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-black outline-none focus:border-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-white disabled:opacity-50"
            />
          </div>

          {/* Format Selector */}
          <div>
            <label className="mb-2 block text-xs font-semibold text-black dark:text-white">Quiz Format</label>
            <div className="grid grid-cols-2 gap-2">
              {formats.map((f) => (
                <button
                  key={f}
                  type="button"
                  disabled={isGenerating}
                  onClick={() => setFormat(f)}
                  className={`rounded-lg border px-3 py-2.5 text-left text-sm transition-colors disabled:opacity-50 ${
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

          {/* Question Count Input */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-black dark:text-white">
              Number of Questions (Max {maxQuestions})
            </label>
            <input
              type="number"
              min={1}
              max={maxQuestions}
              value={questions}
              disabled={isGenerating}
              onChange={(e) => setQuestions(Number(e.target.value))}
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-black outline-none focus:border-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-white disabled:opacity-50"
            />
          </div>
          {/* Visibility */}
          <div>
            <label className="mb-2 block text-xs font-semibold text-black dark:text-white">Visibility</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={isGenerating}
                onClick={() => setIsPublic(false)}
                className={`rounded-lg border px-3 py-2.5 text-left text-sm transition-colors disabled:opacity-50 ${
                  !isPublic
                    ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                    : "border-zinc-200 text-zinc-600 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-500"
                }`}
              >
                Private
              </button>
              <button
                type="button"
                disabled={isGenerating}
                onClick={() => setIsPublic(true)}
                className={`rounded-lg border px-3 py-2.5 text-left text-sm transition-colors disabled:opacity-50 ${
                  isPublic
                    ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                    : "border-zinc-200 text-zinc-600 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-500"
                }`}
              >
                Public
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-7 flex gap-3">
          <button
            onClick={onClose}
            disabled={isGenerating}
            className="flex-1 rounded-full border border-zinc-200 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-500 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerateClick}
            disabled={isGenerating || docs.length === 0 || selectedDocs.length === 0}
            className="flex-1 rounded-full bg-black py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-100 disabled:opacity-50"
          >
            {isGenerating ? "Generating AI Quiz..." : "Generate Quiz"}
          </button>
        </div>
      </div>
    </div>
  );
}