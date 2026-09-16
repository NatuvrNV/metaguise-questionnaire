import type { ReactElement } from "react";
import { AnimatePresence, motion } from "framer-motion";
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

function Screen() {
  const { step } = useQuestionnaire();
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
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={step}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {map[step]}
      </motion.div>
    </AnimatePresence>
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
