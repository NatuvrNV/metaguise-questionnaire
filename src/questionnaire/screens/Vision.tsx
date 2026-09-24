import { useState } from "react";
import { SplitLayout } from "../SplitLayout";
import { PrimaryButton, StepHeading, StickyFooter } from "../primitives";
import { useQuestionnaire } from "../context";
import imgHero from "@/assets/step-vision.webp";

// Zapier "Catch Hook" webhook URL — sends the full brief to Zapier on submit.
const ZAPIER_WEBHOOK_URL = "https://hooks.zapier.com/hooks/catch/22435559/4dv0kb7/";

export function Vision() {
  const { answers, setAnswer, next } = useQuestionnaire();
  const vision = answers.vision ?? "";
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (submitting) return;
    setSubmitting(true);

    // Flatten the answers into a spreadsheet-friendly shape.
    const payload = {
      submittedAt: new Date().toISOString(),
      fullName: answers.fullName ?? "",
      email: answers.email ?? "",
      phone: `${answers.phoneCountry ?? ""} ${answers.phone ?? ""}`.trim(),
      role: answers.role === "Other" ? answers.roleOther : answers.role ?? "",
      projectType: answers.projectType === "other" ? answers.projectTypeOther : answers.projectType ?? "",
      scale: answers.scale ?? "",
      facadeStyle: answers.facadeStyle ?? "",
      timeline: answers.timeline ?? "",
      hasAssets: answers.hasAssets ?? "",
      engagement: answers.engagement === "other" ? answers.engagementOther : answers.engagement ?? "",
      vision,
      fileNames: (answers.files ?? []).map((f) => f.name).join(", "),
      fileCount: (answers.files ?? []).length,
    };

    console.info("[Metaguise] Project brief submitted", payload);

    if (ZAPIER_WEBHOOK_URL) {
      try {
        // NOTE: Content-Type is "text/plain" on purpose, not "application/json".
        // "application/json" is not a CORS-safelisted header value, so the browser
        // sends a preflight OPTIONS request first — and Zapier's Catch Hook doesn't
        // answer that preflight the way browsers expect, so the real POST either
        // gets blocked or only the empty preflight gets logged. "text/plain" is
        // safelisted, so no preflight happens, and Zapier still parses the body as
        // JSON since the content itself is valid JSON.
        await fetch(ZAPIER_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "text/plain" },
          body: JSON.stringify(payload),
        });
      } catch (err) {
        // Don't block the user's flow on a network error — just log it.
        console.error("[Metaguise] Failed to send brief to Zapier", err);
      }
    }

    setSubmitting(false);
    next();
  };

  return (
    <SplitLayout imageKey="vision" imageSrc={imgHero} caption="What story should your facade tell?">
      <div className="space-y-6">
        <StepHeading
          kicker="Step 09: Design Vision"
          title="Tell us your facade goals."
        />
        <div className="relative">
          <textarea
            value={vision}
            onChange={(e) => setAnswer("vision", e.target.value.slice(0, 1200))}
            placeholder="Describe your vision, material preferences, or the architectural statement you want to make..."
            className="min-h-[180px] w-full resize-y rounded-md border border-border bg-card/40 p-4 text-[14px] leading-relaxed text-foreground placeholder:text-muted-foreground/70 outline-none transition focus:border-[color:var(--accent)] focus:bg-card focus:shadow-[0_0_0_3px_color-mix(in_oklab,var(--accent)_18%,transparent)]"
          />
          <div className="mt-2 text-right text-xs text-muted-foreground tabular-nums">{vision.length}/1200</div>
        </div>
      </div>
      <StickyFooter>
        <PrimaryButton onClick={submit} disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Project Brief"}
        </PrimaryButton>
      </StickyFooter>
    </SplitLayout>
  );
}