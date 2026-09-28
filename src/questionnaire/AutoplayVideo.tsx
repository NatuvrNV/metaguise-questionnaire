import { useEffect, useRef } from "react";

type AutoPlayVideoProps = {
  src: string;
  poster?: string;
  className?: string;
};

export function AutoPlayVideo({ src, poster, className }: AutoPlayVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    // React doesn't always apply the `muted` attribute to the DOM, and iOS needs it.
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");

    const tryPlay = () => {
      video.play().catch(() => {
        /* autoplay blocked; the interaction fallback below will retry */
      });
    };

    tryPlay();

    // Retry when the video becomes ready or the tab becomes visible again.
    video.addEventListener("loadeddata", tryPlay);
    const onVisibility = () => {
      if (document.visibilityState === "visible") tryPlay();
    };
    document.addEventListener("visibilitychange", onVisibility);

    // Fallback for iOS Low Power Mode or strict browsers:
    // start on the first touch or click anywhere on the page.
    const onInteract = () => {
      tryPlay();
      cleanupInteract();
    };
    const cleanupInteract = () => {
      window.removeEventListener("touchstart", onInteract);
      window.removeEventListener("click", onInteract);
    };
    window.addEventListener("touchstart", onInteract, { passive: true });
    window.addEventListener("click", onInteract);

    return () => {
      video.removeEventListener("loadeddata", tryPlay);
      document.removeEventListener("visibilitychange", onVisibility);
      cleanupInteract();
    };
  }, [src]);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      className={className}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      controls={false}
      disablePictureInPicture
    />
  );
}