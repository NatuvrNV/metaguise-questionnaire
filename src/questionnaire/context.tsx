import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Answers = {
  projectType?: string;
  projectTypeOther?: string;
  fullName?: string;
  phone?: string;
  phoneCountry?: string;
  email?: string;
  role?: string;
  roleOther?: string;
  facadeStyle?: string;
  scale?: string;
  timeline?: string;
  engagement?: string;
  engagementOther?: string;
  hasAssets?: "yes" | "no";
  files?: { name: string; size: number }[];
  vision?: string;
};

export const TOTAL_STEPS = 10;

type Ctx = {
  step: number;
  answers: Answers;
  setAnswer: <K extends keyof Answers>(key: K, value: Answers[K]) => void;
  next: () => void;
  prev: () => void;
  goto: (n: number) => void;
  reset: () => void;
};

const QuestionnaireContext = createContext<Ctx | null>(null);
const STORAGE_KEY = "metaguise:questionnaire:v1";

export function QuestionnaireProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Answers>({
    projectType: "residence",
    scale: "accent",
    facadeStyle: "iconic",
    timeline: "concept",
    phoneCountry: "+91",
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.step) setStep(parsed.step);
        if (parsed.answers) setAnswers(parsed.answers);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ step, answers })); } catch {}
  }, [step, answers]);

  const value = useMemo<Ctx>(() => ({
    step,
    answers,
    setAnswer: (k, v) => setAnswers((a) => ({ ...a, [k]: v })),
    next: () => setStep((s) => Math.min(TOTAL_STEPS, s + 1)),
    prev: () => setStep((s) => Math.max(1, s - 1)),
    goto: (n) => setStep(Math.max(1, Math.min(TOTAL_STEPS, n))),
    reset: () => { setStep(1); setAnswers({}); try { localStorage.removeItem(STORAGE_KEY); } catch {} },
  }), [step, answers]);

  return <QuestionnaireContext.Provider value={value}>{children}</QuestionnaireContext.Provider>;
}

export function useQuestionnaire() {
  const ctx = useContext(QuestionnaireContext);
  if (!ctx) throw new Error("useQuestionnaire must be used inside provider");
  return ctx;
}
