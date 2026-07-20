import { ArrowRight, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useState, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function StepHeading({ kicker, title, sub }: { kicker?: string; title: ReactNode; sub?: ReactNode }) {
  return (
    <div className="space-y-3">
      {kicker && (
        <div className="text-[10px] uppercase tracking-[0.3em] text-foreground/70">{kicker}</div>
      )}
      <h1 className="text-2xl font-light leading-[1.15] tracking-tight text-foreground md:text-3xl lg:whitespace-nowrap">
        {title}
      </h1>
      {sub && <p className="max-w-xl text-sm text-foreground/70 md:text-base">{sub}</p>}
    </div>
  );
}

export function PrimaryButton({
  children,
  onClick,
  disabled,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "group inline-flex items-center gap-3 rounded-full bg-foreground px-6 py-3 text-xs font-light uppercase tracking-[0.18em] text-background",
        "transition-all duration-300 hover:gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:cursor-not-allowed disabled:bg-foreground/20 disabled:text-foreground/50"
      )}
    >
      {children}
      <ArrowRight size={15} strokeWidth={1.5} />
    </button>
  );
}

export function GhostButton({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-3 rounded-full border border-foreground px-6 py-3 text-xs font-light uppercase tracking-[0.18em] text-foreground transition hover:bg-foreground hover:text-background"
    >
      {children}
    </button>
  );
}

export function StickyFooter({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="flex flex-wrap items-center gap-4 px-6 py-3 md:px-10">
        {children}
      </div>
    </div>
  );
}

export function OptionRow({
  label,
  selected,
  onHover,
  onClick,
  index,
  thumb,
  thumbClassName,
}: {
  label: string;
  selected: boolean;
  onHover?: () => void;
  onClick: () => void;
  index: number;
  thumb?: string;
  thumbClassName?: string;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.35 }}
      onMouseEnter={onHover}
      onFocus={onHover}
      onClick={onClick}
      className={cn(
        "group relative flex w-full items-center gap-4 rounded-md border px-3 py-2.5 text-left transition-all duration-300",
        selected
          ? "border-[color:var(--accent)] bg-[color:color-mix(in_oklab,var(--accent)_8%,transparent)]"
          : "border-border bg-card/40 hover:border-foreground/30 hover:bg-card"
      )}
    >
      {thumb && (
        <span className={cn("relative h-10 w-14 shrink-0 overflow-hidden rounded-sm border border-border/60", thumbClassName)}>
          <img src={thumb} alt="" className="h-full w-full object-cover" />
        </span>
      )}
      <span className="flex-1 text-[14px] font-light text-foreground">{label}</span>
      <span
        className={cn(
          "grid h-5 w-5 place-items-center rounded-full border transition",
          selected ? "border-[color:var(--accent)] bg-[color:var(--accent)]" : "border-border group-hover:border-foreground/40"
        )}
      >
        {selected && <Check size={12} className="text-[color:var(--accent-foreground)]" strokeWidth={3} />}
      </span>
    </motion.button>
  );
}

type FloatingInputProps = InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string };
export function FloatingInput({ label, error, value, onChange, ...rest }: FloatingInputProps) {
  const [focused, setFocused] = useState(false);
  const hasValue = typeof value === "string" && value.length > 0;
  const floated = focused || hasValue;
  return (
    <div className="relative">
      <input
        {...rest}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={cn(
          "peer h-12 w-full rounded-md border bg-card/40 px-4 pt-4 pb-1 text-[14px] text-foreground outline-none transition",
          "focus:border-[color:var(--accent)] focus:bg-card focus:shadow-[0_0_0_3px_color-mix(in_oklab,var(--accent)_18%,transparent)]",
          error ? "border-destructive" : "border-border"
        )}
        placeholder=" "
      />
      <label
        className={cn(
          "pointer-events-none absolute left-4 transition-all duration-200",
          floated ? "top-1.5 text-[10px] uppercase tracking-[0.2em] text-[color:var(--gold)]" : "top-1/2 -translate-y-1/2 text-[14px] text-muted-foreground"
        )}
      >
        {label}
      </label>
      {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
    </div>
  );
}
