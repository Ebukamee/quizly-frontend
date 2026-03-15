"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { quizzes } from "../../lib/mockData";
import Spinner from "../../components/Spinner";
import LatexRenderer from "../../components/LatexRenderer";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, ArrowRight01Icon, Clock01Icon } from "@hugeicons/core-free-icons";

type MathsAnswer = { workings: string; answer: string };

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

export default function TakeQuizPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const quiz = quizzes.find((q) => q.id === id);

  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [mathsAnswers, setMathsAnswers] = useState<Record<string, MathsAnswer>>({});

  // Total elapsed timer only
  const [elapsed, setElapsed] = useState(0);
  const elapsedRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setLoading(false);
    elapsedRef.current = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => { if (elapsedRef.current) clearInterval(elapsedRef.current); };
  }, []);

  if (loading) return <Spinner />;

  if (!quiz) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-zinc-500">Quiz not found.</p>
        <Link href="/quiz" className="mt-4 text-sm underline">Back to Quizzes</Link>
      </div>
    );
  }

  const question = quiz.questions[current];
  const isLast = current === quiz.questions.length - 1;
  const progress = ((current + 1) / quiz.questions.length) * 100;

  const isMCQ = quiz.format === "MCQ";
  const isSubjective = quiz.format === "Subjective";
  const isEssay = quiz.format === "Essay";
  const isMaths = quiz.format === "Maths";

  const currentAnswer = answers[question.id] ?? "";
  const currentMaths = mathsAnswers[question.id] ?? { workings: "", answer: "" };

  function isAnswered(qId: string) {
    if (isMaths) return (mathsAnswers[qId]?.answer ?? "").trim().length > 0;
    return (answers[qId] ?? "").trim().length > 0;
  }

  function handleAnswer(value: string) {
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
  }

  function handleMaths(field: keyof MathsAnswer, value: string) {
    setMathsAnswers((prev) => ({
      ...prev,
      [question.id]: { ...currentMaths, [field]: value },
    }));
  }

  function handleNext() {
    if (isLast) {
      if (elapsedRef.current) clearInterval(elapsedRef.current);
      router.push("/attempts/a1");
    } else {
      setCurrent((c) => c + 1);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Back link */}
      <Link
        href="/quiz"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-black dark:hover:text-white"
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
        {quiz.title}
      </Link>

      {/* Progress bar + timer */}
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
          Q {current + 1} of {quiz.questions.length}
        </p>
        <div className="flex items-center gap-1.5 text-xs font-semibold tabular-nums text-zinc-500 dark:text-zinc-400">
          <HugeiconsIcon icon={Clock01Icon} size={12} />
          {formatTime(elapsed)}
        </div>
      </div>
      <div className="mb-6 h-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
        <div
          className="h-full rounded-full bg-black transition-all duration-300 dark:bg-white"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question card */}
      <div className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-4 flex gap-2">
          <span className="rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-0.5 text-xs text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800">
            {quiz.subjectName}
          </span>
          <span className="rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-0.5 text-xs text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800">
            {quiz.format}
          </span>
        </div>

        <p className="mb-6 text-base font-medium leading-snug text-black dark:text-white">
          <LatexRenderer text={question.text} />
        </p>

        {/* MCQ options */}
        {isMCQ && question.options && (
          <div className="space-y-2">
            {question.options.map((opt) => (
              <button
                key={opt.label}
                type="button"
                onClick={() => handleAnswer(opt.label)}
                className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm transition-colors ${
                  currentAnswer === opt.label
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : "border border-zinc-200 text-zinc-700 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-500"
                }`}
              >
                <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold ${
                  currentAnswer === opt.label
                    ? "border-white/30 dark:border-black/30"
                    : "border-zinc-300 dark:border-zinc-600"
                }`}>
                  {opt.label}
                </span>
                <LatexRenderer text={opt.text} />
              </button>
            ))}
          </div>
        )}

        {/* Subjective */}
        {isSubjective && (
          <input
            type="text"
            value={currentAnswer}
            onChange={(e) => handleAnswer(e.target.value)}
            placeholder="Type your answer…"
            className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-black outline-none focus:border-black dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:border-white"
          />
        )}

        {/* Essay */}
        {isEssay && (
          <textarea
            rows={6}
            value={currentAnswer}
            onChange={(e) => handleAnswer(e.target.value)}
            placeholder="Write your essay response here…"
            className="w-full resize-none rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm text-black outline-none focus:border-black dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:border-white"
          />
        )}

        {/* Maths */}
        {isMaths && (
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-zinc-500">Show your workings</label>
              <textarea
                rows={4}
                value={currentMaths.workings}
                onChange={(e) => handleMaths("workings", e.target.value)}
                placeholder="Write out your steps here… (LaTeX supported, e.g. $2x + 3$)"
                className="w-full resize-none rounded-lg border border-zinc-200 bg-zinc-50 p-4 font-mono text-sm text-black outline-none focus:border-black dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:border-white"
              />
              {currentMaths.workings.trim() && (
                <div className="mt-2 rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-2.5 dark:border-zinc-800 dark:bg-zinc-800">
                  <p className="mb-1 text-[10px] text-zinc-400">Preview</p>
                  <p className="text-sm text-black dark:text-white">
                    <LatexRenderer text={currentMaths.workings} />
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-zinc-500">Final answer</label>
              <input
                type="text"
                value={currentMaths.answer}
                onChange={(e) => handleMaths("answer", e.target.value)}
                placeholder="e.g. $x = 4$ or 42"
                className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 font-mono text-sm text-black outline-none focus:border-black dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:border-white"
              />
              {currentMaths.answer.trim() && (
                <div className="mt-2 rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-2.5 dark:border-zinc-800 dark:bg-zinc-800">
                  <p className="mb-1 text-[10px] text-zinc-400">Preview</p>
                  <p className="text-sm text-black dark:text-white">
                    <LatexRenderer text={currentMaths.answer} />
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="mt-5 flex items-center justify-between">
        <button
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          disabled={current === 0}
          className="inline-flex h-10 items-center gap-1.5 rounded-full border border-zinc-200 px-3 text-sm font-semibold text-zinc-700 transition-colors hover:border-zinc-400 disabled:pointer-events-none disabled:opacity-30 sm:gap-2 sm:px-5 dark:border-zinc-700 dark:text-zinc-300"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={13} />
          Back
        </button>

        <button
          onClick={handleNext}
          className="inline-flex h-10 items-center gap-1.5 rounded-full bg-black px-4 text-sm font-semibold text-white transition-all hover:bg-zinc-800 active:scale-[0.97] sm:gap-2 sm:px-6 dark:bg-white dark:text-black dark:hover:bg-zinc-100"
        >
          {isLast ? "Submit Quiz" : "Next"}
          {!isLast && <HugeiconsIcon icon={ArrowRight01Icon} size={13} />}
        </button>
      </div>

      {/* Question number grid */}
      <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-zinc-400">Questions</p>
        <div className="flex flex-wrap gap-2">
          {quiz.questions.map((q, i) => {
            const answered = isAnswered(q.id);
            const isCurrent = i === current;
            return (
              <button
                key={q.id}
                onClick={() => setCurrent(i)}
                className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold transition-all ${
                  isCurrent
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : answered
                    ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/40 dark:text-green-400 dark:hover:bg-green-900/60"
                    : "bg-red-50 text-red-500 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40"
                }`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
        <div className="mt-3 flex items-center gap-4 text-[11px] text-zinc-400">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-sm bg-green-400" />
            Answered
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-sm bg-red-400" />
            Not answered
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-sm bg-black dark:bg-white" />
            Current
          </span>
        </div>
      </div>
    </div>
  );
}
