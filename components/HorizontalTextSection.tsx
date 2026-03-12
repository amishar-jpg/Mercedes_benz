"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

type Segment = {
  text: string;
  weight: number;
  opacity: number;
  outline?: boolean;
  gold?: boolean;
  small?: boolean;
  gradient?: boolean;
};

/* ── Text segments — each rendered at massive scale ── */
const SEGMENTS: Segment[] = [
  { text: "THE",     weight: 200, opacity: 1.0 },
  { text: "·",       weight: 300, opacity: 0.55, gold: true, small: true },
  { text: "BEST",    weight: 700, opacity: 1.0, gradient: true },
  { text: "·",       weight: 300, opacity: 0.55, gold: true, small: true },
  { text: "OR",      weight: 200, opacity: 0.5 },
  { text: "·",       weight: 300, opacity: 0.55, gold: true, small: true },
  { text: "NOTHING", weight: 200, opacity: 0.9, outline: true },
];

export default function HorizontalTextSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textTrackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const textTrack = textTrackRef.current;
      if (!textTrack) return;

      /* Pin the section and scrub the text track horizontally */
      gsap.to(textTrack, {
        x: () => -(textTrack.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: () => `+=${textTrack.scrollWidth - window.innerWidth}`,
          scrub: 1.5,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden"
      style={{ height: "100vh", background: "#060606" }}
    >
      {/* ── Background gold grid ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(184,150,46,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(184,150,46,1) 1px, transparent 1px)
          `,
          backgroundSize: "90px 90px",
          opacity: 0.018,
        }}
      />

      {/* ── Top section label ── */}
      <motion.div
        className="absolute top-10 left-1/2 z-10 flex items-center gap-4"
        style={{ transform: "translateX(-50%)" }}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 0.5, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="w-10 h-px" style={{ background: "#b8962e" }} />
        <span
          style={{
            fontSize: "9px",
            letterSpacing: "0.62em",
            textTransform: "uppercase",
            color: "rgba(184,150,46,0.9)",
            fontWeight: 400,
            whiteSpace: "nowrap",
          }}
        >
          Mercedes-Benz Philosophy
        </span>
        <div className="w-10 h-px" style={{ background: "#b8962e" }} />
      </motion.div>

      {/* ── Edge fade masks (left & right) ── */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            "linear-gradient(90deg, #060606 0%, transparent 7%, transparent 93%, #060606 100%)",
        }}
      />

      {/* ── Horizontal scroll track ── */}
      <div
        ref={textTrackRef}
        className="absolute left-0 flex items-center"
        style={{
          top: "50%",
          transform: "translateY(-50%)",
          paddingLeft: "12vw",
          paddingRight: "12vw",
          whiteSpace: "nowrap",
          willChange: "transform",
          gap: "4vw",
        }}
      >
        {SEGMENTS.map((seg, i) => (
          <span
            key={i}
            style={{
              fontSize: seg.small
                ? "clamp(44px, 7vw, 110px)"
                : "clamp(88px, 16vw, 260px)",
              fontWeight: seg.weight,
              letterSpacing: seg.small ? "0.12em" : "-0.02em",
              lineHeight: 0.88,
              color: seg.gradient
                ? "transparent"
                : seg.gold
                ? `rgba(184,150,46,${seg.opacity})`
                : `rgba(245,245,245,${seg.opacity})`,
              /* Outlined variant */
              WebkitTextStroke: seg.outline
                ? "1px rgba(245,245,245,0.3)"
                : undefined,
              /* Gold gradient on BEST */
              background: seg.gradient
                ? "linear-gradient(135deg, #f5f5f5 0%, #b8962e 45%, #f5d78e 75%, #f5f5f5 100%)"
                : undefined,
              WebkitBackgroundClip: seg.gradient ? "text" : undefined,
              backgroundClip: seg.gradient ? "text" : undefined,
              flexShrink: 0,
            }}
          >
            {seg.text}
          </span>
        ))}

        {/* ── German tagline suffix — separated by a fine vertical rule ── */}
        <div
          className="flex items-center gap-6 ml-4"
          style={{
            borderLeft: "1px solid rgba(184,150,46,0.18)",
            paddingLeft: "5vw",
          }}
        >
          <div className="flex flex-col gap-2">
            <span
              style={{
                fontSize: "clamp(13px, 1.5vw, 22px)",
                fontWeight: 300,
                color: "rgba(184,150,46,0.55)",
                letterSpacing: "0.45em",
                textTransform: "uppercase",
              }}
            >
              DAS BESTE
            </span>
            <span
              style={{
                fontSize: "clamp(13px, 1.5vw, 22px)",
                fontWeight: 300,
                color: "rgba(184,150,46,0.35)",
                letterSpacing: "0.45em",
                textTransform: "uppercase",
              }}
            >
              ODER NICHTS
            </span>
          </div>
        </div>
      </div>

      {/* ── Bottom hint ── */}
      <div
        className="absolute bottom-9 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3"
        style={{ opacity: 0.28 }}
      >
        <svg width="22" height="10" viewBox="0 0 22 10" fill="none">
          <path d="M0 5 H20 M16 1 L20 5 L16 9" stroke="#b8962e" strokeWidth="1" />
        </svg>
        <span
          style={{
            fontSize: "8px",
            letterSpacing: "0.55em",
            textTransform: "uppercase",
            color: "rgba(245,245,245,0.7)",
          }}
        >
          Scroll
        </span>
      </div>
    </section>
  );
}
