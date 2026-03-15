"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { fetchSubjectById, uploadDocument, deleteSubjectById, deleteDocumentById } from "../../utilis/helper";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, Upload01Icon, File01Icon, MoreVerticalIcon } from "@hugeicons/core-free-icons";
import Spinner from "../../components/Spinner";

export default function SubjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter(); 
  
  const [subject, setSubject] = useState<any>(null);
  const [docs, setDocs] = useState<any[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  // States for the dot menus
  const [isSubjectMenuOpen, setIsSubjectMenuOpen] = useState(false);
  const [openDocMenuId, setOpenDocMenuId] = useState<string | null>(null);

  // States for Toasts and Modal
  const [toast, setToast] = useState<{ message: string; type: "warning" | "success" | "error" } | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; type: "subject" | "document"; targetId?: string }>({
    isOpen: false,
    type: "subject",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadSubjectData = async () => {
    if (!id) return;
    const data = await fetchSubjectById(id as string);
    if (data) {
      setSubject(data);
      setDocs(data.documents || []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadSubjectData();
  }, [id]);

  const showToast = (message: string, type: "warning" | "success" | "error") => {
    setToast({ message, type });
    // Auto-hide success and error toasts after 3 seconds
    if (type !== "warning") {
      setTimeout(() => setToast(null), 3000);
    }
  };

  // Handles both the drag-and-drop and the manual file selection
  const handleFileUpload = async (file: File) => {
    if (!file || !id) return;
    setIsUploading(true);

    const res = await uploadDocument(file, id as string);
    if (res) {
      loadSubjectData(); // Instantly refresh the list to show the new document
    }

    setIsUploading(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  // 1. Trigger Modals instead of instant deletion
  const triggerSubjectDelete = () => {
    setIsSubjectMenuOpen(false);
    setDeleteModal({ isOpen: true, type: "subject" });
  };

  const triggerDocumentDelete = (docId: string) => {
    setOpenDocMenuId(null);
    setDeleteModal({ isOpen: true, type: "document", targetId: docId });
  };

  // 2. Execute Actual Deletion from Modal Confirmation
  const confirmDelete = async () => {
    const { type, targetId } = deleteModal;
    setDeleteModal({ isOpen: false, type: "subject" }); // Close modal
    
    showToast("Deleting...", "warning"); // Show yellow deleting toast

    if (type === "subject") {
      const success = await deleteSubjectById(id as string);
      if (success) {
        showToast("Subject deleted successfully", "success");
        // Wait a brief moment so the user sees the success toast before redirecting
        setTimeout(() => router.push("/subjects"), 1000); 
      } else {
        showToast("Failed to delete subject", "error");
      }
    } else if (type === "document" && targetId) {
      const success = await deleteDocumentById(targetId);
      if (success) {
        showToast("Document deleted successfully", "success");
        loadSubjectData(); // Refresh the document list instantly
      } else {
        showToast("Failed to delete document", "error");
      }
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

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

        {/* Action Buttons Container */}
        <div className="flex items-center gap-2">
          {/* Hidden file input for the Upload button */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            accept=".pdf,.txt,.docx"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="inline-flex h-9 items-center gap-2 rounded-full border border-zinc-200 px-3 text-sm font-semibold text-black transition-all hover:border-zinc-400 sm:h-10 sm:px-5 dark:border-zinc-700 dark:text-white dark:hover:border-zinc-500 disabled:opacity-50"
          >
            <HugeiconsIcon icon={Upload01Icon} size={13} />
            <span className="hidden sm:inline">{isUploading ? "Uploading..." : "Upload"}</span>
          </button>

          {/* Subject Dot Menu */}
          <div className="relative">
            <button
              onClick={() => setIsSubjectMenuOpen((prev) => !prev)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 text-zinc-500 transition-all hover:border-zinc-400 hover:text-black sm:h-10 sm:w-10 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-500 dark:hover:text-white"
            >
              <HugeiconsIcon icon={MoreVerticalIcon} size={16} />
            </button>

            {isSubjectMenuOpen && (
              <div className="absolute right-0 mt-2 w-36 rounded-xl border border-zinc-200 bg-white p-1.5 shadow-lg z-10 dark:border-zinc-800 dark:bg-zinc-900">
                <button
                  onClick={triggerSubjectDelete}
                  className="flex w-full items-center justify-start rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10"
                >
                  Delete Subject
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`mb-5 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed py-6 sm:py-10 transition-colors ${isDragging
            ? "border-black bg-zinc-50 dark:border-white dark:bg-zinc-900"
            : "border-zinc-200 dark:border-zinc-800"
          }`}
      >
        <HugeiconsIcon icon={Upload01Icon} size={24} className="mb-3 text-zinc-400" />
        <p className="text-sm text-zinc-500">
          {isUploading ? "Uploading to Supabase..." : "Drag & drop documents here or click to browse"}
        </p>
        <p className="mt-1 text-xs text-zinc-400">PDF, DOCX, TXT up to 20 MB</p>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="border-b border-zinc-100 px-5 py-3.5 dark:border-zinc-800">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Documents</p>
        </div>

        {/* Account for no documents */}
        {docs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-sm text-zinc-500">No documents in this folder yet.</p>
          </div>
        ) : (
          <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {docs.map((doc) => (
              <li key={doc.id} className="flex items-center gap-4 px-5 py-3.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-200 text-zinc-400 dark:border-zinc-700">
                  <HugeiconsIcon icon={File01Icon} size={15} />
                </div>
                <div className="min-w-0 flex-1">
                  {/* Using Prisma's 'title' field and converting the 'createdAt' date */}
                  <p className="truncate text-sm font-medium text-black dark:text-white">{doc.title}</p>
                  <p className="text-xs text-zinc-400">
                    Uploaded {new Date(doc.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Document Dot Menu */}
                <div className="relative shrink-0">
                  <button
                    onClick={() => setOpenDocMenuId((prev) => (prev === doc.id ? null : doc.id))}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-black dark:hover:bg-zinc-800 dark:hover:text-white"
                  >
                    <HugeiconsIcon icon={MoreVerticalIcon} size={16} />
                  </button>

                  {openDocMenuId === doc.id && (
                    <div className="absolute right-0 top-full z-20 mt-1 w-32 rounded-xl border border-zinc-200 bg-white p-1.5 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
                      <button
                        onClick={() => triggerDocumentDelete(doc.id)}
                        className="flex w-full items-center justify-start rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10"
                      >
                        Delete File
                      </button>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* --- CONFIRMATION MODAL --- */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl dark:border dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="font-display text-lg font-bold text-black dark:text-white">
              Delete {deleteModal.type === "subject" ? "Subject" : "Document"}?
            </h3>
            <p className="mt-2 text-sm text-zinc-500">
              Are you sure you want to delete this {deleteModal.type}? This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDeleteModal({ isOpen: false, type: "subject" })}
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