"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Spinner from "../../../(dashboard)/components/Spinner";
import LatexRenderer from "../../../(dashboard)/components/LatexRenderer";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, ArrowRight01Icon, Clock01Icon, Upload01Icon } from "@hugeicons/core-free-icons";
import { fetchQuizById, submitAttempt, prepareImageForAI } from "../../../(dashboard)/utilis/helper";

type MathsAnswer = { fileName: string; dataUrl: string; file?: File };

const TWO_HOURS = 2 * 60 * 60;

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

export default function PublicTakeQuizPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "warning" | "success" | "error" } | null>(null);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [mathsAnswers, setMathsAnswers] = useState<Record<string, MathsAnswer>>({});
  const [studentName, setStudentName] = useState("");
  const mathsFileRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [elapsed, setElapsed] = useState(0);
  const elapsedRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedAtRef = useRef<number>(Date.now());
  const initializedRef = useRef(false);
  const sessionKey = `public_quiz_session_${id}`;

  const clearSession = () => {
    localStorage.removeItem(sessionKey);
  };

  useEffect(() => {
    const loadQuiz = async () => {
      setLoading(true);
      const fetchedQuiz = await fetchQuizById(id as string);

      if (fetchedQuiz) {
        // Block private quizzes from being taken on public route
        if (!fetchedQuiz.isPublic) {
          router.replace("/");
          return;
        }

        let rawQuestions = [];
        if (fetchedQuiz.type === "MCQ") rawQuestions = fetchedQuiz.mcqQuestions;
        else if (fetchedQuiz.type === "SUBJECTIVE") rawQuestions = fetchedQuiz.subjectiveQuestions;
        else if (fetchedQuiz.type === "THEORY") rawQuestions = fetchedQuiz.theoryQuestions;
        else if (fetchedQuiz.type === "MATH") rawQuestions = fetchedQuiz.mathQuestions;

        const normalizedQuestions = rawQuestions.map((q: any) => ({
          id: q.id,
          text: q.questionText,
          options:
            fetchedQuiz.type === "MCQ"
              ? q.options.map((optText: string, idx: number) => ({
                  label: String.fromCharCode(65 + idx),
                  text: optText,
                }))
              : undefined,
        }));

        const formatMap: Record<string, string> = {
          MCQ: "MCQ",
          SUBJECTIVE: "Subjective",
          THEORY: "Essay",
          MATH: "Maths",
        };

        setQuiz({
          ...fetchedQuiz,
          format: formatMap[fetchedQuiz.type] || fetchedQuiz.type,
          subjectName: fetchedQuiz.subject?.name || "General",
          questions: normalizedQuestions,
        });
      }

      let startAt = Date.now();
      const saved = localStorage.getItem(sessionKey);

      if (saved) {
        try {
          const session = JSON.parse(saved);
          const elapsedSoFar = Math.floor((Date.now() - session.startedAt) / 1000);

          if (elapsedSoFar < TWO_HOURS) {
            startAt = session.startedAt;
            setAnswers(session.answers || {});
            const restoredMaths: Record<string, MathsAnswer> = {};
            for (const [qId, val] of Object.entries(session.mathsAnswers || {})) {
              const v = val as any;
              restoredMaths[qId] = { fileName: v.fileName || "", dataUrl: v.dataUrl || "" };
            }
            setMathsAnswers(restoredMaths);
            setStudentName(session.studentName || "");
            setCurrent(session.current || 0);
          } else {
            localStorage.removeItem(sessionKey);
          }
        } catch {
          localStorage.removeItem(sessionKey);
        }
      }

      startedAtRef.current = startAt;
      initializedRef.current = true;
      setLoading(false);

      elapsedRef.current = setInterval(() => {
        const secs = Math.floor((Date.now() - startedAtRef.current) / 1000);
        if (secs >= TWO_HOURS) {
          clearInterval(elapsedRef.current!);
          localStorage.removeItem(sessionKey);
          setAnswers({});
          setMathsAnswers({});
          setCurrent(0);
          startedAtRef.current = Date.now();
          setElapsed(0);
        } else {
          setElapsed(secs);
        }
      }, 1000);
    };

    loadQuiz();
    return () => {
      if (elapsedRef.current) clearInterval(elapsedRef.current);
    };
  }, [id]);

  useEffect(() => {
    if (!initializedRef.current) return;
    const mathsMeta: Record<string, { fileName: string }> = {};
    for (const [qId, val] of Object.entries(mathsAnswers)) {
      if (val.fileName) mathsMeta[qId] = { fileName: val.fileName };
    }
    localStorage.setItem(
      sessionKey,
      JSON.stringify({
        startedAt: startedAtRef.current,
        answers,
        mathsAnswers: mathsMeta,
        studentName,
        current,
      })
    );
  }, [answers, mathsAnswers, studentName, current, sessionKey]);

  const showToast = (message: string, type: "warning" | "success" | "error") => {
    setToast({ message, type });
    if (type !== "warning") setTimeout(() => setToast(null), 3000);
  };

  if (loading) return <Spinner />;

  // Always show name slide at current === 0
  const nameSlide = current === 0;
  const qIndex = current - 1;
  const totalSlides = quiz?.questions.length + 1;
  const question = nameSlide ? null : quiz?.questions[qIndex];
  const isLast = current === totalSlides - 1;
  const progress = ((current + 1) / totalSlides) * 100;

  const isMCQ = quiz?.format === "MCQ";
  const isSubjective = quiz?.format === "Subjective";
  const isEssay = quiz?.format === "Essay";
  const isMaths = quiz?.format === "Maths";

  const currentAnswer = answers[question?.id] ?? "";
  const currentMaths = mathsAnswers[question?.id] ?? { fileName: "", dataUrl: "" };

  function isAnswered(qId: string) {
    if (isMaths) return !!mathsAnswers[qId]?.dataUrl;
    return (answers[qId] ?? "").trim().length > 0;
  }

  function handleAnswer(value: string) {
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
  }

  function handleMathsFile(file: File) {
    if (file.size > 4 * 1024 * 1024) {
      showToast("File too large. Please use an image under 4MB.", "error");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setMathsAnswers((prev) => ({
        ...prev,
        [question.id]: { fileName: file.name, dataUrl: reader.result as string, file },
      }));
    };
    reader.readAsDataURL(file);
  }

  function handleMathsFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) handleMathsFile(e.target.files[0]);
  }

  function handleMathsDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 1) {
      showToast("Only one image per question is allowed.", "error");
      return;
    }
    if (e.dataTransfer.files && e.dataTransfer.files[0]) handleMathsFile(e.dataTransfer.files[0]);
  }

  function clearMathsFile() {
    setMathsAnswers((prev) => ({
      ...prev,
      [question.id]: { fileName: "", dataUrl: "" },
    }));
    if (mathsFileRef.current) mathsFileRef.current.value = "";
  }

  async function handleNext() {
    if (nameSlide) {
      if (!studentName.trim()) {
        showToast("Please enter your name to continue.", "error");
        return;
      }
      setCurrent((c) => c + 1);
      return;
    }

    if (isLast) {
      if (isSubmitting) return;
      if (!studentName.trim()) {
        showToast("Please go back and enter your name.", "error");
        return;
      }
      setIsSubmitting(true);
      showToast("Grading your quiz...", "warning");

      try {
        const formattedAnswers = await Promise.all(
          quiz.questions.map(async (q: any) => {
            const mathData = mathsAnswers[q.id];
            let base64 = undefined;
            let mime = undefined;

            if (mathData?.file instanceof File) {
              const processed = await prepareImageForAI(mathData.file);
              base64 = processed.base64;
              mime = processed.mimeType;
            } else if (mathData?.dataUrl) {
              const [prefix, b64] = mathData.dataUrl.split(",");
              base64 = b64;
              mime = prefix.split(":")[1]?.split(";")[0];
            }

            return {
              questionId: q.id,
              questionType: quiz.type,
              userAnswer: answers[q.id] || "",
              maxPoints: quiz.type === "THEORY" ? 10 : 1,
              imageBase64: base64,
              mimeType: mime,
            };
          })
        );

        const result = await submitAttempt(id as string, formattedAnswers, studentName.trim());

        if (elapsedRef.current) clearInterval(elapsedRef.current);
        clearSession();
        router.push(`/public/attempts/${result.id}`);
      } catch (err: any) {
        showToast(err.message || "Error submitting quiz", "error");
        setIsSubmitting(false);
      }
    } else {
      setCurrent((c) => c + 1);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-black dark:hover:text-white">
          <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
          {quiz.title}
        </Link>
      </div>

      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
          {nameSlide ? "Before we start" : `Q ${qIndex + 1} of ${quiz.questions.length}`}
        </p>
        <div className="flex items-center gap-1.5 text-xs font-semibold tabular-nums text-zinc-500 dark:text-zinc-400">
          <HugeiconsIcon icon={Clock01Icon} size={12} />
          {formatTime(elapsed)}
        </div>
      </div>
      <div className="mb-6 h-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
        <div className="h-full rounded-full bg-black transition-all duration-300 dark:bg-white" style={{ width: `${progress}%` }} />
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-4 flex gap-2">
          <span className="rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-0.5 text-xs text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800">{quiz.subjectName}</span>
          <span className="rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-0.5 text-xs text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800">{quiz.format}</span>
          <span className="rounded-md border border-green-200 bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-600 dark:border-green-800 dark:bg-green-900/30 dark:text-green-400">
            Public
          </span>
        </div>

        {nameSlide ? (
          <div>
            <p className="mb-1 text-base font-medium text-black dark:text-white">What&apos;s your name?</p>
            <p className="mb-5 text-sm text-zinc-500">Enter your name so your attempt can be identified.</p>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Your full name"
              autoFocus
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-black outline-none focus:border-black dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:border-white"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleNext();
              }}
            />
          </div>
        ) : (
          <>
            <p className="mb-6 text-base font-medium leading-snug text-black dark:text-white">
              <LatexRenderer text={question.text} />
            </p>

            {isMCQ && question.options && (
              <div className="space-y-2">
                {question.options.map((opt: any) => (
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
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold ${
                        currentAnswer === opt.label ? "border-white/30 dark:border-black/30" : "border-zinc-300 dark:border-zinc-600"
                      }`}
                    >
                      {opt.label}
                    </span>
                    <LatexRenderer text={opt.text} />
                  </button>
                ))}
              </div>
            )}

            {isSubjective && (
              <input
                type="text"
                value={currentAnswer}
                onChange={(e) => handleAnswer(e.target.value)}
                placeholder="Type your answer…"
                className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-black outline-none focus:border-black dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:border-white"
              />
            )}
            {isEssay && (
              <textarea
                rows={6}
                value={currentAnswer}
                onChange={(e) => handleAnswer(e.target.value)}
                placeholder="Write your essay response here…"
                className="w-full resize-none rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-sm text-black outline-none focus:border-black dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:border-white"
              />
            )}

            {isMaths && (
              <div className="space-y-3">
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Upload an image of your handwritten answer. Ensure your{" "}
                  <span className="font-semibold text-zinc-700 dark:text-zinc-300">final answer is clearly labeled</span>.
                </p>
                <input type="file" ref={mathsFileRef} onChange={handleMathsFileSelect} className="hidden" accept=".png,.jpg,.jpeg,.heic,.pdf" />
                {currentMaths.dataUrl || currentMaths.fileName ? (
                  <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800">
                    {currentMaths.dataUrl && currentMaths.dataUrl.startsWith("data:image/") && (
                      <img src={currentMaths.dataUrl} alt="Uploaded answer" className="mb-3 max-h-64 w-full rounded-lg object-contain" />
                    )}
                    {!currentMaths.dataUrl && currentMaths.fileName && (
                      <p className="mb-3 text-xs text-amber-600 dark:text-amber-400">Image preview lost after reload. Please re-upload to submit.</p>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex min-w-0 items-center gap-2">
                        <HugeiconsIcon icon={Upload01Icon} size={14} className="shrink-0 text-zinc-400" />
                        <p className="truncate text-sm font-medium text-black dark:text-white">{currentMaths.fileName}</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <button type="button" onClick={() => mathsFileRef.current?.click()} className="text-xs font-semibold text-zinc-500 hover:text-black dark:hover:text-white">
                          Replace
                        </button>
                        <button type="button" onClick={clearMathsFile} className="text-xs font-semibold text-red-500 hover:text-red-700">
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleMathsDrop}
                    onClick={() => mathsFileRef.current?.click()}
                    className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed py-8 transition-colors ${
                      isDragging ? "border-black bg-zinc-50 dark:border-white dark:bg-zinc-800" : "border-zinc-200 dark:border-zinc-700"
                    }`}
                  >
                    <HugeiconsIcon icon={Upload01Icon} size={24} className="mb-2 text-zinc-400" />
                    <p className="text-sm text-zinc-500">Drag & drop your answer here or click to browse</p>
                    <p className="mt-1 text-xs text-zinc-400">PNG, JPG, HEIC, or PDF</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <div className="mt-5 flex items-center justify-between">
        <button
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          disabled={current === 0 || isSubmitting}
          className="inline-flex h-10 items-center gap-1.5 rounded-full border border-zinc-200 px-3 text-sm font-semibold text-zinc-700 transition-colors hover:border-zinc-400 disabled:pointer-events-none disabled:opacity-30 sm:gap-2 sm:px-5 dark:border-zinc-700 dark:text-zinc-300"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={13} /> Back
        </button>
        <button
          onClick={handleNext}
          disabled={isSubmitting}
          className="inline-flex h-10 items-center gap-1.5 rounded-full bg-black px-4 text-sm font-semibold text-white transition-all hover:bg-zinc-800 active:scale-[0.97] disabled:opacity-50 sm:gap-2 sm:px-6 dark:bg-white dark:text-black dark:hover:bg-zinc-100"
        >
          {nameSlide ? "Start" : isLast ? (isSubmitting ? "Grading..." : "Submit Quiz") : "Next"}
          {!isLast && !nameSlide && <HugeiconsIcon icon={ArrowRight01Icon} size={13} />}
        </button>
      </div>

      <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-zinc-400">Questions</p>
        <div className="flex flex-wrap gap-2">
          {quiz?.questions.map((q: any, i: number) => {
            const slideIdx = i + 1;
            return (
              <button
                key={q.id}
                disabled={isSubmitting}
                onClick={() => setCurrent(slideIdx)}
                className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold transition-all ${
                  slideIdx === current
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : isAnswered(q.id)
                    ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/40 dark:text-green-400 dark:hover:bg-green-900/60"
                    : "bg-red-50 text-red-500 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40"
                }`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      </div>

      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg transition-all ${
            toast.type === "warning" ? "bg-yellow-500" : toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}
