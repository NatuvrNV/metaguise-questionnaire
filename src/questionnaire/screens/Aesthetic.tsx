import { useEffect, useRef, useState } from "react";
import { PrimaryButton, StepHeading, StickyFooter, OptionRow } from "../primitives";
import { useQuestionnaire } from "../context";
import { SplitLayout } from "../SplitLayout";

import imgDefault from "@/assets/facade-default.webp";
import iconicAsset from "@/assets/aesthetic/iconic.webp";
import minimalAsset from "@/assets/aesthetic/minimal.webp";
import contemporaryAsset from "@/assets/aesthetic/contemporary.webp";
import artisticAsset from "@/assets/aesthetic/artistic.webp";
import contextualAsset from "@/assets/aesthetic/contextual.webp";
import fluidAsset from "@/assets/aesthetic/fluid.webp";
import monolithicAsset from "@/assets/aesthetic/monolithic.webp";
import futuristicAsset from "@/assets/aesthetic/futuristic.webp";
import refinedAsset from "@/assets/aesthetic/refined.webp";
import valueDrivenAsset from "@/assets/aesthetic/value-driven.webp";
import oneOfAKindAsset from "@/assets/aesthetic/one-of-a-kind.webp";
import texturalAsset from "@/assets/aesthetic/textural.webp";

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

// Module-level flag so this only ever runs once per page session,
// even if the component remounts (e.g. user navigates back to this step).
let prefetched = false;

function prefetchStyleImages() {
  if (prefetched) return;
  prefetched = true;

  const urls = [imgDefault, ...STYLES.map((s) => s.img).filter(Boolean)] as string[];

  urls.forEach((src) => {
    const img = new Image();
    img.src = src;
  });
}

export function Aesthetic() {
  const { answers, setAnswer, next } = useQuestionnaire();
  const [hover, setHover] = useState<string | null>(null);
  const idleHandle = useRef<number | null>(null);

  useEffect(() => {
    // Defer prefetching until the browser is idle so it never competes
    // with the current image's own load / first paint.
    if ("requestIdleCallback" in window) {
      idleHandle.current = window.requestIdleCallback(prefetchStyleImages, { timeout: 2000 });
      return () => {
        if (idleHandle.current !== null) window.cancelIdleCallback(idleHandle.current);
      };
    } else {
      const t = window.setTimeout(prefetchStyleImages, 300);
      return () => window.clearTimeout(t);
    }
  }, []);

  const activeKey = hover ?? answers.facadeStyle ?? null;
  const active = STYLES.find((s) => s.key === activeKey);
  const imageSrc = active?.img ?? imgDefault;
  const imageKey = active?.img ? active.key : "aesthetic-default";

  return (
    <SplitLayout
      imageKey={imageKey}
      imageSrc={imageSrc}
      imgProps={{ fetchPriority: "high", decoding: "async" }}
    >
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