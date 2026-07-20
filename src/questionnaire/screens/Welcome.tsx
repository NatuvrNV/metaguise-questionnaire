import { motion } from "framer-motion";
import hero from "@/assets/hero.jpg";
import heroVideo from "@/assets/hero.mp4.json";
import { GhostButton } from "../primitives";
import { useQuestionnaire } from "../context";
import logoFortis from "@/assets/logos/fortis.png";
import logoAB from "@/assets/logos/ab-jewellers.png";
import logoApollo from "@/assets/logos/apollo.png";
import logoAsro from "@/assets/logos/asro-arcade.png";
import logoBdr from "@/assets/logos/bdr.png";
import logoBillionaire from "@/assets/logos/billionaire-homes.png";
import logoBmw from "@/assets/logos/bmw.png";
import logoCityspace from "@/assets/logos/cityspace-82.png";
import logoDsr from "@/assets/logos/dsr-builders.png";
import logoRadisson from "@/assets/logos/radisson.png";
import logoGls from "@/assets/logos/gls-university.png";
import logoHafeez from "@/assets/logos/hafeez-contractor.png";
import logoRailways from "@/assets/logos/indian-railways.png";
import logoM3M from "@/assets/logos/m3m.png";
import logoMiraj from "@/assets/logos/miraj-group.png";
import logoMorpho from "@/assets/logos/morphogenesis.png";
import logoOdisha from "@/assets/logos/odisha-cricket.png";
import logoWestin from "@/assets/logos/westin-residences.png";
import logoReliance from "@/assets/logos/reliance.png";
import logoArdete from "@/assets/logos/studio-ardete.png";
import logoLotus from "@/assets/logos/studio-lotus.png";
import logoTanishq from "@/assets/logos/tanishq.png";

const LOGOS = [
  { src: logoBillionaire, alt: "Billionaire Homes" },
  { src: logoHafeez, alt: "Architect Hafeez Contractor" },
  { src: logoDsr, alt: "DSR Builders" },
  { src: logoArdete, alt: "Studio Ardete" },
  { src: logoMiraj, alt: "Miraj Group" },
  { src: logoMorpho, alt: "Morphogenesis" },
  { src: logoFortis, alt: "Fortis" },
  { src: logoApollo, alt: "Apollo Hospitals" },
  { src: logoBmw, alt: "BMW" },
  { src: logoAB, alt: "AB Jewels" },
  { src: logoAsro, alt: "ASRO Arcade" },
  { src: logoBdr, alt: "BDR" },
  { src: logoCityspace, alt: "Cityspace 82 Architects" },
  { src: logoRadisson, alt: "Radisson" },
  { src: logoGls, alt: "GLS University" },
  { src: logoRailways, alt: "Indian Railways" },
  { src: logoM3M, alt: "M3M" },
  { src: logoOdisha, alt: "Odisha Cricket Association" },
  { src: logoReliance, alt: "Reliance" },
  { src: logoTanishq, alt: "Tanishq" },
  { src: logoLotus, alt: "Studio Lotus" },
  { src: logoWestin, alt: "Westin Residences" },
];

export function Welcome() {
  const { next } = useQuestionnaire();
  return (
    <div className="grid min-h-[calc(100vh-66px)] grid-cols-1 lg:h-[calc(100vh-66px)] lg:min-h-0 lg:grid-cols-[2fr_1fr] lg:overflow-hidden">
      <div className="flex items-center px-6 py-10 md:px-12 lg:pl-16 lg:pr-8">

        <div className="w-full max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-8"
          >
            <div className="text-[11px] uppercase tracking-[0.32em] text-foreground/70">
              India&apos;s original metal facade brand.
            </div>
            <h1 className="text-3xl font-light leading-[1.1] tracking-tight text-foreground md:text-4xl lg:text-5xl">
              A Metaguise facade isn&rsquo;t just{" "}
              <br className="hidden lg:inline" />
              measured in square feet, it&rsquo;s measured{" "}
              <br className="hidden lg:inline" />
              in recognition and prestige.
            </h1>
            <p className="max-w-2xl text-base text-foreground/80 md:text-lg lg:whitespace-nowrap">
              This is where you begin your journey of creating legacy through architecture.
            </p>

            <div className="pt-2">
              <GhostButton onClick={next}>Start Your Journey</GhostButton>
            </div>

            <div className="space-y-5 pt-10">
              <div className="text-[10px] uppercase tracking-[0.3em] text-foreground/60">
                1800+ Projects Delivered. Trusted choice of the greatest architectural minds of the world.
              </div>
              <div className="relative overflow-hidden">
                <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent" />
                <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent" />
                <div className="flex w-max animate-marquee items-center gap-14">
                  {[...LOGOS, ...LOGOS].map((l, i) => (
                    <img
                      key={i}
                      src={l.src}
                      alt={l.alt}
                      className="h-[50px] w-auto max-w-[150px] object-contain opacity-90 transition hover:opacity-100"
                      style={{ filter: "brightness(0) invert(1)" }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="relative order-first flex h-[36vh] items-stretch justify-center overflow-hidden border-b border-border lg:sticky lg:top-[66px] lg:order-none lg:h-[calc(100vh-66px)] lg:border-b-0 lg:border-l">
        <div className="relative h-full w-full overflow-hidden">
          <motion.video
            src={heroVideo.url}
            poster={hero}
            autoPlay
            muted
            loop
            playsInline
            initial={{ scale: 1.08, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-background/70 via-transparent to-background/20" />
        </div>
      </div>
    </div>
  );
}
