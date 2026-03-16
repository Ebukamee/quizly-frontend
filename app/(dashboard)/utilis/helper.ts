export const fetchUserSubjects = async () => {
    try {
        const response = await fetch("http://localhost:8000/api/subjects", {
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
        const response = await fetch("http://localhost:8000/api/subjects", {
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
        const response = await fetch(`http://localhost:8000/api/subjects/${id}`, {
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

        const response = await fetch("http://localhost:8000/api/documents/upload", {
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
        const response = await fetch(`http://localhost:8000/api/documents/${documentId}`, {
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
        const response = await fetch(`http://localhost:8000/api/subjects/${documentId}`, {
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
  requestedCount?: number
) => {
  try {
    const response = await fetch("http://localhost:8000/api/quizzes/generate", {
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