import { SplitLayout } from "../SplitLayout";
import { PrimaryButton, StepHeading, StickyFooter } from "../primitives";
import { useQuestionnaire } from "../context";
import imgHero from "@/assets/step-vision.jpg";

export function Vision() {
  const { answers, setAnswer, next } = useQuestionnaire();
  const vision = answers.vision ?? "";

  const submit = () => {
    // Log full project brief : backend wiring can be added later
    console.info("[Metaguise] Project brief submitted", answers);
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
        <PrimaryButton onClick={submit}>Submit Project Brief</PrimaryButton>
      </StickyFooter>
    </SplitLayout>
  );
}
