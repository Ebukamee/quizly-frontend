"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { subjects, documents } from "../../lib/mockData";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, Upload01Icon, File01Icon, Delete01Icon } from "@hugeicons/core-free-icons";

export default function SubjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const subject = subjects.find((s) => s.id === id);
  const docs = documents[id] ?? [];
  const [isDragging, setIsDragging] = useState(false);

  if (!subject) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-zinc-500">Subject not found.</p>
        <Link href="/subjects" className="mt-4 text-sm underline">Back to Subjects</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/subjects"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-black dark:hover:text-white"
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
        Subjects
      </Link>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold text-black dark:text-white">{subject.name}</h1>
          <p className="mt-0.5 text-sm text-zinc-500">{docs.length} documents uploaded</p>
        </div>
        <button className="inline-flex h-9 items-center gap-2 rounded-full border border-zinc-200 px-3 text-sm font-semibold text-black transition-all hover:border-zinc-400 sm:h-10 sm:px-5 dark:border-zinc-700 dark:text-white dark:hover:border-zinc-500">
          <HugeiconsIcon icon={Upload01Icon} size={13} />
          <span className="hidden sm:inline">Upload</span>
        </button>
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); }}
        className={`mb-5 flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-6 sm:py-10 transition-colors ${
          isDragging
            ? "border-black bg-zinc-50 dark:border-white dark:bg-zinc-900"
            : "border-zinc-200 dark:border-zinc-800"
        }`}
      >
        <HugeiconsIcon icon={Upload01Icon} size={24} className="mb-3 text-zinc-400" />
        <p className="text-sm text-zinc-500">Drag & drop documents here</p>
        <p className="mt-1 text-xs text-zinc-400">PDF, DOCX, TXT up to 50 MB</p>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="border-b border-zinc-100 px-5 py-3.5 dark:border-zinc-800">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Documents</p>
        </div>
        <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {docs.map((doc) => (
            <li key={doc.id} className="flex items-center gap-4 px-5 py-3.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-200 text-zinc-400 dark:border-zinc-700">
                <HugeiconsIcon icon={File01Icon} size={15} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-black dark:text-white">{doc.name}</p>
                <p className="text-xs text-zinc-400">{doc.size} · {doc.uploadedAt}</p>
              </div>
              <button className="shrink-0 text-zinc-300 transition-colors hover:text-red-500 dark:text-zinc-700 dark:hover:text-red-400">
                <HugeiconsIcon icon={Delete01Icon} size={14} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
