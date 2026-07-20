import { motion } from "framer-motion";
import { MessageCircle, ArrowUpRight } from "lucide-react";
import complete from "@/assets/step-complete.jpg";
import { useQuestionnaire } from "../context";

export function Complete() {
  const { reset } = useQuestionnaire();
  return (
    <div className="relative min-h-[calc(100vh-58px)] overflow-hidden">
      <motion.img
        src={complete}
        alt=""
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/55 to-background/95" />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mx-auto min-h-[calc(100vh-58px)] max-w-3xl px-0 py-0 text-center my-0 flex-col flex items-center justify-center gap-0"
      >
        <div className="text-[11px] uppercase tracking-[0.32em] text-[color:var(--gold)]">Brief received</div>
        <h1 className="mt-6 font-serif text-4xl font-light leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
          <span className="block">Thank you. Your architectural</span>
          <span className="block">vision has been received.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-base font-light text-muted-foreground md:text-lg">
          Our engineering and design team will review your project requirements personally.<br />
          <span className="text-foreground">Estimated callback time: within 24 hours.</span>
        </p>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <a
            href="https://wa.me/919811604449"
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-3 rounded-full bg-[#25D366] px-7 py-3.5 text-sm font-light uppercase tracking-[0.18em] text-black transition hover:gap-4 hover:shadow-[0_0_40px_-10px_#25D366]"
          >
            <MessageCircle size={16} /> Connect via WhatsApp
          </a>
          <a
            href="https://metaguise.com/"
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2 rounded-full border border-border px-7 py-3.5 text-sm font-light uppercase tracking-[0.18em] text-foreground transition hover:border-[color:var(--gold)] hover:text-[color:var(--gold)]"
          >
            Explore Our Portfolio <ArrowUpRight size={16} className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>

        <button
          onClick={reset}
          className="mt-16 text-xs uppercase tracking-[0.25em] text-muted-foreground transition hover:text-foreground"
        >
          Start a new project brief
        </button>
      </motion.div>
    </div>
  );
}
