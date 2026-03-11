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
    accent: "#6aa3e8",
  },
  {
    progress: 0.82,
    number: "04",
    label: "Electrification",
    title: "Electric\nFuture",
    body: "The EQS. 770 km range. Zero compromise. The pinnacle of electric luxury.",
    accent: "#50c8a0",
  },
];

export default function VideoScrubSection() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [activeKF, setActiveKF] = useState(0);
  const [scrollPct, setScrollPct] = useState(0);
  const [capturedFrames, setCapturedFrames] = useState<string[]>([]);
  const activeKFRef = useRef(0);
  const scrollPctRef = useRef(0);

  // Extract frames from video
  useEffect(() => {
    const video = document.createElement("video");
    video.src = "/firefly.mp4";
    video.muted = true;
    video.preload = "metadata";

    const framesToCapture = [0.04, 0.28, 0.55, 0.82];
    const frames: string[] = new Array(framesToCapture.length);
    let captured = 0;

    const captureAt = (index: number, fraction: number) => {
      const onSeeked = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 480;
        canvas.height = 270;
        const ctx = canvas.getContext("2d");
        if (ctx) ctx.drawImage(video, 0, 0, 480, 270);
        frames[index] = canvas.toDataURL("image/webp", 0.82);
        video.removeEventListener("seeked", onSeeked);
        captured++;
        if (captured === framesToCapture.length) {
          setCapturedFrames([...frames]);
        }
        // Capture next frame
        if (index + 1 < framesToCapture.length) {
          setTimeout(() => captureAt(index + 1, framesToCapture[index + 1]), 80);
        }
      };
      video.addEventListener("seeked", onSeeked, { once: true });
      video.currentTime = video.duration * fraction;
    };

    video.addEventListener("loadedmetadata", () => {
      captureAt(0, framesToCapture[0]);
    }, { once: true });

    video.load();

    return () => {
      video.src = "";
    };
  }, []);

  // Scrub scroll trigger
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let scrollTriggerInstance: ScrollTrigger | null = null;

    const setupScrub = () => {
      scrollTriggerInstance = ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.6,
        onUpdate: (self) => {
          const p = self.progress;

          // Update video time
          if (video.duration && !isNaN(video.duration)) {
            video.currentTime = p * video.duration;
          }

          // Progress bar
          if (progressBarRef.current) {
            gsap.set(progressBarRef.current, { scaleX: p });
          }

          // Active keyframe
          let active = 0;
          KEYFRAMES.forEach((kf, i) => {
            if (p >= kf.progress) active = i;
          });

          if (active !== activeKFRef.current) {
            activeKFRef.current = active;
            setActiveKF(active);
          }

          const pct = Math.round(p * 100);
          if (pct !== scrollPctRef.current) {
            scrollPctRef.current = pct;
            setScrollPct(pct);
          }
        },
      });
    };

    if (video.readyState >= 1) {
      setupScrub();
    } else {
      video.addEventListener("loadedmetadata", setupScrub, { once: true });
    }

    return () => {
      scrollTriggerInstance?.kill();
      video.removeEventListener("loadedmetadata", setupScrub);
    };
  }, []);

  const kf = KEYFRAMES[activeKF];

  return (
    /* 500vh scroll container — sticky video inside */
    <div ref={wrapperRef} className="relative" style={{ height: "500vh" }}>
      <div
        className="sticky top-0 w-full h-screen overflow-hidden"
        style={{ background: "#070707" }}
      >
        {/* Video — no willChange to preserve HD quality */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          src="/firefly.mp4"
          muted
          playsInline
          preload="auto"
        />

        {/* Gradients */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(7,7,7,0.65) 0%, transparent 25%, transparent 60%, rgba(7,7,7,0.92) 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(7,7,7,0.88) 0%, rgba(7,7,7,0.18) 40%, transparent 100%)",
          }}
        />

        {/* Accent tint per chapter */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            background: `radial-gradient(ellipse 55% 55% at 80% 50%, ${kf.accent}0a 0%, transparent 70%)`,
          }}
          transition={{ duration: 1.4 }}
        />

        {/* ── Keyframe text ── */}
        <div
          className="absolute inset-0 flex flex-col justify-end pointer-events-none"
          style={{
            paddingBottom: "clamp(60px, 8vh, 100px)",
            paddingLeft: "clamp(28px, 6vw, 96px)",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeKF}
              initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -24, filter: "blur(10px)" }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col gap-6 max-w-2xl"
            >
              {/* Chapter label */}
              <div className="flex items-center gap-4">
                <motion.span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "10px",
                    letterSpacing: "0.48em",
                    color: kf.accent,
                    fontWeight: 400,
                    textTransform: "uppercase",
                  }}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.18 }}
                >
                  {kf.number} — {kf.label}
                </motion.span>
                <motion.span
                  className="inline-block h-px"
                  style={{ background: kf.accent, opacity: 0.55 }}
                  initial={{ width: 0 }}
                  animate={{ width: 28 }}
                  transition={{ delay: 0.28, duration: 0.5 }}
                />
              </div>

              {/* Title */}
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(48px, 8vw, 116px)",
                  fontWeight: 300,
                  lineHeight: 0.95,
                  letterSpacing: "-0.025em",
                  color: "#f0ede8",
                  whiteSpace: "pre-line",
                  fontStyle: "italic",
                }}
              >
                {kf.title}
              </h2>

              {/* Body */}
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "15px",
                  fontWeight: 300,
                  lineHeight: 1.9,
                  color: "rgba(240,237,232,0.50)",
                  maxWidth: "400px",
                }}
              >
                {kf.body}
              </p>

              {/* Accent line */}
              <motion.div
                style={{
                  height: 1,
                  background: `linear-gradient(90deg, ${kf.accent}, transparent)`,
                  maxWidth: "240px",
                }}
                initial={{ scaleX: 0, transformOrigin: "left" }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.38, duration: 0.9 }}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Captured frame thumbnails (right side) ── */}
        {capturedFrames.length > 0 && (
          <div
            className="absolute top-1/2 -translate-y-1/2 flex flex-col gap-4 z-20"
            style={{ right: "clamp(28px, 5vw, 80px)" }}
          >
            {capturedFrames.map((src, i) => (
              <motion.div
                key={i}
                className="relative overflow-hidden"
                style={{ width: 96, height: 54, borderRadius: 2, cursor: "pointer" }}
                animate={{
                  scale: i === activeKF ? 1.14 : 0.85,
                  opacity: i === activeKF ? 1 : 0.32,
                  x: i === activeKF ? -10 : 0,
                }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`Chapter ${i + 1}`}
                  className="w-full h-full object-cover"
                  style={{
                    filter: i === activeKF ? "none" : "grayscale(70%) brightness(0.6)",
                    display: "block",
                  }}
                />
                {/* Gold border when active */}
                {i === activeKF && (
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{ border: `1px solid ${KEYFRAMES[i].accent}`, borderRadius: 2 }}
                    layoutId="activeBorder"
                    transition={{ duration: 0.4 }}
                  />
                )}
                {/* Bottom bar */}
                {i === activeKF && (
                  <div
                    className="absolute bottom-0 left-0 right-0"
                    style={{ height: 2, background: KEYFRAMES[i].accent }}
                  />
                )}
                {/* Number label */}
                <div
                  className="absolute top-1.5 left-2"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "7px",
                    letterSpacing: "0.18em",
                    color: i === activeKF ? KEYFRAMES[i].accent : "rgba(240,237,232,0.4)",
                    fontWeight: 500,
                    textTransform: "uppercase",
                  }}
                >
                  {KEYFRAMES[i].number}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* ── Vertical scroll progress (left side) ── */}
        <div
          className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center gap-3 z-20"
          style={{ left: "clamp(12px, 2vw, 24px)" }}
        >
          <svg width="24" height="180" viewBox="0 0 24 180" fill="none">
            <line x1="12" y1="0" x2="12" y2="180" stroke="rgba(240,237,232,0.07)" strokeWidth="1" />
            <motion.line
              x1="12" y1="0" x2="12" y2="180"
              stroke={kf.accent}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="180"
              animate={{ strokeDashoffset: 180 - scrollPct * 1.8 }}
              transition={{ duration: 0 }}
            />
            {KEYFRAMES.map((kfItem, i) => (
              <motion.circle
                key={i}
                cx="12"
                cy={kfItem.progress * 180}
                r={i === activeKF ? 4 : 3}
                fill={i === activeKF ? kfItem.accent : "transparent"}
                stroke={kfItem.accent}
                strokeWidth="1"
                animate={{ r: i === activeKF ? 4.5 : 2.5, opacity: i === activeKF ? 1 : 0.5 }}
                transition={{ duration: 0.4 }}
              />
            ))}
          </svg>
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "8px",
              letterSpacing: "0.12em",
              color: kf.accent,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {scrollPct}%
          </span>
        </div>

        {/* ── Progress bar bottom ── */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{ height: "1px", background: "rgba(240,237,232,0.05)" }}
        >
          <div
            ref={progressBarRef}
            className="h-full"
            style={{
              transformOrigin: "left center",
              background: `linear-gradient(90deg, ${kf.accent}, #e8c86a)`,
              transition: "background 0.9s ease",
            }}
          />
        </div>

        {/* Corner marks */}
        {[
          { pos: "top-20 left-8", b: "border-t border-l" },
          { pos: "top-20 right-8 md:right-24", b: "border-t border-r" },
          { pos: "bottom-8 left-8", b: "border-b border-l" },
          { pos: "bottom-8 right-8 md:right-24", b: "border-b border-r" },
        ].map(({ pos, b }, i) => (
          <motion.div
            key={i}
            className={`absolute ${pos} w-6 h-6 ${b}`}
            style={{ borderColor: `${kf.accent}45` }}
            animate={{ opacity: [0.4, 0.75, 0.4] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.25 }}
          />
        ))}
      </div>
    </div>
  );
}
