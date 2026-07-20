import { useState } from "react";
import { SplitLayout } from "../SplitLayout";
import { OptionRow, PrimaryButton, StepHeading, StickyFooter } from "../primitives";
import { useQuestionnaire } from "../context";

import imgResidence from "@/assets/type-residence.jpg";
import imgCorporate from "@/assets/type-corporate.jpg";
import imgRetail from "@/assets/type-retail.jpg";
import imgInstitutional from "@/assets/type-institutional.jpg";
import imgHospitality from "@/assets/type-hospitality.jpg";
import imgHealthcare from "@/assets/type-healthcare.jpg";
import imgMixedAsset from "@/assets/type-mixed.jpg";
const imgMixed = imgMixedAsset;
import imgOther from "@/assets/type-other.jpg";

const OPTIONS: { key: string; label: string; img: string; caption: string }[] = [
  { key: "residence", label: "Luxury Residence: Villa/Bungalow facade", img: imgResidence, caption: "Private luxury, crafted in metal" },
  { key: "corporate", label: "Commercial & Corporate: HQ/Office facade", img: imgCorporate, caption: "Identity for the corporate skyline" },
  { key: "retail", label: "Retail & Flagship: Luxury retail/Jewellery showroom", img: imgRetail, caption: "Storefronts that hold a city's gaze" },
  { key: "institutional", label: "Institutional: University/Public architecture", img: imgInstitutional, caption: "Civic architecture, enduring presence" },
  { key: "hospitality", label: "Hospitality: Hotel/Resort", img: imgHospitality, caption: "Arrival as architectural ceremony" },
  { key: "healthcare", label: "Healthcare: Premium hospital facade", img: imgHealthcare, caption: "Calm precision in every panel" },
  { key: "mixed", label: "Mixed Use/Township: Podiums & towers", img: imgMixed, caption: "Skylines shaped at scale" },
  { key: "other", label: "Other", img: imgOther, caption: "Tell us what you have in mind" },
];

export function ProjectType() {
  const { answers, setAnswer, next } = useQuestionnaire();
  const [hover, setHover] = useState<string | null>(null);
  const active = hover ?? answers.projectType ?? "residence";
  const current = OPTIONS.find((o) => o.key === active) ?? OPTIONS[0];

  return (
    <SplitLayout imageKey={current.key} imageSrc={current.img} caption={current.caption}>
      <div className="space-y-6">
        <StepHeading
          kicker="Step 02: Project Classification"
          title={<>What best describes your project?</>}
          sub="Hover to preview the typology. Select one to continue."
        />
        <div className="grid grid-cols-2 gap-2">
          {OPTIONS.map((o, i) => (
            <OptionRow
              key={o.key}
              index={i}
              label={o.label}
              selected={answers.projectType === o.key}
              onHover={() => setHover(o.key)}
              onClick={() => setAnswer("projectType", o.key)}
            />
          ))}
        </div>
        {answers.projectType === "other" && (
          <input
            autoFocus
            type="text"
            value={answers.projectTypeOther ?? ""}
            onChange={(e) => setAnswer("projectTypeOther", e.target.value)}
            placeholder="Please specify your project type"
            className="h-12 w-full rounded-md border border-border bg-card/40 px-4 text-[14px] text-foreground outline-none transition focus:border-[color:var(--accent)] focus:bg-card focus:shadow-[0_0_0_3px_color-mix(in_oklab,var(--accent)_18%,transparent)]"
          />
        )}
      </div>
      <StickyFooter>
        <PrimaryButton
          disabled={!answers.projectType || (answers.projectType === "other" && !answers.projectTypeOther?.trim())}
          onClick={next}
        >
          Continue
        </PrimaryButton>
      </StickyFooter>
    </SplitLayout>
  );
}
