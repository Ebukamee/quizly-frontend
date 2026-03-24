const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://quizly-wr2f.onrender.com";

export const fetchUserSubjects = async () => {
    try {
        const response = await fetch(`${API_URL}/api/subjects`, {
            method: "GET",
            // CRUCIAL: Sends the Better Auth cookie to the Express backend
            credentials: "include",
        });

        if (!response.ok) throw new Error("Failed to fetch subjects");

        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
};

export const createSubject = async (subjectName: string) => {
    try {
        const response = await fetch(`${API_URL}/api/subjects`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ name: subjectName }),
        });

        if (!response.ok) throw new Error("Failed to create subject");

        return await response.json(); // Returns the newly created subject object
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const fetchSubjectById = async (id: string) => {
    try {
        const response = await fetch(`${API_URL}/api/subjects/${id}`, {
            method: "GET",
            // CRUCIAL: Sends the Better Auth cookie
            credentials: "include",
        });

        if (!response.ok) throw new Error("Failed to fetch subject details");

        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const uploadDocument = async (file: File, subjectId: string) => {
    try {
        // 1. Pack the file and data into a raw FormData object
        const formData = new FormData();
        formData.append("file", file);
        formData.append("subjectId", subjectId);
        formData.append("title", file.name);

        const response = await fetch(`${API_URL}/api/documents/upload`, {
            method: "POST",
            credentials: "include",
            // IMPORTANT: Do NOT set the 'Content-Type' header here. 
            // When using FormData, the browser automatically sets the correct 
            // 'multipart/form-data' boundary headers for Multer to read.
            body: formData,
        });

        if (!response.ok) throw new Error("Upload failed");

        return await response.json(); // Returns the saved database record
    } catch (error) {
        console.error(error);
        return null;
    }
};
export const deleteDocumentById = async (documentId: string) => {
    try {
        const response = await fetch(`${API_URL}/api/documents/${documentId}`, {
            method: "DELETE",
            credentials: "include",
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to delete document");
        }

        return true;
    } catch (error) {
        console.error("Delete Error:", error);
        return false;
    }
};
export const deleteSubjectById = async (documentId: string) => {
    try {
        const response = await fetch(`${API_URL}/api/subjects/${documentId}`, {
            method: "DELETE",
            credentials: "include",
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to delete Subject");
        }

        return true; // Success!
    } catch (error) {
        console.error("Delete Error:", error);
        return false;
    }
};

// --- QUIZ GENERATION ---

export const generateQuizRequest = async (
  subjectId: string,
  documentIds: string[],
  type: 'mcq' | 'subjective' | 'theory' | 'math',
  topic?: string,
  requestedCount?: number,
  isPublic?: boolean
) => {
  try {
    const response = await fetch(`${API_URL}/api/quizzes/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        subjectId,
        documentIds,
        type,
        topic,
        requestedCount,
        isPublic: isPublic ?? false,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to generate quiz");
    }

    const data = await response.json();
    return data; 
    
  } catch (error) {
    console.error("Generate Quiz Fetch Error:", error);
    return null;
  }
};

export const fetchUserQuizzes = async () => {
  try {
    const response = await fetch(`${API_URL}/api/quizzes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", 
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch quizzes");
    }

    return await response.json();
  } catch (error) {
    console.error("Fetch Quizzes Error:", error);
    return []; // Return an empty array on failure so the UI doesn't crash
  }
};

export const fetchQuizById = async (quizId: string) => {
  try {
    const response = await fetch(`${API_URL}/api/quizzes/${quizId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", 
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch quiz details");
    }

    return await response.json();
  } catch (error) {
    console.error(`Fetch Quiz ${quizId} Error:`, error);
    return null; 
  }
};

export const deleteQuizRequest = async (quizId: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/api/quizzes/${quizId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", 
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to delete quiz");
    }

    return true;
  } catch (error) {
    console.error(`Delete Quiz ${quizId} Error:`, error);
    return false;
  }
};
// ... (keep all your existing Subject and Document functions above)

/**
 * Submits a completed quiz attempt to the backend for grading.
 * UPDATED: Added credentials: "include" to match your auth pattern.
 */
export const submitAttempt = async (quizId: string, answers: any[], studentName?: string) => {
  try {
    const response = await fetch(`${API_URL}/api/attempts/${quizId}/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // CRITICAL: This allows Better Auth to verify your session on port 8000
      credentials: "include", 
      body: JSON.stringify({
        studentName,
        answers
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to submit attempt');
    }

    return await response.json();
  } catch (error) {
    console.error("Submission error:", error);
    throw error;
  }
};

// --- ATTEMPTS ---

export const fetchUserAttempts = async () => {
  try {
    const response = await fetch(`${API_URL}/api/attempts`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch attempts");
    }

    return await response.json();
  } catch (error) {
    console.error("Fetch Attempts Error:", error);
    return [];
  }
};

export const fetchAttemptById = async (attemptId: string) => {
  try {
    const response = await fetch(`${API_URL}/api/attempts/${attemptId}`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch attempt details");
    }

    return await response.json();
  } catch (error) {
    console.error(`Fetch Attempt ${attemptId} Error:`, error);
    return null;
  }
};

/**
 * Compresses an image file and returns a Gemini-friendly Base64 string.
 * Max dimension: 1600px. JPEG quality: 0.82. Always outputs image/jpeg.
 */
export const prepareImageForAI = (file: File): Promise<{ base64: string; mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const MAX = 1600;
        let { width, height } = img;
        if (width > MAX || height > MAX) {
          if (width > height) { height = Math.round((height * MAX) / width); width = MAX; }
          else { width = Math.round((width * MAX) / height); height = MAX; }
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.82);
        const base64 = dataUrl.split(",")[1];
        resolve({ base64, mimeType: "image/jpeg" });
      };
      img.onerror = reject;
      img.src = reader.result as string;
    };
    reader.onerror = reject;
  });
};