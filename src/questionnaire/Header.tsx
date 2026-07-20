import { motion } from "framer-motion";
import { TOTAL_STEPS, useQuestionnaire } from "./context";
import logo from "@/assets/metaguise-logo.png";

export function Header() {
  const { step } = useQuestionnaire();
  const progress = Math.max(0, Math.min(1, step/TOTAL_STEPS));

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="relative flex h-24 items-center justify-center px-6 md:px-10">
        <img src={logo} alt="Metaguise" className="h-16 w-auto object-contain" />
      </div>
      <div className="relative h-[2px] w-full bg-border/40">
        <motion.div
          className="absolute inset-y-0 left-0 bg-foreground"
          initial={false}
          animate={{ width: `${progress * 100}%` }}
          transition={{ type: "spring", stiffness: 90, damping: 22 }}
        />
      </div>
    </header>
  );
}
