import { useEffect, useLayoutEffect } from "react";
import type { ReactElement } from "react";
import { motion } from "framer-motion";
import { QuestionnaireProvider, useQuestionnaire } from "./context";
import { Header } from "./Header";
import { Welcome } from "./screens/Welcome";
import { ProjectType } from "./screens/ProjectType";
import { Contact } from "./screens/Contact";
import { Role } from "./screens/Role";
import { Aesthetic } from "./screens/Aesthetic";
import { Scale, Timeline, Engagement } from "./screens/SimpleChoice";
import { Vision } from "./screens/Vision";
import { Complete } from "./screens/Complete";

// Collect the URLs of every image in src/assets (no extra bundle weight, just URLs).
// On Vite 4 or older, replace `query: "?url", import: "default"` with `as: "url"`.
const imageUrls = Object.values(
  import.meta.glob("/src/assets/**/*.{webp,png,jpg,jpeg}", {
    eager: true,
    query: "?url",
    import: "default",
  }) as Record<string, string>
);

// Download all step images in the background so they're cached before the user reaches them.
function usePreloadImages() {
  useEffect(() => {
    const timer = setTimeout(() => {
      imageUrls.forEach((src) => {
        const img = new Image();
        img.decoding = "async";
        img.src = src;
      });
    }, 500);
    return () => clearTimeout(timer);
  }, []);
}

function Screen() {
  const { step } = useQuestionnaire();

  usePreloadImages();

  // useLayoutEffect runs before the browser paints, so there is no visible scroll jump.
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [step]);

  const map: Record<number, ReactElement> = {
    1: <Welcome />,
    2: <ProjectType />,
    3: <Contact />,
    4: <Role />,
    5: <Scale />,
    6: <Aesthetic />,
    7: <Timeline />,
    8: <Engagement />,
    9: <Vision />,
    10: <Complete />,
  };

  // No exit animation and no AnimatePresence "wait": the old screen is replaced
  // immediately and the new one fades in softly, so there is no blank gap.
  return (
    <motion.div
      key={step}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {map[step]}
    </motion.div>
  );
}

export function QuestionnaireApp() {
  return (
    <QuestionnaireProvider>
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <Screen />
      </div>
    </QuestionnaireProvider>
  );
}