"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ────────────────────────────────────────────────
   Keyframes — each fires at a scroll progress %
   (0.0 → 1.0) and shows specific story text.
──────────────────────────────────────────────── */
const KEYFRAMES = [
  {
    progress: 0.0,
    number: "01",
    label: "Design",
    title: "Sculpted\nPerfection",
    body: "Every crease, every surface born from wind-tunnel precision and obsessive craftsmanship.",
  },
  {
    progress: 0.28,
    number: "02",
    label: "Performance",
    title: "Pure\nPower",
    body: "AMG V8 Biturbo. 510 hp. 0–100 km/h in 3.5 seconds. Raw performance, civilised.",
  },
  {
    progress: 0.55,
    number: "03",
    label: "Technology",
    title: "Intelligent\nDrive",
    body: "MBUX Hyperscreen learns your world. AI co-pilot for every journey.",
  },
  {
    progress: 0.82,
    number: "04",
    label: "Electrification",
    title: "Electric\nFuture",
    body: "The EQS. 770 km range. Zero compromise. The pinnacle of electric luxury.",
  },
];

export default function VideoScrubSection() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const keyframeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const kfNumberRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    /* Wait for video metadata so we have duration */
    const init = () => {
      const ctx = gsap.context(() => {
        // Set all keyframe panels invisible at start
        keyframeRefs.current.forEach((el, i) => {
          if (!el) return;
          gsap.set(el, { opacity: i === 0 ? 1 : 0, y: i === 0 ? 0 : 40 });
        });

        /* ── Main scrub ScrollTrigger ── */
        ScrollTrigger.create({
          trigger: wrapperRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
          onUpdate: (self) => {
            const p = self.progress;

            // Scrub video
            if (video.duration && !isNaN(video.duration)) {
              video.currentTime = p * video.duration;
            }

            // Progress bar
            if (progressBarRef.current) {
              gsap.set(progressBarRef.current, { scaleX: p });
            }

            // Keyframe text transitions
            KEYFRAMES.forEach((kf, i) => {
              const current = keyframeRefs.current[i];
              if (!current) return;

              const next = KEYFRAMES[i + 1];
              const start = kf.progress;
              const end = next ? next.progress : 1;
              const mid = (end - start) * 0.5 + start;

              if (p >= start && p < end) {
                // Fade in during first half of keyframe window
                const localP = Math.min((p - start) / ((mid - start) || 0.01), 1);
                gsap.to(current, {
                  opacity: localP,
                  y: (1 - localP) * 30,
                  duration: 0,
                });
              } else if (p >= end) {
                // Already past — keep visible at 0 opacity for clean exit
                gsap.to(current, { opacity: 0, y: -20, duration: 0 });
              } else {
                gsap.to(current, { opacity: 0, y: 30, duration: 0 });
              }
            });
          },
        });
      }, wrapperRef);

      return () => ctx.revert();
    };

    if (video.readyState >= 1) {
      init();
    } else {
      video.addEventListener("loadedmetadata", init, { once: true });
    }

    return () => {
      video.removeEventListener("loadedmetadata", init);
    };
  }, []);

  return (
    /* total scroll height = 500vh */
    <div ref={wrapperRef} className="scrub-container relative" style={{ height: "500vh" }}>
      {/* Sticky viewport */}
      <div
        ref={stickyRef}
        className="sticky top-0 w-full h-screen overflow-hidden"
        style={{ background: "#080808" }}
      >
        {/* ── Video ── */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          src="/hero.mp4"
          muted
          playsInline
          preload="auto"
          style={{ willChange: "transform" }}
        />

        {/* Cinematic overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(8,8,8,0.5) 0%, transparent 30%, transparent 65%, rgba(8,8,8,0.75) 100%)",
          }}
        />
        {/* Left dark gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(8,8,8,0.8) 0%, rgba(8,8,8,0.2) 45%, transparent 100%)",
          }}
        />

        {/* ── Keyframe text panels ── */}
        <div className="absolute inset-0 flex flex-col justify-end pb-20 px-8 md:px-16 lg:px-24 pointer-events-none">
          {KEYFRAMES.map((kf, i) => (
            <div
              key={kf.number}
              ref={(el) => { keyframeRefs.current[i] = el; }}
              className="absolute bottom-20 left-8 md:left-16 lg:left-24 flex flex-col gap-4 max-w-lg"
              style={{ opacity: 0, willChange: "opacity, transform" }}
            >
              {/* Chapter label */}
              <div className="flex items-center gap-3">
                <span
                  ref={(el) => { kfNumberRefs.current[i] = el; }}
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "10px",
                    letterSpacing: "0.45em",
                    color: "#b8962e",
                    fontWeight: 400,
                    textTransform: "uppercase",
                  }}
                >
                  {kf.number} — {kf.label}
                </span>
                <span className="inline-block w-8 h-px bg-[#b8962e]/60" />
              </div>

              {/* Title */}
              <h2
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: "clamp(40px, 7vw, 100px)",
                  fontWeight: 200,
                  lineHeight: 1.0,
                  letterSpacing: "-0.025em",
                  color: "#f5f5f5",
                  whiteSpace: "pre-line",
                }}
              >
                {kf.title}
              </h2>

              {/* Body */}
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: 300,
                  lineHeight: 1.8,
                  color: "rgba(245,245,245,0.55)",
                  maxWidth: "360px",
                }}
              >
                {kf.body}
              </p>
            </div>
          ))}
        </div>

        {/* ── HUD: keyframe dots (right side) ── */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4">
          {KEYFRAMES.map((kf) => (
            <div key={kf.number} className="flex items-center gap-2 group">
              <span
                className="opacity-0 group-hover:opacity-100 transition-opacity text-right"
                style={{ fontSize: "9px", letterSpacing: "0.3em", color: "rgba(184,150,46,0.7)", textTransform: "uppercase" }}
              >
                {kf.label}
              </span>
              <div
                className="w-1.5 h-1.5 rounded-full border border-white/30 bg-transparent"
                style={{ background: "rgba(184,150,46,0.4)" }}
              />
            </div>
          ))}
        </div>

        {/* ── Progress bar (bottom) ── */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{ height: "1px", background: "rgba(255,255,255,0.08)" }}
        >
          <div
            ref={progressBarRef}
            className="progress-bar h-full"
            style={{ transformOrigin: "left center" }}
          />
        </div>

        {/* ── Scrub indicator text ── */}
        <div
          className="absolute top-8 right-8 flex items-center gap-2 opacity-30"
        >
          <span style={{ fontSize: "9px", letterSpacing: "0.35em", textTransform: "uppercase", color: "white" }}>
            Scroll to explore
          </span>
          <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
            <path d="M0 5 H14 M10 1 L14 5 L10 9" stroke="white" strokeWidth="1" />
          </svg>
        </div>

        {/* ── Corner frame lines ── */}
        <div className="absolute top-20 left-8 w-8 h-8 border-t border-l border-white/20" />
        <div className="absolute top-20 right-16 w-8 h-8 border-t border-r border-white/20" />
        <div className="absolute bottom-8 left-8 w-8 h-8 border-b border-l border-white/20" />
        <div className="absolute bottom-8 right-16 w-8 h-8 border-b border-r border-white/20" />
      </div>
    </div>
  );
}
