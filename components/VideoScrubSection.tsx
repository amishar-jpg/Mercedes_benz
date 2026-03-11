"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const KEYFRAMES = [
  {
    progress: 0.0,
    number: "01",
    label: "Design",
    title: "Sculpted\nPerfection",
    body: "Every crease, every surface born from wind-tunnel precision and obsessive craftsmanship.",
    accent: "#b8962e",
  },
  {
    progress: 0.28,
    number: "02",
    label: "Performance",
    title: "Pure\nPower",
    body: "AMG V8 Biturbo. 510 hp. 0–100 km/h in 3.5 seconds. Raw performance, civilised.",
    accent: "#c87840",
  },
  {
    progress: 0.55,
    number: "03",
    label: "Technology",
    title: "Intelligent\nDrive",
    body: "MBUX Hyperscreen learns your world. AI co-pilot for every journey.",
    accent: "#5c8de8",
  },
  {
    progress: 0.82,
    number: "04",
    label: "Electrification",
    title: "Electric\nFuture",
    body: "The EQS. 770 km range. Zero compromise. The pinnacle of electric luxury.",
    accent: "#60d4a8",
  },
];

export default function VideoScrubSection() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressNumRef = useRef<HTMLSpanElement>(null);
  const [activeKF, setActiveKF] = useState(0);
  const [scrollPct, setScrollPct] = useState(0);
  const frameRefs = useRef<(HTMLImageElement | null)[]>([]);
  const [capturedFrames, setCapturedFrames] = useState<string[]>([]);

  // Extract multiple frames from the video for 3D showcase
  useEffect(() => {
    const video = document.createElement("video");
    video.src = "/hero.mp4";
    video.muted = true;
    video.preload = "auto";

    const framesToCapture = [0.05, 0.25, 0.55, 0.82];
    const frames: string[] = [];
    let captured = 0;

    const captureAt = (fraction: number) => {
      return new Promise<string>((resolve) => {
        const onSeeked = () => {
          const canvas = document.createElement("canvas");
          canvas.width = 640;
          canvas.height = 360;
          const ctx = canvas.getContext("2d");
          if (ctx) ctx.drawImage(video, 0, 0, 640, 360);
          resolve(canvas.toDataURL("image/webp", 0.85));
          video.removeEventListener("seeked", onSeeked);
        };
        video.addEventListener("seeked", onSeeked);
        video.currentTime = video.duration * fraction;
      });
    };

    video.addEventListener("loadedmetadata", async () => {
      for (const frac of framesToCapture) {
        const dataUrl = await captureAt(frac);
        frames.push(dataUrl);
        captured++;
        if (captured === framesToCapture.length) {
          setCapturedFrames([...frames]);
        }
      }
    }, { once: true });

    video.load();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const init = () => {
      const ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: wrapperRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.4,
          onUpdate: (self) => {
            const p = self.progress;
            setScrollPct(Math.round(p * 100));

            if (video.duration && !isNaN(video.duration)) {
              video.currentTime = p * video.duration;
            }

            if (progressBarRef.current) {
              gsap.set(progressBarRef.current, { scaleX: p });
            }

            // Find active keyframe
            let active = 0;
            KEYFRAMES.forEach((kf, i) => {
              if (p >= kf.progress) active = i;
            });
            setActiveKF(active);
          },
        });
      }, wrapperRef);

      return () => ctx.revert();
    };

    if (video.readyState >= 1) init();
    else video.addEventListener("loadedmetadata", init, { once: true });

    return () => video.removeEventListener("loadedmetadata", init);
  }, []);

  const kf = KEYFRAMES[activeKF];

  return (
    <div ref={wrapperRef} className="scrub-container relative" style={{ height: "500vh" }}>
      <div
        ref={stickyRef}
        className="sticky top-0 w-full h-screen overflow-hidden"
        style={{ background: "#060606" }}
      >
        {/* Main scrubbing video */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          src="/hero.mp4"
          muted
          playsInline
          preload="auto"
          style={{ willChange: "transform" }}
        />

        {/* Canvas for frame extraction (hidden) */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Dynamic gradient overlay */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: `linear-gradient(180deg, rgba(8,8,8,0.6) 0%, transparent 28%, transparent 62%, rgba(8,8,8,0.85) 100%)`,
          }}
          transition={{ duration: 0.8 }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(90deg, rgba(8,8,8,0.85) 0%, rgba(8,8,8,0.2) 45%, transparent 100%)",
          }}
        />

        {/* Animated accent color overlay keyed to keyframe */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            background: `radial-gradient(ellipse 60% 60% at 80% 50%, ${kf.accent}08 0%, transparent 70%)`,
          }}
          transition={{ duration: 1.2 }}
        />

        {/* ── Keyframe text panel ── */}
        <div className="absolute inset-0 flex flex-col justify-end pb-20 px-8 md:px-16 lg:px-24 pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeKF}
              initial={{ opacity: 0, y: 50, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -30, filter: "blur(8px)" }}
              transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
              className="flex flex-col gap-5 max-w-xl"
            >
              {/* Chapter label */}
              <div className="flex items-center gap-3">
                <motion.span
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "10px",
                    letterSpacing: "0.45em",
                    color: kf.accent,
                    fontWeight: 400,
                    textTransform: "uppercase",
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {kf.number} — {kf.label}
                </motion.span>
                <motion.span
                  className="inline-block h-px"
                  style={{ background: kf.accent, opacity: 0.6 }}
                  initial={{ width: 0 }}
                  animate={{ width: 32 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                />
              </div>

              {/* Title */}
              <h2
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: "clamp(44px, 7.5vw, 108px)",
                  fontWeight: 200,
                  lineHeight: 1.0,
                  letterSpacing: "-0.028em",
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
                  lineHeight: 1.85,
                  color: "rgba(245,245,245,0.55)",
                  maxWidth: "360px",
                }}
              >
                {kf.body}
              </p>

              {/* Accent line */}
              <motion.div
                style={{ height: 1, background: `linear-gradient(90deg, ${kf.accent}, transparent)` }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Extracted frames mini gallery (right side 3D stack) ── */}
        {capturedFrames.length > 0 && (
          <div className="absolute right-8 md:right-16 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-20">
            {capturedFrames.map((src, i) => (
              <motion.div
                key={i}
                className="relative overflow-hidden cursor-pointer"
                style={{
                  width: 88,
                  height: 50,
                  perspective: 600,
                  transformStyle: "preserve-3d",
                }}
                animate={{
                  scale: i === activeKF ? 1.18 : 0.88,
                  opacity: i === activeKF ? 1 : 0.35,
                  rotateY: i === activeKF ? 0 : 8,
                  x: i === activeKF ? -8 : 0,
                  boxShadow: i === activeKF ? `0 0 20px ${KEYFRAMES[i].accent}60, 0 0 0 1px ${KEYFRAMES[i].accent}` : "none",
                }}
                transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                whileHover={{ scale: 1.12, opacity: 0.9 }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`Frame ${i + 1}`}
                  className="w-full h-full object-cover"
                  style={{ filter: i === activeKF ? "none" : "grayscale(60%)" }}
                />
                {/* Active indicator */}
                {i === activeKF && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5"
                    style={{ background: KEYFRAMES[i].accent }}
                    layoutId="frameIndicator"
                  />
                )}
                {/* Frame label */}
                <div
                  className="absolute top-1 left-1"
                  style={{
                    fontSize: "7px",
                    letterSpacing: "0.2em",
                    color: KEYFRAMES[i].accent,
                    textTransform: "uppercase",
                    fontWeight: 500,
                  }}
                >
                  {KEYFRAMES[i].number}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* ── Scroll progress arc ── */}
        <div className="absolute top-1/2 -translate-y-1/2 left-6 flex flex-col items-center gap-2 z-20">
          <svg width="36" height="200" viewBox="0 0 36 200">
            {/* Track */}
            <line x1="18" y1="0" x2="18" y2="200" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            {/* Progress */}
            <motion.line
              x1="18" y1="0" x2="18" y2="200"
              stroke="url(#progressGrad)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="200"
              animate={{ strokeDashoffset: 200 - scrollPct * 2 }}
              transition={{ duration: 0 }}
            />
            {/* Dots for each keyframe */}
            {KEYFRAMES.map((kf, i) => (
              <motion.circle
                key={i}
                cx="18"
                cy={kf.progress * 200}
                r="4"
                fill={i === activeKF ? kf.accent : "rgba(255,255,255,0.15)"}
                stroke={kf.accent}
                strokeWidth="1"
                animate={{ r: i === activeKF ? 5 : 3 }}
                transition={{ duration: 0.3 }}
              />
            ))}
            <defs>
              <linearGradient id="progressGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#b8962e" />
                <stop offset="100%" stopColor="#f5d78e" />
              </linearGradient>
            </defs>
          </svg>
          {/* Percentage */}
          <span
            ref={progressNumRef}
            style={{
              fontSize: "9px",
              letterSpacing: "0.1em",
              color: kf.accent,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {scrollPct}%
          </span>
        </div>

        {/* ── 3D floating spec badge ── */}
        <motion.div
          className="absolute top-8 right-1/2 translate-x-1/2 md:translate-x-0 md:right-[calc(8rem+120px)] flex flex-col items-center gap-1"
          animate={{ y: [0, -8, 0], rotateX: [0, 5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{ perspective: 400 }}
        >
          <div
            style={{
              border: `1px solid ${kf.accent}40`,
              padding: "6px 16px",
              background: "rgba(8,8,8,0.6)",
              backdropFilter: "blur(8px)",
            }}
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={activeKF}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                style={{
                  fontSize: "9px",
                  letterSpacing: "0.35em",
                  textTransform: "uppercase",
                  color: kf.accent,
                  fontWeight: 400,
                }}
              >
                {kf.label}
              </motion.span>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* ── Progress bar (bottom) ── */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{ height: "2px", background: "rgba(255,255,255,0.05)" }}
        >
          <div
            ref={progressBarRef}
            className="h-full"
            style={{
              transformOrigin: "left center",
              background: `linear-gradient(90deg, ${kf.accent}, #f5d78e)`,
              transition: "background 0.8s ease",
            }}
          />
        </div>

        {/* Scroll to explore hint */}
        <div className="absolute top-8 right-8 flex items-center gap-2 opacity-25 z-20">
          <span style={{ fontSize: "9px", letterSpacing: "0.35em", textTransform: "uppercase", color: "white" }}>
            Scroll to explore
          </span>
          <motion.svg
            width="16" height="10" viewBox="0 0 16 10" fill="none"
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <path d="M0 5 H14 M10 1 L14 5 L10 9" stroke="white" strokeWidth="1" />
          </motion.svg>
        </div>

        {/* Corner frame lines with animation */}
        {[
          { className: "top-20 left-8", border: "border-t border-l" },
          { className: "top-20 right-16", border: "border-t border-r" },
          { className: "bottom-8 left-8", border: "border-b border-l" },
          { className: "bottom-8 right-16", border: "border-b border-r" },
        ].map(({ className, border }, i) => (
          <motion.div
            key={i}
            className={`absolute ${className} w-8 h-8 ${border}`}
            style={{ borderColor: `${kf.accent}40` }}
            animate={{ borderColor: `${kf.accent}60`, opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
    </div>
  );
}
