export type Subject = {
  id: string;
  name: string;
  docCount: number;
  lastUpdated: string;
  color: string;
};

export type Document = {
  id: string;
  name: string;
  size: string;
  uploadedAt: string;
};

export type QuizFormat = "MCQ" | "Subjective" | "Essay" | "Maths";

export type Option = {
  label: string;
  text: string; // raw LaTeX
};

export type Question = {
  id: string;
  text: string; // raw LaTeX
  format: QuizFormat;
  options?: Option[]; // MCQ only
  correctAnswer: string; // raw LaTeX
};

export type Quiz = {
  id: string;
  subjectId: string;
  subjectName: string;
  title: string;
  format: QuizFormat;
  questionCount: number;
  createdAt: string;
  questions: Question[];
};

export type AttemptQuestion = {
  questionId: string;
  questionText: string;       // raw LaTeX
  userAnswer: string;         // raw LaTeX — final answer (or MCQ label)
  userWorkings?: string;      // raw LaTeX — Maths/Essay workings shown by student
  correctAnswer: string;      // raw LaTeX
  correctWorkings?: string;   // raw LaTeX — model workings
  isCorrect: boolean;         // MCQ / Subjective
  marksAwarded?: number;      // Maths / Essay — partial marks
  totalMarks?: number;        // Maths / Essay — max marks per question
};

export type Attempt = {
  id: string;
  quizId: string;
  quizTitle: string;
  subjectName: string;
  format: QuizFormat;
  score: number; // percentage 0-100
  date: string;
  questions: AttemptQuestion[];
};

// ─── Subjects ────────────────────────────────────────────────────────────────

export const subjects: Subject[] = [
  { id: "bio", name: "Biology", docCount: 4, lastUpdated: "2 days ago", color: "#000" },
  { id: "hist", name: "History", docCount: 2, lastUpdated: "5 days ago", color: "#000" },
  { id: "calc", name: "Calculus", docCount: 3, lastUpdated: "1 day ago", color: "#000" },
  { id: "lit", name: "Literature", docCount: 2, lastUpdated: "1 week ago", color: "#000" },
  { id: "phys", name: "Physics", docCount: 3, lastUpdated: "3 days ago", color: "#000" },
];

// ─── Documents per subject ────────────────────────────────────────────────────

export const documents: Record<string, Document[]> = {
  bio: [
    { id: "d1", name: "Chapter 3 — Cell Biology.pdf", size: "2.4 MB", uploadedAt: "Mar 6, 2026" },
    { id: "d2", name: "Lecture Notes — Mitosis.pdf", size: "1.1 MB", uploadedAt: "Mar 4, 2026" },
    { id: "d3", name: "Textbook Ch. 5 — DNA Replication.pdf", size: "3.8 MB", uploadedAt: "Mar 2, 2026" },
  ],
  hist: [
    { id: "d4", name: "World War II Overview.pdf", size: "1.7 MB", uploadedAt: "Mar 3, 2026" },
    { id: "d5", name: "Cold War Notes.pdf", size: "0.9 MB", uploadedAt: "Mar 1, 2026" },
  ],
  calc: [
    { id: "d6", name: "Differentiation Rules.pdf", size: "1.2 MB", uploadedAt: "Mar 7, 2026" },
    { id: "d7", name: "Integration Techniques.pdf", size: "2.0 MB", uploadedAt: "Mar 5, 2026" },
    { id: "d8", name: "Series & Sequences.pdf", size: "1.5 MB", uploadedAt: "Mar 3, 2026" },
  ],
  lit: [
    { id: "d9", name: "Hamlet — Analysis Notes.pdf", size: "0.8 MB", uploadedAt: "Mar 1, 2026" },
    { id: "d10", name: "The Great Gatsby — Themes.pdf", size: "0.6 MB", uploadedAt: "Feb 28, 2026" },
  ],
  phys: [
    { id: "d11", name: "Mechanics & Kinematics.pdf", size: "2.1 MB", uploadedAt: "Mar 5, 2026" },
    { id: "d12", name: "Forces & Newton's Laws.pdf", size: "1.8 MB", uploadedAt: "Mar 4, 2026" },
    { id: "d13", name: "Work, Energy & Power.pdf", size: "1.4 MB", uploadedAt: "Mar 3, 2026" },
  ],
};

// ─── Quizzes ──────────────────────────────────────────────────────────────────

export const quizzes: Quiz[] = [
  {
    id: "q1",
    subjectId: "calc",
    subjectName: "Calculus",
    title: "Differentiation Fundamentals",
    format: "Maths",
    questionCount: 5,
    createdAt: "Mar 7, 2026",
    questions: [
      {
        id: "q1-1",
        format: "Maths",
        text: "Find the derivative of $f(x) = x^3 - 4x^2 + 7x - 2$.",
        correctAnswer: "$f'(x) = 3x^2 - 8x + 7$",
      },
      {
        id: "q1-2",
        format: "Maths",
        text: "Using the chain rule, differentiate $g(x) = \\sin(x^2 + 1)$.",
        correctAnswer: "$g'(x) = 2x\\cos(x^2 + 1)$",
      },
      {
        id: "q1-3",
        format: "Maths",
        text: "Evaluate $\\frac{d}{dx}\\left[e^{3x}\\ln(x)\\right]$ using the product rule.",
        correctAnswer: "$3e^{3x}\\ln(x) + \\dfrac{e^{3x}}{x}$",
      },
      {
        id: "q1-4",
        format: "Maths",
        text: "Find all critical points of $h(x) = x^4 - 8x^2 + 3$.",
        correctAnswer: "$x = 0,\\; x = 2,\\; x = -2$",
      },
      {
        id: "q1-5",
        format: "Maths",
        text: "Compute $\\lim_{h \\to 0} \\frac{(x+h)^2 - x^2}{h}$ from first principles.",
        correctAnswer: "$2x$",
      },
    ],
  },
  {
    id: "q2",
    subjectId: "bio",
    subjectName: "Biology",
    title: "Cell Biology — MCQ",
    format: "MCQ",
    questionCount: 4,
    createdAt: "Mar 6, 2026",
    questions: [
      {
        id: "q2-1",
        format: "MCQ",
        text: "What is the primary role of \\textit{mitochondria} in eukaryotic cells?",
        options: [
          { label: "A", text: "Protein synthesis" },
          { label: "B", text: "ATP energy production via oxidative phosphorylation" },
          { label: "C", text: "DNA replication" },
          { label: "D", text: "Lipid storage" },
        ],
        correctAnswer: "B",
      },
      {
        id: "q2-2",
        format: "MCQ",
        text: "Which phase of mitosis involves the alignment of chromosomes at the cell equator?",
        options: [
          { label: "A", text: "Prophase" },
          { label: "B", text: "Anaphase" },
          { label: "C", text: "Metaphase" },
          { label: "D", text: "Telophase" },
        ],
        correctAnswer: "C",
      },
      {
        id: "q2-3",
        format: "MCQ",
        text: "The process by which DNA is copied to produce mRNA is called:",
        options: [
          { label: "A", text: "Translation" },
          { label: "B", text: "Replication" },
          { label: "C", text: "Transcription" },
          { label: "D", text: "Transduction" },
        ],
        correctAnswer: "C",
      },
      {
        id: "q2-4",
        format: "MCQ",
        text: "Which organelle is responsible for modifying, packaging, and shipping proteins?",
        options: [
          { label: "A", text: "Ribosome" },
          { label: "B", text: "Golgi apparatus" },
          { label: "C", text: "Lysosome" },
          { label: "D", text: "Endoplasmic reticulum" },
        ],
        correctAnswer: "B",
      },
    ],
  },
  {
    id: "q3",
    subjectId: "hist",
    subjectName: "History",
    title: "World War II — Subjective",
    format: "Subjective",
    questionCount: 5,
    createdAt: "Mar 5, 2026",
    questions: [
      {
        id: "q3-1",
        format: "Subjective",
        text: "In what year did World War II officially begin?",
        correctAnswer: "1939",
      },
      {
        id: "q3-2",
        format: "Subjective",
        text: "Which two countries were targeted by the atomic bombs dropped by the United States in August 1945?",
        correctAnswer: "Hiroshima and Nagasaki (Japan)",
      },
      {
        id: "q3-3",
        format: "Subjective",
        text: "What was the name of the Allied invasion of Normandy, France, on June 6, 1944?",
        correctAnswer: "Operation Overlord (D-Day)",
      },
      {
        id: "q3-4",
        format: "Subjective",
        text: "Who was the Chancellor of Germany at the outbreak of World War II?",
        correctAnswer: "Adolf Hitler",
      },
      {
        id: "q3-5",
        format: "Subjective",
        text: "Name the non-aggression pact signed between Germany and the Soviet Union in August 1939.",
        correctAnswer: "The Molotov–Ribbentrop Pact",
      },
    ],
  },
  {
    id: "q4",
    subjectId: "bio",
    subjectName: "Biology",
    title: "DNA Replication — Essay",
    format: "Essay",
    questionCount: 2,
    createdAt: "Mar 4, 2026",
    questions: [
      {
        id: "q4-1",
        format: "Essay",
        text: "Describe the process of \\textbf{semi-conservative DNA replication}, including the roles of key enzymes such as helicase, primase, and DNA polymerase.",
        correctAnswer: "Semi-conservative replication produces two daughter DNA molecules, each containing one original strand and one newly synthesised strand. Helicase unwinds the double helix at the replication fork. Primase synthesises a short RNA primer, providing a 3'-OH group for DNA polymerase III to extend. The leading strand is synthesised continuously, while the lagging strand is built in Okazaki fragments. DNA polymerase I removes RNA primers and fills gaps; DNA ligase seals nicks to complete the strands.",
      },
      {
        id: "q4-2",
        format: "Essay",
        text: "Explain how errors in DNA replication are detected and corrected. Discuss the consequences when such mechanisms fail.",
        correctAnswer: "DNA polymerase has 3'→5' exonuclease proofreading activity that removes misincorporated nucleotides immediately. Mismatch repair (MMR) proteins subsequently scan the newly synthesised strand for remaining errors. Nucleotide excision repair handles bulky lesions. When these mechanisms fail, mutations accumulate, potentially leading to oncogene activation or tumour suppressor inactivation, driving cancer development.",
      },
    ],
  },
  {
    id: "q5",
    subjectId: "calc",
    subjectName: "Calculus",
    title: "Integration Techniques",
    format: "Maths",
    questionCount: 4,
    createdAt: "Mar 3, 2026",
    questions: [
      {
        id: "q5-1",
        format: "Maths",
        text: "Evaluate $\\displaystyle\\int x\\,e^x\\,dx$ using integration by parts.",
        correctAnswer: "$e^x(x - 1) + C$",
      },
      {
        id: "q5-2",
        format: "Maths",
        text: "Compute $\\displaystyle\\int_0^{\\pi} \\sin^2(x)\\,dx$.",
        correctAnswer: "$\\dfrac{\\pi}{2}$",
      },
      {
        id: "q5-3",
        format: "Maths",
        text: "Use substitution to find $\\displaystyle\\int \\frac{2x}{x^2 + 3}\\,dx$.",
        correctAnswer: "$\\ln|x^2 + 3| + C$",
      },
      {
        id: "q5-4",
        format: "Maths",
        text: "Find the area enclosed between $y = x^2$ and $y = 4$ using a definite integral.",
        correctAnswer: "$\\displaystyle\\int_{-2}^{2}(4 - x^2)\\,dx = \\dfrac{32}{3}$",
      },
    ],
  },
  {
    id: "q6",
    subjectId: "lit",
    subjectName: "Literature",
    title: "Hamlet — Themes",
    format: "Essay",
    questionCount: 2,
    createdAt: "Mar 2, 2026",
    questions: [
      {
        id: "q6-1",
        format: "Essay",
        text: "Analyse how Shakespeare explores the theme of \\textbf{revenge} in \\textit{Hamlet}. Use specific textual evidence to support your argument.",
        correctAnswer: "Shakespeare presents revenge as a corrupting force through Hamlet's prolonged hesitation and its destructive consequences. Hamlet's soliloquies reveal his moral paralysis; despite the Ghost's command, he delays, questioning the ghost's authenticity and his own resolve. The play-within-a-play ('The Mousetrap') demonstrates his intellectual approach to revenge. Ultimately, the revenge plot leads to the deaths of Polonius, Ophelia, Laertes, Gertrude, and Hamlet himself, suggesting that revenge destroys the avenger along with the target.",
      },
      {
        id: "q6-2",
        format: "Essay",
        text: "How does \\textit{Hamlet} reflect the Renaissance preoccupation with the conflict between \\textbf{reason} and \\textbf{passion}?",
        correctAnswer: "Renaissance humanism celebrated reason as humanity's highest faculty, yet acknowledged the destabilising power of passion. Hamlet embodies this tension: his rational, philosophical nature ('What a piece of work is a man') conflicts with the passionate demands of grief and revenge. His 'To be or not to be' soliloquy exemplifies rational deliberation, while his erratic behaviour toward Ophelia and his impulsive killing of Polonius reveal passion overcoming reason. The play ultimately questions whether pure reason can resolve moral crises in an irrational world.",
      },
    ],
  },
  {
    id: "q7",
    subjectId: "phys",
    subjectName: "Physics",
    title: "Applied Mechanics Calculations",
    format: "Maths",
    questionCount: 4,
    createdAt: "Mar 5, 2026",
    questions: [
      {
        id: "q7-1",
        format: "Maths",
        text: "A car starts from rest and reaches a velocity of $72\\,\\text{km/h}$ in $8\\,\\text{s}$. Calculate (i) its acceleration in $\\text{m/s}^2$ and (ii) the distance covered during this time.",
        correctAnswer: "(i) $a = 2.5\\,\\text{m/s}^2$ \\quad (ii) $s = 80\\,\\text{m}$",
      },
      {
        id: "q7-2",
        format: "Maths",
        text: "A block of mass $8\\,\\text{kg}$ rests on a horizontal surface. The coefficient of kinetic friction is $\\mu_k = 0.35$. A horizontal force of $40\\,\\text{N}$ is applied. Take $g = 10\\,\\text{m/s}^2$. Calculate (i) the friction force and (ii) the net acceleration of the block.",
        correctAnswer: "(i) $F_f = 28\\,\\text{N}$ \\quad (ii) $a = 1.5\\,\\text{m/s}^2$",
      },
      {
        id: "q7-3",
        format: "Maths",
        text: "A projectile is launched at an angle of $30°$ to the horizontal with an initial speed of $20\\,\\text{m/s}$. Take $g = 10\\,\\text{m/s}^2$. Find (i) the maximum height reached and (ii) the total time of flight.",
        correctAnswer: "(i) $H = \\dfrac{(20\\sin 30°)^2}{2 \\times 10} = 5\\,\\text{m}$ \\quad (ii) $T = \\dfrac{2 \\times 20\\sin 30°}{10} = 2\\,\\text{s}$",
      },
      {
        id: "q7-4",
        format: "Maths",
        text: "A force of $50\\,\\text{N}$ acts on an object at an angle of $60°$ to the horizontal displacement of $10\\,\\text{m}$. Calculate (i) the work done by the force and (ii) the power if the work is done in $5\\,\\text{s}$.",
        correctAnswer: "(i) $W = 50 \\times 10 \\times \\cos 60° = 250\\,\\text{J}$ \\quad (ii) $P = \\dfrac{250}{5} = 50\\,\\text{W}$",
      },
    ],
  },
];

// ─── Attempts ─────────────────────────────────────────────────────────────────

export const attempts: Attempt[] = [
  {
    id: "a1",
    quizId: "q1",
    quizTitle: "Differentiation Fundamentals",
    subjectName: "Calculus",
    format: "Maths",
    score: 80,
    date: "Mar 7, 2026",
    questions: [
      {
        questionId: "q1-1", questionText: "Find the derivative of $f(x) = x^3 - 4x^2 + 7x - 2$.",
        userWorkings: "Differentiate term by term:\\n$\\frac{d}{dx}(x^3) = 3x^2$\\n$\\frac{d}{dx}(-4x^2) = -8x$\\n$\\frac{d}{dx}(7x) = 7$\\n$\\frac{d}{dx}(-2) = 0$",
        userAnswer: "$f'(x) = 3x^2 - 8x + 7$",
        correctWorkings: "Apply the power rule to each term: $\\frac{d}{dx}(ax^n) = nax^{n-1}$",
        correctAnswer: "$f'(x) = 3x^2 - 8x + 7$",
        isCorrect: true, marksAwarded: 4, totalMarks: 5,
      },
      {
        questionId: "q1-2", questionText: "Using the chain rule, differentiate $g(x) = \\sin(x^2 + 1)$.",
        userWorkings: "Let $u = x^2 + 1$, so $g = \\sin(u)$\\n$\\frac{dg}{du} = \\cos(u)$\\n$\\frac{du}{dx} = 2x$\\nBy chain rule: $g'(x) = \\cos(u) \\cdot 2x$",
        userAnswer: "$g'(x) = 2x\\sin(x^2 + 1)$",
        correctWorkings: "Let $u = x^2+1$. Chain rule: $g'(x) = \\cos(u) \\cdot \\frac{du}{dx} = \\cos(x^2+1) \\cdot 2x$",
        correctAnswer: "$g'(x) = 2x\\cos(x^2 + 1)$",
        isCorrect: false, marksAwarded: 3, totalMarks: 5,
      },
      {
        questionId: "q1-3", questionText: "Evaluate $\\frac{d}{dx}\\left[e^{3x}\\ln(x)\\right]$.",
        userWorkings: "Product rule: $(uv)' = u'v + uv'$\\n$u = e^{3x},\\; u' = 3e^{3x}$\\n$v = \\ln(x),\\; v' = \\frac{1}{x}$\\n$(e^{3x}\\ln x)' = 3e^{3x}\\ln x + e^{3x} \\cdot \\frac{1}{x}$",
        userAnswer: "$3e^{3x}\\ln(x) + \\frac{e^{3x}}{x}$",
        correctWorkings: "Product rule with $u=e^{3x}$, $v=\\ln x$: $u'=3e^{3x}$, $v'=\\frac{1}{x}$",
        correctAnswer: "$3e^{3x}\\ln(x) + \\dfrac{e^{3x}}{x}$",
        isCorrect: true, marksAwarded: 5, totalMarks: 5,
      },
      {
        questionId: "q1-4", questionText: "Find all critical points of $h(x) = x^4 - 8x^2 + 3$.",
        userWorkings: "$h'(x) = 4x^3 - 16x$\\nSet $h'(x) = 0$: $4x(x^2 - 4) = 0$\\n$x = 0$ or $x^2 = 4 \\Rightarrow x = \\pm 2$",
        userAnswer: "$x = 0,\\; x = 2,\\; x = -2$",
        correctWorkings: "$h'(x)=4x^3-16x=4x(x^2-4)=0 \\Rightarrow x=0,\\pm2$",
        correctAnswer: "$x = 0,\\; x = 2,\\; x = -2$",
        isCorrect: true, marksAwarded: 5, totalMarks: 5,
      },
      {
        questionId: "q1-5", questionText: "Compute $\\lim_{h \\to 0} \\frac{(x+h)^2 - x^2}{h}$.",
        userWorkings: "Expand: $\\frac{x^2 + 2xh + h^2 - x^2}{h} = \\frac{2xh + h^2}{h} = 2x + h$",
        userAnswer: "$x$",
        correctWorkings: "$\\frac{(x+h)^2-x^2}{h}=\\frac{2xh+h^2}{h}=2x+h \\xrightarrow{h\\to 0} 2x$",
        correctAnswer: "$2x$",
        isCorrect: false, marksAwarded: 2, totalMarks: 5,
      },
    ],
  },
  {
    id: "a2",
    quizId: "q2",
    quizTitle: "Cell Biology — MCQ",
    subjectName: "Biology",
    format: "MCQ",
    score: 75,
    date: "Mar 6, 2026",
    questions: [
      { questionId: "q2-1", questionText: "What is the primary role of mitochondria in eukaryotic cells?", userAnswer: "B", correctAnswer: "B", isCorrect: true },
      { questionId: "q2-2", questionText: "Which phase of mitosis involves chromosome alignment at the cell equator?", userAnswer: "A", correctAnswer: "C", isCorrect: false },
      { questionId: "q2-3", questionText: "The process by which DNA is copied to produce mRNA is called:", userAnswer: "C", correctAnswer: "C", isCorrect: true },
      { questionId: "q2-4", questionText: "Which organelle packages and ships proteins?", userAnswer: "B", correctAnswer: "B", isCorrect: true },
    ],
  },
  {
    id: "a3",
    quizId: "q3",
    quizTitle: "World War II — Subjective",
    subjectName: "History",
    format: "Subjective",
    score: 67,
    date: "Mar 5, 2026",
    questions: [
      { questionId: "q3-1", questionText: "Briefly explain the significance of the Molotov–Ribbentrop Pact.", userAnswer: "It was a non-aggression pact between Germany and the USSR that let Germany invade Poland without Soviet interference.", correctAnswer: "The pact was a non-aggression agreement between Nazi Germany and the Soviet Union allowing Germany to invade Poland without Soviet intervention, partitioning Eastern Europe and triggering Allied declarations of war.", isCorrect: true },
      { questionId: "q3-2", questionText: "What were the primary strategic objectives of Operation Overlord?", userAnswer: "To land in France and open a second front.", correctAnswer: "Secure beachheads in Normandy, advance inland, capture key ports, and force Germany to fight on two fronts.", isCorrect: true },
      { questionId: "q3-3", questionText: "How did the atomic bomb influence the conclusion of WWII in the Pacific?", userAnswer: "It destroyed two cities and ended the war.", correctAnswer: "The bombings of Hiroshima and Nagasaki, combined with Soviet entry into the Pacific War, prompted Japan's surrender on August 15, 1945.", isCorrect: false },
    ],
  },
  {
    id: "a4",
    quizId: "q5",
    quizTitle: "Integration Techniques",
    subjectName: "Calculus",
    format: "Maths",
    score: 50,
    date: "Mar 4, 2026",
    questions: [
      {
        questionId: "q5-1", questionText: "Evaluate $\\int x\\,e^x\\,dx$.",
        userWorkings: "Integration by parts: $u = x,\\; dv = e^x dx$\\n$du = dx,\\; v = e^x$\\n$\\int x e^x dx = xe^x - \\int e^x dx = xe^x - e^x$",
        userAnswer: "$xe^x + C$",
        correctWorkings: "IBP: $u=x$, $dv=e^x dx \\Rightarrow du=dx$, $v=e^x$. So $xe^x - \\int e^x dx = xe^x - e^x = e^x(x-1)+C$",
        correctAnswer: "$e^x(x-1)+C$",
        isCorrect: false, marksAwarded: 3, totalMarks: 5,
      },
      {
        questionId: "q5-2", questionText: "Compute $\\int_0^{\\pi} \\sin^2(x)\\,dx$.",
        userWorkings: "Use identity: $\\sin^2 x = \\frac{1-\\cos 2x}{2}$\\n$\\int_0^\\pi \\frac{1-\\cos 2x}{2}\\,dx = \\left[\\frac{x}{2} - \\frac{\\sin 2x}{4}\\right]_0^\\pi = \\frac{\\pi}{2}$",
        userAnswer: "$\\dfrac{\\pi}{2}$",
        correctWorkings: "$\\sin^2 x = \\frac{1-\\cos 2x}{2}$; integrate to get $\\frac{\\pi}{2}$",
        correctAnswer: "$\\dfrac{\\pi}{2}$",
        isCorrect: true, marksAwarded: 5, totalMarks: 5,
      },
      {
        questionId: "q5-3", questionText: "Find $\\int \\frac{2x}{x^2+3}\\,dx$.",
        userWorkings: "Let $u = x^2+3,\\; du = 2x\\,dx$\\n$\\int \\frac{du}{u} = \\ln|u| + C = \\ln|x^2+3|+C$",
        userAnswer: "$\\ln|x^2+3|+C$",
        correctWorkings: "Substitution $u=x^2+3$, $du=2x\\,dx$",
        correctAnswer: "$\\ln|x^2+3|+C$",
        isCorrect: true, marksAwarded: 5, totalMarks: 5,
      },
      {
        questionId: "q5-4", questionText: "Find the area between $y=x^2$ and $y=4$.",
        userWorkings: "Intersections: $x^2=4 \\Rightarrow x=\\pm 2$\\n$\\int_{-2}^{2}(4-x^2)dx = \\left[4x - \\frac{x^3}{3}\\right]_{-2}^{2}$\\n$= (8 - \\frac{8}{3}) - (-8 + \\frac{8}{3}) = 16 - \\frac{16}{3}$",
        userAnswer: "$8$",
        correctWorkings: "$\\int_{-2}^{2}(4-x^2)dx = [4x-x^3/3]_{-2}^{2} = (8-8/3)-(-8+8/3) = 32/3$",
        correctAnswer: "$\\dfrac{32}{3}$",
        isCorrect: false, marksAwarded: 3, totalMarks: 5,
      },
    ],
  },
  {
    id: "a5",
    quizId: "q4",
    quizTitle: "DNA Replication — Essay",
    subjectName: "Biology",
    format: "Essay",
    score: 88,
    date: "Mar 3, 2026",
    questions: [
      { questionId: "q4-1", questionText: "Describe semi-conservative DNA replication.", userAnswer: "Semi-conservative replication means each daughter molecule has one old and one new strand. Helicase unwinds the DNA, primase adds RNA primers, and DNA polymerase III synthesises new strands. The leading strand is continuous; the lagging strand uses Okazaki fragments. DNA ligase seals the fragments.", correctAnswer: "Semi-conservative replication produces two daughter molecules each containing one original and one new strand. Key enzymes: helicase (unwinding), primase (RNA primers), DNA polymerase III (extension), DNA polymerase I (primer removal), and DNA ligase (sealing).", isCorrect: true, marksAwarded: 9, totalMarks: 10 },
      { questionId: "q4-2", questionText: "How are replication errors corrected?", userAnswer: "DNA polymerase proofreads using 3'→5' exonuclease activity. Mismatch repair fixes remaining errors. Failures can cause mutations leading to cancer.", correctAnswer: "Proofreading by DNA polymerase (3'→5' exonuclease), mismatch repair, and nucleotide excision repair. Failures lead to mutation accumulation, oncogene activation, and cancer.", isCorrect: true, marksAwarded: 8, totalMarks: 10 },
    ],
  },
  {
    id: "a6",
    quizId: "q6",
    quizTitle: "Hamlet — Themes",
    subjectName: "Literature",
    format: "Essay",
    score: 92,
    date: "Mar 2, 2026",
    questions: [
      { questionId: "q6-1", questionText: "Analyse the theme of revenge in Hamlet.", userAnswer: "Shakespeare portrays revenge as corrosive through Hamlet's hesitation. His soliloquies show moral paralysis, and his delay using the play-within-a-play reveals intellectual complexity. Ultimately, revenge destroys nearly every character.", correctAnswer: "Revenge is a corrupting force. Hamlet's delay, the play-within-a-play, and the final deaths of all major characters demonstrate that revenge destroys the avenger as much as the target.", isCorrect: true, marksAwarded: 10, totalMarks: 10 },
      { questionId: "q6-2", questionText: "How does Hamlet reflect the Renaissance conflict between reason and passion?", userAnswer: "Hamlet's philosophical nature ('To be or not to be') represents reason, while his impulsive killing of Polonius and treatment of Ophelia show passion. The play questions whether reason alone can resolve moral dilemmas.", correctAnswer: "Hamlet embodies reason-passion conflict: philosophical soliloquies vs impulsive actions. Renaissance humanism celebrated reason but Hamlet shows its limits in an irrational world.", isCorrect: true, marksAwarded: 9, totalMarks: 10 },
    ],
  },
  {
    id: "a7",
    quizId: "q2",
    quizTitle: "Cell Biology — MCQ",
    subjectName: "Biology",
    format: "MCQ",
    score: 100,
    date: "Mar 1, 2026",
    questions: [
      { questionId: "q2-1", questionText: "Primary role of mitochondria?", userAnswer: "B", correctAnswer: "B", isCorrect: true },
      { questionId: "q2-2", questionText: "Chromosome alignment phase?", userAnswer: "C", correctAnswer: "C", isCorrect: true },
      { questionId: "q2-3", questionText: "DNA to mRNA process?", userAnswer: "C", correctAnswer: "C", isCorrect: true },
      { questionId: "q2-4", questionText: "Organelle that packages proteins?", userAnswer: "B", correctAnswer: "B", isCorrect: true },
    ],
  },
  {
    id: "a8",
    quizId: "q1",
    quizTitle: "Differentiation Fundamentals",
    subjectName: "Calculus",
    format: "Maths",
    score: 40,
    date: "Feb 28, 2026",
    questions: [
      { questionId: "q1-1", questionText: "Derivative of $f(x) = x^3 - 4x^2 + 7x - 2$.", userAnswer: "$3x^2 - 8x$", correctAnswer: "$3x^2 - 8x + 7$", isCorrect: false },
      { questionId: "q1-2", questionText: "Differentiate $g(x) = \\sin(x^2+1)$.", userAnswer: "$\\cos(x^2+1)$", correctAnswer: "$2x\\cos(x^2+1)$", isCorrect: false },
      { questionId: "q1-3", questionText: "Differentiate $e^{3x}\\ln(x)$.", userAnswer: "$3e^{3x}\\ln(x) + \\frac{e^{3x}}{x}$", correctAnswer: "$3e^{3x}\\ln(x) + \\frac{e^{3x}}{x}$", isCorrect: true },
      { questionId: "q1-4", questionText: "Critical points of $h(x) = x^4 - 8x^2 + 3$.", userAnswer: "$x = \\pm 2$", correctAnswer: "$x = 0,\\; x = \\pm 2$", isCorrect: false },
      { questionId: "q1-5", questionText: "Derivative from first principles.", userAnswer: "$2x$", correctAnswer: "$2x$", isCorrect: true },
    ],
  },
  {
    id: "a9",
    quizId: "q7",
    quizTitle: "Applied Mechanics Calculations",
    subjectName: "Physics",
    format: "Maths",
    score: 70,
    date: "Mar 5, 2026",
    questions: [
      {
        questionId: "q7-1",
        questionText: "A car starts from rest and reaches $72\\,\\text{km/h}$ in $8\\,\\text{s}$. Calculate acceleration and distance.",
        userWorkings: "Convert: $72\\,\\text{km/h} = 20\\,\\text{m/s}$\\n(i) $a = \\frac{v-u}{t} = \\frac{20-0}{8} = 2.5\\,\\text{m/s}^2$\\n(ii) $s = ut + \\frac{1}{2}at^2 = 0 + \\frac{1}{2}(2.5)(64) = 80\\,\\text{m}$",
        userAnswer: "(i) $a = 2.5\\,\\text{m/s}^2$ \\quad (ii) $s = 80\\,\\text{m}$",
        correctWorkings: "Convert $72\\,\\text{km/h}=20\\,\\text{m/s}$. Use $a=(v-u)/t$ and $s=\\frac{1}{2}at^2$",
        correctAnswer: "(i) $a = 2.5\\,\\text{m/s}^2$ \\quad (ii) $s = 80\\,\\text{m}$",
        isCorrect: true, marksAwarded: 5, totalMarks: 5,
      },
      {
        questionId: "q7-2",
        questionText: "A $8\\,\\text{kg}$ block, $\\mu_k=0.35$, pushed with $40\\,\\text{N}$. Find friction and acceleration.",
        userWorkings: "(i) $F_f = \\mu_k mg = 0.35 \\times 8 \\times 10 = 28\\,\\text{N}$\\n(ii) $F_{net} = 40 - 28 = 12\\,\\text{N}$\\n$a = F_{net}/m = 12/8 = 1.5\\,\\text{m/s}^2$",
        userAnswer: "(i) $F_f = 28\\,\\text{N}$ \\quad (ii) $a = 1.5\\,\\text{m/s}^2$",
        correctWorkings: "$F_f=\\mu_k mg=28\\,\\text{N}$; $F_{net}=12\\,\\text{N}$; $a=1.5\\,\\text{m/s}^2$",
        correctAnswer: "(i) $F_f = 28\\,\\text{N}$ \\quad (ii) $a = 1.5\\,\\text{m/s}^2$",
        isCorrect: true, marksAwarded: 5, totalMarks: 5,
      },
      {
        questionId: "q7-3",
        questionText: "Projectile at $30°$, $u=20\\,\\text{m/s}$, $g=10\\,\\text{m/s}^2$. Find max height and time of flight.",
        userWorkings: "Vertical component: $u_y = 20\\sin 30° = 10\\,\\text{m/s}$\\n(i) $H = \\frac{u_y^2}{2g} = \\frac{100}{20} = 5\\,\\text{m}$\\n(ii) $T = \\frac{2u_y}{g} = \\frac{20}{10} = 2\\,\\text{s}$",
        userAnswer: "(i) $H = 5\\,\\text{m}$ \\quad (ii) $T = 2\\,\\text{s}$",
        correctWorkings: "$u_y=20\\sin30°=10$; $H=u_y^2/(2g)=5\\,\\text{m}$; $T=2u_y/g=2\\,\\text{s}$",
        correctAnswer: "(i) $H = 5\\,\\text{m}$ \\quad (ii) $T = 2\\,\\text{s}$",
        isCorrect: true, marksAwarded: 5, totalMarks: 5,
      },
      {
        questionId: "q7-4",
        questionText: "$50\\,\\text{N}$ at $60°$, displacement $10\\,\\text{m}$, done in $5\\,\\text{s}$. Find work and power.",
        userWorkings: "(i) $W = Fd\\cos\\theta = 50 \\times 10 \\times \\cos 60° = 500 \\times 0.5 = 250\\,\\text{J}$\\n(ii) $P = W/t = 250/5 = 50\\,\\text{W}$... wait, actually I got $P = 50\\,\\text{W}$ but wrote $60\\,\\text{W}$",
        userAnswer: "(i) $W = 250\\,\\text{J}$ \\quad (ii) $P = 60\\,\\text{W}$",
        correctWorkings: "$W=50\\times10\\times\\cos60°=250\\,\\text{J}$; $P=250/5=50\\,\\text{W}$",
        correctAnswer: "(i) $W = 250\\,\\text{J}$ \\quad (ii) $P = 50\\,\\text{W}$",
        isCorrect: false, marksAwarded: 3, totalMarks: 5,
      },
    ],
  },
];

// ─── Chart data ───────────────────────────────────────────────────────────────

export const barChartData = [
  { label: "Mon", value: 2 },
  { label: "Tue", value: 5 },
  { label: "Wed", value: 3 },
  { label: "Thu", value: 7 },
  { label: "Fri", value: 4 },
  { label: "Sat", value: 6 },
  { label: "Sun", value: 1 },
];

export const donutData = [
  { label: "Maths", value: 35, color: "#6366f1" },
  { label: "MCQ", value: 28, color: "#ec4899" },
  { label: "Essay", value: 22, color: "#f97316" },
  { label: "Subjective", value: 15, color: "#22c55e" },
];

// ─── Stat cards ───────────────────────────────────────────────────────────────

export const stats = {
  totalQuizzes: quizzes.length,
  totalAttempts: attempts.length,
  avgScore: Math.round(attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length),
  subjects: subjects.length,
};
