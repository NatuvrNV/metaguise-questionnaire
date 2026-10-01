import { useState } from "react";
import { SplitLayout } from "../SplitLayout";
import { PrimaryButton, StepHeading, StickyFooter } from "../primitives";
import { useQuestionnaire } from "../context";
import imgHero from "@/assets/step-vision.webp";

// Zapier "Catch Hook" webhook URL — sends the full brief to Zapier on submit.
const ZAPIER_WEBHOOK_URL = "https://hooks.zapier.com/hooks/catch/22435559/4dv0kb7/";

// ---- cshare backend (same API as the /build/ page) ----
const BACKEND_BASE = "https://backend.cshare.in/api";
const COMPANY_ID = "693f9759f956d25cedd37a6f";
const API_KEY = "918ef419818745ef1f09f705a9642545";
const CALL_SOURCE = "QUESTIONNAIRE_VISUAL_ADS";

// ---------------------------------------------------------------------------
// CRM-ONLY values (nothing below is sent to Zapier)
// ---------------------------------------------------------------------------

// Scale answer -> sq ft sent to backend (one value inside each bucket,
// so lead-assignment ranges match correctly)
const SCALE_SQFT: Record<string, number> = {
  accent: 999, // Under 1,000
  boutique: 2999, // Under 3,000
  mid: 9999, // 3,000 to 10,000
  large: 29999, // 10,000 to 30,000
  landmark: 30001, // 30,000 and above
};

// Human-readable range text for the CRM brief / remarks
const SCALE_RANGE_LABEL: Record<string, string> = {
  accent: "Under 1000 (0-999)",
  boutique: "1001-2999",
  mid: "3001-9999",
  large: "10001-29999",
  landmark: "30001+",
};

const PROJECT_TYPE_LABEL: Record<string, string> = {
  residence: "Residential",
  corporate: "Commercial & Corporate",
  retail: "Retail & Flagship",
  institutional: "Institutional",
  hospitality: "Hospitality",
  healthcare: "Healthcare",
  mixed: "Mixed Use/Township",
};

const FACADE_STYLE_LABEL: Record<string, string> = {
  iconic: "Iconic",
  refined: "Old Money",
  minimal: "Japandi",
  contemporary: "Contemporary",
  artistic: "Avant-garde",
  contextual: "Contextual",
  "value-driven": "Functional",
  "one-of-a-kind": "One of a Kind",
  fluid: "Classic",
  monolithic: "Brutalist",
  futuristic: "Neo-futurist",
  textural: "Maximalist",
};

const STAGE_LABEL: Record<string, string> = {
  design: "Design Stage",
  construction: "Under Construction",
  "civil-complete": "Civil work completed, ready for facade work",
  renovation: "Renovation/Facade upgrade",
};

const ROLE_TO_TYPE: Record<string, string> = {
  Architect: "ARCHITECT",
  "Real Estate Developer": "REAL_ESTATE_DEVELOPER",
  "End User/Owner": "END_USER",
  // Main Contractor / Facade Consultant / Other: no matching backend enum -> ""
};

const PROJECT_TYPE_MAP: Record<string, string> = {
  residence: "RESIDENTIAL",
  corporate: "COMMERCIAL",
  retail: "RETAIL",
  hospitality: "HOSPITALITY",
  // institutional / healthcare / mixed / other fall back to COMMERCIAL
};

function parseRange(range?: string): { min: number; max: number } {
  if (!range) return { min: 0, max: 0 };
  const parts = range.split("-").map((p) => parseInt(p.trim(), 10));
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return { min: parts[0], max: parts[1] };
  }
  return { min: 0, max: 0 };
}

async function getLeadAssignments(sqft: number) {
  try {
    const res = await fetch(
      `${BACKEND_BASE}/genericEmployee/genericEmployeeFilter?roles=PRE_SALES&statuses=ACTIVE&page=0&size=1000`,
      {
        method: "PUT",
        headers: { companyId: COMPANY_ID, apiKey: API_KEY, "Content-Type": "application/json" },
      }
    );
    if (!res.ok) throw new Error("Failed to fetch employees");
    const data = await res.json();
    const employees: any[] = data?.object?.content ?? [];
    return employees
      .filter((e) => {
        const r = parseRange(e.employeeAssignmentRange);
        return sqft >= r.min && sqft <= r.max;
      })
      .map((e) => ({
        role: "PRE_SALES",
        employeeId: e.id,
        employeeName: e.fullName || "Unknown Employee",
      }));
  } catch (err) {
    console.error("[Metaguise] Could not fetch pre-sales employees", err);
    return [];
  }
}

export function Vision() {
  const { answers, setAnswer, next } = useQuestionnaire();
  const vision = answers.vision ?? "";
  const [submitting, setSubmitting] = useState(false);

  const createLead = async (brief: string, remarks: string) => {
    const sqft = SCALE_SQFT[answers.scale ?? ""] ?? 5000;
    const leadAssignments = await getLeadAssignments(sqft);

    const fullName = (answers.fullName ?? "").trim();
    const city = (answers.city ?? "").trim();
    const dial = (answers.phoneCountry ?? "+91").replace(/\D/g, "");
    const contact = `${dial}${answers.phone ?? ""}`; // e.g. 919811604449

    const payload = {
      firstName: fullName.split(" ")[0] || fullName,
      fullName,
      contact,
      email: answers.email ?? "",
      address: city ? `${city}, India` : "India",
      locality: city,
      city,
      district: city,
      state: city ? "INDIA" : "",
      pincode: "000000",
      pincodeMappingId: "693f98b3f956d25cedd37dfc",
      projectType: PROJECT_TYPE_MAP[answers.projectType ?? ""] ?? "COMMERCIAL",
      type: ROLE_TO_TYPE[answers.role ?? ""] ?? "",
      engagementTimeline:
        answers.engagement === "immediate"
          ? "IMMEDIATE"
          : answers.engagement === "next-month"
          ? "NEXT_MONTH"
          : "FUTURE",
      has3dOrSiteDrawings: answers.hasAssets === "yes",
      approximateFacadeCladdingSqFt: sqft,
      projectBrief: brief,
      productCategory: "COMMERCIAL",
      productBrand: "Metaguise",
      productId: "69412167f956d233e1261afc",
      callStatus: "NEW_LEAD",
      remarks,
      callRegistration: true,
      leadAssignments,
      callSource: CALL_SOURCE,
    };

    const res = await fetch(`${BACKEND_BASE}/customer/create`, {
      method: "POST",
      headers: { companyId: COMPANY_ID, apikey: API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const text = await res.text();
    console.info("[Metaguise] Lead creation response", res.status, text);
    if (!res.ok) throw new Error(`Lead creation failed: ${res.status}`);
  };

  const submit = async () => {
    if (submitting) return;
    setSubmitting(true);

    const role = answers.role === "Other" ? answers.roleOther : answers.role ?? "";
    const projectType =
      answers.projectType === "other" ? answers.projectTypeOther : answers.projectType ?? "";
    const engagement =
      answers.engagement === "other" ? answers.engagementOther : answers.engagement ?? "";
    const timeline =
      answers.timeline === "construction" && answers.timelineDays
        ? `construction (civil work completing in ${answers.timelineDays} days)`
        : answers.timeline ?? "";

    // ---- ZAPIER payload: unchanged, still sends the original raw values ----
    const payload = {
      submittedAt: new Date().toISOString(),
      source: CALL_SOURCE,
      fullName: answers.fullName ?? "",
      city: answers.city ?? "",
      email: answers.email ?? "",
      phone: `${answers.phoneCountry ?? ""} ${answers.phone ?? ""}`.trim(),
      role,
      projectType,
      scale: answers.scale ?? "",
      facadeStyle: answers.facadeStyle ?? "",
      timeline,
      hasAssets: answers.hasAssets ?? "",
      engagement,
      vision,
      fileNames: (answers.files ?? []).map((f) => f.name).join(", "),
      fileCount: (answers.files ?? []).length,
    };

    // ---- CRM-only labels ----
    const facadeTypeLabel =
      answers.projectType === "other"
        ? answers.projectTypeOther ?? ""
        : PROJECT_TYPE_LABEL[answers.projectType ?? ""] ?? "";

    const facadeAreaLabel = SCALE_RANGE_LABEL[answers.scale ?? ""] ?? "";

    const facadeVisionLabel = FACADE_STYLE_LABEL[answers.facadeStyle ?? ""] ?? "";

    const facadeStageLabel =
      answers.timeline === "construction" && answers.timelineDays
        ? `Under Construction (civil work completing in ${answers.timelineDays} days)`
        : STAGE_LABEL[answers.timeline ?? ""] ?? "";

    // Remarks field in the CRM
    const remarks = [
      `Facade Type: ${facadeTypeLabel} (step 2)`,
      `Facade Area: ${facadeAreaLabel} sq ft (step 5)`,
      `Facade Vision: ${facadeVisionLabel} (step 6)`,
      `Facade Stage: ${facadeStageLabel} (step 7)`,
      `Facade Goals: ${vision} (step 9)`,
    ].join("\n");

    // Human-readable brief for the CRM (covers answers the backend has no field for)
    const brief = [
      answers.city ? `City: ${answers.city}` : "",
      `Role: ${role}`,
      `Project type: ${projectType}`,
      `Facade Area (sq ft): ${facadeAreaLabel}`,
      `Facade style: ${answers.facadeStyle ?? ""}`,
      `Project stage: ${timeline}`,
      `Engagement: ${engagement}`,
      `Has 3D/drawings: ${answers.hasAssets ?? ""}`,
      payload.fileCount ? `Files listed: ${payload.fileNames}` : "",
      vision ? `Vision: ${vision}` : "",
    ]
      .filter(Boolean)
      .join(". ");

    console.info("[Metaguise] Project brief submitted", payload);

    // Run both in parallel; neither should block the user's flow.
    const [zapierResult, leadResult] = await Promise.allSettled([
      ZAPIER_WEBHOOK_URL
        ? // Content-Type "text/plain" on purpose: avoids the CORS preflight that
          // Zapier's Catch Hook doesn't answer. Body is still valid JSON.
          fetch(ZAPIER_WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "text/plain" },
            body: JSON.stringify(payload),
          })
        : Promise.resolve(),
      createLead(brief, remarks),
    ]);

    if (zapierResult.status === "rejected")
      console.error("[Metaguise] Failed to send brief to Zapier", zapierResult.reason);
    if (leadResult.status === "rejected")
      console.error("[Metaguise] Failed to create lead in backend", leadResult.reason);

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