"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";

export function VideoSection({
  src,
  poster,
  eyebrow = "Watch · 50 seconds",
  title = "Peptides, in plain English.",
  description = "A 50 second walkthrough of what peptides are, why cells already makes them, and what people are talking about right now.",
}: {
  src: string;
  poster: string;
  eyebrow?: string;
  title?: string;
  description?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onVolume = () => setMuted(v.muted);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    v.addEventListener("volumechange", onVolume);
    return () => {
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("volumechange", onVolume);
    };
  }, []);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.muted = false;
      setMuted(false);
      v.play()
        .then(() => setStarted(true))
        .catch(() => {
          v.muted = true;
          setMuted(true);
          v.play()
            .then(() => setStarted(true))
            .catch(() => {});
        });
    } else {
      v.pause();
    }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (v) v.muted = !v.muted;
  };

  return (
    <section className="mx-auto max-w-7xl px-4 md:px-6 py-20 md:py-28">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:items-center">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-accent">{eyebrow}</p>
          <h2 className="mt-4 font-display text-3xl md:text-4xl lg:text-5xl font-medium tracking-[-0.02em] leading-[1.05]">
            {title}
          </h2>
          <p className="mt-5 text-base text-foreground leading-relaxed max-w-md">{description}</p>
        </div>
        <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-[oklch(0.18_0.05_250)] shadow-[var(--shadow-elegant)]">
          <div className="aspect-video w-full">
            <video
              ref={videoRef}
              src={src}
              poster={poster}
              playsInline
              preload="metadata"
              controls={started}
              controlsList="nodownload"
              className="h-full w-full object-cover"
            />
          </div>
          {!started && (
            <button
              type="button"
              onClick={togglePlay}
              aria-label="Play video"
              className="group absolute inset-0 flex items-center justify-center bg-[oklch(0.14_0.05_250/0.35)] transition-colors hover:bg-[oklch(0.14_0.05_250/0.25)]"
            >
              <span className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-white/95 text-[oklch(0.18_0.05_250)] shadow-2xl ring-1 ring-white/40 transition-transform group-hover:scale-105">
                <Play className="h-7 w-7 fill-current" />
              </span>
            </button>
          )}
          {started && !playing && (
            <button
              type="button"
              onClick={togglePlay}
              aria-label="Resume"
              className="absolute bottom-4 right-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              <Pause className="h-4 w-4" />
            </button>
          )}
          {muted && started && (
            <button
              type="button"
              onClick={toggleMute}
              aria-label="Unmute"
              className="absolute top-4 right-4 inline-flex h-10 items-center gap-2 rounded-full border border-white/30 bg-black/55 px-3 text-xs font-medium text-white hover:bg-black/75 transition-colors"
            >
              <VolumeX className="h-4 w-4" />
              Tap to unmute
            </button>
          )}
          {!muted && started && (
            <button
              type="button"
              onClick={toggleMute}
              aria-label="Mute"
              className="absolute top-4 right-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              <Volume2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
