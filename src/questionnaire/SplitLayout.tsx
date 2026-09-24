import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TOTAL_STEPS, useQuestionnaire } from "./context";

export function SplitLayout({
  children,
  imageSrc,
  imageKey,
  videoSrc,
}: {
  children: ReactNode;
  imageSrc: string;
  imageKey: string;
  caption?: string;
  videoSrc?: string;
}) {
  const { step, prev, next } = useQuestionnaire();

  const nav = (
    <div className="flex items-center gap-3 text-xs tabular-nums text-foreground">
      <button
        onClick={prev}
        disabled={step === 1}
        aria-label="Previous question"
        className="grid h-9 w-9 place-items-center rounded-full border border-foreground/40 text-foreground transition hover:border-foreground hover:bg-foreground hover:text-background disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-foreground md:h-7 md:w-7"
      >
        <ChevronLeft size={14} strokeWidth={1.5} />
      </button>
      <span>
        <span>{String(step).padStart(2, "0")}</span>
        <span className="mx-1 text-foreground/40">/</span>
        <span className="text-foreground/60">{String(TOTAL_STEPS).padStart(2, "0")}</span>
      </span>
      <button
        onClick={next}
        disabled={step === TOTAL_STEPS}
        aria-label="Next question"
        className="grid h-9 w-9 place-items-center rounded-full border border-foreground/40 text-foreground transition hover:border-foreground hover:bg-foreground hover:text-background disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-foreground md:h-7 md:w-7"
      >
        <ChevronRight size={14} strokeWidth={1.5} />
      </button>
    </div>
  );

  return (
    <div className="grid grid-cols-1 pb-24 lg:min-h-[calc(100vh-98px)] lg:grid-cols-[3fr_2fr] lg:pb-20">
      <div className="relative flex items-center px-5 pb-6 pt-16 md:px-10 md:py-8 md:pt-16 lg:px-14">
        <div className="absolute right-6 top-4 hidden md:flex md:right-10">{nav}</div>
        <div className="absolute right-5 top-4 flex md:hidden">{nav}</div>
        <div className="w-full max-w-2xl">{children}</div>
      </div>
      <div className="relative order-first hidden overflow-hidden border-b border-border lg:order-none lg:block lg:h-auto lg:border-b-0 lg:border-l">
        {videoSrc ? (
          <video
            key={videoSrc}
            src={videoSrc}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <AnimatePresence mode="sync">
            <motion.img
              key={imageKey}
              src={imageSrc}
              alt=""
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </AnimatePresence>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-background/40 via-transparent to-transparent" />
      </div>
    </div>
  );
}
