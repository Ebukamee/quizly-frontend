"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { fetchAttemptById } from "../../utilis/helper";
import LatexRenderer from "../../components/LatexRenderer";
import Link from "next/link";
import Spinner from "../../components/Spinner";

function scorePill(score: number) {
  if (score >= 70) return "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400";
  if (score >= 50) return "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400";
  return "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400";
}

function marksPill(awarded: number, total: number) {
  if (total === 0) return "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400";
  const pct = awarded / total;
  if (pct >= 0.7) return "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400";
  if (pct >= 0.5) return "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400";
  return "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400";
}

// 1. SAFE DATE FORMATTER
function safeFormatDate(dateInput?: string | Date) {
  if (!dateInput) return "Recently completed";
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return "Recently completed"; // Catch the "Invalid Date" bug
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

const formatMap: Record<string, string> = {
  MCQ: "MCQ",
  SUBJECTIVE: "Subjective",
  THEORY: "Essay",
  MATH: "Maths",
};

export default function AttemptDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const data = await fetchAttemptById(id as string);
      if (data) setAttempt(data);
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading) return <Spinner />;

  if (!attempt) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-zinc-500">Attempt not found.</p>
        <Link href="/attempts" className="mt-4 text-sm underline">Back to Attempts</Link>
      </div>
    );
  }

  const quizType = attempt.quiz?.type;
  const format = formatMap[quizType] || quizType;
  const isMaths = format === "Maths";
  const isEssay = format === "Essay";
  const isPartial = isMaths || isEssay;

  const questions = attempt.answers || [];

  const totalAwarded = questions.reduce((s: number, q: any) => s + (q.pointsAwarded ?? 0), 0);
  const totalPossible = questions.reduce((s: number, q: any) => s + (q.maxPoints ?? 0), 0);
  const calculatedPercent = totalPossible > 0 ? Math.round((totalAwarded / totalPossible) * 100) : 0;

  return (
    <div className="mx-auto max-w-3xl">
      {/* Back */}
      <Link
        href="/attempts"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-black dark:hover:text-white"
      >
        ← Attempts
      </Link>

      {/* Score card */}
      <div className="mb-6 rounded-xl border border-zinc-200 bg-white p-4 sm:p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-xl font-display text-xl font-bold sm:h-20 sm:w-20 sm:text-2xl ${scorePill(calculatedPercent)}`}>
            {calculatedPercent}%
          </div>
          <div>
            <h2 className="font-display text-base font-bold text-black sm:text-lg dark:text-white">{attempt.quiz?.title || "Untitled Quiz"}</h2>
            <p className="mt-0.5 text-sm text-zinc-500">{attempt.quiz?.subject?.name || "General"} · {format}</p>
            <p className="mt-0.5 text-xs text-zinc-400">
              {/* Uses the new safe date formatter */}
              {safeFormatDate(attempt.createdAt)}
            </p>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              <span className="font-semibold text-black dark:text-white">{totalAwarded}</span>
              {" / "}
              <span className="font-semibold text-black dark:text-white">{totalPossible}</span>
              {" "}{isPartial ? "marks" : "points"}
            </p>
            {isPartial && (
              <p className="mt-0.5 text-xs text-zinc-400">Steps and workings count towards marks</p>
            )}
          </div>
        </div>
      </div>

      {/* Q&A breakdown */}
      <div className="space-y-4">
        {questions.map((q: any, i: number) => {
          const hasMarks = q.pointsAwarded !== undefined && q.maxPoints !== undefined;
          const markRatio = hasMarks && q.maxPoints > 0 ? q.pointsAwarded / q.maxPoints : 0;
          const isFullyCorrect = hasMarks && q.pointsAwarded === q.maxPoints && q.maxPoints > 0;

          const borderColor = hasMarks
            ? markRatio >= 0.7 ? "border-green-200 dark:border-green-900"
            : markRatio >= 0.5 ? "border-amber-200 dark:border-amber-900"
            : "border-red-200 dark:border-red-900"
            : "border-red-200 dark:border-red-900";

          const questionText = q.questionText || "";
          const correctAnswer = q.correctAnswer || "";
          const userAnswer = q.userAnswer || (isMaths ? "[Image Uploaded]" : "");
          const explanation = q.explanation || "";

          // Safe parsing for options array (handles Prisma JSON stringification)
          let optionsArr: string[] = [];
          if (Array.isArray(q.options)) {
            optionsArr = q.options;
          } else if (typeof q.options === 'string') {
            try { optionsArr = JSON.parse(q.options); } catch(e) {}
          }

          return (
            <div key={q.id || i} className={`rounded-xl border bg-white p-4 sm:p-5 dark:bg-zinc-900 ${borderColor}`}>
              <div className="mb-3 flex items-start justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Q{i + 1}</p>
                {isPartial ? (
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${marksPill(q.pointsAwarded ?? 0, q.maxPoints ?? 1)}`}>
                    {q.pointsAwarded}/{q.maxPoints} marks
                  </span>
                ) : (
                  <span className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${isFullyCorrect ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400" : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400"}`}>
                    {isFullyCorrect ? "✓ Correct" : "✗ Incorrect"}
                  </span>
                )}
              </div>

              <p className="mb-4 text-sm font-medium leading-snug text-black dark:text-white">
                <LatexRenderer text={questionText} />
              </p>

              {/* Maths */}
              {isMaths && (
                <div className="space-y-2">
                  {q.userSteps && (
                    <div className="rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-800">
                      <p className="mb-2 text-xs font-semibold text-zinc-400">Your workings</p>
                      <div className="space-y-1 text-sm text-zinc-700 dark:text-zinc-300">
                        {q.userSteps.split("\\n").map((line: string, li: number) => (
                          <p key={li}><LatexRenderer text={line} /></p>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className={`rounded-lg px-4 py-2.5 text-sm ${markRatio >= 1 ? "bg-green-50 dark:bg-green-950/40" : markRatio >= 0.5 ? "bg-amber-50 dark:bg-amber-950/40" : "bg-red-50 dark:bg-red-950/40"}`}>
                    <p className="mb-0.5 text-xs font-semibold text-zinc-400">Your answer</p>
                    <p className="text-zinc-800 dark:text-zinc-200"><LatexRenderer text={userAnswer} /></p>
                  </div>
                  {q.expectedSteps && (
                    <div className="rounded-lg border border-zinc-100 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-800/60">
                      <p className="mb-2 text-xs font-semibold text-zinc-400">Expected workings</p>
                      <div className="mb-3 space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                        {q.expectedSteps.split("\\n").map((line: string, li: number) => (
                          <p key={li}><LatexRenderer text={line} /></p>
                        ))}
                      </div>
                      {correctAnswer && (
                        <div className="border-t border-zinc-100 pt-2.5 dark:border-zinc-700">
                          <p className="mb-0.5 text-xs font-semibold text-zinc-400">Expected final value</p>
                          <p className="text-sm text-green-700 dark:text-green-400"><LatexRenderer text={correctAnswer} /></p>
                        </div>
                      )}
                    </div>
                  )}
                  {!q.expectedSteps && correctAnswer && (
                    <div className="rounded-lg border border-zinc-100 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-800/60">
                      <p className="mb-0.5 text-xs font-semibold text-zinc-400">Expected final value</p>
                      <p className="text-sm text-green-700 dark:text-green-400"><LatexRenderer text={correctAnswer} /></p>
                    </div>
                  )}
                </div>
              )}

              {/* Essay */}
              {isEssay && (
                <div className="space-y-2">
                  <div className={`rounded-lg px-4 py-3 text-sm ${markRatio >= 0.7 ? "bg-green-50 dark:bg-green-950/40" : "bg-amber-50 dark:bg-amber-950/40"}`}>
                    <p className="mb-1 text-xs font-semibold text-zinc-400">Your response</p>
                    <p className="leading-relaxed text-zinc-800 dark:text-zinc-200">{userAnswer}</p>
                  </div>
                  {q.keyPoints && (
                    <div className="rounded-lg border border-zinc-100 bg-white px-4 py-3 text-sm dark:border-zinc-800 dark:bg-zinc-800/60">
                      <p className="mb-1 text-xs font-semibold text-zinc-400">Grading Rubric / Key Points</p>
                      <p className="leading-relaxed text-zinc-600 dark:text-zinc-400">{q.keyPoints}</p>
                    </div>
                  )}
                  {explanation && (
                    <div className="rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-800">
                      <p className="mb-1 text-xs font-semibold text-zinc-400">AI Feedback</p>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">{explanation}</p>
                    </div>
                  )}
                </div>
              )}

              {/* MCQ & Subjective */}
              {!isMaths && !isEssay && (
                <div className="space-y-2">
                  
                  {/* 2. THE NEW MCQ OPTIONS RENDERER */}
                  {optionsArr.length > 0 ? (
                    <div className="mt-4 space-y-2">
                      {optionsArr.map((opt: string, optIdx: number) => {
                        const label = String.fromCharCode(65 + optIdx);
                        const isUserChoice = (userAnswer || "").toUpperCase() === label;
                        
                        // Check if this option is the correct one (handling both raw text and single letter formats)
                        const isCorrectChoice = 
                          (correctAnswer.length === 1 && correctAnswer.toUpperCase() === label) || 
                          (opt.trim().toLowerCase() === correctAnswer.trim().toLowerCase());

                        let optClass = "border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/50";
                        let labelClass = "border-zinc-400 text-zinc-500 dark:border-zinc-500 dark:text-zinc-400";

                        if (isCorrectChoice) {
                          optClass = "border-green-500 bg-green-50 dark:border-green-500/50 dark:bg-green-900/20 text-green-800 dark:text-green-300";
                          labelClass = "border-green-600/50 text-green-700 dark:border-green-400/50 dark:text-green-400";
                        } else if (isUserChoice && !isCorrectChoice) {
                          optClass = "border-red-500 bg-red-50 dark:border-red-500/50 dark:bg-red-900/20 text-red-800 dark:text-red-300";
                          labelClass = "border-red-600/50 text-red-700 dark:border-red-400/50 dark:text-red-400";
                        }

                        return (
                          <div key={optIdx} className={`flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-sm ${optClass}`}>
                            <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold ${labelClass}`}>
                              {label}
                            </span>
                            <div className="flex-1"><LatexRenderer text={opt} /></div>
                            
                            {/* Badges indicating user choice vs correct answer */}
                            <div className="flex shrink-0 gap-2">
                              {isUserChoice && !isCorrectChoice && (
                                <span className="rounded-md bg-red-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-700 dark:bg-red-900/50 dark:text-red-400">Your Answer</span>
                              )}
                              {isCorrectChoice && (
                                <span className="rounded-md bg-green-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-green-700 dark:bg-green-900/50 dark:text-green-400">Correct Answer</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    /* Fallback for Subjective (which has no options array) */
                    <>
                      <div className={`rounded-lg px-4 py-2.5 text-sm ${isFullyCorrect ? "bg-green-50 dark:bg-green-950/40" : "bg-red-50 dark:bg-red-950/40"}`}>
                        <p className="mb-0.5 text-xs font-semibold text-zinc-400">Your answer</p>
                        <p className={isFullyCorrect ? "text-green-800 dark:text-green-300" : "text-red-800 dark:text-red-300"}>
                          <LatexRenderer text={userAnswer} />
                        </p>
                      </div>
                      {!isFullyCorrect && correctAnswer && (
                        <div className="rounded-lg bg-green-50 px-4 py-2.5 text-sm dark:bg-green-950/40">
                          <p className="mb-0.5 text-xs font-semibold text-zinc-400">Correct answer</p>
                          <p className="text-green-800 dark:text-green-300">
                            <LatexRenderer text={correctAnswer} />
                          </p>
                        </div>
                      )}
                    </>
                  )}

                  {explanation && quizType !== 'MCQ' && (
                    <div className="mt-3 rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-800">
                      <p className="mb-1 text-xs font-semibold text-zinc-400">Feedback</p>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">{explanation}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}