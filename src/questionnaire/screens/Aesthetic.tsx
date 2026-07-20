import { useState } from "react";
import { PrimaryButton, StepHeading, StickyFooter, OptionRow } from "../primitives";
import { useQuestionnaire } from "../context";
import { SplitLayout } from "../SplitLayout";

import imgDefault from "@/assets/facade-default.jpg";
import iconicAsset from "@/assets/aesthetic/iconic.jpg";
import minimalAsset from "@/assets/aesthetic/minimal.jpg";
import contemporaryAsset from "@/assets/aesthetic/contemporary.jpg";
import artisticAsset from "@/assets/aesthetic/artistic.jpg";
import contextualAsset from "@/assets/aesthetic/contextual.jpg";
import fluidAsset from "@/assets/aesthetic/fluid.jpg";
import monolithicAsset from "@/assets/aesthetic/monolithic.webp";
import futuristicAsset from "@/assets/aesthetic/futuristic.jpg";
import refinedAsset from "@/assets/aesthetic/refined.jpg";
import valueDrivenAsset from "@/assets/aesthetic/value-driven.jpg";
import oneOfAKindAsset from "@/assets/aesthetic/one-of-a-kind.jpg";
import texturalAsset from "@/assets/aesthetic/textural.jpg";

const STYLES: { key: string; label: string; img?: string }[] = [
  { key: "iconic", label: "Iconic", img: iconicAsset },
  { key: "refined", label: "Old Money", img: refinedAsset },
  { key: "minimal", label: "Japandi", img: minimalAsset },
  { key: "contemporary", label: "Contemporary", img: contemporaryAsset },
  { key: "artistic", label: "Avant-garde", img: artisticAsset },
  { key: "contextual", label: "Contextual", img: contextualAsset },
  { key: "value-driven", label: "Functional", img: valueDrivenAsset },
  { key: "one-of-a-kind", label: "One of a kind", img: oneOfAKindAsset },
  { key: "fluid", label: "Classic", img: fluidAsset },
  { key: "monolithic", label: "Brutalist", img: monolithicAsset },
  { key: "futuristic", label: "Neo-futurist", img: futuristicAsset },
  { key: "textural", label: "Maximalist", img: texturalAsset },
];

export function Aesthetic() {
  const { answers, setAnswer, next } = useQuestionnaire();
  const [hover, setHover] = useState<string | null>(null);

  const activeKey = hover ?? answers.facadeStyle ?? null;
  const active = STYLES.find((s) => s.key === activeKey);
  const imageSrc = active?.img ?? imgDefault;
  const imageKey = active?.img ? active.key : "aesthetic-default";

  return (
    <SplitLayout imageKey={imageKey} imageSrc={imageSrc}>
      <div className="space-y-6">
        <StepHeading
          kicker="Step 06: Aesthetic Resonance"
          title="What's your facade vision?"
        />
        <div className="grid grid-cols-2 gap-2">
          {STYLES.map((s, i) => (
            <OptionRow
              key={s.key}
              index={i}
              label={s.label}
              selected={answers.facadeStyle === s.key}
              onHover={() => setHover(s.key)}
              onClick={() => setAnswer("facadeStyle", s.key)}
            />
          ))}
        </div>
      </div>
      <StickyFooter>
        <PrimaryButton disabled={!answers.facadeStyle} onClick={next}>Continue</PrimaryButton>
      </StickyFooter>
    </SplitLayout>
  );
}
