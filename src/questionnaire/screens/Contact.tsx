import { z } from "zod";
import { useState, useRef, useEffect } from "react";
import { SplitLayout } from "../SplitLayout";
import { FloatingInput, PrimaryButton, StepHeading, StickyFooter } from "../primitives";
import { useQuestionnaire } from "../context";
import { cn } from "@/lib/utils";
import hero from "@/assets/contact-intro.jpg";
import { Search } from "lucide-react";

function flagEmoji(code: string): string {
  const base = 0x1f1e6;
  return code
    .toUpperCase()
    .split("")
    .map((ch) => String.fromCodePoint(base + ch.charCodeAt(0) - 65))
    .join("");
}

const schema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name").max(80),
  phone: z.string().trim().min(7, "Enter a valid phone number").max(20),
  email: z.string().trim().email("Enter a valid email").max(120),
});

const COUNTRIES: { code: string; name: string; dial: string }[] = [
  { code: "IN", name: "India", dial: "+91" },
  { code: "US", name: "United States", dial: "+1" },
  { code: "GB", name: "United Kingdom", dial: "+44" },
  { code: "AE", name: "United Arab Emirates", dial: "+971" },
  { code: "SA", name: "Saudi Arabia", dial: "+966" },
  { code: "QA", name: "Qatar", dial: "+974" },
  { code: "KW", name: "Kuwait", dial: "+965" },
  { code: "OM", name: "Oman", dial: "+968" },
  { code: "BH", name: "Bahrain", dial: "+973" },
  { code: "SG", name: "Singapore", dial: "+65" },
  { code: "MY", name: "Malaysia", dial: "+60" },
  { code: "AU", name: "Australia", dial: "+61" },
  { code: "CA", name: "Canada", dial: "+1" },
  { code: "DE", name: "Germany", dial: "+49" },
  { code: "FR", name: "France", dial: "+33" },
  { code: "IT", name: "Italy", dial: "+39" },
  { code: "ES", name: "Spain", dial: "+34" },
  { code: "NL", name: "Netherlands", dial: "+31" },
  { code: "CH", name: "Switzerland", dial: "+41" },
  { code: "JP", name: "Japan", dial: "+81" },
  { code: "CN", name: "China", dial: "+86" },
  { code: "HK", name: "Hong Kong", dial: "+852" },
  { code: "KR", name: "South Korea", dial: "+82" },
  { code: "ID", name: "Indonesia", dial: "+62" },
  { code: "TH", name: "Thailand", dial: "+66" },
  { code: "PH", name: "Philippines", dial: "+63" },
  { code: "VN", name: "Vietnam", dial: "+84" },
  { code: "LK", name: "Sri Lanka", dial: "+94" },
  { code: "BD", name: "Bangladesh", dial: "+880" },
  { code: "PK", name: "Pakistan", dial: "+92" },
  { code: "NP", name: "Nepal", dial: "+977" },
  { code: "ZA", name: "South Africa", dial: "+27" },
  { code: "NG", name: "Nigeria", dial: "+234" },
  { code: "KE", name: "Kenya", dial: "+254" },
  { code: "EG", name: "Egypt", dial: "+20" },
  { code: "TR", name: "Turkey", dial: "+90" },
  { code: "BR", name: "Brazil", dial: "+55" },
  { code: "MX", name: "Mexico", dial: "+52" },
  { code: "AR", name: "Argentina", dial: "+54" },
  { code: "NZ", name: "New Zealand", dial: "+64" },
];

function PhoneWithCountry({
  dial,
  onDialChange,
  value,
  onChange,
  error,
}: {
  dial: string;
  onDialChange: (d: string) => void;
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  const [focused, setFocused] = useState(false);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const floated = focused || value.length > 0;
  const selected = COUNTRIES.find((c) => c.dial === dial) ?? COUNTRIES[0];

  const filtered = search.trim()
    ? COUNTRIES.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.code.toLowerCase().includes(search.toLowerCase()) ||
          c.dial.includes(search)
      )
    : COUNTRIES;

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div className="relative">
      <div
        className={cn(
          "flex h-12 w-full items-stretch overflow-hidden rounded-md border bg-card/40 transition",
          focused && "border-[color:var(--accent)] bg-card shadow-[0_0_0_3px_color-mix(in_oklab,var(--accent)_18%,transparent)]",
          error ? "border-destructive" : !focused && "border-border"
        )}
      >
        <button
          type="button"
          onClick={() => {
            setOpen((o) => !o);
            if (open) setSearch("");
          }}
          className="relative flex h-full cursor-pointer items-center gap-1.5 border-r border-border bg-transparent px-3 text-[14px] text-foreground outline-none"
          aria-label="Country code"
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <span className="text-base leading-none">{flagEmoji(selected.code)}</span>
          <span>{selected.dial}</span>
        </button>
        {open && (
          <div
            ref={dropdownRef}
            className="absolute top-full left-0 z-50 mt-1 flex w-80 max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-lg border border-border bg-black shadow-2xl"
            role="listbox"
          >
            <div className="flex items-center gap-2 border-b border-zinc-800 px-3 py-2.5">
              <Search className="h-4 w-4 text-zinc-400" />
              <input
                type="text"
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search"
                className="flex-1 bg-transparent text-sm text-white placeholder-zinc-500 outline-none"
              />
            </div>
            <div className="max-h-64 overflow-y-auto">
              {filtered.map((c) => (
                <div
                  key={c.code}
                  role="option"
                  aria-selected={c.dial === dial}
                  onClick={() => {
                    onDialChange(c.dial);
                    setOpen(false);
                    setSearch("");
                  }}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 px-3 py-2.5 text-[13px] text-white hover:bg-zinc-800",
                    c.dial === dial && "bg-zinc-800/70"
                  )}
                >
                  <span className="text-base leading-none">{flagEmoji(c.code)}</span>
                  <span className="flex-1">{c.name}</span>
                  <span className="text-zinc-400">{c.code}</span>
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="px-3 py-4 text-center text-sm text-zinc-500">No results</div>
              )}
            </div>
          </div>
        )}
        <input
          type="tel"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          autoComplete="tel"
          className="peer h-full flex-1 bg-transparent px-4 pt-4 pb-1 text-[14px] text-foreground outline-none"
          placeholder=" "
        />
        <label
          className={cn(
            "pointer-events-none absolute transition-all duration-200",
            floated
              ? "left-[5.5rem] top-1.5 text-[10px] uppercase tracking-[0.2em] text-[color:var(--gold)]"
              : "left-[5.5rem] top-1/2 -translate-y-1/2 text-[14px] text-muted-foreground"
          )}
        >
          Phone Number
        </label>
      </div>
      {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
    </div>
  );
}

export function Contact() {
  const { answers, setAnswer, next } = useQuestionnaire();
  const result = schema.safeParse({
    fullName: answers.fullName ?? "",
    phone: answers.phone ?? "",
    email: answers.email ?? "",
  });
  const errors = result.success ? {} : result.error.flatten().fieldErrors;

  return (
    <SplitLayout imageKey="contact" imageSrc={hero} caption="A facade begins with a conversation">
      <div className="space-y-6">
        <StepHeading
          kicker="Step 03: Introduction"
          title="Tell us about yourself"
          sub="Our principal architects will reach out personally within 24 hours."
        />
        <div className="space-y-3">
          <FloatingInput
            label="Full Name"
            value={answers.fullName ?? ""}
            onChange={(e) => setAnswer("fullName", e.target.value)}
            error={answers.fullName !== undefined ? errors.fullName?.[0] : undefined}
            autoComplete="name"
          />
          <PhoneWithCountry
            dial={answers.phoneCountry ?? "+91"}
            onDialChange={(d) => setAnswer("phoneCountry", d)}
            value={answers.phone ?? ""}
            onChange={(v) => setAnswer("phone", v)}
            error={answers.phone !== undefined ? errors.phone?.[0] : undefined}
          />
          <FloatingInput
            label="Email Address"
            type="email"
            value={answers.email ?? ""}
            onChange={(e) => setAnswer("email", e.target.value)}
            error={answers.email !== undefined ? errors.email?.[0] : undefined}
            autoComplete="email"
          />
        </div>
      </div>
      <StickyFooter>
        <PrimaryButton disabled={!result.success} onClick={next}>Continue</PrimaryButton>
      </StickyFooter>
    </SplitLayout>
  );
}
