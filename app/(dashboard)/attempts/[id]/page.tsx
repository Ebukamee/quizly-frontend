import { attempts } from "../../lib/mockData";
import LatexRenderer from "../../components/LatexRenderer";
import Link from "next/link";

function scorePill(score: number) {
  if (score >= 70) return "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400";
  if (score >= 50) return "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400";
  return "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400";
}

function marksPill(awarded: number, total: number) {
  const pct = awarded / total;
  if (pct >= 0.7) return "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400";
  if (pct >= 0.5) return "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400";
  return "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400";
}

export default async function AttemptDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const attempt = attempts.find((a) => a.id === id);

  if (!attempt) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-zinc-500">Attempt not found.</p>
        <Link href="/attempts" className="mt-4 text-sm underline">Back to Attempts</Link>
      </div>
    );
  }

  const isMaths = attempt.format === "Maths";
  const isEssay = attempt.format === "Essay";
  const isPartial = isMaths || isEssay;

  const totalAwarded = isPartial
    ? attempt.questions.reduce((s, q) => s + (q.marksAwarded ?? 0), 0)
    : attempt.questions.filter((q) => q.isCorrect).length;
  const totalPossible = isPartial
    ? attempt.questions.reduce((s, q) => s + (q.totalMarks ?? 0), 0)
    : attempt.questions.length;

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
      <div className="mb-6 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center gap-6">
          <div className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-xl font-display text-2xl font-bold ${scorePill(attempt.score)}`}>
            {attempt.score}%
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-black dark:text-white">{attempt.quizTitle}</h2>
            <p className="mt-0.5 text-sm text-zinc-500">{attempt.subjectName} · {attempt.format}</p>
            <p className="mt-0.5 text-xs text-zinc-400">{attempt.date}</p>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              <span className="font-semibold text-black dark:text-white">{totalAwarded}</span>
              {" / "}
              <span className="font-semibold text-black dark:text-white">{totalPossible}</span>
              {" "}{isPartial ? "marks" : "correct"}
            </p>
            {isPartial && (
              <p className="mt-0.5 text-xs text-zinc-400">Steps and workings count towards marks</p>
            )}
          </div>
        </div>
      </div>

      {/* Q&A breakdown */}
      <div className="space-y-4">
        {attempt.questions.map((q, i) => {
          const hasMarks = q.marksAwarded !== undefined && q.totalMarks !== undefined;
          const markRatio = hasMarks ? q.marksAwarded! / q.totalMarks! : 0;

          const borderColor = hasMarks
            ? markRatio >= 0.7 ? "border-green-200 dark:border-green-900"
            : markRatio >= 0.5 ? "border-amber-200 dark:border-amber-900"
            : "border-red-200 dark:border-red-900"
            : q.isCorrect ? "border-green-200 dark:border-green-900" : "border-red-200 dark:border-red-900";

          return (
            <div key={q.questionId} className={`rounded-xl border bg-white p-5 dark:bg-zinc-900 ${borderColor}`}>
              <div className="mb-3 flex items-start justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Q{i + 1}</p>
                {hasMarks ? (
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${marksPill(q.marksAwarded!, q.totalMarks!)}`}>
                    {q.marksAwarded}/{q.totalMarks} marks
                  </span>
                ) : (
                  <span className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${q.isCorrect ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400" : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400"}`}>
                    {q.isCorrect ? "✓" : "✗"}
                    {q.isCorrect ? " Correct" : " Incorrect"}
                  </span>
                )}
              </div>

              <p className="mb-4 text-sm font-medium leading-snug text-black dark:text-white">
                <LatexRenderer text={q.questionText} />
              </p>

              {/* Maths */}
              {isMaths && (
                <div className="space-y-2">
                  {q.userWorkings && (
                    <div className="rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-800">
                      <p className="mb-2 text-xs font-semibold text-zinc-400">Your workings</p>
                      <div className="space-y-1 text-sm text-zinc-700 dark:text-zinc-300">
                        {q.userWorkings.split("\\n").map((line, li) => (
                          <p key={li}><LatexRenderer text={line} /></p>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className={`rounded-lg px-4 py-2.5 text-sm ${markRatio >= 1 ? "bg-green-50 dark:bg-green-950/40" : markRatio >= 0.5 ? "bg-amber-50 dark:bg-amber-950/40" : "bg-red-50 dark:bg-red-950/40"}`}>
                    <p className="mb-0.5 text-xs font-semibold text-zinc-400">Your final answer</p>
                    <p className="text-zinc-800 dark:text-zinc-200"><LatexRenderer text={q.userAnswer} /></p>
                  </div>
                  <div className="rounded-lg border border-zinc-100 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-800/60">
                    {q.correctWorkings && (
                      <>
                        <p className="mb-1.5 text-xs font-semibold text-zinc-400">Model workings</p>
                        <div className="mb-3 space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                          {q.correctWorkings.split("\\n").map((line, li) => (
                            <p key={li}><LatexRenderer text={line} /></p>
                          ))}
                        </div>
                      </>
                    )}
                    <div className={q.correctWorkings ? "border-t border-zinc-100 pt-2.5 dark:border-zinc-700" : ""}>
                      <p className="mb-0.5 text-xs font-semibold text-zinc-400">Correct answer</p>
                      <p className="text-sm text-green-700 dark:text-green-400"><LatexRenderer text={q.correctAnswer} /></p>
                    </div>
                  </div>
                </div>
              )}

              {/* Essay */}
              {isEssay && (
                <div className="space-y-2">
                  <div className={`rounded-lg px-4 py-3 text-sm ${markRatio >= 0.7 ? "bg-green-50 dark:bg-green-950/40" : "bg-amber-50 dark:bg-amber-950/40"}`}>
                    <p className="mb-1 text-xs font-semibold text-zinc-400">Your response</p>
                    <p className="leading-relaxed text-zinc-800 dark:text-zinc-200">{q.userAnswer}</p>
                  </div>
                  <div className="rounded-lg border border-zinc-100 bg-white px-4 py-3 text-sm dark:border-zinc-800 dark:bg-zinc-800/60">
                    <p className="mb-1 text-xs font-semibold text-zinc-400">Model answer</p>
                    <p className="leading-relaxed text-zinc-600 dark:text-zinc-400">{q.correctAnswer}</p>
                  </div>
                </div>
              )}

              {/* MCQ / Subjective */}
              {!isMaths && !isEssay && (
                <div className="space-y-2">
                  <div className={`rounded-lg px-4 py-2.5 text-sm ${q.isCorrect ? "bg-green-50 dark:bg-green-950/40" : "bg-red-50 dark:bg-red-950/40"}`}>
                    <p className="mb-0.5 text-xs font-semibold text-zinc-400">Your answer</p>
                    <p className={q.isCorrect ? "text-green-800 dark:text-green-300" : "text-red-800 dark:text-red-300"}>
                      <LatexRenderer text={q.userAnswer} />
                    </p>
                  </div>
                  {!q.isCorrect && (
                    <div className="rounded-lg bg-green-50 px-4 py-2.5 text-sm dark:bg-green-950/40">
                      <p className="mb-0.5 text-xs font-semibold text-zinc-400">Correct answer</p>
                      <p className="text-green-800 dark:text-green-300">
                        <LatexRenderer text={q.correctAnswer} />
                      </p>
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
