import { useRef, useState, type DragEvent } from "react";
import { UploadCloud, FileText, X } from "lucide-react";
import { SplitLayout } from "../SplitLayout";
import { PrimaryButton, StepHeading, StickyFooter } from "../primitives";
import { useQuestionnaire } from "../context";
import { cn } from "@/lib/utils";
import imgHero from "@/assets/step-assets.jpg";

export function Upload() {
  const { answers, setAnswer, next } = useQuestionnaire();
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const files = answers.files ?? [];

  const accept = (list: FileList | null) => {
    if (!list) return;
    const incoming = Array.from(list).map((f) => ({ name: f.name, size: f.size }));
    setAnswer("files", [...files, ...incoming].slice(0, 12));
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDrag(false);
    accept(e.dataTransfer.files);
  };

  return (
    <SplitLayout imageKey="upload" imageSrc={imgHero} caption="Show us what you've envisioned">
      <div className="space-y-6">
        <StepHeading
          kicker="Step 09: Project Assets"
          title="Do you have any 3D renders or architectural drawings?"
        />
        <div
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "cursor-pointer rounded-md border border-dashed px-6 py-8 text-center transition",
            drag ? "border-[color:var(--accent)] bg-[color:color-mix(in_oklab,var(--accent)_8%,transparent)]" : "border-border bg-card/30 hover:border-foreground/40"
          )}
        >
          <UploadCloud className="mx-auto text-[color:var(--gold)]" size={28} />
          <p className="mt-3 font-serif text-base">Drag &amp; drop your files here</p>
          <p className="mt-1 text-xs text-muted-foreground">or click to browse: PDF, DWG, RVT, High-res images</p>
          <input
            ref={inputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => accept(e.target.files)}
            accept=".pdf,.dwg,.rvt,.png,.jpg,.jpeg,.webp"
          />
        </div>

        {files.length > 0 && (
          <div className="space-y-2">
            {files.map((f, i) => (
              <div key={i} className="flex items-center justify-between rounded-md border border-border bg-card/40 px-4 py-2.5 text-sm">
                <div className="flex items-center gap-3 truncate">
                  <FileText size={16} className="text-[color:var(--gold)]" />
                  <span className="truncate">{f.name}</span>
                  <span className="text-xs text-muted-foreground">{(f.size/1024).toFixed(0)} KB</span>
                </div>
                <button
                  onClick={() => setAnswer("files", files.filter((_, idx) => idx !== i))}
                  className="text-muted-foreground hover:text-destructive"
                  aria-label="Remove"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <StickyFooter>
        <PrimaryButton onClick={next}>{files.length ? "Continue" : "Proceed without upload"}</PrimaryButton>
      </StickyFooter>
    </SplitLayout>
  );
}
